import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getDoctorAvailableSlots } from "@/lib/slot-engine";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const doctorId = searchParams.get("doctorId");
    const departmentId = searchParams.get("departmentId");
    const search = searchParams.get("search");

    const where: any = {};

    // Role-based visibility
    if (session.user.role === "PATIENT") {
      if (!session.patient?.id) {
        return NextResponse.json({ success: true, appointments: [] });
      }
      where.patientId = session.patient.id;
    } else if (session.user.role === "DOCTOR") {
      if (!session.doctor?.id) {
        return NextResponse.json({ success: true, appointments: [] });
      }
      where.doctorId = session.doctor.id;
    } else {
      // ADMIN or RECEPTIONIST can filter by doctorId
      if (doctorId) where.doctorId = doctorId;
    }

    if (date) where.appointmentDate = date;
    if (status && status !== "ALL") where.status = status;
    if (departmentId) where.departmentId = departmentId;

    if (search) {
      where.OR = [
        { appointmentNumber: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
        { patient: { user: { phone: { contains: search } } } },
        { doctor: { user: { name: { contains: search } } } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { id: true, name: true },
            },
            department: true,
          },
        },
        department: true,
      },
      orderBy: [{ appointmentDate: "desc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error("Appointments fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    const body = await req.json();

    const {
      doctorId,
      departmentId,
      appointmentDate,
      startTime,
      appointmentType = "IN_PERSON",
      reason,
      // For walk-in / guest or receptionist booking
      guestPatient,
    } = body;

    if (!doctorId || !departmentId || !appointmentDate || !startTime) {
      return NextResponse.json(
        { success: false, message: "Doctor, department, date, and start time are required." },
        { status: 400 }
      );
    }

    // Determine Patient ID
    let patientIdToUse: string | null = null;

    if (session?.user?.role === "PATIENT") {
      patientIdToUse = session.patient?.id || null;
    } else if (
      (session?.user?.role === "ADMIN" || session?.user?.role === "RECEPTIONIST") &&
      body.patientId
    ) {
      patientIdToUse = body.patientId;
    } else if (guestPatient && guestPatient.name && guestPatient.phone) {
      // Find or register patient record
      const cleanPhone = guestPatient.phone.trim();
      let existingUser = await prisma.user.findFirst({
        where: { phone: cleanPhone },
        include: { patient: true },
      });

      if (!existingUser) {
        const dummyEmail = `walkin.${Date.now()}.${Math.floor(Math.random() * 1000)}@aimshospital.local`;
        const bcrypt = await import("bcryptjs");
        const tempPass = await bcrypt.hash("Patient@1234", 8);

        existingUser = await prisma.user.create({
          data: {
            name: guestPatient.name.trim(),
            email: guestPatient.email?.trim() || dummyEmail,
            phone: cleanPhone,
            passwordHash: tempPass,
            role: "PATIENT",
            status: "ACTIVE",
            patient: {
              create: {
                gender: guestPatient.gender || null,
                bloodGroup: guestPatient.bloodGroup || null,
                dateOfBirth: guestPatient.dateOfBirth || null,
                address: guestPatient.address || null,
                emergencyContact: guestPatient.emergencyContact || null,
              },
            },
          },
          include: { patient: true },
        });
      } else if (!existingUser.patient) {
        const p = await prisma.patient.create({
          data: {
            userId: existingUser.id,
            gender: guestPatient.gender || null,
            bloodGroup: guestPatient.bloodGroup || null,
          },
        });
        existingUser.patient = p;
      }

      patientIdToUse = existingUser.patient!.id;
    } else if (session?.patient?.id) {
      patientIdToUse = session.patient.id;
    }

    if (!patientIdToUse) {
      return NextResponse.json(
        { success: false, message: "Patient information is required to confirm booking." },
        { status: 400 }
      );
    }

    // Verify slot availability in real time
    const slotCheck = await getDoctorAvailableSlots(doctorId, appointmentDate);
    if (!slotCheck.success) {
      return NextResponse.json(
        { success: false, message: slotCheck.message || "Date is not available for booking." },
        { status: 400 }
      );
    }

    const targetSlot = slotCheck.slots.find((s) => s.startTime === startTime);
    if (!targetSlot || !targetSlot.isAvailable) {
      return NextResponse.json(
        {
          success: false,
          message: `The selected time slot (${startTime}) is no longer available. Please select another slot.`,
        },
        { status: 409 }
      );
    }

    const endTime = targetSlot.endTime;

    // Transactional Booking to prevent double booking race condition
    const newAppointment = await prisma.$transaction(async (tx) => {
      // Double check active appointment on this exact slot
      const conflict = await tx.appointment.findFirst({
        where: {
          doctorId,
          appointmentDate,
          startTime,
          status: { notIn: ["CANCELLED"] },
        },
      });

      if (conflict) {
        throw new Error("This slot was just booked by another patient. Please choose another time.");
      }

      // Generate unique token number
      const datePrefix = appointmentDate.replace(/-/g, "");
      const count = await tx.appointment.count({
        where: { appointmentDate },
      });
      const appointmentNumber = `APT-${datePrefix}-${String(count + 1).padStart(3, "0")}`;

      const created = await tx.appointment.create({
        data: {
          appointmentNumber,
          patientId: patientIdToUse!,
          doctorId,
          departmentId,
          appointmentDate,
          startTime,
          endTime,
          appointmentType,
          reason: reason || "General Medical Consultation",
          status: "CONFIRMED",
        },
        include: {
          patient: {
            include: { user: true },
          },
          doctor: {
            include: { user: true, department: true },
          },
          department: true,
        },
      });

      // Send in-app notification
      if (created.patient?.user?.id) {
        await tx.notification.create({
          data: {
            userId: created.patient.user.id,
            title: "Appointment Confirmed",
            message: `Your appointment #${appointmentNumber} with ${created.doctor.user.name} on ${appointmentDate} at ${startTime} is confirmed.`,
            type: "APPOINTMENT",
            link: "/patient/appointments",
          },
        });
      }

      return created;
    });

    await logAuditEvent({
      userId: session?.user?.id || null,
      action: "APPOINTMENT_BOOKED",
      entity: "Appointment",
      entityId: newAppointment.id,
      details: `Appointment ${newAppointment.appointmentNumber} booked for ${newAppointment.patient.user.name} with ${newAppointment.doctor.user.name}`,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to confirm appointment." },
      { status: 500 }
    );
  }
}

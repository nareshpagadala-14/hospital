import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getDoctorAvailableSlots } from "@/lib/slot-engine";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, department: true } },
        department: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
    }

    // Role verification
    if (session.user.role === "PATIENT" && appointment.patientId !== session.patient?.id) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching appointment." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
    }

    const body = await req.json();
    const { status, consultationNotes, cancellationReason, rescheduleDate, rescheduleTime } = body;

    // Reschedule Request
    if (rescheduleDate && rescheduleTime) {
      // Check availability for the new slot
      const slotCheck = await getDoctorAvailableSlots(appointment.doctorId, rescheduleDate);
      if (!slotCheck.success) {
        return NextResponse.json(
          { success: false, message: slotCheck.message || "Date is not available." },
          { status: 400 }
        );
      }

      const targetSlot = slotCheck.slots.find((s) => s.startTime === rescheduleTime);
      if (!targetSlot || !targetSlot.isAvailable) {
        return NextResponse.json(
          { success: false, message: "Selected time slot is already booked or invalid." },
          { status: 409 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Double check conflict
        const conflict = await tx.appointment.findFirst({
          where: {
            doctorId: appointment.doctorId,
            appointmentDate: rescheduleDate,
            startTime: rescheduleTime,
            status: { notIn: ["CANCELLED"] },
            id: { not: id },
          },
        });

        if (conflict) {
          throw new Error("This slot was just booked by another patient.");
        }

        const res = await tx.appointment.update({
          where: { id },
          data: {
            appointmentDate: rescheduleDate,
            startTime: rescheduleTime,
            endTime: targetSlot.endTime,
            status: "CONFIRMED",
          },
          include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
          },
        });

        if (appointment.patient?.user?.id) {
          await tx.notification.create({
            data: {
              userId: appointment.patient.user.id,
              title: "Appointment Rescheduled",
              message: `Your appointment #${appointment.appointmentNumber} has been rescheduled to ${rescheduleDate} at ${rescheduleTime}.`,
              type: "APPOINTMENT",
              link: "/patient/appointments",
            },
          });
        }

        return res;
      });

      await logAuditEvent({
        userId: session.user.id,
        action: "APPOINTMENT_RESCHEDULED",
        entity: "Appointment",
        entityId: id,
        details: `Rescheduled from ${appointment.appointmentDate} ${appointment.startTime} to ${rescheduleDate} ${rescheduleTime}`,
      });

      return NextResponse.json({ success: true, message: "Appointment rescheduled successfully.", appointment: updated });
    }

    // Cancellation Request
    if (status === "CANCELLED") {
      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          status: "CANCELLED",
          cancellationReason: cancellationReason || "Cancelled by patient or clinic",
        },
      });

      if (appointment.patient?.user?.id) {
        await prisma.notification.create({
          data: {
            userId: appointment.patient.user.id,
            title: "Appointment Cancelled",
            message: `Your appointment #${appointment.appointmentNumber} has been cancelled.`,
            type: "WARNING",
            link: "/patient/appointments",
          },
        });
      }

      await logAuditEvent({
        userId: session.user.id,
        action: "APPOINTMENT_CANCELLED",
        entity: "Appointment",
        entityId: id,
        details: `Appointment cancelled: ${cancellationReason || "No reason specified"}`,
      });

      return NextResponse.json({ success: true, message: "Appointment cancelled.", appointment: updated });
    }

    // Status or clinical note update by Doctor / Receptionist / Admin
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status || undefined,
        consultationNotes: consultationNotes !== undefined ? consultationNotes : undefined,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    await logAuditEvent({
      userId: session.user.id,
      action: "APPOINTMENT_UPDATED",
      entity: "Appointment",
      entityId: id,
      details: `Status changed to ${status || appointment.status}`,
    });

    return NextResponse.json({ success: true, message: "Appointment updated.", appointment: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update appointment." },
      { status: 500 }
    );
  }
}

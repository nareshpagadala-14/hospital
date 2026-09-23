import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const departmentSlug = searchParams.get("departmentSlug");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "ACTIVE";

    const where: any = {
      status: status === "ALL" ? undefined : status,
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (departmentSlug) {
      where.department = { slug: departmentSlug };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { specialization: { contains: search } },
        { qualification: { contains: search } },
        { department: { name: { contains: search } } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        availabilities: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
      orderBy: { experienceYears: "desc" },
    });

    return NextResponse.json({ success: true, doctors });
  } catch (error) {
    console.error("Doctors fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctors." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      departmentId,
      qualification,
      specialization,
      experienceYears,
      registrationNumber,
      consultationFee,
      languages,
      biography,
      photo,
    } = body;

    if (!name || !email || !departmentId || !qualification || !specialization) {
      return NextResponse.json(
        { success: false, message: "Missing required doctor fields." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password || "Doctor@1234", 10);

    const result = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: phone || null,
          passwordHash,
          role: "DOCTOR",
          status: "ACTIVE",
        },
      });

      const d = await tx.doctor.create({
        data: {
          userId: u.id,
          departmentId,
          qualification,
          specialization,
          experienceYears: Number(experienceYears) || 0,
          registrationNumber: registrationNumber || null,
          consultationFee: Number(consultationFee) || 500.0,
          languages: languages || "Telugu, English",
          biography: biography || null,
          photo: photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
          status: "ACTIVE",
        },
        include: {
          user: true,
          department: true,
        },
      });

      // Default Mon-Sat availability
      for (let day = 1; day <= 6; day++) {
        await tx.doctorAvailability.create({
          data: {
            doctorId: d.id,
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "13:00",
            slotDurationMinutes: 30,
            maxAppointmentsPerSlot: 1,
          },
        });
        await tx.doctorAvailability.create({
          data: {
            doctorId: d.id,
            dayOfWeek: day,
            startTime: "16:00",
            endTime: "19:00",
            slotDurationMinutes: 30,
            maxAppointmentsPerSlot: 1,
          },
        });
      }

      return d;
    });

    await logAuditEvent({
      userId: session.user.id,
      action: "DOCTOR_CREATED",
      entity: "Doctor",
      entityId: result.id,
      details: `Created doctor profile: ${result.user.name} (${result.specialization})`,
    });

    return NextResponse.json({ success: true, doctor: result });
  } catch (error: any) {
    console.error("Doctor creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create doctor." },
      { status: 500 }
    );
  }
}

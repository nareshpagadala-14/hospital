import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        department: true,
        availabilities: {
          orderBy: { dayOfWeek: "asc" },
        },
        unavailabilities: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, doctor });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctor details." },
      { status: 500 }
    );
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

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found." }, { status: 404 });
    }

    // Only Admin or the Doctor themselves can edit
    const isOwner = session.user.id === doctor.userId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden. You cannot edit this doctor profile." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      qualification,
      specialization,
      experienceYears,
      registrationNumber,
      consultationFee,
      languages,
      biography,
      photo,
      status,
      name,
      phone,
    } = body;

    const updated = await prisma.$transaction(async (tx) => {
      if (name || phone) {
        await tx.user.update({
          where: { id: doctor.userId },
          data: {
            name: name || undefined,
            phone: phone || undefined,
          },
        });
      }

      return await tx.doctor.update({
        where: { id },
        data: {
          qualification: qualification || undefined,
          specialization: specialization || undefined,
          experienceYears: experienceYears !== undefined ? Number(experienceYears) : undefined,
          registrationNumber: registrationNumber || undefined,
          consultationFee: consultationFee !== undefined ? Number(consultationFee) : undefined,
          languages: languages || undefined,
          biography: biography || undefined,
          photo: photo || undefined,
          status: status || undefined,
        },
        include: {
          user: true,
          department: true,
        },
      });
    });

    await logAuditEvent({
      userId: session.user.id,
      action: "DOCTOR_UPDATED",
      entity: "Doctor",
      entityId: id,
      details: `Updated doctor profile: ${updated.user.name}`,
    });

    return NextResponse.json({ success: true, doctor: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update doctor profile." },
      { status: 500 }
    );
  }
}

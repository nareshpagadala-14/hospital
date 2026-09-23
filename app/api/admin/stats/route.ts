import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const [
      totalPatients,
      totalDoctors,
      totalDepartments,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      recentAppointments,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count({ where: { status: "ACTIVE" } }),
      prisma.department.count({ where: { status: "ACTIVE" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { appointmentDate: todayStr } }),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
      prisma.appointment.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          patient: { include: { user: { select: { name: true, phone: true } } } },
          doctor: { include: { user: { select: { name: true } }, department: true } },
          department: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalDepartments,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
      },
      recentAppointments,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch stats." }, { status: 500 });
  }
}

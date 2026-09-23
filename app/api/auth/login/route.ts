import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setAuthCookie } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email address or password." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Account is suspended or inactive. Please contact hospital administration." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email address or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      doctorId: user.doctor?.id,
      patientId: user.patient?.id,
    });

    await setAuthCookie(token);

    await logAuditEvent({
      userId: user.id,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      details: `User logged in with role ${user.role}`,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patient?.id,
        doctorId: user.doctor?.id,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setAuthCookie } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, dateOfBirth, gender, bloodGroup, address, emergencyContact } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and patient in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: phone?.trim() || null,
          passwordHash,
          role: "PATIENT",
          status: "ACTIVE",
        },
      });

      const p = await tx.patient.create({
        data: {
          userId: u.id,
          dateOfBirth: dateOfBirth || null,
          gender: gender || null,
          bloodGroup: bloodGroup || null,
          address: address || null,
          emergencyContact: emergencyContact || null,
        },
      });

      return { user: u, patient: p };
    });

    const token = await createSessionToken({
      userId: newUser.user.id,
      email: newUser.user.email,
      name: newUser.user.name,
      role: "PATIENT",
      patientId: newUser.patient.id,
    });

    await setAuthCookie(token);

    await logAuditEvent({
      userId: newUser.user.id,
      action: "PATIENT_REGISTER",
      entity: "Patient",
      entityId: newUser.patient.id,
      details: `New patient registered: ${newUser.user.name} (${cleanEmail})`,
    });

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
      user: {
        id: newUser.user.id,
        name: newUser.user.name,
        email: newUser.user.email,
        role: newUser.user.role,
        patientId: newUser.patient.id,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

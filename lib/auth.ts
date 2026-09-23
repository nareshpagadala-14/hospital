import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "hospital_ultra_secure_jwt_secret_guntur_super_speciality_2026"
);

const COOKIE_NAME = "hospital_session_token";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
  doctorId?: string;
  patientId?: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<{
  user: any;
  patient?: any;
  doctor?: any;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        patient: true,
        doctor: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return null;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      patient: user.patient,
      doctor: user.doctor,
    };
  } catch (error) {
    console.error("Auth error in getCurrentUser:", error);
    return null;
  }
}

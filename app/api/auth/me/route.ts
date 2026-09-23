import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: current.user,
      patient: current.patient,
      doctor: current.doctor,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

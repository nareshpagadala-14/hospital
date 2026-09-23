import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const settings = await prisma.hospitalSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json(); // e.g. { emergency_phone: "+91 ...", hospital_name: "..." }

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await prisma.hospitalSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    await logAuditEvent({
      userId: session.user.id,
      action: "SETTINGS_UPDATED",
      entity: "HospitalSetting",
      details: `Updated settings keys: ${Object.keys(body).join(", ")}`,
    });

    return NextResponse.json({ success: true, message: "Hospital settings saved successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

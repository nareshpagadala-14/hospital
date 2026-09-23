import { NextResponse } from "next/server";
import { removeAuthCookie, getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST() {
  try {
    const current = await getCurrentUser();
    if (current?.user?.id) {
      await logAuditEvent({
        userId: current.user.id,
        action: "USER_LOGOUT",
        entity: "User",
        entityId: current.user.id,
        details: "User initiated logout",
      });
    }

    await removeAuthCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    await removeAuthCookie();
    return NextResponse.json({ success: true });
  }
}

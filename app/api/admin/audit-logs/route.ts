import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, role: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch audit logs." }, { status: 500 });
  }
}

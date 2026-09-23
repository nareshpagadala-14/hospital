import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { user: { phone: { contains: search } } },
        { bloodGroup: { contains: search } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, patients });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch patients." }, { status: 500 });
  }
}

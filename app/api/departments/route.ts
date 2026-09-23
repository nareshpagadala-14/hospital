import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      where: { status: "ACTIVE" },
      include: {
        _count: {
          select: { doctors: true, appointments: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, departments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch departments." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, icon, image } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: "Name and description are required." },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newDept = await prisma.department.create({
      data: {
        name,
        slug,
        description,
        icon: icon || "Stethoscope",
        image: image || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        status: "ACTIVE",
      },
    });

    await logAuditEvent({
      userId: session.user.id,
      action: "DEPARTMENT_CREATED",
      entity: "Department",
      entityId: newDept.id,
      details: `Created department: ${newDept.name}`,
    });

    return NextResponse.json({ success: true, department: newDept });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create department." },
      { status: 500 }
    );
  }
}

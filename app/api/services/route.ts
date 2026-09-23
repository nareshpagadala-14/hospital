import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to load services." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    const { title, category, description, icon, image, facilities } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const service = await prisma.service.create({
      data: {
        title,
        slug,
        category: category || "GENERAL",
        description,
        icon: icon || "Activity",
        image: image || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        facilities: typeof facilities === "string" ? facilities : JSON.stringify(facilities || []),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

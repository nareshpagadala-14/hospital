import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const packages = await prisma.healthPackage.findMany({
      where: { status: "ACTIVE" },
      orderBy: { originalPrice: "desc" },
    });
    return NextResponse.json({ success: true, packages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to load packages." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, includedTests, originalPrice, discountedPrice, validityDays, image, isPopular } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const pkg = await prisma.healthPackage.create({
      data: {
        name,
        slug,
        description,
        includedTests: typeof includedTests === "string" ? includedTests : JSON.stringify(includedTests || []),
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        validityDays: Number(validityDays) || 30,
        image,
        isPopular: Boolean(isPopular),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, package: pkg });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

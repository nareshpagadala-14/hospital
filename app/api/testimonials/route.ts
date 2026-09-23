import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to load testimonials." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, department, rating, comment } = body;

    if (!patientName || !comment) {
      return NextResponse.json(
        { success: false, message: "Name and review comment are required." },
        { status: 400 }
      );
    }

    // New testimonials start as unapproved until moderated by admin, per specification
    const testimonial = await prisma.testimonial.create({
      data: {
        patientName,
        department: department || "General Healthcare",
        rating: Number(rating) || 5,
        comment,
        isApproved: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for sharing your feedback. Your review will appear once verified by administration.",
      testimonial,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

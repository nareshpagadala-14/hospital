import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const articles = await prisma.healthArticle.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to load health articles." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();
    const { title, excerpt, content, category, authorName, readTimeMinutes, image } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const article = await prisma.healthArticle.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category: category || "GENERAL_MEDICINE",
        authorName: authorName || "Medical Editorial Board",
        readTimeMinutes: Number(readTimeMinutes) || 5,
        image,
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

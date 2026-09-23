import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        doctors: [],
        departments: [],
        services: [],
        packages: [],
        articles: [],
      });
    }

    const [doctors, departments, services, packages, articles] = await Promise.all([
      prisma.doctor.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { user: { name: { contains: q } } },
            { specialization: { contains: q } },
            { department: { name: { contains: q } } },
          ],
        },
        include: {
          user: { select: { name: true } },
          department: { select: { name: true, slug: true } },
        },
        take: 5,
      }),
      prisma.department.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ name: { contains: q } }, { description: { contains: q } }],
        },
        take: 5,
      }),
      prisma.service.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ title: { contains: q } }, { description: { contains: q } }],
        },
        take: 5,
      }),
      prisma.healthPackage.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ name: { contains: q } }, { description: { contains: q } }],
        },
        take: 5,
      }),
      prisma.healthArticle.findMany({
        where: {
          isPublished: true,
          OR: [{ title: { contains: q } }, { excerpt: { contains: q } }],
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      query: q,
      results: {
        doctors,
        departments,
        services,
        packages,
        articles,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Search failed." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobile, email, subject, message } = body;

    if (!name || !mobile || !message) {
      return NextResponse.json(
        { success: false, message: "Name, mobile number, and message are required." },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        mobile,
        email: email || null,
        subject: subject || "General Inquiry",
        message,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received. Our patient helpdesk in Guntur will contact you shortly.",
      contact,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

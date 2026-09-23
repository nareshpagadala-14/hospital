import { NextResponse } from "next/server";
import { getDoctorAvailableSlots } from "@/lib/slot-engine";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!doctorId || !date) {
      return NextResponse.json(
        { success: false, message: "Both doctorId and date parameters are required." },
        { status: 400 }
      );
    }

    const result = await getDoctorAvailableSlots(doctorId, date);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Slots generation error:", error);
    return NextResponse.json(
      { success: false, message: "Error calculating available time slots." },
      { status: 500 }
    );
  }
}

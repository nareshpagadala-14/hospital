import { prisma } from "@/lib/prisma";

export interface TimeSlot {
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "09:30"
  isAvailable: boolean;
  statusText?: string;
}

export interface SlotAvailabilityResult {
  success: boolean;
  message?: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  date: string;
  slots: TimeSlot[];
  totalAvailable: number;
}

export async function getDoctorAvailableSlots(
  doctorId: string,
  dateStr: string // YYYY-MM-DD
): Promise<SlotAvailabilityResult> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: { select: { name: true } },
      department: { select: { name: true } },
    },
  });

  if (!doctor || doctor.status !== "ACTIVE") {
    return {
      success: false,
      message: "Doctor is not currently available for appointments.",
      doctorId,
      doctorName: doctor?.user?.name || "Unknown",
      departmentName: doctor?.department?.name || "",
      date: dateStr,
      slots: [],
      totalAvailable: 0,
    };
  }

  // Validate date is not in the past
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (targetDate < today) {
    return {
      success: false,
      message: "Cannot book appointments for past dates.",
      doctorId,
      doctorName: doctor.user.name,
      departmentName: doctor.department.name,
      date: dateStr,
      slots: [],
      totalAvailable: 0,
    };
  }

  // Check hospital holidays
  const holiday = await prisma.hospitalHoliday.findFirst({
    where: { date: dateStr },
  });
  if (holiday) {
    return {
      success: false,
      message: `Hospital OPD closed for ${holiday.name}. Emergency services remain 24/7.`,
      doctorId,
      doctorName: doctor.user.name,
      departmentName: doctor.department.name,
      date: dateStr,
      slots: [],
      totalAvailable: 0,
    };
  }

  // Check doctor leaves / unavailabilities
  const leave = await prisma.doctorUnavailability.findFirst({
    where: {
      doctorId,
      startDate: { lte: dateStr },
      endDate: { gte: dateStr },
    },
  });
  if (leave) {
    return {
      success: false,
      message: `Doctor is unavailable on this date (${leave.reason || "Official Leave"}).`,
      doctorId,
      doctorName: doctor.user.name,
      departmentName: doctor.department.name,
      date: dateStr,
      slots: [],
      totalAvailable: 0,
    };
  }

  // Determine day of week (0=Sun, 1=Mon, ..., 6=Sat)
  const dayOfWeek = targetDate.getDay();

  // Find doctor's availability schedules for this day
  const availabilities = await prisma.doctorAvailability.findMany({
    where: {
      doctorId,
      dayOfWeek,
    },
    orderBy: { startTime: "asc" },
  });

  if (availabilities.length === 0) {
    return {
      success: false,
      message: "Doctor does not have scheduled consultation clinic on this day.",
      doctorId,
      doctorName: doctor.user.name,
      departmentName: doctor.department.name,
      date: dateStr,
      slots: [],
      totalAvailable: 0,
    };
  }

  // Fetch already booked appointments for this date
  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: dateStr,
      status: {
        notIn: ["CANCELLED"],
      },
    },
    select: {
      startTime: true,
      status: true,
    },
  });

  const bookedSlotMap = new Set(bookedAppointments.map((a) => a.startTime));

  // Determine current time if date is today
  const isToday =
    targetDate.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const generatedSlots: TimeSlot[] = [];

  for (const rule of availabilities) {
    const [startHour, startMin] = rule.startTime.split(":").map(Number);
    const [endHour, endMin] = rule.endTime.split(":").map(Number);
    const duration = rule.slotDurationMinutes || 30;

    let cursorMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (cursorMinutes + duration <= endMinutes) {
      const slotStartHour = Math.floor(cursorMinutes / 60);
      const slotStartMin = cursorMinutes % 60;
      const slotEndHour = Math.floor((cursorMinutes + duration) / 60);
      const slotEndMin = (cursorMinutes + duration) % 60;

      const startTimeStr = `${String(slotStartHour).padStart(2, "0")}:${String(slotStartMin).padStart(2, "0")}`;
      const endTimeStr = `${String(slotEndHour).padStart(2, "0")}:${String(slotEndMin).padStart(2, "0")}`;

      const isAlreadyBooked = bookedSlotMap.has(startTimeStr);
      const isPastTimeToday = isToday && cursorMinutes <= currentMinutes + 15; // 15 min buffer

      const isAvailable = !isAlreadyBooked && !isPastTimeToday;
      let statusText = "Available";
      if (isAlreadyBooked) statusText = "Booked";
      else if (isPastTimeToday) statusText = "Slot Elapsed";

      generatedSlots.push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        isAvailable,
        statusText,
      });

      cursorMinutes += duration;
    }
  }

  const totalAvailable = generatedSlots.filter((s) => s.isAvailable).length;

  return {
    success: true,
    doctorId,
    doctorName: doctor.user.name,
    departmentName: doctor.department.name,
    date: dateStr,
    slots: generatedSlots,
    totalAvailable,
  };
}

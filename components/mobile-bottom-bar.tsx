"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneCall, Calendar, Stethoscope, User, LayoutDashboard, HeartPulse } from "lucide-react";
import EmergencyModal from "./emergency-modal";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // If in admin or specific internal screens, can still display or adapt
  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-3 py-2 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
          {/* 1. Quick Emergency Button */}
          <button
            onClick={() => setEmergencyOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-red-600 hover:bg-red-50 active:scale-95 transition"
            aria-label="Emergency 24/7"
          >
            <div className="relative w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <PhoneCall className="w-4 h-4 text-red-600 relative" />
            </div>
            <span className="text-[10px] font-extrabold text-red-700 tracking-tight">Emergency</span>
          </button>

          {/* 2. Doctors Directory */}
          <Link
            href="/doctors"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition active:scale-95 ${
              pathname === "/doctors"
                ? "text-sky-700 font-bold bg-sky-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-0.5">
              <Stethoscope className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">Doctors</span>
          </Link>

          {/* 3. Primary CTA: Book Appointment (Pulsing Gradient) */}
          <Link
            href="/#appointment"
            className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl active:scale-95 transition"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-500 text-white shadow-lg shadow-sky-600/30 flex items-center justify-center mb-0.5 -mt-3.5 border-2 border-white">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-sky-700 tracking-tight">Book Slot</span>
          </Link>

          {/* 4. Patient / Staff Portal */}
          <Link
            href="/patient/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition active:scale-95 ${
              pathname.includes("/dashboard")
                ? "text-teal-700 font-bold bg-teal-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-0.5">
              <User className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">Portal</span>
          </Link>
        </div>
      </div>

      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
}

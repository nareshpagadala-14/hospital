"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  Loader2,
  PlusCircle,
  Printer,
  ChevronRight,
} from "lucide-react";

export default function ReceptionDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  const loadAppointments = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (
        !authData.authenticated ||
        (authData.user.role !== "RECEPTIONIST" && authData.user.role !== "ADMIN")
      ) {
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/appointments?date=${selectedDate}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const handleCheckIn = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CHECKED_IN" }),
      });
      const data = await res.json();
      if (data.success) {
        loadAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = appointments.filter((apt) => {
    const term = searchTerm.toLowerCase();
    return (
      apt.appointmentNumber.toLowerCase().includes(term) ||
      apt.patient?.user?.name.toLowerCase().includes(term) ||
      apt.patient?.user?.phone?.toLowerCase().includes(term) ||
      apt.doctor?.user?.name.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p className="text-xs">Loading front desk reception...</p>
      </div>
    );
  }

  const checkedInCount = appointments.filter((a) => a.status === "CHECKED_IN").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pendingCount = appointments.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING").length;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full">
              Front Desk & Triage Reception
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Waiting Room & Patient Check-In
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage live OPD patient arrivals, doctor clinic queues, and walk-in tokens in Guntur.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/#appointment"
              className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Walk-In Patient</span>
            </Link>
          </div>
        </div>

        {/* Reception Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Today
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{appointments.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Appointments</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Checked-In (Waiting)
            </span>
            <p className="text-3xl font-black text-indigo-600 mt-1">{checkedInCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">At OPD Waiting Area</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Completed
            </span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{completedCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Consultations Done</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Expected / Pending
            </span>
            <p className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Yet to arrive</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search patient by name, mobile number, doctor, or token #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Master Daily Appointment Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Arrivals & Appointments for {selectedDate}
            </h3>
            <span className="text-xs text-slate-500">
              Showing <strong>{filtered.length}</strong> records
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Token #</th>
                    <th className="pb-3 font-bold">Time Slot</th>
                    <th className="pb-3 font-bold">Patient Name & Phone</th>
                    <th className="pb-3 font-bold">Doctor & Department</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 font-mono font-bold text-slate-900">
                        {apt.appointmentNumber}
                      </td>
                      <td className="py-4 font-semibold text-sky-700">
                        {apt.startTime} &ndash; {apt.endTime}
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{apt.patient?.user?.name}</p>
                        <p className="text-[11px] text-slate-500">{apt.patient?.user?.phone}</p>
                      </td>
                      <td className="py-4">
                        <p className="font-semibold text-slate-800">{apt.doctor?.user?.name}</p>
                        <p className="text-[11px] text-slate-500">{apt.department?.name}</p>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : apt.status === "CHECKED_IN"
                              ? "bg-indigo-100 text-indigo-800"
                              : apt.status === "CONFIRMED"
                              ? "bg-sky-100 text-sky-800"
                              : apt.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {apt.status === "CONFIRMED" || apt.status === "PENDING" ? (
                          <button
                            onClick={() => handleCheckIn(apt.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-[11px] transition shadow-sm"
                          >
                            Mark Arrived / Check-In
                          </button>
                        ) : null}
                        <button
                          onClick={() => window.print()}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px]"
                          title="Print Token Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

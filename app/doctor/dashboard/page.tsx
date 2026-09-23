"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  ArrowRight,
  Loader2,
  Stethoscope,
  Filter,
  Check,
} from "lucide-react";

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedAptForNotes, setSelectedAptForNotes] = useState<any>(null);
  const [notesText, setNotesText] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadAppointments = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (!authData.authenticated || (authData.user.role !== "DOCTOR" && authData.user.role !== "ADMIN")) {
        router.push("/login");
        return;
      }

      setDoctor(authData.doctor || { user: authData.user });

      const aptRes = await fetch(`/api/appointments?date=${selectedDate}`);
      const aptData = await aptRes.json();
      if (aptData.success) {
        setAppointments(aptData.appointments || []);
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        loadAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAptForNotes) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/appointments/${selectedAptForNotes.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationNotes: notesText, status: "COMPLETED" }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedAptForNotes(null);
        setNotesText("");
        loadAppointments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p className="text-xs">Loading doctor console...</p>
      </div>
    );
  }

  const todayCount = appointments.length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const checkedInCount = appointments.filter((a) => a.status === "CHECKED_IN").length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Doctor Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full">
              Clinical OPD Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Dr. {doctor?.user?.name || "Consultant"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {doctor?.specialization || "Super Specialist"} &bull; {doctor?.department?.name || "AIMS Prime Hospital, Guntur"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Filter Consultation Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Live Patient Queue Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Today
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{todayCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Scheduled Consultations</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              In Waiting Room
            </span>
            <p className="text-3xl font-black text-indigo-600 mt-1">{checkedInCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Checked-in & Ready</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Completed
            </span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{completedCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Consultations Concluded</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Pending / Confirmed
            </span>
            <p className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Upcoming Slots</p>
          </div>
        </div>

        {/* Patient Appointment Queue Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Patient Queue &bull; {selectedDate}
            </h3>
            <span className="text-xs text-slate-500">
              Showing <strong>{appointments.length}</strong> bookings
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No appointments scheduled for this date</p>
              <p className="text-xs text-slate-400 mt-0.5">Select another date to view scheduled clinics.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Slot Time</th>
                    <th className="pb-3 font-bold">Token ID</th>
                    <th className="pb-3 font-bold">Patient Details</th>
                    <th className="pb-3 font-bold">Reason for Visit</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Clinical Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 font-bold text-sky-700">
                        {apt.startTime} &ndash; {apt.endTime}
                      </td>
                      <td className="py-4 font-mono font-semibold text-slate-800">
                        {apt.appointmentNumber}
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{apt.patient?.user?.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {apt.patient?.user?.phone} &bull; Blood: {apt.patient?.bloodGroup || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 max-w-xs text-slate-700 truncate">
                        {apt.reason || "General Consultation"}
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
                        {apt.status !== "COMPLETED" && (
                          <button
                            onClick={() => {
                              setSelectedAptForNotes(apt);
                              setNotesText(apt.consultationNotes || "");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition shadow-sm"
                          >
                            Add Rx / Notes
                          </button>
                        )}
                        {apt.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, "CHECKED_IN")}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl text-[11px] transition border border-indigo-200"
                          >
                            Call Patient
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Consultation Notes Modal */}
        {selectedAptForNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Consultation Summary & Prescription
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient: <strong>{selectedAptForNotes.patient?.user?.name}</strong> (#{selectedAptForNotes.appointmentNumber})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAptForNotes(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Diagnosis, Medication & Dietary Advice
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="e.g. Diagnosed with mild essential hypertension. Prescribed Tab Telmisartan 40mg OD x 30 days. Advised reduced dietary sodium and 40 min morning walk. Review in 1 month."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAptForNotes(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updating || !notesText.trim()}
                  onClick={handleSaveNotes}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                >
                  {updating ? "Saving..." : "Save & Complete Consultation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

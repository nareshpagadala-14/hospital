"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  PhoneCall,
  ArrowRight,
  Loader2,
  PlusCircle,
} from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated) {
          router.push("/login");
          return;
        }

        setUser(authData.user);
        setPatient(authData.patient);

        const aptRes = await fetch("/api/appointments");
        const aptData = await aptRes.json();
        if (aptData.success) {
          setAppointments(aptData.appointments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p className="text-xs">Loading patient portal...</p>
      </div>
    );
  }

  const upcomingApt = appointments.find(
    (a) => a.status === "CONFIRMED" || a.status === "PENDING" || a.status === "CHECKED_IN"
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
              Patient Health Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Blood Group: <strong className="text-slate-800">{patient?.bloodGroup || "Not specified"}</strong> &bull; Emergency Contact: {patient?.emergencyContact || "Registered"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/#appointment"
              className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* Next Scheduled Appointment Spotlight */}
        {upcomingApt ? (
          <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-3 py-0.5 rounded-full">
                  Upcoming Consultation
                </span>
                <span className="text-xs font-bold text-sky-200">
                  Token #{upcomingApt.appointmentNumber}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold">
                {upcomingApt.doctor?.user?.name} ({upcomingApt.department?.name})
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>{upcomingApt.appointmentDate}</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>
                    {upcomingApt.startTime} &ndash; {upcomingApt.endTime}
                  </span>
                </div>
                <span>&bull;</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                  {upcomingApt.status}
                </span>
              </div>

              {upcomingApt.reason && (
                <p className="text-xs text-slate-300 italic">
                  Reason: &ldquo;{upcomingApt.reason}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/patient/appointments"
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
              >
                Manage / Reschedule
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You do not have any pending doctor visits scheduled currently.
            </p>
            <Link
              href="/#appointment"
              className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              <span>Schedule Consultation</span>
            </Link>
          </div>
        )}

        {/* Recent Appointment History Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Your Appointment History</h3>
            <Link
              href="/patient/appointments"
              className="text-xs font-bold text-sky-700 hover:underline flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No appointment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Token ID</th>
                    <th className="pb-3 font-bold">Doctor & Department</th>
                    <th className="pb-3 font-bold">Date & Time</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Clinical Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.slice(0, 5).map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 font-bold text-slate-900">{apt.appointmentNumber}</td>
                      <td className="py-3.5">
                        <p className="font-semibold text-slate-800">{apt.doctor?.user?.name}</p>
                        <p className="text-[11px] text-slate-400">{apt.department?.name}</p>
                      </td>
                      <td className="py-3.5 text-slate-600">
                        {apt.appointmentDate} at {apt.startTime}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : apt.status === "CONFIRMED"
                              ? "bg-sky-100 text-sky-800"
                              : apt.status === "CHECKED_IN"
                              ? "bg-indigo-100 text-indigo-800"
                              : apt.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 max-w-xs truncate">
                        {apt.consultationNotes || "—"}
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

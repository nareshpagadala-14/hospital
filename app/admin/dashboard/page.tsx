"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Settings,
  FileText,
  Activity,
  ArrowRight,
  Loader2,
  PlusCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authData.authenticated || authData.user.role !== "ADMIN") {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentAppointments(data.recentAppointments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p className="text-xs">Loading hospital executive dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full">
              Executive Administration Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Hospital Operations Overview
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live hospital management analytics for AIMS Prime Super Speciality Hospital, Guntur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/doctors"
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Manage Doctors</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </Link>
          </div>
        </div>

        {/* High-Impact KPI Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Patients</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats?.totalPatients || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Registered in EMR</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Doctors</span>
              <Stethoscope className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats?.totalDoctors || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Across 24 Specialities</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Appointments</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-black text-indigo-600 mt-2">{stats?.todayAppointments || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Scheduled for Today</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
              <Activity className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats?.totalAppointments || 0}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {stats?.completedAppointments || 0} Completed
            </p>
          </div>
        </div>

        {/* Recent Appointments & System Activity Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Hospital Bookings Feed</h3>
            <span className="text-xs text-slate-500">Live operational stream</span>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No bookings recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Token ID</th>
                    <th className="pb-3 font-bold">Patient</th>
                    <th className="pb-3 font-bold">Doctor & Department</th>
                    <th className="pb-3 font-bold">Schedule</th>
                    <th className="pb-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 font-bold font-mono text-slate-900">
                        {apt.appointmentNumber}
                      </td>
                      <td className="py-3.5">
                        <p className="font-semibold text-slate-800">{apt.patient?.user?.name}</p>
                        <p className="text-[11px] text-slate-400">{apt.patient?.user?.phone}</p>
                      </td>
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

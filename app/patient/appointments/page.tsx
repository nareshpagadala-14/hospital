"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Loader2,
  XCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal state
  const [cancellingApt, setCancellingApt] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancelAppointment = async () => {
    if (!cancellingApt) return;
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`/api/appointments/${cancellingApt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          cancellationReason: cancelReason || "Cancelled by patient",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess("Appointment cancelled successfully.");
        setCancellingApt(null);
        setCancelReason("");
        loadAppointments();
      } else {
        setActionError(data.message || "Failed to cancel.");
      }
    } catch (e: any) {
      setActionError(e.message || "Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Back Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/patient/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Patient Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Appointments & Consultation History
            </h1>
          </div>

          <Link
            href="/#appointment"
            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm self-start"
          >
            <span>Book New Appointment</span>
          </Link>
        </div>

        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Appointments List */}
        {loading ? (
          <div className="py-24 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
            <p className="text-xs">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No appointments booked yet</h3>
            <p className="text-xs text-slate-500">
              Schedule your first OPD consultation with our specialist doctors in Guntur.
            </p>
            <Link
              href="/#appointment"
              className="inline-block mt-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
            >
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const canCancel =
                apt.status === "PENDING" || apt.status === "CONFIRMED";

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-slate-900 text-base">
                        #{apt.appointmentNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                    </div>

                    <h3 className="text-lg font-bold text-slate-800">
                      {apt.doctor?.user?.name}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        ({apt.department?.name})
                      </span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{apt.appointmentDate}</span>
                      </div>
                      <span>&bull;</span>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>
                          {apt.startTime} &ndash; {apt.endTime}
                        </span>
                      </div>
                      <span>&bull;</span>
                      <span>Type: {apt.appointmentType}</span>
                    </div>

                    {apt.reason && (
                      <p className="text-xs text-slate-600 italic">
                        Reason: {apt.reason}
                      </p>
                    )}

                    {apt.consultationNotes && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 mt-2">
                        <strong>Doctor&apos;s Clinical Advice:</strong> {apt.consultationNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {canCancel && (
                      <button
                        onClick={() => setCancellingApt(apt)}
                        className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                    >
                      Print Slip
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h3 className="font-bold text-slate-900 text-lg">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to cancel appointment #{cancellingApt.appointmentNumber} with {cancellingApt.doctor?.user?.name}?
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule conflict, feeling better"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingApt(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleCancelAppointment}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                >
                  {actionLoading ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Stethoscope,
  Award,
  Clock,
  ShieldCheck,
  Calendar,
  Languages,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import AppointmentWizard from "@/components/appointment-wizard";

export default function DoctorProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadDoctor() {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        const data = await res.json();
        if (data.success) {
          setDoctor(data.doctor);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p className="text-xs">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-32 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested doctor profile does not exist or has been updated.
        </p>
        <Link
          href="/doctors"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doctor Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link
          href="/doctors"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Doctors</span>
        </Link>

        {/* Doctor Header Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Photo */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl overflow-hidden bg-slate-100 relative shadow-md flex-shrink-0">
              {doctor.photo ? (
                <Image
                  src={doctor.photo}
                  alt={doctor.user?.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Stethoscope className="w-12 h-12 text-slate-400 m-auto mt-16" />
              )}
            </div>

            {/* Information */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full mb-2">
                  {doctor.department?.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {doctor.user?.name}
                </h1>
                <p className="text-sm font-semibold text-sky-700 mt-0.5">
                  {doctor.specialization}
                </p>
                <p className="text-xs text-slate-500 mt-1">{doctor.qualification}</p>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Experience</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {doctor.experienceYears} Years
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Consultation Fee</p>
                  <p className="font-extrabold text-emerald-700 text-sm mt-0.5">
                    ₹{doctor.consultationFee}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Registration</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 truncate">
                    {doctor.registrationNumber || "APMC Verified"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Languages</p>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 truncate">
                    {doctor.languages || "Telugu, English"}
                  </p>
                </div>
              </div>

              {/* Biography */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  About Consultant
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {doctor.biography}
                </p>
              </div>

              {/* Clinic Timings */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-center space-x-3 text-xs text-sky-950">
                <Clock className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">OPD Schedule (Guntur Clinic):</p>
                  <p className="text-[11px] text-sky-800 mt-0.5">
                    Monday to Saturday: Morning 09:00 AM &ndash; 01:00 PM | Evening 04:00 PM &ndash; 07:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Booking Section with Preselected Doctor */}
        <div id="book" className="space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Live Scheduling
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Book Appointment with {doctor.user?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your preferred date and time slot below for direct slot reservation.
            </p>
          </div>

          <AppointmentWizard
            preselectedDoctorId={doctor.id}
            preselectedDepartmentId={doctor.departmentId}
          />
        </div>
      </div>
    </div>
  );
}

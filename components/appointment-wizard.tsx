"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AppointmentWizard({
  preselectedDoctorId,
  preselectedDepartmentId,
}: {
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Master Data
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState(preselectedDepartmentId || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId || "");
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to tomorrow or today
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [patientData, setPatientData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "Male",
    dateOfBirth: "1990-01-01",
    bloodGroup: "B+",
    reason: "General Consultation & Health Check",
    appointmentType: "IN_PERSON",
  });

  // Confirmed Result
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  // Auto-fill patient if logged in
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setPatientData((prev) => ({
            ...prev,
            name: data.user.name || "",
            phone: data.user.phone || "",
            email: data.user.email || "",
            gender: data.patient?.gender || "Male",
            bloodGroup: data.patient?.bloodGroup || "B+",
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUser();
  }, []);

  // Fetch departments
  useEffect(() => {
    async function fetchDepts() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (data.success) {
          setDepartments(data.departments);
          if (!selectedDeptId && data.departments.length > 0) {
            setSelectedDeptId(data.departments[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }
    fetchDepts();
  }, []);

  // Fetch doctors when department changes
  useEffect(() => {
    if (!selectedDeptId) return;
    async function fetchDocs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/doctors?departmentId=${selectedDeptId}`);
        const data = await res.json();
        if (data.success) {
          setDoctors(data.doctors);
          if (data.doctors.length > 0) {
            // Pick preselected or first
            if (preselectedDoctorId && data.doctors.some((d: any) => d.id === preselectedDoctorId)) {
              setSelectedDoctorId(preselectedDoctorId);
            } else {
              setSelectedDoctorId(data.doctors[0].id);
            }
          } else {
            setSelectedDoctorId("");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [selectedDeptId, preselectedDoctorId]);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;
    async function fetchSlots() {
      setSlotsLoading(true);
      setErrorMessage("");
      setSelectedSlot(null);
      try {
        const res = await fetch(
          `/api/appointments/slots?doctorId=${selectedDoctorId}&date=${selectedDate}`
        );
        const data = await res.json();
        if (data.success) {
          setAvailableSlots(data.slots);
          if (data.totalAvailable === 0) {
            setErrorMessage("No slots available for this doctor on the selected date. Please pick another date.");
          }
        } else {
          setAvailableSlots([]);
          setErrorMessage(data.message || "Slots unavailable for this date.");
        }
      } catch (err) {
        setAvailableSlots([]);
        setErrorMessage("Error fetching slots. Please try another date.");
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDoctorId, selectedDate]);

  // Handle final submission
  const handleConfirmBooking = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          departmentId: selectedDeptId,
          appointmentDate: selectedDate,
          startTime: selectedSlot?.startTime,
          appointmentType: patientData.appointmentType,
          reason: patientData.reason,
          guestPatient: {
            name: patientData.name,
            phone: patientData.phone,
            email: patientData.email,
            gender: patientData.gender,
            dateOfBirth: patientData.dateOfBirth,
            bloodGroup: patientData.bloodGroup,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.appointment) {
        setConfirmedAppointment(data.appointment);
        setStep(6);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMessage(data.message || "Failed to book appointment. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage("Network error occurred during booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  // Generate next 10 dates for quick selection
  const upcomingDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const dayNum = d.getDate();
    return { dateStr, dayName, monthName, dayNum };
  });

  return (
    <div id="appointment" className="w-full bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
      {/* Wizard Header Progress Bar */}
      <div className="bg-slate-900 text-white px-6 py-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800">
              Interactive OPD Booking Engine
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Schedule Specialist Consultation
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            Step <span className="text-white font-bold text-base">{step}</span> of 6
          </div>
        </div>

        {/* Stepper Dots & Labels */}
        <div className="grid grid-cols-6 gap-2 mt-6">
          {[
            { num: 1, label: "Department" },
            { num: 2, label: "Doctor" },
            { num: 3, label: "Date" },
            { num: 4, label: "Time Slot" },
            { num: 5, label: "Patient" },
            { num: 6, label: "Confirmed" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-sky-500 text-white ring-4 ring-sky-500/30"
                    : step > s.num
                    ? "bg-teal-500 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="hidden sm:inline text-[10px] mt-1.5 font-medium text-slate-400">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Body Container */}
      <div className="p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Booking Notice</p>
              <p className="text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: SELECT DEPARTMENT */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Step 1: Choose Medical Department</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the clinical speciality matching your condition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {departments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-36 ${
                      isSelected
                        ? "border-sky-600 bg-sky-50/80 shadow-md ring-2 ring-sky-500/20"
                        : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                          {dept.doctors?.length || dept._count?.doctors || "Specialists"} Available
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-600" />}
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mt-3 line-clamp-1">
                        {dept.name}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{dept.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedDeptId}
                className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md"
              >
                <span>Select Doctor</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Step 2: Choose Specialist Doctor</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Department: <strong className="text-sky-700">{selectedDept?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" /> Change Department
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
                <p className="text-xs">Loading consultants...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                <User className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">No doctors listed in this department currently</p>
                <p className="text-xs text-slate-500 mt-1">Please select another department.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start space-x-4 ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/70 shadow-md ring-2 ring-sky-500/20"
                          : "border-slate-200 hover:border-sky-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                        {doc.photo ? (
                          <Image
                            src={doc.photo}
                            alt={doc.user?.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-sm truncate">
                            {doc.user?.name}
                          </h5>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-sky-700 font-semibold truncate mt-0.5">
                          {doc.specialization}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{doc.qualification}</p>

                        <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-600">
                          <span>{doc.experienceYears} Years Exp</span>
                          <span>&bull;</span>
                          <span className="font-bold text-emerald-700">₹{doc.consultationFee} Fee</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center space-x-1 text-slate-600 font-semibold px-4 py-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!selectedDoctorId}
                className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md"
              >
                <span>Select Date</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Step 3: Select Consultation Date</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Doctor: <strong className="text-sky-700">{selectedDoctor?.user?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" /> Change Doctor
              </button>
            </div>

            {/* Quick Date Cards Carousel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Available Upcoming Days in Guntur Clinic:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {upcomingDates.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/30"
                          : "border-slate-200 hover:border-sky-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        {item.dayName}
                      </span>
                      <span className="text-xl font-extrabold my-0.5">{item.dayNum}</span>
                      <span className="text-[10px] opacity-80">{item.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Or Manual Date Picker */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Or Pick Custom Date:
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-1 text-slate-600 font-semibold px-4 py-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!selectedDate}
                className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md"
              >
                <span>Select Time Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT TIME SLOT */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Step 4: Select Available Time Slot</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDoctor?.user?.name} &bull; Date: <strong>{selectedDate}</strong>
                </p>
              </div>
              <button
                onClick={() => setStep(3)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" /> Change Date
              </button>
            </div>

            {slotsLoading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
                <p className="text-xs">Checking real-time doctor availability...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">No slots available on this date</p>
                <p className="text-xs text-slate-500 mt-1">
                  The doctor may be on leave, OPD clinic closed, or all slots booked.
                </p>
                <button
                  onClick={() => setStep(3)}
                  className="mt-4 bg-sky-50 text-sky-700 border border-sky-200 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Choose Another Date
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center space-x-4 text-[11px] text-slate-500 pb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-sky-600"></span>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-slate-100 text-slate-400 border border-slate-200"></span>
                    <span>Booked / Elapsed</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl text-center border font-bold text-xs transition ${
                          isSelected
                            ? "bg-sky-600 text-white border-sky-600 shadow-md"
                            : slot.isAvailable
                            ? "bg-white border-slate-200 hover:border-sky-400 text-slate-800 hover:bg-sky-50"
                            : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div>{slot.startTime}</div>
                        <div className="text-[10px] font-normal opacity-80">{slot.statusText}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-1 text-slate-600 font-semibold px-4 py-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                disabled={!selectedSlot}
                className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md"
              >
                <span>Patient Information</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PATIENT DETAILS & REVIEW */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Step 5: Patient Details & Reason</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide accurate patient demographics for hospital clinical records in Guntur.
              </p>
            </div>

            {/* Appointment Summary Capsule */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-800">Booking Summary</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedDoctor?.user?.name} ({selectedDept?.name})
                </p>
                <p className="text-slate-600 mt-0.5">
                  {selectedDate} at <strong>{selectedSlot?.startTime} - {selectedSlot?.endTime}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500">Consultation Fee</span>
                <p className="text-base font-extrabold text-emerald-700">₹{selectedDoctor?.consultationFee}</p>
              </div>
            </div>

            {/* Patient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Patient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venkata Satyanarayana"
                  value={patientData.name}
                  onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number * (For SMS & Token)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94401 23456"
                  value={patientData.phone}
                  onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  value={patientData.email}
                  onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={patientData.gender}
                    onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={patientData.bloodGroup}
                    onChange={(e) => setPatientData({ ...patientData, bloodGroup: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Visit / Symptoms
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chest tightness on exertion, routine blood pressure checkup"
                  value={patientData.reason}
                  onChange={(e) => setPatientData({ ...patientData, reason: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center space-x-1 text-slate-600 font-semibold px-4 py-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={loading || !patientData.name || !patientData.phone}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMED SUCCESS */}
        {step === 6 && confirmedAppointment && (
          <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Appointment Confirmed
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-2">
                Token #{confirmedAppointment.appointmentNumber}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Your consultation has been booked into AIMS Prime Hospital Management System.
              </p>
            </div>

            {/* Printable Slip Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3 shadow-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900">
                  {confirmedAppointment.patient?.user?.name || patientData.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">
                  {confirmedAppointment.doctor?.user?.name || selectedDoctor?.user?.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900">
                  {confirmedAppointment.department?.name || selectedDept?.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-sky-700">
                  {confirmedAppointment.appointmentDate} at {confirmedAppointment.startTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-800">
                  OPD Block, Collectorate Road, Guntur
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
              >
                Print Appointment Slip
              </button>
              <Link
                href="/patient/appointments"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                View in Patient Portal
              </Link>
              <button
                onClick={() => {
                  setStep(1);
                  setConfirmedAppointment(null);
                  setSelectedSlot(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

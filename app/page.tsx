"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HeartPulse,
  PhoneCall,
  Calendar,
  ShieldCheck,
  Award,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  ChevronDown,
  Ambulance,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Loader2,
  FileText,
  Activity,
} from "lucide-react";
import MedicalCanvas3D from "@/components/medical-canvas-3d";
import AppointmentWizard from "@/components/appointment-wizard";
import EmergencyModal from "@/components/emergency-modal";

export default function HomePage() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [deptRes, docRes, pkgRes, srvRes, artRes, testRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/doctors"),
          fetch("/api/packages"),
          fetch("/api/services"),
          fetch("/api/articles"),
          fetch("/api/testimonials"),
        ]);

        const [depts, docs, pkgs, srvs, arts, tests] = await Promise.all([
          deptRes.json(),
          docRes.json(),
          pkgRes.json(),
          srvRes.json(),
          artRes.json(),
          testRes.json(),
        ]);

        if (depts.success) setDepartments(depts.departments || []);
        if (docs.success) setDoctors(docs.doctors || []);
        if (pkgs.success) setPackages(pkgs.packages || []);
        if (srvs.success) setServices(srvs.services || []);
        if (arts.success) setArticles(arts.articles || []);
        if (tests.success) setTestimonials(tests.testimonials || []);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      }
    }
    loadData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (data.success) {
        setContactSent(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setContactSending(false);
    }
  };

  const faqItems = [
    {
      q: "How can I book an outpatient appointment online?",
      a: "Use our interactive Appointment Wizard below! Choose your department, select your specialist, pick an available date and time slot, enter patient details, and receive instant online token confirmation. You can also call +91 863 234 5600.",
    },
    {
      q: "Is emergency and trauma care available 24/7 in Guntur?",
      a: "Yes. Our Level-1 Emergency & Trauma Department operates 24/7/365 with full-time emergency doctors, acute stroke response team, digital cath lab for primary angioplasty, and ACLS ambulances.",
    },
    {
      q: "Are cashless health insurance facilities supported?",
      a: "AIMS Prime Hospital is empanelled with all major insurance providers and TPAs including Star Health, Care, HDFC ERGO, Medi Assist, ICICI Lombard, and Andhra Pradesh government health schemes. Cashless desk operates 24/7.",
    },
    {
      q: "How do I reschedule or cancel my appointment?",
      a: "Patients can easily log in to the Patient Portal with their registered mobile or email, navigate to 'My Appointments', and reschedule to any available slot or cancel with zero fee.",
    },
    {
      q: "What should I bring on the day of my consultation?",
      a: "Please carry a valid photo ID, existing medical prescriptions, prior diagnostic reports (ECG, X-Ray, blood test results), and your health insurance card if you plan for cashless daycare or admission.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* =========================================================================
          1. CINEMATIC HERO SECTION WITH 3D WEBGL VISUAL & FLOATING CARDS
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0A192F] to-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Description, and CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-700/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Premier Tertiary Healthcare in Guntur, Andhra Pradesh</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Advanced Healthcare.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-300">
                  Compassionate Care.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Comprehensive multi-speciality healthcare services delivered by 150+ experienced doctors, modern 24/7 digital cardiac cath lab, robotic joint surgery, and advanced Level-1 trauma care in Guntur.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="#appointment"
                  className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-sky-600/30 transition transform hover:-translate-y-0.5 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  href="/doctors"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition text-xs sm:text-sm"
                >
                  <Stethoscope className="w-4 h-4 text-sky-400" />
                  <span>Find a Doctor</span>
                </Link>

                <button
                  onClick={() => setEmergencyOpen(true)}
                  className="flex items-center space-x-2 bg-red-600/90 hover:bg-red-600 text-white font-bold px-5 py-3.5 rounded-2xl border border-red-500 shadow-lg shadow-red-600/30 transition text-xs sm:text-sm"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>24/7 Emergency</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg text-slate-300">
                <div>
                  <p className="text-2xl font-extrabold text-white">18+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Years of Service</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">150+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Specialist Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-400">NABH</p>
                  <p className="text-xs text-slate-400 mt-0.5">Quality Accredited</p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D WebGL Canvas + Floating Glass Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* 3D Canvas Container */}
              <div className="w-full h-[400px] sm:h-[480px] relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex items-center justify-center">
                <MedicalCanvas3D />

                {/* Floating Glass Information Card 1: 24/7 Emergency */}
                <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-xs text-white shadow-xl flex items-center space-x-3 pointer-events-none">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-[13px]">24/7 Trauma Care</p>
                    <p className="text-[11px] text-slate-400">Guntur Center</p>
                  </div>
                </div>

                {/* Floating Glass Information Card 2: 150+ Specialists */}
                <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-xs text-white shadow-xl flex items-center space-x-3 pointer-events-none">
                  <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[13px]">Digital Cath Lab</p>
                    <p className="text-[11px] text-slate-400">Primary Angioplasty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EMERGENCY 24/7 BANNER WITH PULSATING ECG ANIMATION
      ========================================================================= */}
      <section className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-6 shadow-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                    24/7 Level-1 Emergency
                  </span>
                  {/* Subtle SVG ECG Waveform */}
                  <svg className="w-16 h-5 text-white/80" viewBox="0 0 100 20">
                    <path
                      d="M0 10 L30 10 L35 2 L40 18 L45 5 L50 15 L55 10 L100 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5">
                  Medical Emergency? We&apos;re Here 24/7.
                </h2>
                <p className="text-xs text-red-100 mt-0.5">
                  For acute heart attack, trauma, or stroke, call our emergency response unit immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <a
                href="tel:+918632345678"
                className="flex items-center space-x-2 bg-white text-red-600 hover:bg-red-50 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Call Emergency (+91 863 234 5678)</span>
              </a>

              <button
                onClick={() => setEmergencyOpen(true)}
                className="bg-red-950/40 hover:bg-red-950/60 border border-white/30 text-white font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm transition"
              >
                Ambulance Dispatch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ANIMATED HOSPITAL STATISTICS
      ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
              <Building className="w-8 h-8 text-sky-600 mx-auto mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">18+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Years of Excellence
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
              <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">120+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Specialist Doctors
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
              <Activity className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">24+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Super Specialities
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
              <HeartPulse className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">250K+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Patients Treated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. ABOUT HOSPITAL STORYTELLING
      ========================================================================= */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image & Stats Badge */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative h-[420px] sm:h-[480px]">
                <Image
                  src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80"
                  alt="AIMS Prime Hospital Guntur Building"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-3xl p-5 shadow-xl border border-slate-200 max-w-xs text-xs">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold mb-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span>NABH & NABL Accredited</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Rigorous clinical governance, zero-infection surgical protocols, and 24/7 critical care backup in Guntur.
                </p>
              </div>
            </div>

            {/* Right Storytelling Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                  About AIMS Prime Hospital
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 leading-tight">
                  World-Class Medical Care in the Heart of Andhra Pradesh
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Founded with a mission to deliver advanced tertiary healthcare without compromise, AIMS Prime Super Speciality Hospital is Guntur&apos;s leading healthcare destination. Our hospital houses multidisciplinary centers of excellence in cardiology, neurosurgery, orthopedics, high-risk obstetrics, and pediatric intensive care.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 mr-2" />
                    Advanced Technology
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Flat-panel digital Cath Lab, 64-slice CT, 1.5T MRI, and robotic knee navigation systems.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2" />
                    Compassionate Nursing
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Dedicated 1:1 nurse-to-patient critical care ratios in CCU, NICU, and post-operative wards.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/departments"
                  className="inline-flex items-center space-x-2 text-sky-700 hover:text-sky-800 font-bold text-sm"
                >
                  <span>Explore All 24 Super Specialities</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CLINICAL DEPARTMENTS SHOWCASE
      ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Centers of Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Specialised Clinical Departments
              </h2>
            </div>
            <Link
              href="/departments"
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center"
            >
              <span>View All Departments</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.slice(0, 8).map((dept) => (
              <div
                key={dept.id}
                className="group bg-slate-50 hover:bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-44 relative overflow-hidden bg-slate-200">
                  {dept.image ? (
                    <Image
                      src={dept.image}
                      alt={dept.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {dept.doctors?.length || dept._count?.doctors || "Specialists"} Available
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-700 transition">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <Link
                    href={`/doctors?departmentSlug=${dept.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 pt-2 border-t border-slate-200/70"
                  >
                    <span>Consult Specialists</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FEATURED SPECIALIST DOCTORS
      ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                Medical Faculty
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Meet Our Senior Doctors & Surgeons
              </h2>
            </div>
            <Link
              href="/doctors"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center"
            >
              <span>View Doctor Directory</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, 6).map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 relative flex-shrink-0">
                      {doc.photo ? (
                        <Image
                          src={doc.photo}
                          alt={doc.user?.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Stethoscope className="w-8 h-8 text-slate-400 m-auto mt-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md mb-1">
                        {doc.department?.name}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {doc.user?.name}
                      </h3>
                      <p className="text-xs font-medium text-sky-700 truncate">
                        {doc.specialization}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-2 leading-relaxed">
                    {doc.biography}
                  </p>

                  <div className="flex items-center justify-between mt-4 py-2 border-y border-slate-100 text-xs">
                    <span className="text-slate-500">{doc.experienceYears} Years Experience</span>
                    <span className="font-extrabold text-emerald-700">₹{doc.consultationFee} Fee</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-2">
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/#appointment`}
                    className="flex-1 text-center py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. HOSPITAL INFRASTRUCTURE & SERVICES
      ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Clinical Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Advanced Hospital Facilities
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Equipped with global-standard medical diagnostics, modular surgical suites, and intensive care units in Guntur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition space-y-4"
              >
                <div className="h-40 relative rounded-2xl overflow-hidden bg-slate-200">
                  {srv.image ? (
                    <Image
                      src={srv.image}
                      alt={srv.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    {srv.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{srv.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{srv.description}</p>
                </div>

                {srv.facilities && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1">Key Capabilities:</p>
                    <p>{srv.facilities}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. ONLINE APPOINTMENT BOOKING ENGINE WIZARD
      ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
              Instant OPD Booking
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Book Your Consultation Online
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Guaranteed no double-booking with real-time doctor availability checks.
            </p>
          </div>

          {/* Embedded Interactive Appointment Wizard */}
          <AppointmentWizard />
        </div>
      </section>

      {/* =========================================================================
          9. PREVENTIVE HEALTH CHECKUP PACKAGES
      ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Preventive Health
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Comprehensive Health Checkup Packages
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Early detection saves lives. Choose customized master checkups curated by senior physicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              let tests: string[] = [];
              try {
                tests = JSON.parse(pkg.includedTests || "[]");
              } catch {
                tests = [pkg.includedTests];
              }

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                    pkg.isPopular
                      ? "border-sky-500 shadow-xl ring-2 ring-sky-500/20"
                      : "border-slate-200 shadow-sm hover:shadow-lg"
                  }`}
                >
                  <div className="space-y-4">
                    {pkg.isPopular && (
                      <span className="inline-block text-[10px] font-extrabold uppercase bg-sky-600 text-white px-3 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{pkg.description}</p>

                    <div className="pt-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-slate-900">
                          ₹{pkg.discountedPrice}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{pkg.originalPrice}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Save ₹{pkg.originalPrice - pkg.discountedPrice}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Includes {tests.length} Essential Tests:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {tests.slice(0, 4).map((t, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mr-1.5 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{t}</span>
                          </li>
                        ))}
                        {tests.length > 4 && (
                          <li className="text-[11px] text-sky-600 font-semibold pl-5">
                            + {tests.length - 4} more diagnostics
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/health-packages"
                      className="block text-center w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition"
                    >
                      Book Package
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. VERIFIED PATIENT TESTIMONIALS
      ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Patient Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Stories of Healing & Recovery
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Real testimonials from patients treated at AIMS Prime Hospital Guntur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center text-amber-500 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-base">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 mt-4">
                  <p className="font-bold text-slate-900 text-xs">{t.patientName}</p>
                  <p className="text-[11px] text-sky-700">{t.department} Patient</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. HEALTH ARTICLES & BLOG
      ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                Medical Insights
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Health Education & Guidance
              </h2>
            </div>
            <Link
              href="/articles"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center"
            >
              <span>Read All Articles</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/articles/${art.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-48 relative overflow-hidden bg-slate-200">
                  {art.image && (
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{art.authorName}</span>
                    <span>{art.readTimeMinutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
      ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Patient Support
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          13. LOCATION & CONTACT FORM IN GUNTUR
      ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Hospital Location Info in Guntur */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                  Hospital Location
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  Visit Us in Guntur
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Conveniently situated beside New RTO on Collectorate Road with 24/7 valet parking and ambulance bays.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Hospital Address</p>
                    <p className="text-slate-600 mt-0.5">
                      AIMS Prime Super Speciality Hospital, Collectorate Road, Beside New RTO, Sambasiva Pet, Guntur, Andhra Pradesh 522004
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <Clock className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Hospital Working Hours</p>
                    <p className="text-slate-600 mt-0.5">
                      Outpatient Clinic (OPD): Monday to Saturday 08:00 AM &ndash; 08:00 PM
                    </p>
                    <p className="text-red-600 font-bold mt-0.5">
                      Emergency, ICU & Cath Lab: 24 Hours / 365 Days
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <PhoneCall className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Emergency & Helpline</p>
                    <p className="text-slate-600 mt-0.5">
                      Emergency Desk: <strong>+91 863 234 5678</strong> | Ambulance: <strong>+91 863 234 9999</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact / Feedback Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">Get in Touch with Our Medical Desk</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Have questions about treatments, doctors, or international patient care? Send us a message.
              </p>

              {contactSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-emerald-900 text-sm">Message Sent Successfully</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you. Our patient care executive in Guntur will reach out within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. K. Srinivas"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98480 12345"
                        value={contactForm.mobile}
                        onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Inquiry regarding Knee Replacement Surgery"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your inquiry..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactSending}
                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2"
                  >
                    {contactSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{contactSending ? "Sending Message..." : "Submit Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  );
}

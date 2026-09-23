"use client";

import React from "react";
import Link from "next/link";
import { HeartPulse, PhoneCall, Mail, MapPin, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Hospital Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white tracking-tight">AIMS PRIME</h3>
                <p className="text-xs uppercase font-semibold text-sky-400 tracking-wider">
                  Super Speciality Hospital &bull; Guntur
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Leading the healthcare revolution in Guntur and the Amaravati capital region with 150+ specialist doctors, advanced 24/7 cardiac cath lab, robotic joint replacement, and comprehensive emergency care.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> NABH Standard Patient Safety
              </span>
              <span className="inline-flex items-center text-sky-400 font-semibold bg-sky-950/50 border border-sky-800/60 px-2.5 py-1 rounded-full">
                24/7 Level-1 Trauma
              </span>
            </div>
          </div>

          {/* Col 3: Clinical Departments */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
              Key Departments
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/departments#cardiology" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-sky-500" /> Cardiology & Cath Lab
                </Link>
              </li>
              <li>
                <Link href="/departments#neurology" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-sky-500" /> Neurology & Neurosurgery
                </Link>
              </li>
              <li>
                <Link href="/departments#orthopedics" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-sky-500" /> Robotic Joint Replacement
                </Link>
              </li>
              <li>
                <Link href="/departments#pediatrics" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-sky-500" /> Pediatrics & Level-III NICU
                </Link>
              </li>
              <li>
                <Link href="/departments#gynecology" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-sky-500" /> High-Risk Obstetrics
                </Link>
              </li>
              <li>
                <Link href="/departments#emergency-medicine" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-sky-500" /> 24/7 Emergency & Trauma
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Patient Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Portals & Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#appointment" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-teal-500" /> Online Appointment Engine
                </Link>
              </li>
              <li>
                <Link href="/patient/dashboard" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-teal-500" /> Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-teal-500" /> Doctor Portal
                </Link>
              </li>
              <li>
                <Link href="/reception/dashboard" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-teal-500" /> Front Desk Reception
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-teal-500" /> Hospital Admin Console
                </Link>
              </li>
              <li>
                <Link href="/health-packages" className="hover:text-white transition flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-teal-500" /> Master Health Checkups
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Location */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
              Emergency & Location
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  Collectorate Road, Beside New RTO, Sambasiva Pet, Guntur, AP 522004
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">24/7 Emergency Line</p>
                  <a href="tel:+918632345678" className="text-white font-bold hover:text-rose-400">
                    +91 863 234 5678
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href="mailto:care@aimshospital.com" className="text-slate-400 hover:text-white">
                  care@aimshospital.com
                </a>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-slate-400">OPD: 8 AM - 8 PM | ER: 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} AIMS Prime Super Speciality Hospital, Guntur. All rights reserved.
          </p>
          <p className="max-w-xl text-[11px] text-slate-600 text-center md:text-right leading-relaxed">
            Medical Disclaimer: Health information provided on this website is for general educational purposes and is not a substitute for professional clinical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}

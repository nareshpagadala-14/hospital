"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Ambulance,
  CheckCircle2,
  Send,
  Loader2,
  ChevronRight,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-sky-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Contact & Location</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact AIMS Prime Hospital Guntur
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            We are here to assist you 24/7. Reach out for appointments, medical emergencies, diagnostic queries, or directions.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">24/7 Emergency Line</p>
              <a href="tel:+918632345678" className="text-base font-extrabold text-slate-900 hover:text-red-600 block mt-1">
                +91 863 234 5678
              </a>
              <p className="text-[11px] text-slate-500 mt-1">Direct to Emergency Triage</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Ambulance Service</p>
              <a href="tel:+918632349999" className="text-base font-extrabold text-slate-900 hover:text-sky-600 block mt-1">
                +91 863 234 9999
              </a>
              <p className="text-[11px] text-slate-500 mt-1">ACLS Ambulances with Doctor</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Email Inquiries</p>
              <a href="mailto:care@aimshospital.com" className="text-base font-extrabold text-slate-900 hover:text-sky-600 block mt-1">
                care@aimshospital.com
              </a>
              <p className="text-[11px] text-slate-500 mt-1">Response within 2 hours</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Hospital Timings</p>
              <p className="text-sm font-extrabold text-slate-900 mt-1">OPD: 8 AM - 8 PM</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Emergency & ICU: 24/7</p>
            </div>
          </div>
        </div>

        {/* Map & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Map & Location */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <MapPin className="w-5 h-5 text-sky-600 mr-2" />
                Hospital Location in Guntur
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AIMS Prime Super Speciality Hospital, Collectorate Road, Beside New RTO Office, Sambasiva Pet, Guntur, Andhra Pradesh &ndash; 522004.
              </p>

              {/* Responsive Google Maps Embed / Map Placeholder */}
              <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                <iframe
                  title="AIMS Prime Hospital Guntur Map"
                  src="https://maps.google.com/maps?q=Guntur%2C%20Andhra%20Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                <p>
                  <strong>Landmarks:</strong> 1.5 KM from Guntur Railway Junction &bull; 2 KM from NTR Bus Station &bull; Beside New RTO Office.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Send an Inquiry to Patient Helpdesk</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Our administration and nursing triage desk will respond promptly.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="font-bold text-emerald-900 text-base">Inquiry Submitted</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you for contacting AIMS Prime Hospital. A patient counselor will call you on {formData.mobile} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Health Insurance TPA Approval"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter your inquiry details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{sending ? "Sending..." : "Submit Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

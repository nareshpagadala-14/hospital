"use client";

import React, { useState } from "react";
import { PhoneCall, AlertTriangle, Ambulance, MapPin, X, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";

export default function EmergencyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    location: "",
    emergencyType: "Cardiac Emergency",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          subject: `[URGENT AMBULANCE REQUEST] - ${formData.emergencyType}`,
          message: `URGENT DISPATCH: Pickup at: ${formData.location}. Emergency Nature: ${formData.emergencyType}. Caller: ${formData.name} (${formData.mobile}).`,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-red-200 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Top Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 animate-pulse">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                24/7 Level-1 Trauma Care &bull; Guntur
              </span>
              <h2 className="text-xl font-bold mt-1">Medical Emergency Assistance</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Direct Hotline Dialing Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <a
              href="tel:+918632345678"
              className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 text-center"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <div>
                <p className="text-xs font-medium text-red-100">Direct Emergency</p>
                <p className="text-base font-extrabold">+91 863 234 5678</p>
              </div>
            </a>

            <a
              href="tel:+918632349999"
              className="flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 text-center"
            >
              <Ambulance className="w-5 h-5 text-rose-400" />
              <div>
                <p className="text-xs font-medium text-slate-300">Ambulance Hotline</p>
                <p className="text-base font-extrabold">+91 863 234 9999</p>
              </div>
            </a>
          </div>

          {/* Hospital Address Guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3.5">
            <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <p className="font-semibold text-slate-900 text-sm">AIMS Prime Hospital Emergency Wing</p>
              <p className="mt-0.5">Collectorate Road, Beside New RTO, Sambasiva Pet, Guntur, AP</p>
              <a
                href="https://maps.google.com/?q=Guntur,Andhra+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:underline font-medium inline-block mt-1"
              >
                Open in Google Maps for Immediate GPS Navigation &rarr;
              </a>
            </div>
          </div>

          {/* Ambulance Dispatch Request Form */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <Ambulance className="w-4 h-4 text-red-600 mr-2" />
              Request ACLS Ambulance Dispatch
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Our advanced life-support ambulance will be dispatched with an emergency doctor.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-emerald-900 text-sm">Ambulance Request Received</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Our emergency dispatch unit in Guntur is calling {formData.mobile} right now. Keep your line free.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient / Caller Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Location / Landmark in Guntur Region
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Old Bus Stand, Brodipet 3rd Lane, Guntur"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nature of Emergency
                  </label>
                  <select
                    value={formData.emergencyType}
                    onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Cardiac / Chest Pain">Cardiac / Severe Chest Pain</option>
                    <option value="Stroke / Paralysis Symptoms">Stroke / Sudden Paralysis / Slurred Speech</option>
                    <option value="Road Accident / Severe Trauma">Road Accident / Severe Trauma</option>
                    <option value="Severe Breathing Difficulty">Severe Breathing Difficulty</option>
                    <option value="Pediatric Emergency">Pediatric / Infant High Fever / Seizure</option>
                    <option value="Pregnancy Emergency">Pregnancy / Labor Complications</option>
                    <option value="Other Medical Crisis">Other Medical Crisis</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                >
                  {submitting ? "Dispatching Request..." : "Request Immediate Ambulance Dispatch"}
                </button>
              </form>
            )}
          </div>

          {/* Medical Notice */}
          <div className="text-[11px] text-slate-500 leading-relaxed flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Advisory:</strong> For immediate life-threatening situations, dial the direct hotline numbers above. Online appointment booking is NOT intended for acute emergency conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

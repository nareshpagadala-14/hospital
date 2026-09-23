"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  PhoneCall,
  Clock,
  MapPin,
} from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();
        if (!authData.authenticated || authData.user.role !== "ADMIN") {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Hospital configuration saved successfully.");
      } else {
        setErrorMessage(data.message || "Failed to save settings.");
      }
    } catch (err) {
      setErrorMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p className="text-xs">Loading hospital settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospital System Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Never hardcode clinical contact numbers. Adjust emergency lines, hospital address, and working hours dynamically.
          </p>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <Building className="w-4 h-4 text-sky-600 mr-2" />
              General Hospital Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Official Name</label>
                <input
                  type="text"
                  value={settings["hospital_name"] || ""}
                  onChange={(e) => setSettings({ ...settings, hospital_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings["tagline"] || ""}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hospital Address in Guntur</label>
              <input
                type="text"
                value={settings["address"] || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <PhoneCall className="w-4 h-4 text-rose-600 mr-2" />
              Emergency & Clinical Helplines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">24/7 Emergency Line</label>
                <input
                  type="text"
                  value={settings["emergency_phone"] || ""}
                  onChange={(e) => setSettings({ ...settings, emergency_phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ambulance Hotline</label>
                <input
                  type="text"
                  value={settings["ambulance_phone"] || ""}
                  onChange={(e) => setSettings({ ...settings, ambulance_phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">OPD Appointment Desk</label>
                <input
                  type="text"
                  value={settings["appointment_phone"] || ""}
                  onChange={(e) => setSettings({ ...settings, appointment_phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <Clock className="w-4 h-4 text-teal-600 mr-2" />
              Operating Hours Display
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Working Hours Summary</label>
              <input
                type="text"
                value={settings["working_hours"] || ""}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl uppercase tracking-wider transition shadow-md"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving Changes..." : "Save Hospital Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

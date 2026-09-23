"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        // Route to respective portal
        switch (data.user.role) {
          case "ADMIN":
            router.push("/admin/dashboard");
            break;
          case "DOCTOR":
            router.push("/doctor/dashboard");
            break;
          case "RECEPTIONIST":
            router.push("/reception/dashboard");
            break;
          case "PATIENT":
          default:
            router.push("/patient/dashboard");
            break;
        }
        router.refresh();
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT") => {
    switch (role) {
      case "ADMIN":
        setEmail("admin@aimshospital.com");
        setPassword("Admin@1234");
        break;
      case "DOCTOR":
        setEmail("dr.ramesh@aimshospital.com");
        setPassword("Doctor@1234");
        break;
      case "RECEPTIONIST":
        setEmail("reception@aimshospital.com");
        setPassword("Reception@1234");
        break;
      case "PATIENT":
        setEmail("patient@aimshospital.com");
        setPassword("Patient@1234");
        break;
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-white">
      {/* Left Column: Visual & Trust (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80"
            alt="Medical Team Hospital Guntur"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>

        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-white">AIMS PRIME</h3>
            <p className="text-xs uppercase font-semibold text-sky-400 tracking-wider">
              Hospital Management Portal
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md">
            NABH Accredited &bull; 24/7 Tertiary Care
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Integrated Healthcare Portal for Patients, Physicians & Hospital Staff.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Secure, encrypted access to appointment schedules, electronic clinical summaries, waiting queues, and administrative operations in Guntur.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL Secure Authentication &bull; Audit Log Protected</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Portal Access
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your role or enter your registered email and password.
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Buttons */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              One-Click Demo Roles (For Testing):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("ADMIN")}
                className="text-left p-2 rounded-xl border border-slate-200 bg-white hover:border-sky-500 text-xs font-semibold transition"
              >
                <span className="text-sky-700 font-bold block">Admin Portal</span>
                <span className="text-[10px] text-slate-400 truncate block">admin@aimshospital.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("DOCTOR")}
                className="text-left p-2 rounded-xl border border-slate-200 bg-white hover:border-teal-500 text-xs font-semibold transition"
              >
                <span className="text-teal-700 font-bold block">Doctor Portal</span>
                <span className="text-[10px] text-slate-400 truncate block">dr.ramesh@aimshospital.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("RECEPTIONIST")}
                className="text-left p-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 text-xs font-semibold transition"
              >
                <span className="text-indigo-700 font-bold block">Reception Desk</span>
                <span className="text-[10px] text-slate-400 truncate block">reception@aimshospital.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("PATIENT")}
                className="text-left p-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 text-xs font-semibold transition"
              >
                <span className="text-emerald-700 font-bold block">Patient Portal</span>
                <span className="text-[10px] text-slate-400 truncate block">patient@aimshospital.com</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@aimshospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>{loading ? "Signing in..." : "Sign In to Portal"}</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Don&apos;t have a patient account?{" "}
            <Link href="/register" className="text-sky-600 font-bold hover:underline">
              Register as New Patient
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

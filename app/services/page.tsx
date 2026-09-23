"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, ShieldCheck, PhoneCall, ChevronRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success) {
          setServices(data.services);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-sky-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Hospital Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Hospital Services & Diagnostic Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            From 24/7 emergency resuscitation to digital flat-panel cath lab and high-speed CT/MRI diagnostics in Guntur.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs">
            Loading services...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="h-48 relative rounded-2xl overflow-hidden bg-slate-200 mb-4">
                    {srv.image && (
                      <Image
                        src={srv.image}
                        alt={srv.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      {srv.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{srv.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.description}</p>

                  {srv.facilities && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                      <p className="font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                        Key Capabilities:
                      </p>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{srv.facilities}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href="/#appointment"
                    className="block text-center w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 font-bold text-xs uppercase tracking-wider transition"
                  >
                    Inquire or Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

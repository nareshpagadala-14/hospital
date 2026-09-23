"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

export default function HealthPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await fetch("/api/packages");
        const data = await res.json();
        if (data.success) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-sky-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Health Packages</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Preventive Master Health Checkup Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Proactive health evaluations designed by clinical specialists to detect cardiovascular, metabolic, and oncological risks early.
          </p>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs">
            Loading packages...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                        Recommended
                      </span>
                    )}

                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{pkg.description}</p>

                    <div className="pt-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-slate-900">
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
                      <ul className="space-y-2 text-xs text-slate-600">
                        {tests.map((t, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/#appointment"
                      className="block text-center w-full py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
                    >
                      Book This Package
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

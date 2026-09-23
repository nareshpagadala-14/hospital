"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ArrowRight, Stethoscope, ChevronRight } from "lucide-react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (data.success) {
          setDepartments(data.departments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDepts();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-sky-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Departments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clinical Departments & Centers of Excellence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            AIMS Prime Hospital houses specialized clinical departments equipped with cutting-edge surgical suites, ICUs, and diagnostic technology.
          </p>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs">
            Loading departments...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div
                key={dept.id}
                id={dept.slug}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 relative overflow-hidden bg-slate-200">
                    {dept.image ? (
                      <Image
                        src={dept.image}
                        alt={dept.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg">
                      {dept.doctors?.length || dept._count?.doctors || "0"} Specialists
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-lg">{dept.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center space-x-3">
                  <Link
                    href={`/doctors?departmentSlug=${dept.slug}`}
                    className="flex-1 text-center py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    View Doctors
                  </Link>
                  <Link
                    href={`/#appointment`}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
                  >
                    Book Slot
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

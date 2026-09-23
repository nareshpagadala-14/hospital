"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Stethoscope, Award, Calendar, ArrowRight, Filter, ChevronRight } from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedExp, setSelectedExp] = useState("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        const [docRes, deptRes] = await Promise.all([
          fetch("/api/doctors"),
          fetch("/api/departments"),
        ]);
        const docData = await docRes.json();
        const deptData = await deptRes.json();
        if (docData.success) setDoctors(docData.doctors);
        if (deptData.success) setDepartments(deptData.departments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDept === "ALL" ||
      doc.departmentId === selectedDept ||
      doc.department?.slug === selectedDept;

    const matchesExp =
      selectedExp === "ALL" ||
      (selectedExp === "15+" && doc.experienceYears >= 15) ||
      (selectedExp === "10+" && doc.experienceYears >= 10);

    return matchesSearch && matchesDept && matchesExp;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-sky-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Doctor Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialist Doctors Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Meet our esteemed panel of clinical professors, surgeons, and specialists serving Guntur and the Amaravati capital region.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by doctor name, specialization, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Department Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Experience Levels</option>
                <option value="15+">15+ Years Clinical Experience</option>
                <option value="10+">10+ Years Clinical Experience</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong>{filteredDoctors.length}</strong> verified doctors
            </span>
            {(searchTerm || selectedDept !== "ALL" || selectedExp !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDept("ALL");
                  setSelectedExp("ALL");
                }}
                className="text-sky-600 hover:underline font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs">
            Loading specialist directory...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No doctors match your search</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your department filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                      <h3 className="font-bold text-slate-900 text-base truncate">
                        {doc.user?.name}
                      </h3>
                      <p className="text-xs font-semibold text-sky-700 truncate">
                        {doc.specialization}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                    {doc.biography}
                  </p>

                  <div className="flex items-center justify-between mt-4 py-2 border-y border-slate-100 text-xs">
                    <span className="text-slate-500">
                      <strong>{doc.experienceYears}</strong> Years Experience
                    </span>
                    <span className="font-extrabold text-emerald-700">
                      ₹{doc.consultationFee} Consultation
                    </span>
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
                    href={`/doctors/${doc.id}#book`}
                    className="flex-1 text-center py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
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

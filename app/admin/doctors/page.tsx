"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Plus,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";

export default function AdminDoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Doctor@1234",
    departmentId: "",
    qualification: "",
    specialization: "",
    experienceYears: 10,
    registrationNumber: "APMC-" + Math.floor(10000 + Math.random() * 90000),
    consultationFee: 500,
    languages: "Telugu, English",
    biography: "",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
  });

  const loadData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        fetch("/api/doctors?status=ALL"),
        fetch("/api/departments"),
      ]);
      const docData = await docRes.json();
      const deptData = await deptRes.json();

      if (docData.success) setDoctors(docData.doctors || []);
      if (deptData.success) {
        setDepartments(deptData.departments || []);
        if (deptData.departments.length > 0 && !formData.departmentId) {
          setFormData((prev) => ({ ...prev, departmentId: deptData.departments[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "Doctor@1234",
          departmentId: departments[0]?.id || "",
          qualification: "",
          specialization: "",
          experienceYears: 10,
          registrationNumber: "APMC-" + Math.floor(10000 + Math.random() * 90000),
          consultationFee: 500,
          languages: "Telugu, English",
          biography: "",
          photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
        });
        loadData();
      } else {
        setErrorMessage(data.message || "Failed to create doctor profile.");
      }
    } catch (err: any) {
      setErrorMessage("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.user?.name.toLowerCase().includes(term) ||
      doc.specialization.toLowerCase().includes(term) ||
      doc.department?.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hospital Doctors Directory Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new specialist consultants, manage OPD schedules, and configure consultation fees.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Specialist</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search doctor by name, qualification, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Hospital Medical Faculty</h3>
            <span className="text-xs text-slate-500">
              Showing <strong>{filtered.length}</strong> doctors
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
              <p>Loading medical faculty...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Doctor</th>
                    <th className="pb-3 font-bold">Department</th>
                    <th className="pb-3 font-bold">Experience & Reg</th>
                    <th className="pb-3 font-bold">Fee</th>
                    <th className="pb-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 relative flex-shrink-0">
                            {doc.photo ? (
                              <Image
                                src={doc.photo}
                                alt={doc.user?.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Stethoscope className="w-5 h-5 text-slate-400 m-auto mt-2.5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{doc.user?.name}</p>
                            <p className="text-[11px] text-slate-400">{doc.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-slate-800">{doc.department?.name}</span>
                        <p className="text-[11px] text-sky-700">{doc.specialization}</p>
                      </td>
                      <td className="py-4 text-slate-600">
                        {doc.experienceYears} Years &bull;{" "}
                        <span className="text-[11px] text-slate-400">{doc.registrationNumber || "APMC"}</span>
                      </td>
                      <td className="py-4 font-extrabold text-emerald-700">₹{doc.consultationFee}</td>
                      <td className="py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg">Add New Specialist Doctor</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Haritha Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="dr.haritha@aimshospital.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Specialization Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Pediatric Surgeon"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Qualifications *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MBBS, MS, MCh"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Biography & Experience Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Short summary of medical training, surgeries performed, and clinical achievements..."
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unsplash Profile Photo URL</label>
                  <input
                    type="url"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                  >
                    {submitting ? "Adding Doctor..." : "Save Doctor & Generate Slots"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

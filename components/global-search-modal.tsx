"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, User, Building2, Activity, Package, FileText, ArrowRight, Loader2 } from "lucide-react";

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    doctors: any[];
    departments: any[];
    services: any[];
    packages: any[];
    articles: any[];
  }>({
    doctors: [],
    departments: [],
    services: [],
    packages: [],
    articles: [],
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ doctors: [], departments: [], services: [], packages: [], articles: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.doctors.length +
    results.departments.length +
    results.services.length +
    results.packages.length +
    results.articles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-sky-600 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search doctors, departments, treatments, health packages, articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-sky-600 animate-spin ml-2" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="ml-3 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {query.length >= 2 && totalResults === 0 && !loading && (
            <div className="text-center py-10 text-slate-500">
              <p className="text-base font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-slate-400 mt-1">Try searching for &quot;Cardiology&quot;, &quot;Dr. Ramesh&quot;, or &quot;Health Checkup&quot;</p>
            </div>
          )}

          {query.length < 2 && (
            <div className="py-6 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Popular Searches in Guntur
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cardiology", "Robotic Knee Replacement", "Dr. Ramesh Chandra", "Executive Checkup", "Emergency Trauma"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Doctors */}
          {results.doctors.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-sky-700 mb-2">
                <User className="w-3.5 h-3.5 mr-1.5" /> Doctors ({results.doctors.length})
              </div>
              <div className="space-y-1">
                {results.doctors.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/doctors/${doc.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 transition group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700">
                        {doc.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doc.specialization} &bull; {doc.department?.name}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {results.departments.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
                <Building2 className="w-3.5 h-3.5 mr-1.5" /> Departments ({results.departments.length})
              </div>
              <div className="space-y-1">
                {results.departments.map((dept) => (
                  <Link
                    key={dept.id}
                    href={`/departments#${dept.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50 transition group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                        {dept.name}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">{dept.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Health Packages */}
          {results.packages.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
                <Package className="w-3.5 h-3.5 mr-1.5" /> Health Packages ({results.packages.length})
              </div>
              <div className="space-y-1">
                {results.packages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href="/health-packages"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 transition group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                        {pkg.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        ₹{pkg.discountedPrice} (Original ₹{pkg.originalPrice})
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Health Articles */}
          {results.articles.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-2">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Health Articles ({results.articles.length})
              </div>
              <div className="space-y-1">
                {results.articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 transition group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                        {art.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

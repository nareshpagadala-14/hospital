"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, ArrowRight, ChevronRight, Clock, User } from "lucide-react";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.success) {
          setArticles(data.articles);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-sky-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Health Articles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Medical Articles & Health Education
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Evidence-based health knowledge written and curated by the specialist medical faculty at AIMS Prime Hospital Guntur.
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs">
            Loading articles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/articles/${art.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 relative overflow-hidden bg-slate-200">
                    {art.image && (
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                    <span className="absolute top-4 left-4 text-xs font-bold text-white bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-lg">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-700 transition leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5 truncate mr-2">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{art.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTimeMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

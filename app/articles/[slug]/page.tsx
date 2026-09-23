import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Clock, User, ShieldAlert, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.healthArticle.findUnique({
    where: { slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-xl space-y-8">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-b border-slate-100 pb-6 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-800">{article.authorName}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{article.readTimeMinutes} min read</span>
              </div>
              <span>&bull;</span>
              <span>Published by AIMS Prime Medical Editorial Board</span>
            </div>
          </div>

          {/* Article Image */}
          {article.image && (
            <div className="h-64 sm:h-96 relative rounded-3xl overflow-hidden bg-slate-100 shadow-md">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
            {article.content}
          </div>

          {/* Clinical Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-start space-x-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Medical & Clinical Disclaimer</p>
              <p className="mt-1 text-amber-800 leading-relaxed">
                Health information provided on this website is for general educational purposes and is not a substitute for professional clinical advice, diagnosis, or personalized treatment. Always seek the advice of your physician or qualified health provider with any medical questions.
              </p>
            </div>
          </div>

          {/* Consultation CTA */}
          <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base">Have concerns or symptoms?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Consult directly with our specialist doctors at AIMS Prime Hospital Guntur.
              </p>
            </div>
            <Link
              href="/#appointment"
              className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex-shrink-0 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

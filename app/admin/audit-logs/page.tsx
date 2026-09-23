"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, Loader2, ShieldCheck, User } from "lucide-react";

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();
        if (!authData.authenticated || authData.user.role !== "ADMIN") {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/admin/audit-logs");
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [router]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Security & Clinical Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident chronological trail of user logins, doctor additions, slot reservations, and cancellations.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recorded Security Events</h3>
            <span className="text-xs text-slate-500">
              Showing last <strong>{logs.length}</strong> events
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
              <p>Loading audit trail...</p>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">No audit logs recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-bold">Timestamp</th>
                    <th className="pb-3 font-bold">User / Initiator</th>
                    <th className="pb-3 font-bold">Action Type</th>
                    <th className="pb-3 font-bold">Entity</th>
                    <th className="pb-3 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3">
                        {log.user ? (
                          <div>
                            <p className="font-semibold text-slate-800">{log.user.name}</p>
                            <p className="text-[10px] text-slate-400">{log.user.role}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">System / Anonymous</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-slate-700">{log.entity}</td>
                      <td className="py-3 text-slate-600 max-w-md truncate">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

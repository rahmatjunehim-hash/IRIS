"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareShare, Send, CheckCircle2, RefreshCw, Phone, Clock, AlertCircle } from "lucide-react";
import { NotificationItem } from "@/lib/data-store";

export default function CSClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleResend(id: string) {
    setResendingId(id);
    setFeedback(null);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("Pesan WhatsApp berhasil dikirim ulang ke pelanggan.");
        await loadNotifications();
      } else {
        setFeedback("Gagal mengirim pesan: " + (data.error || "Terjadi kesalahan"));
      }
    } finally {
      setResendingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header (Apple Glass Style) */}
      <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/60 shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-semibold mb-2.5 border border-emerald-500/20">
            <MessageSquareShare className="w-3.5 h-3.5 text-emerald-700" />
            <span>Customer Service — Gateway WhatsApp Fonnte</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Monitoring & Trigger Notifikasi Pengambilan Kacamata
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            Format pesan resmi: <em className="text-slate-700">&quot;Halo ka &#123;nama&#125;, orderan kaka sudah bisa diambil, I See You&quot;</em>. CS dapat memantau status delivery gateway dan memicu pengiriman ulang secara manual jika diperlukan.
          </p>
        </div>

        <button
          onClick={loadNotifications}
          className="apple-press inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-apple-subtle transition cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Segarkan Log</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 shadow-apple-subtle animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}

      {/* Notifications Table */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/60 shadow-apple-card overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold tracking-tight text-slate-900 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Riwayat Pengiriman Pesan WhatsApp</span>
            <span className="font-mono tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {notifications.length}
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">Memuat riwayat gateway...</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            Belum ada notifikasi yang dipicu. Begitu teknisi faset menandai order &quot;Selesai&quot;, log pengiriman akan muncul di sini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="pb-3 px-3">Waktu</th>
                  <th className="pb-3 px-3">Nama Pelanggan</th>
                  <th className="pb-3 px-3">Nomor WhatsApp</th>
                  <th className="pb-3 px-3">Isi Pesan</th>
                  <th className="pb-3 px-3">Status Gateway</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {n.sentAt ? new Date(n.sentAt).toLocaleTimeString("id-ID") : "Baru saja"}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {n.customerNama}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {n.noWa}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate font-normal">
                      &quot;{n.pesan}&quot;
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          n.status === "SENT"
                            ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
                            : n.status === "FAILED"
                            ? "bg-rose-500/10 text-rose-800 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-800 border border-amber-500/20"
                        }`}
                      >
                        {n.status === "SENT" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terkirim
                          </>
                        ) : n.status === "FAILED" ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Gagal
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        disabled={resendingId === n.id}
                        onClick={() => handleResend(n.id)}
                        className="apple-press py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-[11px] inline-flex items-center gap-1.5 shadow-apple-subtle transition cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3 h-3 text-emerald-200" />
                        <span>{resendingId === n.id ? "Mengirim..." : "Kirim Ulang"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

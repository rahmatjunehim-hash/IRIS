"use client";

import React, { useState, useEffect } from "react";
import { Wrench, CheckCircle2, AlertCircle, Clock, Send, Loader2, Sparkles, Filter } from "lucide-react";
import { OrderItem } from "@/lib/data-store";

export default function FasetClient() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PROSES" | "SELESAI">("ALL");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleUpdateStatus(orderId: string, nextStatus: "PROSES" | "SELESAI") {
    setUpdatingId(orderId);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/faset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusFaset: nextStatus,
          catatanTeknisi:
            nextStatus === "SELESAI"
              ? "Pemasangan lensa ke frame selesai dengan presisi."
              : "Sedang proses pemotongan dan beveling lensa.",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || `Status pesanan berhasil diperbarui ke ${nextStatus}`,
        });
        await loadOrders();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal memperbarui status faset",
        });
      }
    } finally {
      setUpdatingId(null);
    }
  }

  // Filter orders related to Faset
  const fasetOrders = orders.filter((o) => o.orderFaset || o.status === "DALAM_FASET" || o.status === "SIAP_DIAMBIL");

  const pendingOrders = fasetOrders.filter(
    (o) => o.orderFaset?.statusFaset === "PENDING"
  );
  const prosesOrders = fasetOrders.filter(
    (o) => o.orderFaset?.statusFaset === "PROSES"
  );
  const selesaiOrders = fasetOrders.filter(
    (o) => o.orderFaset?.statusFaset === "SELESAI" || o.status === "SIAP_DIAMBIL" || o.status === "SELESAI"
  );

  const displayedOrders =
    activeTab === "PENDING"
      ? pendingOrders
      : activeTab === "PROSES"
      ? prosesOrders
      : activeTab === "SELESAI"
      ? selesaiOrders
      : fasetOrders;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner (Apple Glass Style) */}
      <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/60 shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-semibold mb-2.5 border border-emerald-500/20">
            <Wrench className="w-3.5 h-3.5 text-emerald-700" />
            <span>Laboratorium Faset & Perakitan Lensa (Lantai 2 Pusat)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Pengerjaan Pemotongan & Pemasangan Lensa
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            Pesanan dari 4 cabang diproses terpusat. Begitu status diselesaikan teknisi, sistem otomatis mentrigger <strong className="font-semibold text-slate-700">Notifikasi WhatsApp (Fonnte)</strong> ke nomor pelanggan.
          </p>
        </div>

        {/* Apple Segmented Control */}
        <div className="apple-segmented-container p-1 rounded-2xl flex items-center shrink-0">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`apple-press px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-white text-slate-900 font-semibold shadow-apple-subtle"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Semua <span className="font-mono tabular-nums opacity-75">({fasetOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`apple-press px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-white text-amber-900 font-semibold shadow-apple-subtle"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Pending <span className="font-mono tabular-nums opacity-75">({pendingOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("PROSES")}
            className={`apple-press px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              activeTab === "PROSES"
                ? "bg-white text-emerald-900 font-semibold shadow-apple-subtle"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Proses <span className="font-mono tabular-nums opacity-75">({prosesOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("SELESAI")}
            className={`apple-press px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
              activeTab === "SELESAI"
                ? "bg-white text-slate-900 font-semibold shadow-apple-subtle"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Selesai <span className="font-mono tabular-nums opacity-75">({selesaiOrders.length})</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 backdrop-blur-md shadow-apple-subtle animate-fadeIn ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-900"
              : "bg-rose-500/10 border-rose-500/20 text-rose-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Orders Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-mono">Memuat antrian faset...</div>
      ) : displayedOrders.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/60 shadow-apple-card flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
            <Wrench className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">
            Tidak Ada Pesanan di Kategori Ini
          </h4>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Pesanan yang diteruskan oleh kasir cabang akan otomatis mengalir ke dashboard teknisi faset ini secara realtime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedOrders.map((order) => {
            const statusFaset = order.orderFaset?.statusFaset || "PROSES";
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-apple-card hover:shadow-apple-float transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
                        #{String(order.noAntrian).padStart(3, "0")}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {order.cabangNama}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        statusFaset === "PENDING"
                          ? "bg-amber-500/10 text-amber-800 border border-amber-500/20"
                          : statusFaset === "PROSES"
                          ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-700 border border-slate-500/20"
                      }`}
                    >
                      {statusFaset === "PENDING"
                        ? "Menunggu Stok"
                        : statusFaset === "PROSES"
                        ? "Sedang Faset"
                        : "Selesai Siap Ambil"}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <h3 className="font-bold tracking-tight text-slate-900 text-base">
                    {order.customer.nama}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 font-mono tabular-nums">
                    WA: {order.customer.noWa}
                  </p>

                  {/* Frame & Lensa Details */}
                  <div className="bg-black/[0.02] p-4 rounded-2xl border border-slate-200/60 text-xs space-y-2.5 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Frame:</span>
                      <strong className="text-slate-800 font-medium text-xs">
                        {order.frameModel || "Frame Pilihan Customer"} {order.frameColor ? `(${order.frameColor})` : ""}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Jenis Lensa:</span>
                      <strong className="text-emerald-800 font-semibold text-xs">
                        {order.jenisLensa || "Standar Single Vision"}
                      </strong>
                    </div>

                    {/* Eye Exam Specs */}
                    <div className="pt-2.5 border-t border-slate-200/80 font-mono tabular-nums text-[11px] text-slate-700 space-y-1">
                      <div className="flex justify-between items-center">
                        <span><strong className="text-slate-900">R:</strong> SPH {order.eyeExam?.sphR || "0"} CYL {order.eyeExam?.cylR || "0"} AXIS {order.eyeExam?.axisR || "0"}°</span>
                        <span className="text-slate-400">PD {order.eyeExam?.pdR || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span><strong className="text-slate-900">L:</strong> SPH {order.eyeExam?.sphL || "0"} CYL {order.eyeExam?.cylL || "0"} AXIS {order.eyeExam?.axisL || "0"}°</span>
                        <span className="text-slate-400">PD {order.eyeExam?.pdL || "-"}</span>
                      </div>
                    </div>

                    {order.catatanFrame && (
                      <p className="text-[11px] text-amber-800 italic pt-1 border-t border-slate-200/50">
                        Catatan: &quot;{order.catatanFrame}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions based on current status */}
                <div className="pt-3 border-t border-slate-100">
                  {statusFaset === "PENDING" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.id, "PROSES")}
                      className="apple-press w-full py-2.5 px-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-apple-subtle transition disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Wrench className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Lensa Ready &rarr; Mulai Proses Faset</span>
                        </>
                      )}
                    </button>
                  )}

                  {statusFaset === "PROSES" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.id, "SELESAI")}
                      className="apple-press w-full py-2.5 px-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-apple-subtle transition disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Selesai & Kirim Notifikasi WA</span>
                        </>
                      )}
                    </button>
                  )}

                  {statusFaset === "SELESAI" && (
                    <div className="text-center py-2.5 px-3 text-xs font-medium text-emerald-800 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Kacamata Selesai & WA Terkirim</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

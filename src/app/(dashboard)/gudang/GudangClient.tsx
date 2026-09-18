"use client";

import React, { useState, useEffect } from "react";
import { Warehouse, AlertTriangle, CheckCircle2, PackageCheck, Filter, ArrowRight, Loader2 } from "lucide-react";
import { LensStockItem, OrderItem } from "@/lib/data-store";

const CABANG_TABS = [
  { label: "Semua Cabang", value: "" },
  { label: "Purwokerto", value: "PWT" },
  { label: "Cilacap", value: "CLP" },
  { label: "Wonosobo", value: "WSB" },
  { label: "Purbalingga", value: "PBG" },
];

export default function GudangClient() {
  const [stockList, setStockList] = useState<LensStockItem[]>([]);
  const [pendingOrders, setPendingOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCabang, setSelectedCabang] = useState("");
  const [orderingId, setOrderingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadData() {
    try {
      const res = await fetch(`/api/stock?cabang=${selectedCabang}`);
      if (!res.ok) return;
      const data = await res.json();
      setStockList(data.stock || []);
      setPendingOrders(data.pendingOrders || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [selectedCabang]);

  async function handleMarkAsOrdered(stockId: string) {
    setOrderingId(stockId);
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockId }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("Pengadaan lensa berhasil ditandai 'Sudah Diorder' ke supplier.");
        await loadData();
      }
    } finally {
      setOrderingId(null);
    }
  }

  const filteredPending = pendingOrders.filter(
    (o) => !selectedCabang || o.cabangKode.toLowerCase() === selectedCabang.toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner (Apple Glass Style) */}
      <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/60 shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-semibold mb-2.5 border border-emerald-500/20">
            <Warehouse className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pengelolaan Gudang Lensa & Pengadaan Stok</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Stok Lensa Per Cabang & Antrian Pesanan Pending
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            Aturan Bisnis: <strong className="font-semibold text-slate-700">Stok lensa dikelola independen per cabang</strong>. Bagian gudang hanya memproses pesanan dengan status <strong className="font-semibold text-slate-700">Pending</strong> yang membutuhkan pengadaan stok lensa.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-mono tabular-nums font-semibold">{pendingOrders.length}</span> Pesanan Butuh Lensa
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 shadow-apple-subtle animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}

      {/* Apple Segmented Cabang Tabs */}
      <div className="apple-segmented-container p-1 rounded-2xl flex items-center gap-1 overflow-x-auto">
        {CABANG_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCabang(tab.value)}
            className={`apple-press px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedCabang === tab.value
                ? "bg-white text-slate-900 font-semibold shadow-apple-subtle"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: Daftar Pesanan Pending (Menunggu Lensa) */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-amber-500/20 shadow-apple-card">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold tracking-tight text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Pesanan Masuk Berstatus PENDING</span>
              <span className="font-mono tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 font-semibold">
                {filteredPending.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Pesanan ditahan oleh Kasir karena lensa belum ready di cabang bersangkutan.
            </p>
          </div>
        </div>

        {filteredPending.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Tidak ada pesanan berstatus pending di cabang ini. Semua lensa siap diproses!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPending.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 text-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                    <span className="font-mono tabular-nums font-semibold text-amber-950 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                      #{String(order.noAntrian).padStart(3, "0")}
                    </span>
                    <span className="text-[11px] font-medium text-amber-900">
                      {order.cabangNama}
                    </span>
                  </div>
                  <h4 className="font-bold tracking-tight text-slate-900 text-sm mt-3">
                    {order.customer.nama}
                  </h4>
                  <p className="text-slate-500 text-[11px] font-mono tabular-nums">WA: {order.customer.noWa}</p>

                  <div className="mt-3 p-3 rounded-xl bg-white/80 border border-amber-500/20 space-y-1.5 shadow-apple-subtle">
                    <p className="text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lensa Dibutuhkan:</span>
                      <strong className="text-amber-950 font-semibold">{order.jenisLensa || "Standar"}</strong>
                    </p>
                    <p className="font-mono tabular-nums text-[11px] text-slate-700 pt-1 border-t border-slate-100">
                      R: {order.eyeExam?.sphR || "0"} / {order.eyeExam?.cylR || "0"} | L: {order.eyeExam?.sphL || "0"} / {order.eyeExam?.cylL || "0"}
                    </p>
                    {order.orderFaset?.catatanTeknisi && (
                      <p className="text-[11px] text-amber-800 italic pt-1 border-t border-slate-100">
                        Catatan: &quot;{order.orderFaset.catatanTeknisi}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-amber-900/80 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Menunggu pengadaan stok cabang</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Master Stok Lensa Per Cabang */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/60 shadow-apple-card overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold tracking-tight text-slate-900 text-base flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-700" />
              <span>Katalog Stok Lensa Cabang</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Stok dipisah per cabang. Stok yang di bawah batas minimum otomatis ditandai untuk re-order.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">Memuat database stok...</div>
        ) : stockList.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            Belum ada data stok lensa di cabang ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="pb-3 px-3">Cabang</th>
                  <th className="pb-3 px-3">Jenis Lensa</th>
                  <th className="pb-3 px-3">Rentang Ukuran</th>
                  <th className="pb-3 px-3">Jumlah Stok</th>
                  <th className="pb-3 px-3">Batas Min</th>
                  <th className="pb-3 px-3">Status Pengadaan</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockList.map((item) => {
                  const isLow = item.stockQty <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono tabular-nums font-semibold text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                          {item.cabangNama}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        {item.jenisLensa}
                      </td>
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-600 text-[11px]">
                        SPH: {item.sph || "Semua"} | CYL: {item.cyl || "0"}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-semibold font-mono tabular-nums text-xs px-2.5 py-1 rounded-full border ${
                            isLow
                              ? "bg-rose-500/10 text-rose-800 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          }`}
                        >
                          {item.stockQty} Pcs
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono tabular-nums">
                        {item.minStock} Pcs
                      </td>
                      <td className="py-3.5 px-3">
                        {item.isOrdered ? (
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Sudah Diajukan Order
                          </span>
                        ) : isLow ? (
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-800 border border-rose-500/20">
                            Stok Kritis
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                            Aman (Tersedia)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {!item.isOrdered ? (
                          <button
                            type="button"
                            disabled={orderingId === item.id}
                            onClick={() => handleMarkAsOrdered(item.id)}
                            className="apple-press py-1.5 px-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs inline-flex items-center gap-1.5 shadow-apple-subtle transition cursor-pointer disabled:opacity-50"
                          >
                            {orderingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <PackageCheck className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Tandai Sudah Diorder</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Menunggu Pengiriman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

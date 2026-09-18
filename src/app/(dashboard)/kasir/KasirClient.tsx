"use client";

import React, { useState, useEffect, useRef } from "react";
import { ReceiptText, CheckCircle2, Clock, Glasses, ArrowRight, AlertTriangle, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { OrderItem } from "@/lib/data-store";

interface KasirClientProps {
  initialCabang: string;
}

export default function KasirClient({ initialCabang }: KasirClientProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const selectedOrderIdRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form kasir
  const [jenisLensa, setJenisLensa] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [catatanFrame, setCatatanFrame] = useState("");
  const [catatanKasir, setCatatanKasir] = useState("");
  const [noPosStruk, setNoPosStruk] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function selectOrder(order: OrderItem | null) {
    setSelectedOrder(order);
    selectedOrderIdRef.current = order ? order.id : null;
    if (order) {
      setJenisLensa(order.jenisLensa || "Single Vision CRMC (Standar)");
      setFrameModel(order.frameModel || "");
      setFrameColor(order.frameColor || "");
      setCatatanFrame(order.catatanFrame || "");
      setCatatanKasir(order.catatanKasir || "");
      setNoPosStruk(order.noPosStruk || "");
    }
  }

  async function loadOrders() {
    try {
      const res = await fetch(`/api/orders?cabang=${initialCabang}`);
      if (!res.ok) return;
      const data = await res.json();
      const currentOrders: OrderItem[] = data.orders || [];
      setOrders(currentOrders);

      const activeId = selectedOrderIdRef.current;
      if (activeId) {
        const stillInKasir = currentOrders.find(
          (o: OrderItem) => o.id === activeId && o.status === "MENUNGGU_TRANSAKSI"
        );
        if (stillInKasir) {
          setSelectedOrder(stillInKasir);
        } else {
          setSelectedOrder(null);
          selectedOrderIdRef.current = null;
        }
      } else {
        const firstKasirOrder = currentOrders.find(
          (o: OrderItem) => o.status === "MENUNGGU_TRANSAKSI"
        );
        if (firstKasirOrder) {
          selectOrder(firstKasirOrder);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 4000);
    return () => clearInterval(interval);
  }, [initialCabang]);

  async function handleForwardToFaset(statusFaset: "PENDING" | "PROSES") {
    if (!selectedOrder) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/kasir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jenisLensa, // Nilai dinamis yang dapat diubah oleh kasir
          frameModel,
          frameColor,
          catatanFrame,
          catatanKasir,
          noPosStruk,
          statusFaset, // Set manual oleh kasir
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Pesanan pelanggan ${selectedOrder.customer.nama} berhasil diteruskan ke Faset dengan status ${statusFaset}. Lensa: ${jenisLensa || selectedOrder.jenisLensa}`
        );
        selectedOrderIdRef.current = null;
        setSelectedOrder(null);
        await loadOrders();
      } else {
        setMessage(data.error || "Gagal meneruskan ke faset");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const waitingKasirOrders = orders.filter((o) => o.status === "MENUNGGU_TRANSAKSI");
  const alreadyInFasetOrders = orders.filter((o) => o.status === "DALAM_FASET");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner (Apple Glass) */}
      <div className="apple-glass p-6 rounded-3xl border border-black/[0.06] shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-500/20 shadow-apple-subtle">
            <ReceiptText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Dashboard Kasir — Cabang {initialCabang}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Konfirmasi Pesanan & Penerusan ke Faset
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Kasir memverifikasi detail frame fisik dan menentukan status faset secara <strong>manual</strong>: <span className="font-semibold text-amber-700">PENDING</span> (menunggu stok) atau <span className="font-semibold text-emerald-700">PROSES</span> (siap dikerjakan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-medium flex items-center gap-1.5 shadow-apple-subtle">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Bebas Harga (Pembayaran di POS Luar)</span>
          </span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs font-medium flex items-center gap-2 shadow-apple-subtle">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List Pesanan Masuk dari Cek Mata */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-glass rounded-3xl p-5 border border-black/[0.06] shadow-apple-card">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 tracking-tight">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Siap Transaksi (Dari Cek Mata)</span>
              </h3>
              <span className="text-xs font-mono tabular-nums font-bold bg-teal-500/10 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                {waitingKasirOrders.length} Pesanan
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 font-mono">Memuat pesanan...</div>
            ) : waitingKasirOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada pesanan baru dari cek mata.
              </div>
            ) : (
              <div className="space-y-2.5">
                {waitingKasirOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <div
                      key={order.id}
                      onClick={() => selectOrder(order)}
                      className={`p-4 rounded-2xl border transition-all duration-150 active:scale-[0.98] cursor-pointer flex flex-col gap-2 shadow-apple-subtle ${
                        isSelected
                          ? "bg-emerald-500/[0.08] border-emerald-700/60 shadow-apple-card"
                          : "bg-white/70 border-black/[0.06] hover:bg-white hover:border-black/[0.12]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-mono tabular-nums font-black text-emerald-900">
                            #{String(order.noAntrian).padStart(3, "0")}
                          </span>
                          <span className="font-semibold text-slate-800 text-sm tracking-tight">
                            {order.customer.nama}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-teal-500/10 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                          Resep Lengkap
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 bg-black/[0.02] p-2.5 rounded-xl border border-black/[0.04] space-y-1">
                        <p><strong>Lensa:</strong> {order.jenisLensa}</p>
                        <p className="font-mono text-[11px] text-emerald-800">
                          R: SPH {order.eyeExam?.sphR || "0"} CYL {order.eyeExam?.cylR || "0"} | L: SPH {order.eyeExam?.sphL || "0"} CYL {order.eyeExam?.cylL || "0"}
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                        <span>WA: {order.customer.noWa}</span>
                        <span className="font-sans text-slate-500">{order.customer.alamat}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Pesanan yang sudah di Faset */}
          <div className="apple-glass rounded-3xl p-5 border border-black/[0.06] shadow-apple-card">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-3">
              Riwayat Dalam Faset ({alreadyInFasetOrders.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {alreadyInFasetOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-2.5 rounded-xl bg-black/[0.02] text-xs flex items-center justify-between border border-black/[0.05]"
                >
                  <div>
                    <span className="font-semibold text-slate-800 tracking-tight">
                      #{String(o.noAntrian).padStart(3, "0")} {o.customer.nama}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{o.frameModel}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      o.orderFaset?.statusFaset === "PENDING"
                        ? "bg-amber-500/10 text-amber-900 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-900 border-emerald-500/20"
                    }`}
                  >
                    {o.orderFaset?.statusFaset}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Lembar Konfirmasi Kasir */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-apple-card space-y-6">
              {/* Customer & Exam Snapshot */}
              <div className="border-b border-black/[0.06] pb-5">
                <span className="text-[11px] font-mono tabular-nums font-bold text-emerald-800 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-apple-subtle">
                  Konfirmasi Kasir No #{String(selectedOrder.noAntrian).padStart(3, "0")}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-2">
                  {selectedOrder.customer.nama}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedOrder.customer.alamat} • WhatsApp: <span className="font-mono">{selectedOrder.customer.noWa}</span>
                </p>

                {/* Resep Box */}
                <div className="mt-4 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] shadow-apple-subtle">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Glasses className="w-4 h-4 text-emerald-700" />
                    Hasil Resep Pemeriksaan Mata (OD / OS)
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-white/80 p-3 rounded-xl border border-black/[0.05] shadow-apple-subtle">
                      <span className="font-bold text-emerald-900 block font-sans text-xs">Mata Kanan (R/OD):</span>
                      <span>SPH: {selectedOrder.eyeExam?.sphR || "0.00"}</span>, <span>CYL: {selectedOrder.eyeExam?.cylR || "0.00"}</span><br />
                      <span>AXIS: {selectedOrder.eyeExam?.axisR || "0"}°</span>, <span>ADD: {selectedOrder.eyeExam?.addR || "-"}</span><br />
                      <span>PD: {selectedOrder.eyeExam?.pdR || "-"}</span>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-black/[0.05] shadow-apple-subtle">
                      <span className="font-bold text-emerald-900 block font-sans text-xs">Mata Kiri (L/OS):</span>
                      <span>SPH: {selectedOrder.eyeExam?.sphL || "0.00"}</span>, <span>CYL: {selectedOrder.eyeExam?.cylL || "0.00"}</span><br />
                      <span>AXIS: {selectedOrder.eyeExam?.axisL || "0"}°</span>, <span>ADD: {selectedOrder.eyeExam?.addL || "-"}</span><br />
                      <span>PD: {selectedOrder.eyeExam?.pdL || "-"}</span>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[11px] text-slate-600 flex justify-between font-medium">
                    <span>PD Total: <strong className="font-mono text-slate-800">{selectedOrder.eyeExam?.pdTotal || "-"} mm</strong></span>
                    <span>Lensa: <strong className="text-emerald-800">{selectedOrder.jenisLensa}</strong></span>
                  </div>
                  {selectedOrder.eyeExam?.catatan && (
                    <p className="mt-1 text-[11px] text-slate-500 italic">
                      Catatan Optometris: &quot;{selectedOrder.eyeExam.catatan}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Form Kasir Details */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Verifikasi Frame, Pilihan Lensa & Transaksi
                </h4>

                {/* Dynamic Lens Selection & Modification */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-apple-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-emerald-950">
                      Jenis Lensa Transaksi (Dapat Dirubah Kasir Sebelum ke Faset)
                    </label>
                    <span className="text-[10px] text-emerald-800 font-medium bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      Diteruskan ke Faset & Gudang
                    </span>
                  </div>
                  <input
                    type="text"
                    value={jenisLensa}
                    onChange={(e) => setJenisLensa(e.target.value)}
                    placeholder="Contoh: Stellify Blue Control, Single Vision CRMC..."
                    className="block w-full p-2.5 text-xs bg-white border border-emerald-300/80 rounded-xl focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 font-semibold text-emerald-950 transition-all shadow-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {[
                      "Single Vision CRMC (Standar)",
                      "Stellify Blue Control",
                      "Stellify Single Vision 1.55",
                      "Single Vision Photochromic",
                      "Single Vision Bluechromic",
                      "Progressive Standar",
                      "Stellify Progressive",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setJenisLensa(chip)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          jenisLensa === chip
                            ? "bg-emerald-800 text-white border-emerald-900 shadow-sm font-medium"
                            : "bg-white text-slate-700 border-black/[0.08] hover:border-emerald-700/40 hover:bg-emerald-50/40"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Model Frame Fisik
                    </label>
                    <input
                      type="text"
                      value={frameModel}
                      onChange={(e) => setFrameModel(e.target.value)}
                      placeholder="Contoh: Havana Series A-12"
                      className="block w-full p-2.5 text-xs bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Warna Frame
                    </label>
                    <input
                      type="text"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      placeholder="Contoh: Rose Gold / Matte Black"
                      className="block w-full p-2.5 text-xs bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      No. Referensi Struk POS Luar (Opsional)
                    </label>
                    <input
                      type="text"
                      value={noPosStruk}
                      onChange={(e) => setNoPosStruk(e.target.value)}
                      placeholder="Contoh: POS-PWT-202609-099"
                      className="block w-full p-2.5 text-xs bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl font-mono focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      *IRIS tidak memproses nominal pembayaran.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Catatan Khusus Frame
                    </label>
                    <input
                      type="text"
                      value={catatanFrame}
                      onChange={(e) => setCatatanFrame(e.target.value)}
                      placeholder="Contoh: Frame titipan customer, pasang rapat"
                      className="block w-full p-2.5 text-xs bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Catatan Kasir Tambahan
                  </label>
                  <input
                    type="text"
                    value={catatanKasir}
                    onChange={(e) => setCatatanKasir(e.target.value)}
                    placeholder="Contoh: Customer minta selesai sebelum hari Sabtu"
                    className="block w-full p-2.5 text-xs bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Action Buttons: Set Faset Manual Pending vs Proses */}
              <div className="pt-5 border-t border-black/[0.06] space-y-3">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Pilih Status Faset (Wajib Ditentukan Kasir):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Tombol PENDING (Kuning/Amber) */}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleForwardToFaset("PENDING")}
                    className="p-4 rounded-2xl border border-amber-400/80 bg-amber-500/[0.08] hover:bg-amber-500/[0.15] text-amber-950 text-left transition-all duration-150 active:scale-[0.98] flex flex-col justify-between cursor-pointer disabled:opacity-50 shadow-apple-subtle"
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>Kirim Faset: PENDING</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-200/80 rounded-full">
                        Menunggu Stok
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      Gunakan ini jika stok lensa belum ready di cabang. Otomatis dipantau oleh Gudang.
                    </p>
                  </button>

                  {/* Tombol PROSES (Hijau Brand) */}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleForwardToFaset("PROSES")}
                    className="p-4 rounded-2xl border border-emerald-700 bg-emerald-900 hover:bg-emerald-850 text-white text-left transition-all duration-150 active:scale-[0.98] flex flex-col justify-between cursor-pointer shadow-apple-card disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>Kirim Faset: PROSES</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-700 rounded-full text-emerald-200">
                        Siap Dikerjakan
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200 mt-1 leading-relaxed">
                      Lensa ready di cabang. Teknisi faset dapat langsung memotong dan memasang ke frame.
                    </p>
                  </button>
                </div>

                {submitting && (
                  <div className="text-center py-2 text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Meneruskan pesanan ke Faset...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="apple-glass rounded-3xl p-12 border border-black/[0.06] shadow-apple-card text-center">
              <ReceiptText className="w-12 h-12 text-emerald-700/40 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-800 text-base tracking-tight">
                Pilih Pesanan Masuk
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Pilih pesanan di sebelah kiri yang telah selesai diperiksa oleh tim cek mata untuk diverifikasi dan diteruskan ke laboratorium faset.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

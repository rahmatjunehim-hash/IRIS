"use client";

import React, { useState, useEffect, useRef } from "react";
import { Glasses, Volume2, UserCheck, CheckCircle2, Clock, FileText, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { OrderItem } from "@/lib/data-store";

interface CekMataClientProps {
  initialCabang: string;
}

export default function CekMataClient({ initialCabang }: CekMataClientProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const selectedOrderIdRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);

  // Form Resep OD (Right Eye)
  const [sphR, setSphR] = useState("-1.50");
  const [cylR, setCylR] = useState("0.00");
  const [axisR, setAxisR] = useState("0");
  const [addR, setAddR] = useState("");
  const [pdR, setPdR] = useState("31");

  // Form Resep OS (Left Eye)
  const [sphL, setSphL] = useState("-1.25");
  const [cylL, setCylL] = useState("0.00");
  const [axisL, setAxisL] = useState("0");
  const [addL, setAddL] = useState("");
  const [pdL, setPdL] = useState("31");

  const [pdTotal, setPdTotal] = useState("62");
  const [catatan, setCatatan] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function selectOrder(order: OrderItem | null) {
    setSelectedOrder(order);
    selectedOrderIdRef.current = order ? order.id : null;
    if (order && order.eyeExam) {
      setSphR(order.eyeExam.sphR || "-1.50");
      setCylR(order.eyeExam.cylR || "0.00");
      setAxisR(order.eyeExam.axisR || "0");
      setAddR(order.eyeExam.addR || "");
      setPdR(order.eyeExam.pdR || "31");

      setSphL(order.eyeExam.sphL || "-1.25");
      setCylL(order.eyeExam.cylL || "0.00");
      setAxisL(order.eyeExam.axisL || "0");
      setAddL(order.eyeExam.addL || "");
      setPdL(order.eyeExam.pdL || "31");

      setPdTotal(order.eyeExam.pdTotal || "62");
      setCatatan(order.eyeExam.catatan || "");
    }
  }

  async function loadOrders() {
    try {
      const res = await fetch(`/api/orders?cabang=${initialCabang}`);
      if (!res.ok) return;
      const data = await res.json();
      const currentOrders: OrderItem[] = data.orders || [];
      setOrders(currentOrders);

      // Lock: If an order is currently selected, keep it selected!
      const activeId = selectedOrderIdRef.current;
      if (activeId) {
        const stillInList = currentOrders.find(
          (o) => o.id === activeId && (o.status === "MENUNGGU_CEK_MATA" || o.status === "SEDANG_DIPERIKSA")
        );
        if (stillInList) {
          // Update details, do not clear or switch!
          setSelectedOrder(stillInList);
        } else {
          // Finished examination and forwarded to kasir
          setSelectedOrder(null);
          selectedOrderIdRef.current = null;
        }
      } else {
        // Auto-select first in line if none selected
        const first = currentOrders.find(
          (o) => o.status === "SEDANG_DIPERIKSA" || o.status === "MENUNGGU_CEK_MATA"
        );
        if (first) {
          selectOrder(first);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 4000); // Poll for new customer registrations
    return () => clearInterval(interval);
  }, [initialCabang]);

  // Handle Call Customer to Smart TV: Locks selection to this customer immediately
  async function handleCallCustomer(order: OrderItem) {
    selectOrder(order);
    setCallingId(order.id);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${order.id}/call`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(`📢 ${data.message || `Customer #${String(order.noAntrian).padStart(3, "0")} ${order.customer.nama} berhasil dipanggil ke Smart TV!`}`);
        await loadOrders();
      } else {
        setMessage(data.error || "Gagal memanggil ke Smart TV");
      }
    } catch (err) {
      console.error("Call queue error:", err);
      setMessage("Gagal memanggil antrian");
    } finally {
      setCallingId(null);
    }
  }

  // Handle Save Exam and Forward to Kasir (Customer only leaves Cek Mata upon this click!)
  async function handleSaveExam(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sphR,
          cylR,
          axisR,
          addR,
          pdR,
          sphL,
          cylL,
          axisL,
          addL,
          pdL,
          pdTotal,
          catatan,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Resep rekam medis kaka ${selectedOrder.customer.nama} (#${String(selectedOrder.noAntrian).padStart(3, "0")}) berhasil disimpan & diteruskan ke Kasir.`);
        // Release lock
        selectedOrderIdRef.current = null;
        setSelectedOrder(null);
        await loadOrders();
      } else {
        setMessage(data.error || "Gagal menyimpan resep");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetAllOrders() {
    if (!confirm("Reset semua antrian menjadi kosong (mulai dari #001)?")) return;
    try {
      await fetch("/api/admin/reset-orders", { method: "POST" });
      selectedOrderIdRef.current = null;
      setSelectedOrder(null);
      await loadOrders();
      setMessage("Semua data antrian telah di-reset ke nol (bersih).");
    } catch (e) {
      console.error(e);
    }
  }

  const waitingOrders = orders.filter(
    (o) => o.status === "MENUNGGU_CEK_MATA" || o.status === "SEDANG_DIPERIKSA"
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner (Apple Glass) */}
      <div className="apple-glass p-6 rounded-3xl border border-black/[0.06] shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-500/20 shadow-apple-subtle">
            <Glasses className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ruang Refraksi & Cek Mata Optik I See You</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Pemeriksaan Refraksi & Rekam Medis
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Panggil customer dari tablet ini untuk memicu suara pengeras TV ruang tunggu, lalu input resep kacamata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/display/${initialCabang.toLowerCase()}`}
            target="_blank"
            className="apple-btn-primary py-2.5 px-4 text-xs font-semibold rounded-2xl shadow-apple-subtle"
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
            <span>Layar Smart TV ({initialCabang})</span>
          </a>
          <button
            type="button"
            onClick={handleResetAllOrders}
            className="apple-btn-secondary py-2.5 px-3.5 text-xs font-medium rounded-2xl"
            title="Reset antrian kembali ke #001 untuk pengujian baru"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Antrian</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs font-medium flex items-center gap-2 shadow-apple-subtle">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid: Left = Antrian, Right = Form Rekam Medis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Antrian Pasien */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-glass rounded-3xl p-5 border border-black/[0.06] shadow-apple-card">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 tracking-tight">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Antrian Menunggu</span>
              </h3>
              <span className="text-xs font-mono tabular-nums font-bold bg-emerald-500/10 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {waitingOrders.length} Orang
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 font-mono">Memuat antrian...</div>
            ) : waitingOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Tidak ada customer dalam antrian pemeriksaan saat ini.
              </div>
            ) : (
              <div className="space-y-2.5">
                {waitingOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const isCalled = order.statusAntrian === "DIPANGGIL";

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
                        {isCalled && (
                          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                            <Volume2 className="w-3 h-3" /> Dipanggil
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center justify-between">
                        <span>Lensa: {order.jenisLensa || "-"}</span>
                        <span>{order.customer.noWa}</span>
                      </div>

                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100 mt-1">
                        <button
                          type="button"
                          disabled={callingId === order.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallCustomer(order);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{callingId === order.id ? "Memanggil..." : isCalled ? "Panggil Ulang ke TV" : "Panggil ke TV"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Formulir Resep Rekam Medis (Apple Clinical Card Style) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-apple-card space-y-6">
              {/* Header Resep */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-mono tabular-nums font-semibold tracking-wide">
                      REKAM MEDIS #{String(selectedOrder.noAntrian).padStart(3, "0")}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-2">
                      {selectedOrder.customer.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-normal">
                      {selectedOrder.customer.alamat} • WhatsApp: <span className="font-mono tabular-nums">{selectedOrder.customer.noWa}</span>
                    </p>
                  </div>
                  <div className="sm:text-right bg-black/[0.02] sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-slate-100">
                    <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                      Rencana Lensa
                    </span>
                    <span className="text-sm font-semibold text-emerald-800 tracking-tight">
                      {selectedOrder.jenisLensa || "Standar"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Rekam Medis */}
              <form onSubmit={handleSaveExam} className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    Tabel Ukuran Resep (OD - Kanan / OS - Kiri)
                  </h4>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-apple-subtle">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-medium">
                          <th className="py-2.5 px-3 border-r border-slate-800 text-[11px] font-semibold tracking-wide">Mata</th>
                          <th className="py-2.5 px-2 border-r border-slate-800 text-[11px] font-semibold tracking-wide">SPH (Minus/Plus)</th>
                          <th className="py-2.5 px-2 border-r border-slate-800 text-[11px] font-semibold tracking-wide">CYL (Silinder)</th>
                          <th className="py-2.5 px-2 border-r border-slate-800 text-[11px] font-semibold tracking-wide">AXIS (Derajat)</th>
                          <th className="py-2.5 px-2 border-r border-slate-800 text-[11px] font-semibold tracking-wide">ADD (Bifokal/Progresif)</th>
                          <th className="py-2.5 px-2 text-[11px] font-semibold tracking-wide">PD (Pupil Distance)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {/* OD - Kanan */}
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-bold font-mono text-slate-900 border-r border-slate-100 bg-slate-50/75">
                            R (OD)
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={sphR}
                              onChange={(e) => setSphR(e.target.value)}
                              placeholder="-0.00"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={cylR}
                              onChange={(e) => setCylR(e.target.value)}
                              placeholder="0.00"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={axisR}
                              onChange={(e) => setAxisR(e.target.value)}
                              placeholder="0°"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={addR}
                              onChange={(e) => setAddR(e.target.value)}
                              placeholder="+0.00"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={pdR}
                              onChange={(e) => setPdR(e.target.value)}
                              placeholder="30"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                        </tr>

                        {/* OS - Kiri */}
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-bold font-mono text-slate-900 border-r border-slate-100 bg-slate-50/75">
                            L (OS)
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={sphL}
                              onChange={(e) => setSphL(e.target.value)}
                              placeholder="-0.00"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={cylL}
                              onChange={(e) => setCylL(e.target.value)}
                              placeholder="0.00"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={axisL}
                              onChange={(e) => setAxisL(e.target.value)}
                              placeholder="0°"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5 border-r border-slate-100">
                            <input
                              type="text"
                              value={addL}
                              onChange={(e) => setAddL(e.target.value)}
                              placeholder="+0.00"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={pdL}
                              onChange={(e) => setPdL(e.target.value)}
                              placeholder="30"
                              className="w-full p-2 text-center rounded-xl bg-black/[0.02] border border-slate-200 font-mono tabular-nums text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PD Total & Catatan Pemeriksaan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      PD Total (Jarak Pupil)
                    </label>
                    <input
                      type="text"
                      value={pdTotal}
                      onChange={(e) => setPdTotal(e.target.value)}
                      placeholder="62 mm"
                      className="block w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-xl font-mono tabular-nums focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Catatan Keluhan / Rekomendasi Lensa
                    </label>
                    <input
                      type="text"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Contoh: Mata silau saat malam, disarankan lensa Bluechromic"
                      className="block w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="apple-press py-3 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-medium text-xs flex items-center gap-2 shadow-apple-subtle transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan Rekam Medis...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-300" />
                        <span>Selesai Pemeriksaan & Teruskan ke Kasir</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-12 border border-white/60 shadow-apple-card text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <Glasses className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                Pilih Customer di Antrian
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Pilih salah satu customer pada daftar antrian di sebelah kiri untuk mengisi hasil rekam medis pemeriksaan mata.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

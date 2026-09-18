"use client";

import React, { useState, useEffect } from "react";
import { HeadphonesIcon, Search, Edit3, CheckCircle2, MapPin, X, Loader2, Save } from "lucide-react";
import { OrderItem } from "@/lib/data-store";

const CABANG_FILTERS = [
  { label: "Semua Cabang", value: "" },
  { label: "Purwokerto", value: "PWT" },
  { label: "Cilacap", value: "CLP" },
  { label: "Wonosobo", value: "WSB" },
  { label: "Purbalingga", value: "PBG" },
];

export default function AfterSalesClient() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCabang, setSelectedCabang] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Edit State
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Edit fields
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [catatanFrame, setCatatanFrame] = useState("");
  const [sphR, setSphR] = useState("");
  const [cylR, setCylR] = useState("");
  const [axisR, setAxisR] = useState("");
  const [sphL, setSphL] = useState("");
  const [cylL, setCylL] = useState("");
  const [axisL, setAxisL] = useState("");
  const [catatanResep, setCatatanResep] = useState("");

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
  }, []);

  function openEditModal(order: OrderItem) {
    setEditingOrder(order);
    setNama(order.customer.nama);
    setNoWa(order.customer.noWa);
    setAlamat(order.customer.alamat);
    setFrameModel(order.frameModel || "");
    setCatatanFrame(order.catatanFrame || "");
    setSphR(order.eyeExam?.sphR || "");
    setCylR(order.eyeExam?.cylR || "");
    setAxisR(order.eyeExam?.axisR || "");
    setSphL(order.eyeExam?.sphL || "");
    setCylL(order.eyeExam?.cylL || "");
    setAxisL(order.eyeExam?.axisL || "");
    setCatatanResep(order.eyeExam?.catatan || "");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingOrder) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/orders/${editingOrder.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          noWa,
          alamat,
          frameModel,
          catatanFrame,
          sphR,
          cylR,
          axisR,
          sphL,
          cylL,
          axisL,
          catatanResep,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback("Koreksi data pelanggan & resep berhasil disimpan!");
        await loadOrders();
        setEditingOrder(null);
      } else {
        setFeedback("Gagal menyimpan koreksi data: " + (data.error || ""));
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchCabang = !selectedCabang || o.cabangKode.toLowerCase() === selectedCabang.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchSearch =
      !query ||
      o.customer.nama.toLowerCase().includes(query) ||
      o.customer.noWa.includes(query) ||
      (o.frameModel && o.frameModel.toLowerCase().includes(query));
    return matchCabang && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner (Apple Glass Style) */}
      <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/60 shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-semibold mb-2.5 border border-emerald-500/20">
            <HeadphonesIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>After Sales & Layanan Pelanggan Lintas 4 Cabang</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Pencarian Histori & Koreksi Data Pelanggan
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            Wewenang After Sales: <strong className="font-semibold text-slate-700">Melihat & Mengoreksi data</strong> (koreksi resep silinder/minus, perbarui alamat/nomor HP, penyesuaian garansi). Bukan fungsi approval alur pesanan utama.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Purwokerto • Cilacap • Wonosobo • Purbalingga</span>
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 shadow-apple-subtle animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar (Apple Style) */}
      <div className="bg-white/85 backdrop-blur-xl p-3.5 rounded-3xl border border-white/60 shadow-apple-card flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, nomor WA, atau frame..."
            className="block w-full pl-10 pr-4 py-2 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-normal transition"
          />
        </div>

        {/* Apple Segmented Filter */}
        <div className="apple-segmented-container p-1 rounded-2xl flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {CABANG_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedCabang(f.value)}
              className={`apple-press px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedCabang === f.value
                  ? "bg-white text-slate-900 font-semibold shadow-apple-subtle"
                  : "text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/60 shadow-apple-card overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold tracking-tight text-slate-900 text-base flex items-center gap-2">
            <span>Daftar Seluruh Pesanan</span>
            <span className="font-mono tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {filteredOrders.length}
            </span>
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline font-normal">
            Klik tombol Koreksi untuk mengedit data resep / frame
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">Memuat database pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            Tidak ada data pesanan yang cocok dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="pb-3 px-3">Cabang</th>
                  <th className="pb-3 px-3">Antrian</th>
                  <th className="pb-3 px-3">Nama Customer</th>
                  <th className="pb-3 px-3">WhatsApp</th>
                  <th className="pb-3 px-3">Frame & Lensa</th>
                  <th className="pb-3 px-3">Resep (OD / OS)</th>
                  <th className="pb-3 px-3">Status Saat Ini</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono tabular-nums font-semibold text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                        {o.cabangKode}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums font-semibold text-slate-700">
                      #{String(o.noAntrian).padStart(3, "0")}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {o.customer.nama}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-slate-600">
                      {o.customer.noWa}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{o.frameModel || "-"}</div>
                      <div className="text-[11px] text-emerald-800 font-medium">{o.jenisLensa}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-[11px] text-slate-600">
                      <div>R: {o.eyeExam?.sphR || "0"} / {o.eyeExam?.cylR || "0"}</div>
                      <div>L: {o.eyeExam?.sphL || "0"} / {o.eyeExam?.cylL || "0"}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => openEditModal(o)}
                        className="apple-press py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Koreksi Data</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Edit & Koreksi Data (Apple Sheet Style) */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/60 shadow-apple-float space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono tabular-nums font-semibold text-emerald-800 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {editingOrder.cabangNama} • #{String(editingOrder.noAntrian).padStart(3, "0")}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 mt-2">
                  Koreksi Rekam Medis: {editingOrder.customer.nama}
                </h3>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="apple-press p-2 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Customer
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    value={noWa}
                    onChange={(e) => setNoWa(e.target.value)}
                    className="w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl font-mono tabular-nums focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Pelanggan
                </label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Model Frame
                  </label>
                  <input
                    type="text"
                    value={frameModel}
                    onChange={(e) => setFrameModel(e.target.value)}
                    className="w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Catatan Frame
                  </label>
                  <input
                    type="text"
                    value={catatanFrame}
                    onChange={(e) => setCatatanFrame(e.target.value)}
                    className="w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Ukuran Resep */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-2.5">
                  Koreksi Resep Kacamata (Garansi / Penyesuaian)
                </span>
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-slate-200/80 space-y-2.5">
                    <span className="font-semibold text-slate-900 block">Mata Kanan (OD):</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">SPH:</span>
                      <input
                        type="text"
                        value={sphR}
                        onChange={(e) => setSphR(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">CYL:</span>
                      <input
                        type="text"
                        value={cylR}
                        onChange={(e) => setCylR(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">AXIS:</span>
                      <input
                        type="text"
                        value={axisR}
                        onChange={(e) => setAxisR(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-slate-200/80 space-y-2.5">
                    <span className="font-semibold text-slate-900 block">Mata Kiri (OS):</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">SPH:</span>
                      <input
                        type="text"
                        value={sphL}
                        onChange={(e) => setSphL(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">CYL:</span>
                      <input
                        type="text"
                        value={cylL}
                        onChange={(e) => setCylL(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">AXIS:</span>
                      <input
                        type="text"
                        value={axisL}
                        onChange={(e) => setAxisL(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-xl font-mono tabular-nums text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Catatan Komplain / Alasan Koreksi
                  </label>
                  <input
                    type="text"
                    value={catatanResep}
                    onChange={(e) => setCatatanResep(e.target.value)}
                    placeholder="Contoh: Garansi penyesuaian silinder turun 0.25"
                    className="w-full p-2.5 text-xs bg-black/[0.02] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="apple-press py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="apple-press py-2.5 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-apple-subtle disabled:opacity-50 transition"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-emerald-300" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

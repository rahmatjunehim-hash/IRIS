"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  MapPin,
  CheckCircle2,
  ArrowRight,
  User,
  Phone,
  Home,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  ChevronDown,
  Check,
  Tv,
  RotateCcw,
  Layers,
} from "lucide-react";

const CABANG_OPTIONS = [
  { id: "cab_pwt", kode: "PWT", nama: "Purwokerto", alamat: "Jl. Jend. Soedirman" },
  { id: "cab_clp", kode: "CLP", nama: "Cilacap", alamat: "Jl. Gatot Subroto" },
  { id: "cab_wsb", kode: "WSB", nama: "Wonosobo", alamat: "Jl. Ahmad Yani" },
  { id: "cab_pbg", kode: "PBG", nama: "Purbalingga", alamat: "Jl. MT Haryono" },
];

export interface LensaItem {
  label: string;
  category: string;
  desc: string;
  tags: string[];
}

const LENSA_OPTIONS: LensaItem[] = [
  {
    label: "Stellify Blue Control",
    category: "HOYA Stellify",
    desc: "Lensa premium Hoya Stellify dengan perlindungan radiasi sinar biru & kejernihan tinggi",
    tags: ["stelify", "stellify", "blue control", "hoya", "blueray", "komputer"],
  },
  {
    label: "Stellify Single Vision 1.55",
    category: "HOYA Stellify",
    desc: "Lensa jernih standar Jepang Hoya Stellify dengan lapisan anti-gores & anti-pantul kuat",
    tags: ["stelify", "stellify", "single vision", "hoya", "crmc", "standar"],
  },
  {
    label: "Stellify Photochromic (Sensity)",
    category: "HOYA Stellify",
    desc: "Transisi warna gelap cepat saat terkena sinar matahari dengan teknologi optik Hoya Stellify",
    tags: ["stelify", "stellify", "photochromic", "sensity", "hoya", "transisi", "gelap"],
  },
  {
    label: "Stellify Progressive 1.50 / 1.55",
    category: "HOYA Stellify",
    desc: "Lensa multi-fokus presisi tinggi Hoya Stellify untuk pandangan jauh, menengah & baca dekat",
    tags: ["stelify", "stellify", "progressive", "progresif", "hoya", "baca", "jauh dekat"],
  },
  {
    label: "Single Vision CRMC (Standar)",
    category: "Standar",
    desc: "Anti pantul & jernih untuk kebutuhan minus/plus/silinder standar sehari-hari",
    tags: ["crmc", "standar", "single vision", "bening"],
  },
  {
    label: "Single Vision Blue Ray",
    category: "Anti-Radiasi",
    desc: "Perlindungan maksimal dari radiasi layar gadget digital, laptop & monitor TV",
    tags: ["blue ray", "blueray", "anti radiasi", "komputer", "gadget"],
  },
  {
    label: "Single Vision Photochromic",
    category: "Transisi UV",
    desc: "Berubah warna menjadi gelap otomatis saat terpapar sinar matahari / UV luar ruangan",
    tags: ["photochromic", "fotokromik", "transisi", "gelap", "uv"],
  },
  {
    label: "Single Vision Bluechromic (All-in-One)",
    category: "Kombinasi",
    desc: "Kombinasi lengkap: Blokir radiasi layar digital sekaligus berubah gelap di bawah terik matahari",
    tags: ["bluechromic", "all in one", "blueray", "photochromic"],
  },
  {
    label: "Progressive Standar",
    category: "Multi-Fokus",
    desc: "Lensa multi-fokus jarak jauh, menengah & baca dekat tanpa garis pembatas luar",
    tags: ["progressive", "progresif", "baca", "jauh dekat"],
  },
  {
    label: "Konsultasikan saat Cek Mata",
    category: "Konsultasi",
    desc: "Pilih dan diskusikan rekomendasi lensa terbaik bersama staf refraksi setelah hasil periksa",
    tags: ["konsultasi", "rekomendasi", "nanti", "cek"],
  },
];

export default function RegistrasiCustomerPage() {
  const [cabangId, setCabangId] = useState("cab_pwt");
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("L");
  const [jenisLensa, setJenisLensa] = useState("Single Vision CRMC (Standar)");
  const [lensSearchQuery, setLensSearchQuery] = useState("");
  const [lensDropdownOpen, setLensDropdownOpen] = useState(false);
  const lensDropdownRef = useRef<HTMLDivElement | null>(null);
  const [frameModel, setFrameModel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredOrder, setRegisteredOrder] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!cabangId) {
      setError("Silakan pilih cabang terlebih dahulu.");
      return;
    }
    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!noWa.trim()) {
      setError("Nomor WhatsApp wajib diisi untuk notifikasi saat kacamata selesai.");
      return;
    }
    if (!alamat.trim()) {
      setError("Alamat domisili wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cabangId,
          nama,
          noWa,
          alamat,
          tanggalLahir,
          jenisKelamin,
          jenisLensa,
          frameModel: frameModel || "Frame Pilihan di Toko",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal melakukan pendaftaran.");
        setLoading(false);
        return;
      }

      setRegisteredOrder(data.order);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Registrasi fetch error:", err);
      const msg = err instanceof Error ? err.message : "Gagal terhubung ke server.";
      setError(`Gagal terhubung ke server (${msg}). Pastikan server Next.js sedang aktif.`);
      setLoading(false);
    }
  }

  function handleReset() {
    setNama("");
    setNoWa("");
    setAlamat("");
    setTanggalLahir("");
    setFrameModel("");
    setError(null);
    setRegisteredOrder(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (lensDropdownRef.current && !lensDropdownRef.current.contains(event.target as Node)) {
        setLensDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLensa = LENSA_OPTIONS.filter((opt) => {
    if (!lensSearchQuery.trim()) return true;
    const q = lensSearchQuery.toLowerCase();
    const qNorm = q.replace(/ll/g, "l");
    const labelNorm = opt.label.toLowerCase().replace(/ll/g, "l");
    const descNorm = opt.desc.toLowerCase().replace(/ll/g, "l");
    const categoryNorm = opt.category.toLowerCase().replace(/ll/g, "l");
    const tagsNorm = opt.tags.map((t) => t.toLowerCase().replace(/ll/g, "l"));

    return (
      labelNorm.includes(qNorm) ||
      descNorm.includes(qNorm) ||
      categoryNorm.includes(qNorm) ||
      tagsNorm.some((t) => t.includes(qNorm))
    );
  });

  const isStellifySearch = lensSearchQuery.toLowerCase().replace(/ll/g, "l").includes("steli");

  // Layar Tiket Sukses (Apple Wallet / Boarding Pass Aesthetic)
  if (registeredOrder) {
    const cabangKode = registeredOrder.cabangKode?.toLowerCase() || "pwt";
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="max-w-md w-full apple-glass rounded-3xl p-8 text-center relative overflow-hidden border border-black/[0.06] shadow-apple-float">
          {/* Subtle ambient accent */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center justify-center mx-auto mb-3.5 shadow-apple-subtle">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <span className="text-[11px] font-semibold text-emerald-900 tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-apple-subtle inline-block">
            Optik I See You — {registeredOrder.cabangNama}
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-3">
            Pendaftaran Berhasil
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Terima kasih kaka <strong className="text-slate-800">{registeredOrder.customer.nama}</strong>. Nomor antrian kaka telah dicatat di sistem rekam medis.
          </p>

          {/* Ticket Card ala Apple Wallet */}
          <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-apple-float border border-emerald-700/30 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
            <span className="text-[11px] text-emerald-300 font-semibold uppercase tracking-widest block">
              Nomor Antrian Cek Mata
            </span>
            <div className="text-6xl font-mono tabular-nums font-black text-white my-2 tracking-tight drop-shadow-sm">
              #{String(registeredOrder.noAntrian).padStart(3, "0")}
            </div>
            <div className="text-xs font-medium text-emerald-200/90 flex items-center justify-center gap-1.5 mt-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Silakan duduk santai di ruang tunggu</span>
            </div>
          </div>

          <div className="text-left bg-black/[0.02] p-4 rounded-2xl border border-black/[0.05] text-xs space-y-1.5 text-slate-600 shadow-apple-subtle">
            <p><strong>Lensa:</strong> {registeredOrder.jenisLensa}</p>
            <p><strong>No. WhatsApp:</strong> <span className="font-mono">{registeredOrder.customer.noWa}</span></p>
            <p className="text-slate-400 text-[11px] pt-1">
              *Nama kaka akan dipanggil lewat pengeras suara Smart TV saat giliran tiba.
            </p>
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              onClick={handleReset}
              className="w-full apple-btn-primary py-3.5 text-sm font-semibold rounded-2xl shadow-apple-subtle"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Daftarkan Customer Berikutnya</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`/display/${cabangKode}`}
                target="_blank"
                className="apple-btn-secondary py-2.5 text-xs font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <Tv className="w-4 h-4 text-emerald-800" />
                <span>Smart TV</span>
              </a>
              <a
                href="/cek-mata"
                target="_blank"
                className="apple-btn-secondary py-2.5 text-xs font-medium rounded-xl text-emerald-900 border-emerald-200 bg-emerald-50/50 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-emerald-800" />
                <span>Cek Mata</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleResetAllOrders() {
    if (!confirm("Reset semua antrian menjadi kosong (mulai dari #001)?")) return;
    try {
      await fetch("/api/admin/reset-orders", { method: "POST" });
      handleReset();
      alert("Semua data antrian telah di-reset ke nol (mulai antrian #001).");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header with Official Logos */}
        <div className="text-center mb-8 relative">
          <div className="flex flex-col items-center justify-center mb-4">
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-10 w-auto object-contain"
            />
            <img
              src="/brand/logo-for-every-you.png"
              alt="for every you"
              className="h-4 w-auto object-contain mt-1.5 opacity-85"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-950">
            Pendaftaran Cek Mata
          </h1>
          <p className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mt-1">
            Layanan Refraksi & Rekam Medis Optometri
          </p>
          <p className="text-xs text-emerald-900/65 mt-2 max-w-md mx-auto leading-relaxed">
            Silakan isi data diri kaka untuk pemeriksaan refraksi mata gratis dan rekam medis kacamata.
          </p>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleResetAllOrders}
              className="text-[11px] text-slate-400 hover:text-rose-700 underline underline-offset-4 cursor-pointer transition font-mono flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Antrian ke #001 (Untuk Pengujian)</span>
            </button>
          </div>
        </div>

        {/* Form Container (Apple Glass Card) */}
        <div className="apple-glass rounded-3xl p-6 sm:p-10 border border-black/[0.06] shadow-apple-float">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-medium shadow-apple-subtle">
                {error}
              </div>
            )}

            {/* 1. Pilih Cabang (Apple Segmented Grid) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                1. Pilih Cabang Toko
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CABANG_OPTIONS.map((c) => {
                  const isSelected = cabangId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCabangId(c.id)}
                      className={`min-h-[60px] p-3 rounded-2xl border text-center transition-all duration-150 active:scale-[0.97] flex flex-col items-center justify-center cursor-pointer shadow-apple-subtle ${
                        isSelected
                          ? "bg-emerald-900 text-white border-emerald-950 shadow-apple-card font-semibold"
                          : "bg-white/80 text-slate-700 border-black/[0.06] hover:bg-white hover:border-black/[0.12]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-medium tracking-tight">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-300" : "text-emerald-700"}`} />
                        <span>{c.nama}</span>
                      </div>
                      <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-emerald-200" : "text-slate-400"}`}>
                        {c.kode}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Data Pribadi */}
            <div className="space-y-4 pt-2">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                2. Data Diri Pelanggan
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Ayu Wardani"
                    className="block w-full min-h-[48px] pl-10 pr-3.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Nomor WhatsApp Aktif *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={noWa}
                      onChange={(e) => setNoWa(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="block w-full min-h-[48px] pl-10 pr-3.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400 font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">
                    *Untuk menerima info resmi saat kacamata sudah jadi
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Tanggal Lahir (Opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="block w-full min-h-[48px] pl-10 pr-3.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all text-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Alamat Domisili *
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                    <Home className="w-4 h-4" />
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Contoh: Jl. Sudirman No. 12, Purwokerto"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Jenis Kelamin
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer px-3.5 py-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] transition-all">
                    <input
                      type="radio"
                      name="jk"
                      checked={jenisKelamin === "L"}
                      onChange={() => setJenisKelamin("L")}
                      className="accent-emerald-700 w-4 h-4 cursor-pointer"
                    />
                    <span>Laki-laki</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer px-3.5 py-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] transition-all">
                    <input
                      type="radio"
                      name="jk"
                      checked={jenisKelamin === "P"}
                      onChange={() => setJenisKelamin("P")}
                      className="accent-emerald-700 w-4 h-4 cursor-pointer"
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Pilihan Jenis Lensa (Dropdown & Rekomendasi Cerdas) */}
            <div className="pt-2" ref={lensDropdownRef}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  3. Pilihan Jenis Lensa (Rencana)
                </label>
                <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  Ketik &quot;stelify&quot; untuk Rekomendasi
                </span>
              </div>

              {/* Searchable Input with Dropdown Trigger */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 text-emerald-700" />
                </div>
                <input
                  type="text"
                  value={lensSearchQuery || jenisLensa}
                  onFocus={() => {
                    setLensDropdownOpen(true);
                    if (!lensSearchQuery) setLensSearchQuery(jenisLensa);
                  }}
                  onChange={(e) => {
                    setLensSearchQuery(e.target.value);
                    setJenisLensa(e.target.value);
                    setLensDropdownOpen(true);
                  }}
                  placeholder="Ketik nama lensa, misal: stelify, photochromic, crmc..."
                  className="block w-full min-h-[50px] pl-10 pr-10 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 rounded-2xl transition-all font-medium text-slate-900 shadow-apple-subtle"
                />
                <button
                  type="button"
                  onClick={() => setLensDropdownOpen(!lensDropdownOpen)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      lensDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu (Apple Floating Glass Card) */}
                {lensDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-2xl rounded-2xl border border-black/[0.08] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] p-2 max-h-80 overflow-y-auto space-y-1">
                    {/* Header indicator when typing stelify */}
                    {isStellifySearch && (
                      <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-700" />
                          Rekomendasi Koleksi Lensa Hoya Stellify:
                        </span>
                        <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                          Resmi HOYA
                        </span>
                      </div>
                    )}

                    {filteredLensa.length > 0 ? (
                      filteredLensa.map((opt) => {
                        const isSelected = jenisLensa === opt.label;
                        const isStellify = opt.category === "HOYA Stellify";

                        return (
                          <div
                            key={opt.label}
                            onClick={() => {
                              setJenisLensa(opt.label);
                              setLensSearchQuery(opt.label);
                              setLensDropdownOpen(false);
                            }}
                            className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 text-left ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-950 border border-emerald-200/80"
                                : "hover:bg-slate-50 border border-transparent"
                            }`}
                          >
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold tracking-tight text-slate-900">
                                  {opt.label}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    isStellify
                                      ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {opt.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                {opt.desc}
                              </p>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">
                        <p>Tidak ada lensa dengan kata kunci tersebut.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setJenisLensa(lensSearchQuery);
                            setLensDropdownOpen(false);
                          }}
                          className="mt-1.5 text-emerald-800 font-semibold underline text-xs cursor-pointer"
                        >
                          Gunakan &quot;{lensSearchQuery}&quot; sebagai pilihan kustom
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mr-1">
                  Rekomendasi Cepat:
                </span>
                {[
                  "Stellify Blue Control",
                  "Single Vision CRMC (Standar)",
                  "Single Vision Photochromic",
                  "Single Vision Bluechromic",
                  "Stellify Single Vision 1.55",
                  "Progressive Standar",
                ].map((chip) => {
                  const isCurrent = jenisLensa === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setJenisLensa(chip);
                        setLensSearchQuery(chip);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-emerald-900 text-white border-emerald-950 font-medium shadow-sm"
                          : "bg-white/80 text-slate-700 border-black/[0.06] hover:bg-emerald-50/60 hover:border-emerald-700/40"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Frame yang dipilih */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Catatan Model Frame (Opsional)
              </label>
              <input
                type="text"
                value={frameModel}
                onChange={(e) => setFrameModel(e.target.value)}
                placeholder="Contoh: Havana Brown Series atau Frame Bawaan Sendiri"
                className="block w-full min-h-[48px] px-3.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">
                *Staf kasir akan membantu memverifikasi detail frame setelah pemeriksaan selesai.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[52px] apple-btn-primary text-base font-semibold rounded-2xl shadow-apple-float disabled:opacity-50"
            >
              {loading ? (
                <span>Mendaftarkan Antrian...</span>
              ) : (
                <>
                  <span>Ambil Nomor Antrian Cek Mata</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

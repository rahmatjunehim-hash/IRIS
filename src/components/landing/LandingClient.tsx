"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Tv,
  Tablet,
  LogIn,
  ArrowRight,
  Sparkles,
  Volume2,
  MapPin,
  ShieldCheck,
  Building2,
  ExternalLink,
  Glasses,
  ReceiptText,
  Layers,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";

interface CabangDisplayInfo {
  name: string;
  slug: string;
  address: string;
  phone: string;
  currentQueue: string;
  currentCustomer: string;
  nextQueue: string[];
  photos: {
    src: string;
    caption: string;
  }[];
}

const CABANG_DATA: CabangDisplayInfo[] = [
  {
    name: "Purwokerto",
    slug: "purwokerto",
    address: "Jl. Jend. Soedirman, Purwokerto, Jawa Tengah",
    phone: "0812-3456-7890",
    currentQueue: "#001",
    currentCustomer: "Mas Raja",
    nextQueue: ["#002", "#003", "#004"],
    photos: [
      {
        src: "/lokasi/purwokerto/IMG_1543.webp",
        caption: "Galeri Display Frame & Konsultasi Kacamata Purwokerto",
      },
      {
        src: "/lokasi/purwokerto/IMG_1544.webp",
        caption: "Ruang Pemeriksaan Refraksi Presisi Purwokerto",
      },
      {
        src: "/lokasi/purwokerto/IMG_1546.webp",
        caption: "Area Tunggu & Fitting Kacamata Purwokerto",
      },
    ],
  },
  {
    name: "Cilacap",
    slug: "cilacap",
    address: "Jl. Gatot Subroto, Cilacap, Jawa Tengah",
    phone: "0812-3456-7891",
    currentQueue: "#001",
    currentCustomer: "Siti Rahmawati",
    nextQueue: ["#002", "#003"],
    photos: [
      {
        src: "/lokasi/cilacap/IMG_6716.webp",
        caption: "Koleksi Frame Elegan & Area Refraksi Cilacap",
      },
      {
        src: "/lokasi/cilacap/IMG_7453.webp",
        caption: "Ruang Tunggu Nyaman & Kasir Cilacap",
      },
      {
        src: "/lokasi/cilacap/IMG_7455.webp",
        caption: "Laboratorium Pengecekan & Finishing Lensa Cilacap",
      },
    ],
  },
  {
    name: "Wonosobo",
    slug: "wonosobo",
    address: "Jl. Ahmad Yani, Wonosobo, Jawa Tengah",
    phone: "0812-3456-7892",
    currentQueue: "#001",
    currentCustomer: "Ahmad Fauzi",
    nextQueue: ["#002", "#003", "#004"],
    photos: [
      {
        src: "/lokasi/wonosobo/IMG_4474.webp",
        caption: "Interior Butik Kacamata Modern Wonosobo",
      },
      {
        src: "/lokasi/wonosobo/IMG_4475.webp",
        caption: "Display Koleksi Lensa & Frame Premium Wonosobo",
      },
      {
        src: "/lokasi/wonosobo/IMG_4476.webp",
        caption: "Ruang Refraksi Mata Terstandarisasi Wonosobo",
      },
    ],
  },
  {
    name: "Purbalingga",
    slug: "purbalingga",
    address: "Jl. MT Haryono, Purbalingga, Jawa Tengah",
    phone: "0812-3456-7893",
    currentQueue: "#001",
    currentCustomer: "Dewi Lestari",
    nextQueue: ["#002"],
    photos: [
      {
        src: "/lokasi/purbalingga/IMG_8525.webp",
        caption: "Showroom Frame & Layanan Refraksi Purbalingga",
      },
      {
        src: "/lokasi/purbalingga/IMG_8526.webp",
        caption: "Area Konsultasi & Pemilihan Lensa Purbalingga",
      },
      {
        src: "/lokasi/purbalingga/IMG_8533.webp",
        caption: "Layanan Presisi & Customer Care Purbalingga",
      },
    ],
  },
];

export default function LandingClient() {
  const [selectedCabangIdx, setSelectedCabangIdx] = useState(0);
  const [photoSubIdx, setPhotoSubIdx] = useState(0);

  const activeCabang = CABANG_DATA[selectedCabangIdx];
  const currentPhoto =
    activeCabang.photos[photoSubIdx] || activeCabang.photos[0];

  const mainRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const heroBadgeRef = useRef<HTMLDivElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroDescRef = useRef<HTMLParagraphElement | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const showcaseImgRef = useRef<HTMLImageElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);

  // GSAP Initial Page Reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar entrance
      if (navRef.current) {
        gsap.from(navRef.current, {
          y: -24,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
        });
      }

      // Hero Elements Staggered Reveal
      const heroElements = [
        heroBadgeRef.current,
        heroTitleRef.current,
        heroDescRef.current,
        heroCtaRef.current,
      ].filter(Boolean);

      if (heroElements.length > 0) {
        gsap.from(heroElements, {
          y: 30,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        });
      }

      // Showcase Cards Entrance
      gsap.from(".landing-anim-card", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.3,
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance photos every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoSubIdx((prev) => (prev + 1) % activeCabang.photos.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [selectedCabangIdx, activeCabang.photos.length]);

  // GSAP Smooth Transition on Photo or Branch Change
  useEffect(() => {
    if (showcaseImgRef.current) {
      gsap.killTweensOf(showcaseImgRef.current);
      gsap.fromTo(
        showcaseImgRef.current,
        { opacity: 0.35, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
        }
      );
    }

    if (captionRef.current) {
      gsap.killTweensOf(captionRef.current);
      gsap.fromTo(
        captionRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [selectedCabangIdx, photoSubIdx]);

  function handleBranchChange(idx: number) {
    setSelectedCabangIdx(idx);
    setPhotoSubIdx(0);
  }

  function handleNextPhoto() {
    setPhotoSubIdx((prev) => (prev + 1) % activeCabang.photos.length);
  }

  function handlePrevPhoto() {
    setPhotoSubIdx(
      (prev) => (prev - 1 + activeCabang.photos.length) % activeCabang.photos.length
    );
  }

  return (
    <div
      ref={mainRef}
      className="min-h-screen min-h-[100dvh] bg-[#FDFBF7] text-emerald-950 selection:bg-emerald-800 selection:text-white relative overflow-x-hidden font-sans"
    >
      {/* FULL-BLEED STORE PHOTO HERO SECTION */}
      <section className="relative min-h-screen min-h-[100dvh] flex flex-col justify-between overflow-hidden text-white">
        {/* Full-Page Background Photo Layer with GSAP Transition */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            ref={showcaseImgRef}
            src={currentPhoto.src}
            alt={currentPhoto.caption}
            className="w-full h-full object-cover object-center will-change-transform scale-105"
          />

          {/* Luxury Scrim: Deep Emerald Gradient & Warm Lighting for Absolute Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#062419]/90 via-[#062419]/70 to-[#062419]/95" />
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px]" />
          {/* Bottom gentle fade into the ivory section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none" />
        </div>

        {/* Floating Apple Glass Navbar */}
        <header
          ref={navRef}
          className="relative z-30 pt-3 sm:pt-5 max-w-7xl w-full mx-auto px-4 sm:px-6"
        >
          <nav className="rounded-2xl sm:rounded-3xl py-2.5 sm:py-3 px-4 sm:px-6 flex items-center justify-between shadow-2xl border border-white/15 bg-black/40 backdrop-blur-2xl">
            {/* Brand Logo Kiri: Optik I See You (White Crisp Version) */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center"
                aria-label="Beranda Optik I See You"
              >
                <img
                  src="/brand/logo-isy-white.png"
                  alt="Optik I See You"
                  className="h-8 sm:h-9 w-auto object-contain drop-shadow-md"
                />
              </Link>
            </div>

            {/* Center Status Indicator */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>IRIS — I See You Retail & Information System</span>
            </div>

            {/* Samping Kanan: Logo 'for every you' + Tombol Login Staff */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/brand/logo-for-every-you-white.png"
                alt="for every you"
                className="h-4 sm:h-5 w-auto object-contain opacity-90 hidden sm:block drop-shadow-sm"
              />

              <Link
                href="/login"
                className="apple-press inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold shadow-apple-subtle transition-all cursor-pointer min-h-[40px]"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-100" />
                <span>Login Staff</span>
                <ArrowRight className="w-3 h-3 text-emerald-200 hidden sm:inline" />
              </Link>
            </div>
          </nav>
        </header>

        {/* Center Hero Content (Overlaid on Full Store Photo Background) */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center my-auto">
          {/* Badge */}
          <div
            ref={heroBadgeRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold mb-4 sm:mb-6 shadow-apple-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>IRIS — I See You Retail & Information System</span>
          </div>

          {/* Hero Title */}
          <h1
            ref={heroTitleRef}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12] drop-shadow-md"
          >
            Portal Operasional <br className="hidden sm:inline" />
            <span className="text-emerald-300">Optik I See You</span> Lintas 4 Cabang
          </h1>

          {/* Hero Description */}
          <p
            ref={heroDescRef}
            className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto mt-4 font-normal leading-relaxed drop-shadow-sm"
          >
            Ekosistem cerdas terpadu untuk registrasi customer tablet mandiri, antrian Smart TV bersuara jernih (Alice AI), refraksi rekam medis, kasir cabang, laboratorium faset lensa, dan after sales.
          </p>

          {/* Hero CTAs */}
          <div
            ref={heroCtaRef}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/login"
              className="apple-press inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-apple-card transition-all cursor-pointer min-h-[48px]"
            >
              <LogIn className="w-4 h-4 text-emerald-100" />
              <span>Masuk ke Portal Staff</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </Link>
            <a
              href="#shortcut-tv"
              className="apple-press inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm shadow-apple-subtle transition-all cursor-pointer min-h-[48px]"
            >
              <Tv className="w-4 h-4 text-emerald-300" />
              <span>Shortcut Smart TV & Tablet</span>
            </a>
          </div>
        </div>

        {/* Bottom Dock: Store Caption & Live Branch Switcher Controller */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="bg-black/50 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Active Store Photo Caption & Location */}
            <div ref={captionRef} className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  Cabang {activeCabang.name}
                </span>
                <span className="text-xs text-white/70 font-medium">
                  Foto {photoSubIdx + 1} dari {activeCabang.photos.length}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-sm line-clamp-1">
                {currentPhoto.caption}
              </h3>
              <p className="text-[11px] text-white/70 font-normal flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{activeCabang.address}</span>
              </p>
            </div>

            {/* Center: Branch Switcher Tabs (Clean City Names) */}
            <div className="apple-segmented-container p-1 rounded-2xl flex items-center gap-1 bg-black/60 border border-white/15 overflow-x-auto max-w-full shrink-0">
              {CABANG_DATA.map((c, idx) => (
                <button
                  key={c.slug}
                  onClick={() => handleBranchChange(idx)}
                  className={`apple-press px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    selectedCabangIdx === idx
                      ? "bg-emerald-600 text-white shadow-apple-subtle"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Right: Controls & Direct Smart TV Launch */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrevPhoto}
                aria-label="Foto Sebelumnya"
                className="apple-press w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                aria-label="Foto Berikutnya"
                className="apple-press w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href={`/display/${activeCabang.slug}`}
                target="_blank"
                rel="noreferrer"
                className="apple-press inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-apple-subtle transition-all cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5 text-emerald-200" />
                <span>Buka Smart TV {activeCabang.name}</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Shortcuts Section */}
      <section
        id="shortcut-tv"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950">
            Akses Cepat Layar Publik & Layanan
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900/60 mt-1 font-medium">
            Buka langsung tampilan Smart TV antrian toko atau tablet registrasi tanpa perlu login staff.
          </p>
        </div>

        {/* 2-Column Showcase: Smart TV Shortcut & Tablet Registrasi Shortcut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (7 cols): Interactive Smart TV Display Widget */}
          <div className="landing-anim-card lg:col-span-7 bg-[#062419] text-white rounded-3xl p-5 sm:p-8 shadow-apple-float border border-emerald-800/40 flex flex-col justify-between relative overflow-hidden">
            {/* Top header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/50 pb-5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                      <span>Layar Antrian Smart TV</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Ivory tvOS
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-200/70 font-medium">
                      Dipasang pada Smart TV ruang tunggu 4 cabang
                    </p>
                  </div>
                </div>

                {/* Interactive Branch Switcher Tabs */}
                <div className="apple-segmented-container p-1 rounded-2xl flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/60 shrink-0 overflow-x-auto">
                  {CABANG_DATA.map((c, idx) => (
                    <button
                      key={c.slug}
                      onClick={() => handleBranchChange(idx)}
                      className={`apple-press px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedCabangIdx === idx
                          ? "bg-emerald-600 text-white shadow-apple-subtle"
                          : "text-emerald-300/70 hover:text-white"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Smart TV Live Screen (Warm Ivory Clean Theme) */}
              <div className="bg-[#FDFBF7] text-emerald-950 rounded-2xl p-5 sm:p-6 border border-emerald-900/15 shadow-apple-card relative overflow-hidden space-y-4">
                {/* Simulated TV top bar */}
                <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-900">
                      CABANG: {activeCabang.name.toUpperCase()} • IRIS
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                    <span>Alice AI Voice (2x Panggilan) • KAI Chime</span>
                  </div>
                </div>

                {/* Simulated Call Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Sedang Dipanggil Periksa
                    </span>
                    <div className="text-4xl sm:text-5xl font-mono tabular-nums font-black text-emerald-900 tracking-tight">
                      {activeCabang.currentQueue}
                    </div>
                    <div className="text-sm font-bold text-emerald-950 mt-1">
                      {activeCabang.currentCustomer}
                    </div>
                  </div>

                  <div className="bg-white/80 border border-emerald-900/10 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-emerald-900/60 uppercase tracking-wider block mb-2">
                      Antrian Berikutnya
                    </span>
                    <div className="flex gap-2">
                      {activeCabang.nextQueue.map((q) => (
                        <span
                          key={q}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 font-mono tabular-nums text-sm font-bold text-emerald-900 border border-emerald-200/60"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-emerald-900/60 font-medium mt-2">
                      Otomatis tersinkronisasi via websocket polling
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch CTA for Active Branch */}
            <div className="pt-6 mt-6 border-t border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-emerald-200/80 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Cabang Aktif: <strong>{activeCabang.name}</strong>
                </span>
              </div>

              <a
                href={`/display/${activeCabang.slug}`}
                target="_blank"
                rel="noreferrer"
                className="apple-press w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-apple-subtle transition-all cursor-pointer shrink-0 min-h-[44px]"
              >
                <span>Buka Smart TV {activeCabang.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>
            </div>
          </div>

          {/* Right Column (5 cols): Tablet Registrasi Customer & Login Gateway */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Tablet Registrasi Customer Card (Apple iPadOS Style) */}
            <div className="landing-anim-card bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-apple-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200/60">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight text-emerald-950 flex items-center gap-2">
                      <span>Tablet Registrasi Customer</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        Mandiri
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-900/60 font-medium">
                      Layar sentuh iPad di gerbang masuk toko
                    </p>
                  </div>
                </div>

                <p className="text-xs text-emerald-900/70 font-normal leading-relaxed">
                  Customer memilih cabang toko, memasukkan WhatsApp aktif, memilih preferensi lensa (Hoya Stellify, CRMC, Blue Ray, Photochromic, Bluechromic), dan langsung mendapatkan nomor tiket antrian Cek Mata.
                </p>

                {/* Simulated iPad Ticket Card */}
                <div className="mt-4 p-4 rounded-2xl bg-[#FDFBF7] border border-emerald-900/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                      #001
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        Tiket Cek Mata Otomatis
                      </div>
                      <div className="text-[11px] text-emerald-900/60 font-medium">
                        Terhubung ke ruang refraksi
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                    Instan
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/10">
                <Link
                  href="/registrasi"
                  className="apple-press w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs shadow-apple-subtle transition-all cursor-pointer min-h-[44px]"
                >
                  <span>Buka Tablet Registrasi</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                </Link>
              </div>
            </div>

            {/* Internal Staff Gateway Card */}
            <div className="landing-anim-card bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-apple-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white flex items-center justify-center shadow-apple-subtle">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight text-emerald-950">
                      Login Portal Staff & Super Admin
                    </h3>
                    <p className="text-xs text-emerald-900/60 font-medium">
                      Satu gerbang masuk untuk 7 role operasional
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-emerald-900/10 font-medium text-emerald-950 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Super Admin</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-emerald-900/10 font-medium text-emerald-950 flex items-center gap-2">
                    <Glasses className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Cek Mata</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-emerald-900/10 font-medium text-emerald-950 flex items-center gap-2">
                    <ReceiptText className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Kasir Cabang</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-emerald-900/10 font-medium text-emerald-950 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Teknisi Faset</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/10">
                <Link
                  href="/login"
                  className="apple-press w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs shadow-apple-subtle transition-all cursor-pointer min-h-[44px]"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Masuk ke Halaman Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cabang Direct Smart TV Launcher Grid with Real Interior Thumbnails */}
        <div className="landing-anim-card bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-emerald-900/10 shadow-apple-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-bold tracking-tight text-emerald-950 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-800" />
                <span>Peluncur Cepat Smart TV 4 Cabang Resmi</span>
              </h3>
              <p className="text-xs text-emerald-900/60 font-medium mt-0.5">
                Pilih cabang toko untuk langsung membuka layar antrian Smart TV bersuara Alice AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CABANG_DATA.map((c) => (
              <div
                key={c.slug}
                className="rounded-2xl bg-[#FDFBF7] border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-apple-subtle transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Store Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden bg-emerald-950">
                  <img
                    src={c.photos[0].src}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-tight drop-shadow-sm">
                      Cabang {c.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600/40">
                      Aktif
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-emerald-900/70 font-normal line-clamp-2">
                    {c.address}
                  </p>

                  <a
                    href={`/display/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="apple-press w-full py-2.5 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-apple-subtle transition cursor-pointer min-h-[40px]"
                  >
                    <Tv className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Buka Smart TV {c.name}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-300/60" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-emerald-900/10 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-900/60 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-950">Optik I See You</span>
            <span>•</span>
            <span>IRIS — I See You Retail & Information System</span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src="/brand/logo-for-every-you.png"
              alt="for every you"
              className="h-3.5 w-auto object-contain opacity-75"
            />
            <span>•</span>
            <Link
              href="/login"
              className="hover:text-emerald-950 transition-colors"
            >
              Login Staff
            </Link>
            <span>•</span>
            <Link
              href="/registrasi"
              className="hover:text-emerald-950 transition-colors"
            >
              Tablet Registrasi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

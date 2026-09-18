"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SessionUser } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

interface DashboardShellProps {
  user: SessionUser;
  children: React.ReactNode;
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Tutup menu otomatis setiap kali rute berpindah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Kunci scroll body saat drawer terbuka di mobile
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-[#FDFBF7] text-slate-800">
      {/* 1. Desktop & iPad Landscape Sidebar (Tampil di lg ke atas) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* 2. Mobile & Tablet Portrait Drawer (Overlay Sheet) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Sliding Drawer Container */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-emerald-950 text-white shadow-2xl z-10">
            {/* Tombol Tutup Drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup Menu"
              className="absolute top-4 right-3.5 z-20 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Konten Sidebar */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar user={user} onNavClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-5 md:p-8 overflow-y-auto w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

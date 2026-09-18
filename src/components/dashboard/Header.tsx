"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, User, ShieldCheck, Loader2, Menu } from "lucide-react";
import { SessionUser } from "@/lib/auth";
import { ROLE_NAMES } from "@/lib/constants";

interface HeaderProps {
  user: SessionUser;
  onOpenMobileMenu?: () => void;
}

export default function Header({ user, onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="h-16 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#064E3B]/10 px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-apple-subtle">
      {/* Left: Hamburger Button (Mobile) + Role title & Branch Context */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Buka Menu"
            className="lg:hidden p-2 rounded-xl bg-[#064E3B]/[0.05] hover:bg-[#064E3B]/10 text-[#0B1E16] active:scale-95 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-sm md:text-base font-semibold text-[#0B1E16] tracking-tight">
              {ROLE_NAMES[user.role] || user.role}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-900 border border-emerald-500/25 shadow-apple-subtle">
              <MapPin className="w-3 h-3 text-emerald-700" />
              <span>{user.cabangName || "Pusat / Lintas Cabang"}</span>
            </span>
          </div>
          <p className="text-[11px] text-[#6B8579] font-medium tracking-tight hidden sm:block">
            IRIS • Retail & Information System Optik I See You
          </p>
        </div>
      </div>

      {/* Right: User identity & Logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-3 py-1 pr-1.5 rounded-2xl bg-[#064E3B]/[0.04] border border-[#064E3B]/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#0B1E16] leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-[#6B8579] font-mono tracking-tight">
              @{user.username}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#022419] text-white flex items-center justify-center font-bold text-xs shadow-apple-subtle border border-emerald-600/30">
            {user.role === "SUPER_ADMIN" ? (
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            ) : (
              <User className="w-4 h-4 text-emerald-200" />
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Keluar dari sistem"
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-150 active:scale-[0.96] cursor-pointer disabled:opacity-50 border border-transparent hover:border-red-100"
        >
          {loggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}

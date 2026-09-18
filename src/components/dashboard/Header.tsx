"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, User, ShieldCheck, Loader2 } from "lucide-react";
import { SessionUser } from "@/lib/auth";
import { ROLE_NAMES } from "@/lib/constants";

interface HeaderProps {
  user: SessionUser;
}

export default function Header({ user }: HeaderProps) {
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
    <header className="h-16 bg-white/75 backdrop-blur-xl border-b border-black/[0.06] px-6 flex items-center justify-between sticky top-0 z-30 shadow-apple-subtle">
      {/* Left: Role title & Branch Context */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">
              {ROLE_NAMES[user.role] || user.role}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shadow-apple-subtle">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{user.cabangName || "Pusat / Lintas Cabang"}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden sm:block">
            IRIS • Retail & Information System Optik I See You
          </p>
        </div>
      </div>

      {/* Right: User identity & Logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-3 py-1 pr-1.5 rounded-2xl bg-black/[0.03] border border-black/[0.04]">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              @{user.username}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold text-xs shadow-apple-subtle border border-emerald-600/30">
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

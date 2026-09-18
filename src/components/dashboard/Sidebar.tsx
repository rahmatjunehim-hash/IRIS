"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Eye,
  LayoutDashboard,
  Glasses,
  ReceiptText,
  Wrench,
  MessageSquareShare,
  HeadphonesIcon,
  Warehouse,
  ClipboardList,
  Tv,
} from "lucide-react";
import { SessionUser } from "@/lib/auth";

interface SidebarProps {
  user: SessionUser;
  onNavClick?: () => void;
}

export default function Sidebar({ user, onNavClick }: SidebarProps) {
  const pathname = usePathname();

  // Define navigation items
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const allNavItems = [
    {
      label: "Admin Panel",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Kasir Cabang",
      href: "/kasir",
      icon: ReceiptText,
      roles: ["SUPER_ADMIN", "KASIR"],
    },
    {
      label: "Cek Mata (Refraksi)",
      href: "/cek-mata",
      icon: Glasses,
      roles: ["SUPER_ADMIN", "CEK_MATA"],
    },
    {
      label: "Faset / Teknisi",
      href: "/faset",
      icon: Wrench,
      roles: ["SUPER_ADMIN", "FASET"],
    },
    {
      label: "Customer Service",
      href: "/cs",
      icon: MessageSquareShare,
      roles: ["SUPER_ADMIN", "CS"],
    },
    {
      label: "After Sales",
      href: "/after-sales",
      icon: HeadphonesIcon,
      roles: ["SUPER_ADMIN", "AFTER_SALES"],
    },
    {
      label: "Gudang Lensa",
      href: "/gudang",
      icon: Warehouse,
      roles: ["SUPER_ADMIN", "GUDANG"],
    },
  ];

  const visibleItems = allNavItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-[#06261c] text-emerald-100 flex flex-col flex-shrink-0 min-h-screen border-r border-[#0c3e2f] select-none shadow-apple-float z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#0c3e2f]">
        <div className="flex flex-col gap-1.5">
          <img
            src="/brand/logo-isy-white.png"
            alt="Optik I See You"
            className="h-8 w-auto object-contain"
          />
          <img
            src="/brand/logo-for-every-you-white.png"
            alt="for every you"
            className="h-3.5 w-auto object-contain opacity-80"
          />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200/90 bg-white/[0.07] px-2.5 py-1 rounded-lg border border-white/[0.08] text-center leading-tight font-semibold">
            IRIS — I See You Retail & Information System
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest px-3 py-1.5 mb-1">
          {isSuperAdmin ? "Semua Modul Sistem" : "Modul Kerja Anda"}
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                isActive
                  ? "bg-white/[0.14] text-white shadow-apple-subtle border border-white/[0.15] font-semibold backdrop-blur-md"
                  : "text-emerald-100/75 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-emerald-300" : "text-emerald-400/90"
                }`}
              />
              <span className="tracking-tight">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-apple-glow animate-pulse" />
              )}
            </Link>
          );
        })}

        {/* Public Screens Link for Staff Reference */}
        <div className="pt-5 mt-5 border-t border-[#0c3e2f]">
          <div className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest px-3 py-1.5 mb-1">
            Layar Publik / Display
          </div>
          <Link
            href="/registrasi"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-200/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <span className="tracking-tight">Tablet Registrasi</span>
          </Link>
          <Link
            href={`/display/${user.cabangKode?.toLowerCase() || "purwokerto"}`}
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-200/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <Tv className="w-4 h-4 text-emerald-400" />
            <span className="tracking-tight">Smart TV Antrian</span>
          </Link>
        </div>
      </nav>

      {/* Footer info */}
      <div className="p-3.5 border-t border-[#0c3e2f] text-[11px] text-emerald-200/75 text-center font-medium tracking-tight">
        Purwokerto • Cilacap • Wonosobo • Purbalingga
      </div>
    </aside>
  );
}

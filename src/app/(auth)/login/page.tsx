"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Lock, User, AlertCircle, Loader2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk. Periksa kembali username dan password Anda.");
        setLoading(false);
        return;
      }

      // Successful login -> redirect
      const target = callbackUrl || data.redirectUrl || "/admin";
      router.push(target);
      router.refresh();
    } catch {
      setError("Terjadi gangguan koneksi ke server. Silakan coba lagi.");
      setLoading(false);
    }
  }

  // Quick filler for testing
  function setDemoAccount(user: string) {
    setUsername(user);
    setPassword("password123");
    setError(null);
  }

  return (
    <div className="apple-glass py-8 px-6 rounded-3xl sm:px-10">
      <form className="space-y-4" onSubmit={handleLogin}>
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-medium flex items-start gap-2.5 shadow-apple-subtle">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5"
          >
            Username / Email Akun
          </label>
          <div className="relative rounded-xl shadow-apple-subtle">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: kasir_pwt atau admin1"
              className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5"
          >
            Kata Sandi
          </label>
          <div className="relative rounded-xl shadow-apple-subtle">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full apple-btn-primary py-3 text-sm font-semibold rounded-2xl shadow-apple-subtle disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Akun...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Sistem IRIS</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Credentials Bar */}
      <div className="mt-7 pt-5 border-t border-black/[0.06]">
        <p className="text-[11px] font-semibold text-slate-500 mb-2.5 text-center tracking-tight">
          Pilih Akun Cepat (Testing / Demo):
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setDemoAccount("superadmin")}
            className="p-2 text-left rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">Super Admin</div>
            <div className="text-[10px] font-mono text-slate-500">superadmin</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount("kasir_pwt")}
            className="p-2 text-left rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">Kasir Purwokerto</div>
            <div className="text-[10px] font-mono text-emerald-800/60">kasir_pwt</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount("cekmata_pwt")}
            className="p-2 text-left rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">Cek Mata Purwokerto</div>
            <div className="text-[10px] font-mono text-emerald-800/60">cekmata_pwt</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount("faset_pusat")}
            className="p-2 text-left rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">Faset (Lt 2)</div>
            <div className="text-[10px] font-mono text-emerald-800/60">faset_pusat</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount("cs_pusat")}
            className="p-2 text-left rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">CS Notifikasi</div>
            <div className="text-[10px] font-mono text-emerald-800/60">cs_pusat</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount("aftersales_pusat")}
            className="p-2 text-left rounded-xl bg-emerald-500/[0.08] hover:bg-emerald-500/[0.14] border border-emerald-600/20 transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">After Sales</div>
            <div className="text-[10px] font-mono text-emerald-800">aftersales_pusat</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount("gudang_pusat")}
            className="p-2 text-left rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] transition-all duration-150 active:scale-[0.97] cursor-pointer col-span-2 text-center"
          >
            <div className="font-semibold text-emerald-950 tracking-tight">Gudang Lensa</div>
            <div className="text-[10px] font-mono text-emerald-800/60">gudang_pusat</div>
          </button>
        </div>
        <p className="text-[11px] text-center text-emerald-900/50 mt-3 font-mono">
          Default password: <code className="font-bold text-emerald-950">password123</code>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
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
          <div className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-apple-subtle">
            IRIS — I See You Retail & Information System
          </div>
        </div>

        {/* Login Card wrapped in Suspense */}
        <Suspense fallback={<div className="apple-glass p-8 text-center rounded-3xl">Memuat formulir login...</div>}>
          <LoginForm />
        </Suspense>

        {/* Public Links Footer */}
        <div className="mt-6 text-center space-x-4 text-xs font-semibold text-emerald-900/60">
          <a
            href="/registrasi"
            className="hover:text-emerald-950 transition-colors"
          >
            Tablet Registrasi Customer
          </a>
          <span>•</span>
          <a
            href="/display/purwokerto"
            className="hover:text-emerald-950 transition-colors"
          >
            Layar Smart TV Purwokerto
          </a>
        </div>
      </div>
    </div>
  );
}

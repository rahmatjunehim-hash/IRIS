"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  Glasses,
  UserPlus,
  CheckCircle2,
  Lock,
  Plus,
  Tv,
  ClipboardList,
} from "lucide-react";
import { ROLE_NAMES, UserRole } from "@/lib/constants";

interface UserItem {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  cabangName: string;
  isActive: boolean;
}

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "USERS" | "CABANG">("OVERVIEW");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Users State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Form Tambah User
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("password123");
  const [newRole, setNewRole] = useState<UserRole>("KASIR");
  const [newCabang, setNewCabang] = useState("Purwokerto");
  const [submittingUser, setSubmittingUser] = useState(false);

  async function loadUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } finally {
      setLoadingUsers(false);
    }
  }

  React.useEffect(() => {
    loadUsers();
  }, []);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingUser(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          username: newUsername,
          password: newPassword || "password123",
          role: newRole,
          cabangName: newRole === "SUPER_ADMIN" || newRole === "FASET" || newRole === "CS" || newRole === "AFTER_SALES" || newRole === "GUDANG" ? "Pusat" : newCabang,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(`Akun staff baru "${newName}" (@${newUsername.toLowerCase().trim()}) berhasil ditambahkan dan langsung aktif.`);
        setShowAddModal(false);
        setNewName("");
        setNewUsername("");
        setNewPassword("password123");
        await loadUsers();
      } else {
        setFeedback(`Gagal: ${data.error || "Gagal membuat akun"}`);
      }
    } finally {
      setSubmittingUser(false);
    }
  }

  async function handleToggleUser(userId: string) {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          isActive: !target.isActive,
        }),
      });

      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
        );
        setFeedback(`Status akun @${target.username} berhasil diubah.`);
      }
    } catch {
      setFeedback("Gagal memperbarui status akun.");
    }
  }

  async function handleDeleteUser(userId: string, username: string) {
    if (!confirm(`Hapus akun @${username}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        setFeedback(`Akun @${username} berhasil dihapus.`);
      }
    } catch {
      setFeedback("Gagal menghapus user.");
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner (Deep Emerald Luxury Glass Style) */}
      <div className="bg-gradient-to-br from-[#063826] via-[#04281b] to-[#021810] text-[#FDFBF7] rounded-3xl p-6 sm:p-8 shadow-apple-float border border-emerald-700/30 relative overflow-hidden">
        {/* Subtle Luxury Emerald Glow Accents */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-200 text-[11px] font-semibold mb-3 backdrop-blur-md shadow-apple-subtle">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Panel Kontrol Super Admin • Optik I See You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FDFBF7]">
              Manajemen Sistem & Hak Akses
            </h2>
            <p className="text-emerald-100/75 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
              Memonitor kelancaran alur operasional 4 cabang resmi: Purwokerto, Cilacap, Wonosobo, dan Purbalingga.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="apple-press px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-apple-subtle border border-emerald-400/30 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Akun Staff</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 shadow-apple-subtle animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}

      {/* Apple Segmented Control Tabs */}
      <div className="bg-[#064E3B]/[0.06] p-1 rounded-2xl flex items-center gap-1 w-fit border border-[#064E3B]/10">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`apple-press px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
            activeTab === "OVERVIEW"
              ? "bg-[#064E3B] text-white font-semibold shadow-apple-subtle"
              : "text-[#2C473A] hover:text-[#064E3B] font-medium"
          }`}
        >
          Ringkasan Sistem
        </button>
        <button
          onClick={() => setActiveTab("USERS")}
          className={`apple-press px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
            activeTab === "USERS"
              ? "bg-[#064E3B] text-white font-semibold shadow-apple-subtle"
              : "text-[#2C473A] hover:text-[#064E3B] font-medium"
          }`}
        >
          Daftar Pengguna <span className="font-mono tabular-nums opacity-75">({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("CABANG")}
          className={`apple-press px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
            activeTab === "CABANG"
              ? "bg-[#064E3B] text-white font-semibold shadow-apple-subtle"
              : "text-[#2C473A] hover:text-[#064E3B] font-medium"
          }`}
        >
          4 Cabang Resmi
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-[#064E3B]/10 shadow-apple-card">
              <span className="text-[11px] font-semibold text-[#6B8579] uppercase tracking-wider">Cabang Resmi</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-[#0B1E16] font-mono tabular-nums">4</span>
                <span className="text-xs text-[#3B5448] font-medium">Purwokerto, Cilacap, Wonosobo, Purbalingga</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-[#064E3B]/10 shadow-apple-card">
              <span className="text-[11px] font-semibold text-[#6B8579] uppercase tracking-wider">Akun Pengguna</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-[#0B1E16] font-mono tabular-nums">{users.length}</span>
                <span className="text-xs text-[#3B5448] font-medium">7 Role Operasional</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-[#064E3B]/10 shadow-apple-card">
              <span className="text-[11px] font-semibold text-[#6B8579] uppercase tracking-wider">Status Modul</span>
              <div className="mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-900">Step 1 s/d 9 Lengkap</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-[#064E3B]/10 shadow-apple-card">
              <span className="text-[11px] font-semibold text-[#6B8579] uppercase tracking-wider">WhatsApp Gateway</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#0B1E16]">Fonnte</span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">Aktif</span>
              </div>
            </div>
          </div>

          {/* Quick Access to Public Pages */}
          <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-[#064E3B]/10 shadow-apple-card">
            <h3 className="font-bold tracking-tight text-[#0B1E16] text-base mb-4">
              Tautan Layar Publik Per Cabang (Smart TV & Tablet)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { name: "Purwokerto", slug: "purwokerto" },
                { name: "Cilacap", slug: "cilacap" },
                { name: "Wonosobo", slug: "wonosobo" },
                { name: "Purbalingga", slug: "purbalingga" },
              ].map((c) => (
                <div key={c.slug} className="p-4 rounded-2xl bg-[#064E3B]/[0.02] border border-[#064E3B]/10 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-sm text-[#0B1E16]">
                    <span>Cabang {c.name}</span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                      Aktif
                    </span>
                  </div>
                  <div className="pt-2 flex flex-col gap-1.5 text-xs">
                    <a
                      href={`/display/${c.slug}`}
                      target="_blank"
                      className="apple-press inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-medium"
                    >
                      <Tv className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Smart TV Antrian {c.name}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === "USERS" && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/60 shadow-apple-card overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold tracking-tight text-slate-900 text-base">
              Daftar Pengguna Sistem IRIS
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="apple-press py-1.5 px-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs flex items-center gap-1.5 shadow-apple-subtle transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-200" /> Tambah User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#064E3B]/10 text-[#6B8579] uppercase tracking-wider text-[11px] font-semibold">
                  <th className="pb-3 px-3">Nama Pengguna</th>
                  <th className="pb-3 px-3">Username</th>
                  <th className="pb-3 px-3">Role Akses</th>
                  <th className="pb-3 px-3">Penugasan Cabang</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#064E3B]/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#064E3B]/[0.03] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#0B1E16]">{u.name}</td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-[#3B5448]">@{u.username}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                        {ROLE_NAMES[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#2D473B]">{u.cabangName}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          u.isActive
                            ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-800 border border-rose-500/20"
                        }`}
                      >
                        {u.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {u.role !== "SUPER_ADMIN" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleUser(u.id)}
                            className={`apple-press text-[11px] font-medium px-2.5 py-1 rounded-xl transition cursor-pointer ${
                              u.isActive
                                ? "text-rose-700 hover:bg-rose-50"
                                : "text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="apple-press text-[11px] font-medium px-2 py-1 rounded-xl text-[#82998E] hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus akun"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cabang */}
      {activeTab === "CABANG" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              nama: "Purwokerto",
              kode: "PWT",
              alamat: "Jl. Jend. Soedirman, Purwokerto, Jawa Tengah",
              telepon: "081234567890",
              slug: "purwokerto",
            },
            {
              nama: "Cilacap",
              kode: "CLP",
              alamat: "Jl. Gatot Subroto, Cilacap, Jawa Tengah",
              telepon: "081234567891",
              slug: "cilacap",
            },
            {
              nama: "Wonosobo",
              kode: "WSB",
              alamat: "Jl. Ahmad Yani, Wonosobo, Jawa Tengah",
              telepon: "081234567892",
              slug: "wonosobo",
            },
            {
              nama: "Purbalingga",
              kode: "PBG",
              alamat: "Jl. MT Haryono, Purbalingga, Jawa Tengah",
              telepon: "081234567893",
              slug: "purbalingga",
            },
          ].map((c) => (
            <div key={c.kode} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#064E3B]/10 shadow-apple-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#064E3B]/10 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm font-mono tabular-nums shadow-apple-subtle">
                    {c.kode}
                  </div>
                  <div>
                    <h3 className="font-bold tracking-tight text-[#0B1E16] text-base">
                      Optik I See You — {c.nama}
                    </h3>
                    <p className="text-[11px] text-[#6B8579] font-mono">Kode Cabang: {c.kode}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                  Operasional Aktif
                </span>
              </div>

              <div className="text-xs text-[#3B5448] space-y-1.5 font-normal">
                <p><strong className="text-[#0B1E16] font-semibold">Alamat:</strong> {c.alamat}</p>
                <p><strong className="text-[#0B1E16] font-semibold">Telepon / WA:</strong> <span className="font-mono tabular-nums">{c.telepon}</span></p>
              </div>

              <div className="pt-2.5 border-t border-[#064E3B]/10 flex items-center gap-3 text-xs">
                <a
                  href={`/display/${c.slug}`}
                  target="_blank"
                  className="apple-press py-1.5 px-3.5 rounded-xl bg-[#064E3B]/[0.05] text-[#133E2B] hover:bg-[#064E3B]/10 border border-[#064E3B]/10 transition font-medium flex items-center gap-1.5"
                >
                  <Tv className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Buka Layar TV</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah User (Apple Sheet Style) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#064E3B]/15 shadow-apple-float space-y-5">
            <h3 className="font-bold tracking-tight text-[#0B1E16] text-base">
              Tambah Akun Staff / Admin Baru
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#2D473B] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-2.5 text-xs bg-black/[0.02] border border-[#064E3B]/15 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D473B] mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Contoh: kasir_wsb2"
                  className="w-full p-2.5 text-xs bg-black/[0.02] border border-[#064E3B]/15 rounded-2xl font-mono tabular-nums focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D473B] mb-1.5">
                  Password Akun
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Default: password123"
                  className="w-full p-2.5 text-xs bg-black/[0.02] border border-[#064E3B]/15 rounded-2xl font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                />
                <span className="text-[10px] text-[#6B8579] mt-1 block">Default jika dikosongkan: password123</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D473B] mb-1.5">
                  Role Akses
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2.5 text-xs bg-black/[0.02] border border-[#064E3B]/15 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                >
                  <option value="KASIR">Kasir Cabang</option>
                  <option value="CEK_MATA">Cek Mata (Refraksi)</option>
                  <option value="FASET">Teknisi Faset (Lantai 2)</option>
                  <option value="CS">Customer Service</option>
                  <option value="AFTER_SALES">After Sales</option>
                  <option value="GUDANG">Gudang Lensa</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D473B] mb-1.5">
                  Penugasan Cabang
                </label>
                <select
                  value={newCabang}
                  onChange={(e) => setNewCabang(e.target.value)}
                  className="w-full p-2.5 text-xs bg-black/[0.02] border border-[#064E3B]/15 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
                >
                  <option value="Purwokerto">Purwokerto</option>
                  <option value="Cilacap">Cilacap</option>
                  <option value="Wonosobo">Wonosobo</option>
                  <option value="Purbalingga">Purbalingga</option>
                  <option value="Pusat">Pusat / Semua Cabang</option>
                </select>
              </div>

              <div className="pt-3.5 border-t border-[#064E3B]/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="apple-press py-2 px-4 rounded-2xl border border-[#064E3B]/15 text-[#2D473B] text-xs font-medium hover:bg-[#064E3B]/[0.04] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="apple-press py-2 px-4 rounded-2xl bg-[#064E3B] hover:bg-[#043e2d] text-white text-xs font-medium shadow-apple-subtle transition cursor-pointer"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

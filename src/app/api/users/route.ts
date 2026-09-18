import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { UserRole } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const users = DataStore.getUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, password, role, cabangName } = body;

    if (!name || !username || !role) {
      return NextResponse.json(
        { error: "Nama, username, dan role wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = DataStore.findUserByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json(
        { error: `Username @${cleanUsername} sudah digunakan.` },
        { status: 400 }
      );
    }

    const cabangMap: Record<string, { id: string; kode: string }> = {
      Purwokerto: { id: "cab_pwt", kode: "PWT" },
      Cilacap: { id: "cab_clp", kode: "CLP" },
      Wonosobo: { id: "cab_wsb", kode: "WSB" },
      Purbalingga: { id: "cab_pbg", kode: "PBG" },
      Pusat: { id: "hq", kode: "HQ" },
    };

    const cInfo = cabangMap[cabangName] || { id: "hq", kode: "HQ" };

    const newUser = DataStore.addUser({
      name: name.trim(),
      username: cleanUsername,
      password: password || "password123",
      email: `${cleanUsername}@optikiseeyou.com`,
      role: role as UserRole,
      cabangId: cInfo.id === "hq" ? null : cInfo.id,
      cabangName: cabangName || "Pusat",
      cabangKode: cInfo.kode,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: `Akun @${cleanUsername} berhasil dibuat.`,
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menambahkan akun user baru" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID user wajib disertakan." },
        { status: 400 }
      );
    }

    const updated = DataStore.updateUser(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data user berhasil diperbarui.",
      user: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID user wajib disertakan." },
        { status: 400 }
      );
    }

    const ok = DataStore.deleteUser(id);
    if (!ok) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}

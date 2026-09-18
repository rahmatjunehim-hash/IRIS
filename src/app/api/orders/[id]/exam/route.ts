import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const order = DataStore.saveEyeExam(id, body);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Resep pemeriksaan mata berhasil disimpan dan diteruskan ke Kasir.",
      order,
    });
  } catch (error) {
    console.error("Error saving eye exam:", error);
    return NextResponse.json({ error: "Gagal menyimpan resep pemeriksaan" }, { status: 500 });
  }
}

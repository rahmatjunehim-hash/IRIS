import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const order = DataStore.editOrderAfterSales(id, body);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Data pesanan dan resep berhasil diperbarui oleh After Sales.",
      order,
    });
  } catch (error) {
    console.error("Error editing order after sales:", error);
    return NextResponse.json({ error: "Gagal memperbarui data order" }, { status: 500 });
  }
}

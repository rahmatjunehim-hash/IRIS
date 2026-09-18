import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = DataStore.callQueue(id);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Antrian nomor ${order.noAntrian} (${order.customer.nama}) berhasil dipanggil.`,
      order,
    });
  } catch (error) {
    console.error("Error calling queue:", error);
    return NextResponse.json({ error: "Gagal memanggil antrian" }, { status: 500 });
  }
}

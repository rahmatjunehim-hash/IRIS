import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { jenisLensa, frameModel, frameColor, catatanFrame, catatanKasir, noPosStruk, statusFaset } = body;

    if (!statusFaset || (statusFaset !== "PENDING" && statusFaset !== "PROSES")) {
      return NextResponse.json(
        { error: "Status faset wajib ditentukan oleh kasir: PENDING atau PROSES." },
        { status: 400 }
      );
    }

    const order = DataStore.confirmKasirOrder(id, {
      jenisLensa,
      frameModel,
      frameColor,
      catatanFrame,
      catatanKasir,
      noPosStruk,
      statusFaset,
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Pesanan berhasil diteruskan ke Faset dengan status ${statusFaset}.`,
      order,
    });
  } catch (error) {
    console.error("Error confirming kasir order:", error);
    return NextResponse.json({ error: "Gagal memproses pesanan kasir" }, { status: 500 });
  }
}

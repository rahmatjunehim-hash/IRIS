import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { statusFaset, catatanTeknisi } = body;

    if (!statusFaset || !["PENDING", "PROSES", "SELESAI"].includes(statusFaset)) {
      return NextResponse.json(
        { error: "Status faset tidak valid. Pilih: PENDING, PROSES, atau SELESAI." },
        { status: 400 }
      );
    }

    const { order, notifResult } = await DataStore.updateFasetProgress(
      id,
      statusFaset,
      catatanTeknisi
    );

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message:
        statusFaset === "SELESAI"
          ? `Pesanan telah diselesaikan. ${notifResult?.message || "Notifikasi WA dikirimkan ke pelanggan."}`
          : `Status pengerjaan faset diperbarui ke ${statusFaset}.`,
      order,
      notifResult,
    });
  } catch (error) {
    console.error("Error updating faset progress:", error);
    return NextResponse.json({ error: "Gagal memperbarui progres faset" }, { status: 500 });
  }
}

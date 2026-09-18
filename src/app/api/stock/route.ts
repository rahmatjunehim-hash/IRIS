import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cabang = searchParams.get("cabang");
    const stock = DataStore.getLensStock(cabang);
    const pendingOrders = DataStore.getPendingOrders();

    return NextResponse.json({ stock, pendingOrders });
  } catch (error) {
    console.error("Error getting stock:", error);
    return NextResponse.json({ error: "Gagal mengambil data stok gudang" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { stockId } = await req.json();
    if (!stockId) {
      return NextResponse.json({ error: "Stock ID wajib diisi" }, { status: 400 });
    }

    const success = DataStore.markStockAsOrdered(stockId);
    return NextResponse.json({
      success,
      message: success ? "Stok berhasil ditandai 'Sudah Diorder'." : "Gagal menandai stok.",
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json({ error: "Gagal memperbarui status order stok" }, { status: 500 });
  }
}

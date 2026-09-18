import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cabang: string }> }
) {
  try {
    const { cabang } = await params;
    const cabangItem = DataStore.getCabangByKode(cabang) || DataStore.getCabangList()[0];

    const branchOrders = DataStore.getOrders(cabangItem.id);

    // Current called customer
    const currentCalled = branchOrders.find((o) => o.statusAntrian === "DIPANGGIL") || null;

    // Upcoming queue (up to 3)
    const upcomingQueue = branchOrders
      .filter((o) => o.statusAntrian === "MENUNGGU")
      .slice(0, 3)
      .map((o) => ({
        id: o.id,
        noAntrian: o.noAntrian,
        nama: o.customer.nama,
      }));

    return NextResponse.json({
      branch: cabangItem,
      currentCalled: currentCalled
        ? {
            id: currentCalled.id,
            noAntrian: currentCalled.noAntrian,
            nama: currentCalled.customer.nama,
            dipanggilAt: currentCalled.dipanggilAt,
          }
        : null,
      upcomingQueue,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting display queue:", error);
    return NextResponse.json({ error: "Gagal mengambil data antrian display" }, { status: 500 });
  }
}

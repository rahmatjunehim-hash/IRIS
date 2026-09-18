import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cabang = searchParams.get("cabang");
    const orders = DataStore.getOrders(cabang);

    return NextResponse.json(
      { orders },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error getting orders:", error);
    return NextResponse.json({ error: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cabangId, nama, noWa, alamat, tanggalLahir, jenisKelamin, jenisLensa, frameModel } = body;

    if (!cabangId || !nama || !noWa || !alamat) {
      return NextResponse.json(
        { error: "Cabang, Nama, No WhatsApp, dan Alamat wajib diisi." },
        { status: 400 }
      );
    }

    const order = DataStore.createCustomerRegistration({
      cabangId,
      nama,
      noWa,
      alamat,
      tanggalLahir,
      jenisKelamin,
      jenisLensa,
      frameModel,
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil.",
      order,
    });
  } catch (error) {
    console.error("Error creating customer registration:", error);
    return NextResponse.json({ error: "Gagal memproses pendaftaran customer" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const notifications = DataStore.getNotifications();
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return NextResponse.json({ error: "Gagal mengambil log notifikasi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { notificationId } = await req.json();
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID wajib diisi" }, { status: 400 });
    }

    const success = await DataStore.resendNotification(notificationId);
    return NextResponse.json({
      success,
      message: success ? "Pesan WhatsApp berhasil dikirim ulang." : "Gagal mengirim ulang pesan WhatsApp.",
    });
  } catch (error) {
    console.error("Error resending notification:", error);
    return NextResponse.json({ error: "Gagal mengirim ulang notifikasi" }, { status: 500 });
  }
}

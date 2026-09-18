import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    DataStore.clearAllOrders();
    return NextResponse.json({
      success: true,
      message: 'Semua data antrian telah di-reset menjadi kosong (Mulai dari #001).',
    });
  } catch (error) {
    console.error('Error resetting orders:', error);
    return NextResponse.json({ error: 'Gagal me-reset antrian' }, { status: 500 });
  }
}

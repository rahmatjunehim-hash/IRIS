import { prisma } from "./prisma";
import { sendWhatsAppMessage, buildOrderPickupMessage } from "./fonnte";
import { UserRole } from "./constants";

export interface UserStoreItem {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  cabangId: string | null;
  cabangName: string;
  cabangKode: string;
  isActive: boolean;
  createdAt: string;
}

export interface CabangItem {
  id: string;
  kode: string;
  nama: string;
  alamat?: string | null;
  telepon?: string | null;
  isActive: boolean;
}

export interface CustomerItem {
  id: string;
  nama: string;
  noWa: string;
  alamat: string;
  tanggalLahir?: string | null;
  jenisKelamin?: string | null;
  createdAt: string;
}

export interface EyeExamItem {
  id: string;
  orderId: string;
  customerId: string;
  examinerId?: string | null;
  cabangId: string;
  sphR?: string | null;
  cylR?: string | null;
  axisR?: string | null;
  addR?: string | null;
  pdR?: string | null;
  sphL?: string | null;
  cylL?: string | null;
  axisL?: string | null;
  addL?: string | null;
  pdL?: string | null;
  pdTotal?: string | null;
  catatan?: string | null;
  createdAt: string;
}

export interface OrderFasetItem {
  id: string;
  orderId: string;
  statusFaset: "PENDING" | "PROSES" | "SELESAI";
  teknisiId?: string | null;
  catatanTeknisi?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface OrderItem {
  id: string;
  noAntrian: number;
  tanggalAntrian: string;
  customerId: string;
  cabangId: string;
  cabangKode: string;
  cabangNama: string;
  frameModel?: string | null;
  frameColor?: string | null;
  jenisLensa?: string | null;
  catatanFrame?: string | null;
  catatanKasir?: string | null;
  noPosStruk?: string | null; // Referensi POS luar (tanpa harga)
  status:
    | "MENUNGGU_CEK_MATA"
    | "SEDANG_DIPERIKSA"
    | "MENUNGGU_TRANSAKSI"
    | "DALAM_FASET"
    | "SIAP_DIAMBIL"
    | "SELESAI";
  statusAntrian: "MENUNGGU" | "DIPANGGIL" | "SELESAI";
  dipanggilAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: CustomerItem;
  eyeExam?: EyeExamItem | null;
  orderFaset?: OrderFasetItem | null;
}

export interface LensStockItem {
  id: string;
  cabangId: string;
  cabangKode: string;
  cabangNama: string;
  jenisLensa: string;
  sph?: string | null;
  cyl?: string | null;
  stockQty: number;
  minStock: number;
  isOrdered?: boolean;
}

export interface NotificationItem {
  id: string;
  orderId: string;
  customerNama: string;
  noWa: string;
  pesan: string;
  status: "SENT" | "PENDING" | "FAILED";
  sentAt?: string | null;
  fonnteId?: string | null;
}

// In-Memory Fallback State (Digunakan jika database PostgreSQL belum dinyalakan di local dev)
const CABANG_LIST: CabangItem[] = [
  { id: "cab_pwt", kode: "PWT", nama: "Purwokerto", alamat: "Jl. Jend. Soedirman, Purwokerto", telepon: "081234567890", isActive: true },
  { id: "cab_clp", kode: "CLP", nama: "Cilacap", alamat: "Jl. Gatot Subroto, Cilacap", telepon: "081234567891", isActive: true },
  { id: "cab_wsb", kode: "WSB", nama: "Wonosobo", alamat: "Jl. Ahmad Yani, Wonosobo", telepon: "081234567892", isActive: true },
  { id: "cab_pbg", kode: "PBG", nama: "Purbalingga", alamat: "Jl. MT Haryono, Purbalingga", telepon: "081234567893", isActive: true },
];

// Global singleton storage across all Next.js API route compilation bundles
const INITIAL_STOCK: LensStockItem[] = [
  // Purwokerto
  { id: "stk_pwt_1", cabangId: "cab_pwt", cabangKode: "PWT", cabangNama: "Purwokerto", jenisLensa: "Single Vision CRMC", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 24, minStock: 10 },
  { id: "stk_pwt_2", cabangId: "cab_pwt", cabangKode: "PWT", cabangNama: "Purwokerto", jenisLensa: "Single Vision Blue Ray", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 18, minStock: 10 },
  { id: "stk_pwt_3", cabangId: "cab_pwt", cabangKode: "PWT", cabangNama: "Purwokerto", jenisLensa: "Single Vision Photochromic", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 12, minStock: 8 },
  { id: "stk_pwt_4", cabangId: "cab_pwt", cabangKode: "PWT", cabangNama: "Purwokerto", jenisLensa: "Single Vision Bluechromic", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 6, minStock: 8 },
  { id: "stk_pwt_5", cabangId: "cab_pwt", cabangKode: "PWT", cabangNama: "Purwokerto", jenisLensa: "Progressive Standar", sph: "+0.50 s/d +3.00", cyl: "0", stockQty: 4, minStock: 5 },
  // Cilacap
  { id: "stk_clp_1", cabangId: "cab_clp", cabangKode: "CLP", cabangNama: "Cilacap", jenisLensa: "Single Vision CRMC", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 15, minStock: 10 },
  { id: "stk_clp_2", cabangId: "cab_clp", cabangKode: "CLP", cabangNama: "Cilacap", jenisLensa: "Single Vision Blue Ray", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 3, minStock: 10, isOrdered: true },
  { id: "stk_clp_3", cabangId: "cab_clp", cabangKode: "CLP", cabangNama: "Cilacap", jenisLensa: "Single Vision Photochromic", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 9, minStock: 8 },
  // Wonosobo
  { id: "stk_wsb_1", cabangId: "cab_wsb", cabangKode: "WSB", cabangNama: "Wonosobo", jenisLensa: "Single Vision CRMC", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 20, minStock: 10 },
  { id: "stk_wsb_2", cabangId: "cab_wsb", cabangKode: "WSB", cabangNama: "Wonosobo", jenisLensa: "Single Vision Blue Ray", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 11, minStock: 10 },
  // Purbalingga
  { id: "stk_pbg_1", cabangId: "cab_pbg", cabangKode: "PBG", cabangNama: "Purbalingga", jenisLensa: "Single Vision CRMC", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 14, minStock: 10 },
  { id: "stk_pbg_2", cabangId: "cab_pbg", cabangKode: "PBG", cabangNama: "Purbalingga", jenisLensa: "Single Vision Bluechromic", sph: "0 s/d -4.00", cyl: "0 s/d -2.00", stockQty: 5, minStock: 8 },
];

const INITIAL_USERS: UserStoreItem[] = [
  { id: "usr_superadmin", name: "Super Admin IRIS", username: "superadmin", email: "superadmin@optikiseeyou.com", role: "SUPER_ADMIN", cabangId: null, cabangName: "Semua Cabang (Pusat)", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_admin1", name: "Super Admin 1", username: "admin1", email: "admin1@optikiseeyou.com", role: "SUPER_ADMIN", cabangId: null, cabangName: "Semua Cabang (Pusat)", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_admin2", name: "Super Admin 2", username: "admin2", email: "admin2@optikiseeyou.com", role: "SUPER_ADMIN", cabangId: null, cabangName: "Semua Cabang (Pusat)", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_kasir_pwt", name: "Kasir Purwokerto", username: "kasir_pwt", email: "kasir.pwt@optikiseeyou.com", role: "KASIR", cabangId: "cab_pwt", cabangName: "Purwokerto", cabangKode: "PWT", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_cekmata_pwt", name: "Optometris Purwokerto", username: "cekmata_pwt", email: "cekmata.pwt@optikiseeyou.com", role: "CEK_MATA", cabangId: "cab_pwt", cabangName: "Purwokerto", cabangKode: "PWT", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_kasir_clp", name: "Kasir Cilacap", username: "kasir_clp", email: "kasir.clp@optikiseeyou.com", role: "KASIR", cabangId: "cab_clp", cabangName: "Cilacap", cabangKode: "CLP", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_cekmata_clp", name: "Optometris Cilacap", username: "cekmata_clp", email: "cekmata.clp@optikiseeyou.com", role: "CEK_MATA", cabangId: "cab_clp", cabangName: "Cilacap", cabangKode: "CLP", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_kasir_wsb", name: "Kasir Wonosobo", username: "kasir_wsb", email: "kasir.wsb@optikiseeyou.com", role: "KASIR", cabangId: "cab_wsb", cabangName: "Wonosobo", cabangKode: "WSB", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_cekmata_wsb", name: "Optometris Wonosobo", username: "cekmata_wsb", email: "cekmata.wsb@optikiseeyou.com", role: "CEK_MATA", cabangId: "cab_wsb", cabangName: "Wonosobo", cabangKode: "WSB", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_kasir_pbg", name: "Kasir Purbalingga", username: "kasir_pbg", email: "kasir.pbg@optikiseeyou.com", role: "KASIR", cabangId: "cab_pbg", cabangName: "Purbalingga", cabangKode: "PBG", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_cekmata_pbg", name: "Optometris Purbalingga", username: "cekmata_pbg", email: "cekmata.pbg@optikiseeyou.com", role: "CEK_MATA", cabangId: "cab_pbg", cabangName: "Purbalingga", cabangKode: "PBG", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_faset_pusat", name: "Teknisi Faset Pusat", username: "faset_pusat", email: "faset@optikiseeyou.com", role: "FASET", cabangId: null, cabangName: "Pusat (Lantai 2)", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_cs_pusat", name: "Customer Service", username: "cs_pusat", email: "cs@optikiseeyou.com", role: "CS", cabangId: null, cabangName: "Pusat", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_aftersales_pusat", name: "Staff After Sales", username: "aftersales_pusat", email: "aftersales@optikiseeyou.com", role: "AFTER_SALES", cabangId: null, cabangName: "Lintas 4 Cabang", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
  { id: "usr_gudang_pusat", name: "Staff Gudang Lensa", username: "gudang_pusat", email: "gudang@optikiseeyou.com", role: "GUDANG", cabangId: null, cabangName: "Pusat", cabangKode: "HQ", isActive: true, createdAt: new Date().toISOString() },
];

const globalForIris = globalThis as unknown as {
  IRIS_ORDERS?: OrderItem[];
  IRIS_NOTIFICATIONS?: NotificationItem[];
  IRIS_STOCK?: LensStockItem[];
  IRIS_USERS?: UserStoreItem[];
};

if (!globalForIris.IRIS_ORDERS) {
  globalForIris.IRIS_ORDERS = [];
}
if (!globalForIris.IRIS_NOTIFICATIONS) {
  globalForIris.IRIS_NOTIFICATIONS = [];
}
if (!globalForIris.IRIS_STOCK) {
  globalForIris.IRIS_STOCK = [...INITIAL_STOCK];
}
if (!globalForIris.IRIS_USERS) {
  globalForIris.IRIS_USERS = [...INITIAL_USERS];
}

function getOrders(): OrderItem[] {
  if (!globalForIris.IRIS_ORDERS) globalForIris.IRIS_ORDERS = [];
  return globalForIris.IRIS_ORDERS;
}

function getNotifications(): NotificationItem[] {
  if (!globalForIris.IRIS_NOTIFICATIONS) globalForIris.IRIS_NOTIFICATIONS = [];
  return globalForIris.IRIS_NOTIFICATIONS;
}

function getStock(): LensStockItem[] {
  if (!globalForIris.IRIS_STOCK) globalForIris.IRIS_STOCK = [...INITIAL_STOCK];
  return globalForIris.IRIS_STOCK;
}

function getUsersList(): UserStoreItem[] {
  if (!globalForIris.IRIS_USERS) globalForIris.IRIS_USERS = [...INITIAL_USERS];
  return globalForIris.IRIS_USERS;
}

export const DataStore = {
  getCabangList(): CabangItem[] {
    return CABANG_LIST;
  },

  getCabangByKode(kode: string): CabangItem | undefined {
    return CABANG_LIST.find((c) => c.kode.toLowerCase() === kode.toLowerCase() || c.nama.toLowerCase() === kode.toLowerCase());
  },

  getOrders(cabangId?: string | null): OrderItem[] {
    const allOrders = getOrders();
    if (
      !cabangId ||
      cabangId === "all" ||
      cabangId.toLowerCase() === "hq" ||
      cabangId.toLowerCase() === "pusat"
    ) {
      return [...allOrders];
    }
    return allOrders.filter(
      (o) =>
        o.cabangId === cabangId ||
        o.cabangKode.toLowerCase() === cabangId.toLowerCase() ||
        o.cabangNama.toLowerCase() === cabangId.toLowerCase()
    );
  },

  getOrderById(orderId: string): OrderItem | undefined {
    return getOrders().find((o) => o.id === orderId);
  },

  // Step 2: Registrasi customer baru dari tablet
  createCustomerRegistration(data: {
    cabangId: string;
    nama: string;
    noWa: string;
    alamat: string;
    tanggalLahir?: string;
    jenisKelamin?: string;
    jenisLensa?: string;
    frameModel?: string;
  }): OrderItem {
    const cabang = CABANG_LIST.find((c) => c.id === data.cabangId || c.kode === data.cabangId) || CABANG_LIST[0];
    const today = new Date().toISOString().split("T")[0];
    
    const allOrders = getOrders();
    // Hitung nomor antrian harian untuk cabang tersebut
    const existingBranchOrdersToday = allOrders.filter(
      (o) => o.cabangId === cabang.id && o.tanggalAntrian === today
    );
    const nextQueueNumber = existingBranchOrdersToday.length + 1;

    const customerId = "cust_" + Date.now();
    const orderId = "ord_" + Date.now();

    const newCustomer: CustomerItem = {
      id: customerId,
      nama: data.nama.trim(),
      noWa: data.noWa.trim(),
      alamat: data.alamat.trim(),
      tanggalLahir: data.tanggalLahir || null,
      jenisKelamin: data.jenisKelamin || null,
      createdAt: new Date().toISOString(),
    };

    const newOrder: OrderItem = {
      id: orderId,
      noAntrian: nextQueueNumber,
      tanggalAntrian: today,
      customerId,
      cabangId: cabang.id,
      cabangKode: cabang.kode,
      cabangNama: cabang.nama,
      frameModel: data.frameModel || "Frame Pilihan Customer",
      jenisLensa: data.jenisLensa || "Single Vision Standar",
      status: "MENUNGGU_CEK_MATA",
      statusAntrian: "MENUNGGU",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: newCustomer,
    };

    allOrders.unshift(newOrder);
    return newOrder;
  },

  // Step 3: Cek Mata panggil antrian (terhubung ke Smart TV)
  callQueue(orderId: string): OrderItem | null {
    const allOrders = getOrders();
    const order = allOrders.find((o) => o.id === orderId);
    if (!order) return null;

    // Reset status order yang sedang dipanggil sebelumnya di cabang yang sama
    allOrders.forEach((o) => {
      if (o.cabangId === order.cabangId && o.statusAntrian === "DIPANGGIL") {
        o.statusAntrian = "SELESAI";
      }
    });

    order.statusAntrian = "DIPANGGIL";
    order.status = "SEDANG_DIPERIKSA";
    order.dipanggilAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    return order;
  },

  // Step 3: Simpan resep rekam medis optometri & teruskan ke Kasir
  saveEyeExam(orderId: string, examData: Partial<EyeExamItem>): OrderItem | null {
    const order = getOrders().find((o) => o.id === orderId);
    if (!order) return null;

    const exam: EyeExamItem = {
      id: "exam_" + Date.now(),
      orderId,
      customerId: order.customerId,
      cabangId: order.cabangId,
      ...examData,
      createdAt: new Date().toISOString(),
    };

    order.eyeExam = exam;
    order.status = "MENUNGGU_TRANSAKSI";
    order.statusAntrian = "SELESAI";
    order.updatedAt = new Date().toISOString();
    return order;
  },

  // Step 4: Kasir konfirmasi pesanan (tanpa harga) & set status manual faset (PENDING / PROSES)
  confirmKasirOrder(
    orderId: string,
    data: {
      jenisLensa?: string;
      frameModel: string;
      frameColor?: string;
      catatanFrame?: string;
      catatanKasir?: string;
      noPosStruk?: string;
      statusFaset: "PENDING" | "PROSES"; // Diset manual oleh kasir
    }
  ): OrderItem | null {
    const order = getOrders().find((o) => o.id === orderId);
    if (!order) return null;

    if (data.jenisLensa) {
      order.jenisLensa = data.jenisLensa;
    }
    order.frameModel = data.frameModel || order.frameModel;
    order.frameColor = data.frameColor || order.frameColor;
    order.catatanFrame = data.catatanFrame || order.catatanFrame;
    order.catatanKasir = data.catatanKasir || order.catatanKasir;
    order.noPosStruk = data.noPosStruk || order.noPosStruk;
    order.status = "DALAM_FASET";
    order.updatedAt = new Date().toISOString();

    order.orderFaset = {
      id: "faset_" + Date.now(),
      orderId,
      statusFaset: data.statusFaset,
      catatanTeknisi: data.statusFaset === "PENDING" ? "Menunggu ketersediaan stok lensa" : "Siap diproses teknisi",
      startedAt: data.statusFaset === "PROSES" ? new Date().toISOString() : undefined,
    };

    return order;
  },

  // Step 5 & 6: Faset update progress (Pending -> Proses -> Selesai)
  async updateFasetProgress(
    orderId: string,
    statusFaset: "PENDING" | "PROSES" | "SELESAI",
    catatanTeknisi?: string
  ): Promise<{ order: OrderItem | null; notifResult?: { status: boolean; message: string } }> {
    const order = getOrders().find((o) => o.id === orderId);
    if (!order) return { order: null };

    if (!order.orderFaset) {
      order.orderFaset = {
        id: "faset_" + Date.now(),
        orderId,
        statusFaset,
        catatanTeknisi,
      };
    } else {
      order.orderFaset.statusFaset = statusFaset;
      if (catatanTeknisi) order.orderFaset.catatanTeknisi = catatanTeknisi;
    }

    if (statusFaset === "PROSES" && !order.orderFaset.startedAt) {
      order.orderFaset.startedAt = new Date().toISOString();
    }

    let notifResult: { status: boolean; message: string } | undefined;

    // Jika selesai -> otomatis siap diambil & picu WhatsApp Fonnte (Step 6)
    if (statusFaset === "SELESAI") {
      order.orderFaset.completedAt = new Date().toISOString();
      order.status = "SIAP_DIAMBIL";

      // Susun pesan WhatsApp lengkap dengan detail Frame, Lensa, Ukuran Resep (Minus/Plus/Cyl/Axis), dan Cabang
      const richMessage = buildOrderPickupMessage({
        customerName: order.customer.nama,
        cabangNama: order.cabangNama,
        frameModel: order.frameModel,
        frameColor: order.frameColor,
        jenisLensa: order.jenisLensa,
        eyeExam: order.eyeExam,
      });

      // Trigger Fonnte
      const waRes = await sendWhatsAppMessage(order.customer.noWa, order.customer.nama, richMessage);
      notifResult = { status: waRes.status, message: waRes.message };

      const notifItem: NotificationItem = {
        id: "notif_" + Date.now(),
        orderId: order.id,
        customerNama: order.customer.nama,
        noWa: order.customer.noWa,
        pesan: richMessage,
        status: waRes.status ? "SENT" : "FAILED",
        sentAt: new Date().toISOString(),
        fonnteId: waRes.responseId,
      };
      getNotifications().unshift(notifItem);
    }

    order.updatedAt = new Date().toISOString();
    return { order, notifResult };
  },

  // Step 7: After Sales edit dan koreksi data lintas cabang
  editOrderAfterSales(
    orderId: string,
    data: {
      nama?: string;
      noWa?: string;
      alamat?: string;
      frameModel?: string;
      catatanFrame?: string;
      sphR?: string;
      cylR?: string;
      axisR?: string;
      addR?: string;
      sphL?: string;
      cylL?: string;
      axisL?: string;
      addL?: string;
      catatanResep?: string;
    }
  ): OrderItem | null {
    const order = getOrders().find((o) => o.id === orderId);
    if (!order) return null;

    if (data.nama) order.customer.nama = data.nama;
    if (data.noWa) order.customer.noWa = data.noWa;
    if (data.alamat) order.customer.alamat = data.alamat;
    if (data.frameModel) order.frameModel = data.frameModel;
    if (data.catatanFrame) order.catatanFrame = data.catatanFrame;

    if (order.eyeExam) {
      if (data.sphR !== undefined) order.eyeExam.sphR = data.sphR;
      if (data.cylR !== undefined) order.eyeExam.cylR = data.cylR;
      if (data.axisR !== undefined) order.eyeExam.axisR = data.axisR;
      if (data.addR !== undefined) order.eyeExam.addR = data.addR;
      if (data.sphL !== undefined) order.eyeExam.sphL = data.sphL;
      if (data.cylL !== undefined) order.eyeExam.cylL = data.cylL;
      if (data.axisL !== undefined) order.eyeExam.axisL = data.axisL;
      if (data.addL !== undefined) order.eyeExam.addL = data.addL;
      if (data.catatanResep !== undefined) order.eyeExam.catatan = data.catatanResep;
    }

    order.updatedAt = new Date().toISOString();
    return order;
  },

  // Step 7: CS ambil notifikasi
  getNotifications(): NotificationItem[] {
    return [...getNotifications()];
  },

  async resendNotification(notificationId: string): Promise<boolean> {
    const item = getNotifications().find((n) => n.id === notificationId);
    if (!item) return false;

    const res = await sendWhatsAppMessage(item.noWa, item.customerNama);
    if (res.status) {
      item.status = "SENT";
      item.sentAt = new Date().toISOString();
      item.fonnteId = res.responseId;
      return true;
    }
    return false;
  },

  // Step 8: Gudang stok lensa per cabang & list pesanan pending
  getLensStock(cabangId?: string | null): LensStockItem[] {
    const allStock = getStock();
    if (!cabangId) return [...allStock];
    return allStock.filter((s) => s.cabangId === cabangId || s.cabangKode.toLowerCase() === cabangId.toLowerCase());
  },

  markStockAsOrdered(stockId: string): boolean {
    const item = getStock().find((s) => s.id === stockId);
    if (!item) return false;
    item.isOrdered = true;
    return true;
  },

  getPendingOrders(): OrderItem[] {
    return getOrders().filter(
      (o) => o.status === "DALAM_FASET" && o.orderFaset?.statusFaset === "PENDING"
    );
  },

  // Reset/Clear for clean testing
  clearAllOrders(): void {
    globalForIris.IRIS_ORDERS = [];
    globalForIris.IRIS_NOTIFICATIONS = [];
  },

  // Step 9: User Management (Super Admin)
  getUsers(): UserStoreItem[] {
    return [...getUsersList()];
  },

  findUserByUsername(username: string): UserStoreItem | undefined {
    const clean = username.trim().toLowerCase();
    return getUsersList().find((u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean);
  },

  addUser(user: Omit<UserStoreItem, "id" | "createdAt">): UserStoreItem {
    const list = getUsersList();
    const newUser: UserStoreItem = {
      ...user,
      id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    list.push(newUser);
    return newUser;
  },

  updateUser(id: string, updates: Partial<UserStoreItem>): UserStoreItem | null {
    const user = getUsersList().find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  },

  deleteUser(id: string): boolean {
    const list = getUsersList();
    const idx = list.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  },
};

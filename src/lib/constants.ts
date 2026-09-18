export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  KASIR: "KASIR",
  CEK_MATA: "CEK_MATA",
  FASET: "FASET",
  CS: "CS",
  AFTER_SALES: "AFTER_SALES",
  GUDANG: "GUDANG",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  KASIR: "Kasir Cabang",
  CEK_MATA: "Pemeriksaan Mata (Refraksi)",
  FASET: "Teknisi Faset (Lantai 2)",
  CS: "Customer Service (Notifikasi WA)",
  AFTER_SALES: "After Sales & Service",
  GUDANG: "Pengelola Stok Lensa",
};

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  KASIR: "/kasir",
  CEK_MATA: "/cek-mata",
  FASET: "/faset",
  CS: "/cs",
  AFTER_SALES: "/after-sales",
  GUDANG: "/gudang",
};

export const ROLE_ALLOWED_ROUTES: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    "/admin",
    "/kasir",
    "/cek-mata",
    "/faset",
    "/cs",
    "/after-sales",
    "/gudang",
  ],
  KASIR: ["/kasir"],
  CEK_MATA: ["/cek-mata"],
  FASET: ["/faset"],
  CS: ["/cs"],
  AFTER_SALES: ["/after-sales"],
  GUDANG: ["/gudang"],
};

export const ORDER_STATUS_LABELS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  MENUNGGU_CEK_MATA: {
    label: "Menunggu Cek Mata",
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  SEDANG_DIPERIKSA: {
    label: "Sedang Diperiksa",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  MENUNGGU_TRANSAKSI: {
    label: "Menunggu Transaksi Kasir",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  DALAM_FASET: {
    label: "Dalam Proses Faset",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  SIAP_DIAMBIL: {
    label: "Siap Diambil",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-300",
  },
  SELESAI: {
    label: "Selesai (Sudah Diambil)",
    bg: "bg-emerald-200",
    text: "text-emerald-950",
    border: "border-emerald-400",
  },
};

export const FASET_STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: {
    label: "Pending (Menunggu Stok)",
    bg: "bg-amber-100 text-amber-900 border-amber-300",
    text: "text-amber-900",
  },
  PROSES: {
    label: "Proses Pengerjaan",
    bg: "bg-emerald-800 text-white border-emerald-900",
    text: "text-white",
  },
  SELESAI: {
    label: "Selesai Faset",
    bg: "bg-emerald-600 text-white border-emerald-700",
    text: "text-white",
  },
};

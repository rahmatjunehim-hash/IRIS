# ANTI-AI SLOP: Engineering & Design Standard
> **Version:** 1.0.0  
> **Target:** Modern Web & Mobile Applications (Next.js, React, Tailwind CSS, TypeScript, Mobile/Web)  
> **Philosophy:** *Craft over boilerplate. Intentionality over automation. Substance over simulation.*

---

## 1. Pendahuluan & Definisi "AI Slop"
**"AI Slop"** adalah istilah untuk artefak digital (desain, kode, atau copywriting) yang dihasilkan oleh kecerdasan buatan secara generik, malas, dangkal, dan klise. AI Slop mudah dikenali dari ketiadaan konteks mendalam, estetika murahan bertema gradasi ungu neon/mesh acak, kode berulang tanpa arsitektur terarah, dan ketiadaan interaksi manusiawi yang taktil.

Dokumen ini adalah **pedoman baku dan aturan keras (hard rules)** yang wajib ditaati oleh pengembang dan AI coding assistant dalam merancang antarmuka, menulis kode, dan menyusun interaksi sistem.

---

## 2. Standar Desain Visual & UI (Visual Anti-Slop)

### ❌ HAL-HAL YANG DIHARAMKAN (Banned AI Tropes):
1. **Gradasi AI Klise**: Dilarang keras menggunakan background gradasi ungu-ke-pink neon (rom-purple-600 via-pink-500 to-indigo-600) atau efek "cyberpunk/ai glow" tanpa relevansi brand.
2. **Kartu Tanpa Karakter**: Dilarang membuat 3 kolom kartu putih polos yang masing-masing hanya berisi lingkaran pastel dengan ikon Lucide acak di tengahnya.
3. **Blob & Mesh Blur Acak**: Dilarang menaruh lingkaran blur acak semata-mata untuk mengisi ruang kosong tanpa hirarki pencahayaan yang logis.
4. **Metrik Halusinasi Tanpa Bukti**: Dilarang menaruh counter marketing generik seperti *"99.9% Uptime"*, *"10x Lebih Cepat"*, *"10.000+ Pengguna Puas"* jika tidak ada data nyata yang mendasarinya.
5. **Bayangan Kotor (Muddy Shadows)**: Dilarang memakai ox-shadow yang pekat, gelap, dan kotor.

### ✅ STANDAR KUALITAS APPLE / MODERN CRAFT:
1. **Bahan & Material Otentik (Glassmorphism & Vibrancy)**:
   - Gunakan material translucent (ackdrop-blur-xl, ackdrop-blur-md) dengan opasitas background terukur (g-white/80 di mode terang, g-stone-900/80 di mode gelap).
   - Tepi pembatas (border) harus ultra-halus (1px hairline border: order-black/[0.06] atau order-white/[0.1]), bukan border abu-abu tebal yang kaku.
2. **Tipografi Berhirarki & Proporsional**:
   - Gunakan ritme tipografi San Francisco (SF Pro style) atau font sans-serif berbobot teratur.
   - Judul utama: ont-semibold atau ont-bold dengan *kerning* rapat (	racking-tight).
   - Angka numerik, jam, antrian, dan kode stok: **wajib** menggunakan ont-mono tabular-nums agar angka tidak bergoyang saat nilainya bertambah.
   - Label kecil/kategori: 	ext-[11px] font-semibold uppercase tracking-wider text-slate-500.
3. **Kontrol Terpadu Bergaya Apple (Segmented Controls)**:
   - Filter tab tidak boleh berupa tab link garis bawah standar yang membosankan.
   - Gunakan wadah abu-abu netral lembut (g-stone-150 / g-black/[0.04]) dengan bantalan aktif (*active sliding pill*) berwarna kontras dan berefek bayangan lembut.
4. **Radius Kurva Lembut (Continuous Squircles)**:
   - Gunakan ounded-2xl (16px) untuk card dan input, serta ounded-3xl (24px) untuk container modal/dialog utama.
5. **Bayangan Multi-Stop (Ambient & Key Shadows)**:
   - Gunakan bayangan bertingkat tipis yang meniru difusi cahaya matahari nyata:
     shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_24px_-4px_rgba(0,0,0,0.06)].

---

## 3. Standar Interaktivitas & UX (Interaction Anti-Slop)

### ❌ HAL-HAL YANG DIHARAMKAN:
1. **Spinner Berputar Tanpa Henti**: Dilarang meletakkan loader spinner raksasa di tengah layar saat data sedang dimuat secara asinkron.
2. **Tombol Mati (Dead Buttons)**: Tombol yang tidak memiliki umpan balik visual saat ditekan, melayang (hover), atau saat disabled.
3. **Formulir Tanpa Error Handling Nyata**: Menampilkan popup bawaan browser atau pesan generic Something went wrong.
4. **Layout Shift (CLS)**: Elemen yang melompat-lompat saat gambar atau data baru selesai di-fetch.

### ✅ STANDAR KUALITAS:
1. **Umpan Balik Taktil (Tactile Press Feedback)**:
   - Setiap tombol interaktif wajib memiliki feedback fisik halus:  
     ctive:scale-[0.98] transition-all duration-150 ease-out.
   - Cursor wajib diset cursor-pointer pada semua elemen interaktif.
2. **Skeleton & Optimistic Updates**:
   - Tampilkan skeleton pulsing tipis (nimate-pulse bg-stone-200/60 rounded-xl) dengan ukuran identik dengan data yang akan dimuat.
   - Untuk aksi sederhana (seperti ubah status, toggle antrian), gunakan update optimistik segera sebelum menunggu round-trip server.
3. **Aksesibilitas & Keyboard First**:
   - Dukung tombol Escape untuk menutup modal/sheet.
   - Ring fokus yang jelas dan kontras saat navigasi menggunakan tombol Tab.
4. **Empty State yang Informatif**:
   - Jika data kosong, tampilkan ilustrasi ikon bersih, pesan ramah mengapa data kosong, dan aksi nyata untuk mengisinya (bukan sekadar teks "Tidak ada data").

---

## 4. Standar Kode & Rekayasa Perangkat Lunak (Code Anti-Slop)

### ❌ HAL-HAL YANG DIHARAMKAN:
1. **File Raksasa 1000+ Baris**: Menggabungkan state, types, UI rendering, kalkulasi bisnis, dan pemanggilan API dalam 1 file monolitik.
2. **Tipe Malas ny**: Mengabaikan TypeScript dengan menulis data: any atau (e: any) => void.
3. **Komentar Malas**: Meninggalkan // TODO: implement later atau // Add logic here di berkas produksi.
4. **Library Bloat**: Menginstal library animasi 500KB hanya untuk animasi fade-in sederhana yang cukup dikerjakan dengan CSS Tailwind murni.
5. **Hardcoded Secrets & Magic Strings**: Menaruh API Key atau kredensial langsung di kode sumber.

### ✅ STANDAR KUALITAS:
1. **Strict Type Safety**:
   - Definisikan interface dan type dengan jelas untuk seluruh model data, status enum, dan payload API.
2. **Idempotensi & Resilience**:
   - Setiap pemanggilan API harus tahan terhadap kegagalan jaringan, memfasilitasi fallback yang elegan, dan tidak membuat aplikasi crash.
3. **Lightweight & High Performance**:
   - Manfaatkan kapabilitas hardware-accelerated CSS (	ransform, opacity, ackdrop-filter).
   - Ukuran bundel seminimal mungkin, zero dependency yang tidak diperlukan.
4. **Single Source of Truth**:
   - State dikelola secara terpusat tanpa desinkronisasi antar-komponen.

---

## 5. Standar Copywriting & Bahasa (Copy Anti-Slop)

### ❌ KATA/FRASA YANG DIHARAMKAN:
- *"Unleash the ultimate power of..."*
- *"Revolutionize your eyewear experience..."*
- *"Seamlessly streamline your optical workflow with next-gen AI..."*
- *"Delve into our cutting-edge features..."*

### ✅ GAYA BAHASA YANG BENAR:
- **Kontekstual, Manusiawi & Santun**: Gunakan sapaan yang wajar dan dihormati di Indonesia (contoh: *"Pelanggan yang kami hormati"*, *"Silakan memasuki ruangan periksa mata"*).
- **Jelas & To-the-point**: Informasikan apa yang sedang terjadi, apa langkah selanjutnya, dan berapa lama estimasi waktu.
- **Rendah Hati & Profesional**: Tidak perlu melebih-lebihkan teknologi di depan pengguna akhir.

---

## 6. Checklist Cepat Penerapan (Quick Verification Checklist)
Sebelum commit atau rilis fitur baru, pastikan:
- [ ] Tidak ada warna ungu gradasi AI atau mesh murahan.
- [ ] Tombol memiliki efek taktil ctive:scale-[0.98].
- [ ] Card menggunakan bahan frosted glass ber-border ultra-tipis.
- [ ] Angka jam, kuantitas, dan antrian menggunakan 	abular-nums.
- [ ] Filter tab menggunakan model Apple Segmented Control.
- [ ] TypeScript bebas dari tipe ny.
- [ ] Copywriting natural dan tidak berbau buzzword AI.
- [ ] Responsif sempurna di mobile, iPad/tablet, dan desktop monitor besar.

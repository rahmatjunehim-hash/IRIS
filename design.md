# Design guidelines — IRIS

## 1. Prinsip desain
- Minimalis, cepat dipakai staff yang sibuk — bukan dashboard analitik yang ramai.
- Warna hijau + putih, konsisten dengan brand Optik I See You (bukan dark theme).
- Tablet-first untuk layar customer & cek mata (touch target besar, form sederhana); desktop-first untuk kasir, admin, gudang, after sales (tabel & multi-kolom).

## 2. Warna & status
Pakai warna untuk membedakan status order secara konsisten di semua layar:

| Status | Warna | Arti |
|---|---|---|
| Menunggu cek mata | Abu-abu | Baru daftar, belum dipanggil |
| Sedang diperiksa | Hijau muda | Di tahap cek mata |
| Menunggu transaksi | Hijau muda | Sudah punya resep, di tab kasir |
| Pending (faset) | Kuning/amber | Lensa belum ready, nunggu stok |
| Proses (faset) | Hijau tua | Lensa sedang dikerjakan |
| Selesai | Hijau brand | Siap diambil, sudah dinotifikasi |

Warna brand utama: hijau (sesuaikan dengan hex resmi I See You yang sudah dipakai di optikiseeyou.com), putih untuk background, abu-abu netral untuk teks sekunder.

## 3. Layar kunci

**Tablet — registrasi customer**
Form satu kolom: pilih cabang (tombol besar, bukan dropdown), lalu nama, no WA, alamat, TTL, jenis lensa. Tombol submit besar di bawah. Tidak perlu login.

**Tablet — cek mata**
Panel antrian di atas (nomor urut, nama customer, tombol panggil), form input resep di bawah (tabel sph/silinder/axis/add/pd kanan-kiri, seperti contoh kertas rekam medis yang sudah ada), kolom catatan bebas.

**Smart TV — layar antrian ruang tunggu**
Landscape, kontras tinggi biar kebaca dari jarak jauh. Kotak besar di kiri: label "Sedang dipanggil" + nama customer dalam font besar (gaya rumah sakit). Kolom kanan lebih kecil: daftar 2-3 nama antrian berikutnya beserta nomor urut. Nama cabang di footer. Tidak ada elemen interaktif — murni tampilan pasif + suara panggilan otomatis saat update.

**Desktop — kasir**
List order masuk dari cek mata, klik satu order untuk buka detail data pesanan (data lengkap + pilihan frame/lensa — tanpa harga, karena pembayaran ada di sistem POS terpisah), tombol set status pending/proses untuk order yang sudah ada di faset.

**Desktop — faset/teknisi**
List order, dikelompokkan per status (pending/proses/selesai), setiap kartu order tampilkan nama customer, frame, jenis lensa, ukuran. Tombol update ke "selesai" kalau sudah jadi.

**Desktop — after sales**
Tabel semua order lintas cabang, bisa difilter per cabang/status, tiap baris bisa diklik untuk edit data (bukan approval, murni koreksi data).

**Desktop — gudang**
List lensa berstatus pending, difilter/dikelompokkan per cabang lalu per jenis/ukuran (stok dikelola terpisah tiap cabang, bukan terpusat), dengan jumlah kebutuhan, tombol tandai "sudah diorder".

**Desktop — super admin**
Kelola akun (tambah/nonaktifkan user per role & cabang), kelola master data cabang & produk, laporan ringkas semua cabang.

## 4. Komponen berulang
- Badge status (pakai warna di atas) muncul konsisten di semua list order.
- Kartu order: nama customer, cabang, waktu, status — dipakai di kasir, faset, after sales, gudang dengan isi disesuaikan.
- Notifikasi WA: template pesan tetap, hanya nama customer yang dinamis. Contoh: "Halo ka {nama}, orderan kaka sudah bisa diambil, I See You".

## 5. Aksesibilitas & kegunaan
- Tablet: tombol minimal 44px tinggi, kontras tinggi (dipakai customer awam & lansia).
- Hindari istilah teknis di layar customer — bahasa sehari-hari ("Pilih cabang terdekat", bukan "Select branch").
- Desktop staff: prioritaskan kecepatan input (keyboard shortcut opsional untuk kasir) di atas keindahan visual.

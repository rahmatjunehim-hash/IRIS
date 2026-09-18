# PRD — IRIS (I See You Retail & Information System)

## 1. Ringkasan
IRIS adalah sistem internal untuk Optik I See You yang mengelola alur customer dari registrasi cek mata sampai pengambilan kacamata jadi, lintas 4 cabang (Purwokerto, Cilacap, Wonosobo, Purbalingga). Menggantikan proses manual/kertas (lihat contoh form "Data Rekam Medis Customer") dengan sistem digital yang terhubung antar bagian.

## 2. Masalah
- Data customer (resep, ukuran lensa, alamat) masih dicatat manual di kertas per cabang, rawan hilang dan tidak terpusat.
- Tidak ada visibilitas status order lintas bagian — kasir, faset, dan customer service tidak tahu progres order tanpa saling tanya manual.
- Tidak ada histori data customer yang bisa diakses ulang untuk after sales atau komplain.

## 3. Tujuan
- Satu alur digital dari registrasi cek mata sampai notifikasi pengambilan.
- Setiap role hanya melihat/mengerjakan bagian yang relevan dengan pekerjaannya.
- Data lengkap tersimpan dan bisa diakses lintas cabang oleh super admin dan after sales.
- Notifikasi otomatis ke customer saat order selesai.

## 4. Role & hak akses

| Role | Jumlah user | Akses |
|---|---|---|
| Super admin | 2 | Kelola akun, master data (cabang, produk, harga), permission, laporan semua cabang |
| Kasir | per cabang | Input data awal, catatan frame, konfirmasi data pesanan (tanpa harga — pembayaran ada di sistem POS terpisah), set status pending/proses faset |
| Cek mata | per cabang | Antrian pemeriksaan, input resep (sph, silinder, axis, add, pd), catatan |
| Faset / teknisi | pusat (lantai 2) | Terima order dari kasir, cocokkan lensa dengan frame, update progres |
| CS | per cabang / pusat | Trigger notifikasi WA ke customer saat order selesai |
| After sales | pusat, lintas cabang | Lihat dan edit data yang sudah masuk, akses semua cabang |
| Gudang | pusat | Pantau stok lensa yang pending, ajukan order stok |

Catatan: tidak ada tier "admin biasa" di antara super admin dan role operasional — setiap role operasional punya wewenang penuh atas bagiannya sendiri, super admin hanya pegang hal yang sifatnya sistem (akun, master data, harga, permission).

## 5. Alur utama (functional flow)
1. Customer memilih frame secara fisik, lalu mengisi form registrasi sendiri di tablet: pilih cabang, nama, no WA, alamat, TTL (tanggal isi otomatis), pilihan jenis lensa. Kasir menambahkan catatan frame.
2. Data otomatis masuk ke antrian cek mata. Petugas cek mata memanggil sesuai antrian, mengisi hasil pemeriksaan (resep sph/silinder/axis/add/pd) dan catatan.

### 2a. Layar antrian TV (fitur tambahan)
Setiap cabang punya smart TV di ruang tunggu yang menampilkan tampilan antrian seperti di rumah sakit:
- Nama customer yang **sedang dipanggil**, ditampilkan besar dan jelas.
- Daftar 2-3 nama **antrian berikutnya**.
- Saat petugas cek mata menekan tombol "panggil" di tabletnya, layar TV update otomatis (real-time, tanpa refresh manual) **dan** ada suara otomatis yang menyebut nama, contoh: "Atas nama Ayu, silahkan masuk ke ruang cek mata."
- Layar TV adalah halaman web terpisah yang dibuka di browser smart TV (tidak perlu install aplikasi), per cabang.
3. Setelah cek mata selesai, data masuk ke tab kasir untuk konfirmasi data pesanan (frame, jenis lensa) menggunakan data lengkap ala rekam medis. Tidak ada harga produk di IRIS — pembayaran/transaksi tetap ditangani sistem kasir/POS terpisah yang sudah berjalan; kasir di IRIS hanya mengambil dan meneruskan data pesanan.
4. Setelah transaksi, data masuk ke faset/teknisi (lantai 2) untuk mencocokkan lensa (stok, ukuran, jenis) dengan frame (lantai 1).
5. Kasir menentukan status faset: **pending** (lensa belum ready) atau **proses** (sedang dikerjakan). Order pending muncul di dashboard gudang untuk dipantau stoknya sampai bisa lanjut proses.
6. Setelah faset selesai, data masuk ke CS dan after sales secara bersamaan.
7. CS memicu bot WhatsApp otomatis ke customer, format: "Halo ka {nama}, orderan kaka sudah bisa diambil, I See You".
8. After sales bisa melihat dan mengedit salinan data yang sudah masuk, dengan akses ke semua cabang.
9. Gudang memantau daftar lensa berstatus pending untuk keperluan order ulang stok.

## 6. Requirement non-fungsional
- Harus mendukung penggunaan di tablet (registrasi customer, cek mata) dan desktop (kasir, admin, after sales, gudang).
- Data harus real-time antar role — begitu satu tahap disimpan, tahap berikutnya langsung bisa melihatnya tanpa refresh manual.
- Layar antrian TV harus update dan bersuara dalam hitungan detik setelah tombol "panggil" ditekan — bukan polling lambat yang terasa delay.
- Setiap cabang punya data terpisah secara operasional, tapi bisa dilihat gabungan oleh super admin dan after sales.
- Riwayat perubahan status (log) harus tersimpan, minimal untuk status faset dan notifikasi WA.

## 7. Di luar cakupan (v1)
- Pembayaran online / payment gateway (transaksi tetap manual di kasir).
- Aplikasi mobile terpisah untuk customer (cukup web form di tablet).
- Integrasi otomatis ke marketplace atau e-commerce.

## 8. Keputusan (sebelumnya pertanyaan terbuka)
- Stok lensa di gudang **dipisah per cabang**, bukan terpusat.
- Notifikasi WA memakai **Fonnte** (WhatsApp gateway tidak resmi) — murah, dokumentasi lengkap, komunitas besar, cocok untuk notifikasi transaksional volume rendah. Alternatif: Wablas jika nanti butuh kirim dari nomor WA tiap cabang secara terpisah (fitur rotator multi-nomor).
- **Tidak ada harga produk di IRIS.** Kasir hanya mengambil dan meneruskan data pesanan (frame, jenis lensa); transaksi/pembayaran tetap di sistem kasir/POS yang sudah ada dan terpisah dari IRIS.

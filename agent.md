# agent.md — instruksi build IRIS untuk Antigravity

## Konteks proyek
Membangun IRIS, sistem manajemen internal Optik I See You (4 cabang: Purwokerto, Cilacap, Wonosobo, Purbalingga). Baca `prd.md` untuk requirement lengkap dan `design.md` untuk panduan UI sebelum mulai coding.

## Stack yang disarankan
- Next.js 15 (App Router) + TypeScript + Tailwind — konsisten dengan proyek optikiseeyou.com yang sudah berjalan.
- Database: PostgreSQL + Prisma ORM.
- Auth: NextAuth atau Clerk, role-based access control (super_admin, kasir, cek_mata, faset, cs, after_sales, gudang).
- Realtime update antar role: gunakan polling ringan atau websocket (Pusher/Ably) — order yang masuk ke tahap berikutnya harus muncul tanpa refresh manual. **Wajib** untuk layar antrian TV (lihat bagian khusus di bawah) — delay yang kelihatan bakal langsung ketauan customer di ruang tunggu.
- Notifikasi WA: gunakan **Fonnte** — trigger otomatis saat status order jadi "selesai". (Alternatif: Wablas kalau nanti butuh kirim dari nomor WA tiap cabang secara terpisah.)

## Fitur layar antrian TV + suara panggilan
- Halaman terpisah (mis. `/display/[cabang]`) yang dibuka di browser smart TV per cabang, tidak perlu login/app install.
- Update via websocket/Pusher yang sama dengan realtime order — begitu petugas cek mata klik "panggil", event langsung dikirim ke halaman display: nama yang sedang dipanggil pindah ke posisi utama, antrian berikutnya digeser.
- **Suara panggilan**: rekomendasi pakai **Web Speech API (`SpeechSynthesisUtterance`)** langsung di browser TV, `lang: 'id-ID'`, karena gratis dan simpel — kebanyakan smart TV modern (Android TV/Google TV) pakai browser berbasis Chrome yang sudah dukung suara bahasa Indonesia. Format kalimat: `"Atas nama {nama}, silahkan masuk ke ruang cek mata."`
- **Kalau kualitas suara bawaan TV kurang bagus/jelas** (baru ketahuan pas testing di device TV asli), upgrade ke Google Cloud Text-to-Speech: generate file MP3 di backend saat tombol "panggil" ditekan, kirim URL audio ke halaman display lewat websocket, halaman TV cukup `<audio>` play. Lebih stabil kualitasnya tapi ada biaya per karakter (kecil untuk volume notifikasi seperti ini).
- Tambahkan field di `orders`: `no_antrian` (reset harian per cabang), `status_antrian` (menunggu/dipanggil/selesai), `dipanggil_at` (timestamp) — dipakai buat urutan tampilan di layar TV.

## Struktur data
Ikuti skema entitas berikut (lihat ERD yang sudah dibuat sebelumnya di percakapan):
- `cabang`, `users`, `customers`, `eye_exams`, `orders`, `order_faset`, `lens_stock`, `notifications`.
- `orders.status` untuk status transaksi umum; `order_faset.status_faset` khusus pending/proses/selesai — dua field ini terpisah, jangan digabung.
- `lens_stock` **wajib punya `cabang_id`** — stok dikelola terpisah per cabang, bukan terpusat.
- `orders` **tidak menyimpan harga/nominal apa pun** — IRIS bukan sistem transaksi. Pembayaran ditangani sistem kasir/POS lain yang sudah berjalan; kasir di IRIS hanya mengambil dan meneruskan data pesanan (frame, jenis lensa) ke faset.
- `users.role` cukup satu kolom string, tidak perlu tabel roles terpisah.

## Urutan pengerjaan yang disarankan
1. Setup project, auth, dan role-based routing (setiap role hanya bisa akses halamannya sendiri).
2. Buat form registrasi customer (tablet) — tanpa login, pilih cabang + isi data.
3. Buat dashboard cek mata: antrian + form resep.
4. Buat dashboard kasir: terima order dari cek mata, transaksi, set status pending/proses.
5. Buat dashboard faset: terima order dari kasir, update progres.
6. Buat integrasi notifikasi WA otomatis saat faset set status "selesai".
7. Buat dashboard CS (trigger/monitor notifikasi) dan after sales (lihat & edit semua data).
8. Buat dashboard gudang (list lensa pending, tandai sudah diorder).
9. Buat panel super admin (kelola user, cabang, produk, harga).

## Aturan bisnis penting — jangan sampai salah implementasi
- Status pending/proses di faset **diset manual oleh kasir**, bukan otomatis oleh sistem.
- Data lensa & catatan yang diisi customer di awal **tetap satu objek yang sama** sampai ke faset — jangan buat ulang record baru di tiap tahap, cukup update status dan tambah field di record yang sama.
- After sales **hanya view + edit**, bukan approval — jangan taruh dia di jalur utama alur order.
- Gudang hanya berurusan dengan order yang berstatus **pending**, bukan semua order.
- Tidak ada tier admin di antara super admin dan role operasional — jangan tambahkan role baru di luar 7 yang sudah didefinisikan tanpa konfirmasi dulu ke user.

## Sudah dikonfirmasi user — jangan diubah tanpa tanya lagi
- Provider notifikasi WA: Fonnte.
- Stok lensa di gudang: per cabang, bukan terpusat.
- Tidak ada harga produk di IRIS sama sekali — kasir cuma ambil data, transaksi/pembayaran di sistem POS lain yang sudah ada.

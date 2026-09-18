# ANTI-AI-SLOP & APPLE HIG DESIGN MANIFESTO
> **Standar Desain & Engineering UI/UX Premium Anti-Generic AI**
> *Optik I See You — IRIS & Modern Web Architecture*

---

## 1. Prinsip Utama: Anti-AI Slop (Bebas Corak Murahan AI)

### ❌ Dilarang Keras (AI Slop Signals):
1. **NO EMOJI SEBAGAI ELEMEN UI**:
   - Dilarang keras menaruh emoji generik (seperti 🚀, 💡, ✨, 🔥, 🎙️, 🤖, 💥, 🎉, 📈) pada header, tombol, badge, tab menu, card, maupun bullet points.
   - Emoji murahan membuat aplikasi terlihat seperti proyek demo mainan hasil copy-paste ChatGPT.
2. **NO PURPLE/NEON AI GRADIENTS**:
   - Dilarang memakai gradient ungu-biru neon generik (`from-indigo-500 to-purple-600`) khas AI templates.
3. **NO ROBOTIC / OVERPROMISED COPYWRITING**:
   - Dilarang menggunakan buzzword kosong seperti *"Revolutionize your workflow with next-gen AI-powered cutting-edge synergy"*.
   - Gunakan copy profesional, ringkas, tegas, dan natural sesuai konteks operasional nyata.
4. **NO BORDERLESS / MESSY CARDS**:
   - Dilarang membuat card putih di atas background abu-abu tanpa depth, border, dan padding yang proporsional.

### ✅ Wajib Diterapkan (The High-End Standard):
1. **Precision Vector Icons (Lucide React)**:
   - Gunakan icon SVG presisi monokromatis dengan ketebalan stroke seragam (`strokeWidth={1.5}` atau `1.75`).
   - Ukuran proporsional: 16px (`w-4 h-4`) untuk micro-actions/badges, 20px (`w-5 h-5`) untuk navigation/inputs, 24px (`w-6 h-6`) untuk hero features.
2. **Aesthetic Brand Assets**:
   - Gunakan logo resmi beresolusi tinggi (`/brand/logo-isy-putih.png`, `/brand/logo-for-every-you.png`).
3. **Typography-First Hierarchy**:
   - Font sans-serif yang bersih (Inter / SF Pro Display) dengan optical kerning (`tracking-tight`).
   - Tabular figures (`font-mono tabular-nums`) untuk nomor antrian, harga uang (Rupiah), durasi, dan waktu jam.

---

## 2. Color Palette Resmi IRIS: Warm Ivory & Luxe Emerald

### Background & Surfaces:
- **Ivory Base (Default Light)**: `#FDFBF7` (Putih gading lembut, hangat di mata, tidak menyilaukan seperti pure `#FFFFFF`).
- **Surface Elevation 1 (Card/Container)**: `bg-white/85 backdrop-blur-xl border border-black/[0.05] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]`
- **Surface Elevation 2 (Elevated Modal/Dropdown)**: `bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.08)]`

### Signature Emerald Accent:
- **Primary Deep Emerald**: `#064E3B` (Tailwind `emerald-900` - Mewah, elegan, berwibawa).
- **Primary Active**: `#047857` (Tailwind `emerald-700`).
- **Surface Tint (Subtle Badges)**: `bg-emerald-50 text-emerald-800 border border-emerald-200/60`.
- **Contrast Text**: Slate-900 (`#0F172A`) untuk heading utama, Slate-500 (`#64748B`) untuk secondary info.

---

## 3. Apple iOS / macOS / visionOS Design DNA

### Translucent Glass & Subtle Borders:
- Selalu gunakan `backdrop-blur-xl` dipadukan dengan border 1px ultra-halus yang transparan (`border-black/[0.06]` pada light mode, `border-white/10` pada dark mode).
- Sudut lengkung modern: `rounded-2xl` (16px) untuk card & input, `rounded-3xl` (24px) untuk panel besar, `rounded-full` untuk pills/status badges.

### Micro-Interactions & Feel:
- Feedback haptic visual pada setiap elemen yang dapat diklik:
  `transition-all duration-150 ease-out active:scale-[0.98]`
- Hover states halus tanpa pergeseran layout yang menyentak:
  `hover:border-emerald-600/30 hover:shadow-apple-card`

---

## 4. Checklist Wajib Sebelum Merilis Halaman / Komponen

- [ ] Tidak ada satu pun emoji generik (seperti roket, bintang, mikrofon, dll) di UI.
- [ ] Semua icon menggunakan Lucide SVG berukuran proporsional.
- [ ] Background utama halaman menggunakan palet Putih Ivory `#FDFBF7` (atau tema Emerald Luxe yang kontras dan bersih).
- [ ] Card memiliki border 1px ultra-tipis yang menyatu dengan latar belakang.
- [ ] Angka nominal, jam, dan nomor antrian menggunakan `font-mono tabular-nums`.
- [ ] Copywriting profesional, jelas, ramah, dan bebas dari jargon AI berlebihan.
- [ ] Logo resmi IRIS / Optik I See You terpasang proporsional dan tidak pecah/blur.

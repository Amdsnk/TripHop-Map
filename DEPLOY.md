# 🚀 Panduan Deploy — Trip-Hop Archive Map

Panduan lengkap untuk deploy aplikasi ini ke **Vercel** dengan backend **Supabase**.

---

## Prasyarat

| Tool | Versi minimum | Link |
|------|--------------|------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | (bundled dengan Node) |
| Git | 2+ | https://git-scm.com |
| Akun Vercel | - | https://vercel.com/signup |
| Akun Supabase | - | https://supabase.com/dashboard |
| Vercel CLI (opsional) | latest | `npm i -g vercel` |

---

## Bagian 1 — Persiapan Repository

### 1.1 Push ke GitHub/GitLab/Bitbucket

```bash
# Inisialisasi git jika belum ada
git init
git add .
git commit -m "Initial commit — Trip-Hop Archive Map"

# Buat repo baru di GitHub, lalu:
git remote add origin https://github.com/USERNAME/trip-hop-archive.git
git branch -M main
git push -u origin main
```

### 1.2 Pastikan file ini ada di root project

```
vercel.json          ✅ sudah dibuat
vite.config.ts       ✅ sudah dikonfigurasi (outDir: dist)
.env.example         ✅ template env vars
.gitignore           ✅ pastikan .env dan dist/ ada di sini
```

Cek `.gitignore` memiliki baris berikut:
```
.env
.env.local
dist/
node_modules/
```

---

## Bagian 2 — Setup Supabase

> **Catatan:** Aplikasi ini saat ini adalah arsip statis (semua data di `src/data/artists.ts`). Supabase **hanya diperlukan** jika kamu ingin menambahkan fitur: autentikasi pengguna, penyimpanan playlist cloud, atau form submission. Jika tidak, lewati ke Bagian 3.

### 2.1 Buat Project Supabase

1. Buka https://supabase.com/dashboard
2. Klik **"New Project"**
3. Isi:
   - **Name:** `trip-hop-archive`
   - **Database Password:** simpan dengan aman
   - **Region:** pilih yang terdekat (Singapore untuk Asia Tenggara)
4. Tunggu ~2 menit hingga project siap

### 2.2 Ambil Credentials

1. Pergi ke **Project Settings → API**
2. Salin:
   - **Project URL** → `https://xxxxxxxxxxxx.supabase.co`
   - **anon/public key** → string panjang di bawah "Project API keys"

### 2.3 Migrasi Database (Jika Menggunakan Fitur DB)

Jika project ini membutuhkan tabel database, jalankan migrasi berikut di **SQL Editor** Supabase:

```sql
-- Tabel untuk menyimpan playlist pengguna (opsional)
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Playlist',
  tracks JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa lihat/edit playlist milik sendiri
CREATE POLICY "Users can manage own playlists"
  ON public.playlists
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: playlist publik bisa dilihat semua orang
CREATE POLICY "Public playlists are viewable"
  ON public.playlists
  FOR SELECT
  USING (is_public = true);
```

Untuk menjalankan di **Supabase SQL Editor**:
1. Buka dashboard project
2. Klik **"SQL Editor"** di sidebar kiri
3. Paste SQL di atas
4. Klik **"Run"**

### 2.4 Setup Auth (Opsional)

1. Pergi ke **Authentication → Settings**
2. Di bawah **"Email Auth"** → pastikan diaktifkan
3. Di **"Site URL"** → masukkan URL Vercel kamu (setelah deploy): `https://trip-hop-archive.vercel.app`
4. Di **"Redirect URLs"** → tambahkan: `https://trip-hop-archive.vercel.app/**`

---

## Bagian 3 — Deploy ke Vercel

### Metode A: Via Dashboard Vercel (Direkomendasikan)

1. **Buka** https://vercel.com/new
2. **Import Git Repository** → pilih repo `trip-hop-archive`
3. **Configure Project:**
   - Framework Preset: **Vite** (auto-detected)
   - Root Directory: `./` (biarkan default)
   - Build Command: `npx vite build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables** — klik "Environment Variables" dan tambahkan:

   | Key | Value |
   |-----|-------|
   | `VITE_APP_ID` | `app-crlrq8qvf8jl` |
   | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` |

5. Klik **"Deploy"** — tunggu ~2-3 menit
6. ✅ Aplikasi live di `https://trip-hop-archive-USERNAME.vercel.app`

### Metode B: Via Vercel CLI

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy dari root project
cd /path/to/trip-hop-archive
vercel

# Ikuti prompt:
# ? Set up and deploy? → Y
# ? Which scope? → pilih akun kamu
# ? Link to existing project? → N
# ? Project name? → trip-hop-archive
# ? In which directory is your code? → ./
# ? Want to override settings? → N

# Vercel auto-detect Vite, deploy ke preview URL
# Untuk production:
vercel --prod
```

### Metode C: Deploy Manual (tanpa Git)

```bash
# Build lokal dulu
npm install
npx vite build

# Deploy folder dist ke Vercel
vercel deploy ./dist --prod
```

---

## Bagian 4 — Konfigurasi Domain Kustom (Opsional)

1. Di Vercel Dashboard → **Project → Settings → Domains**
2. Tambahkan domain: `trip-hop.yourdomain.com`
3. Ikuti instruksi DNS:
   - Jika menggunakan **CNAME**: arahkan ke `cname.vercel-dns.com`
   - Jika menggunakan **A record**: arahkan ke `76.76.21.21`
4. Tunggu propagasi DNS (5-60 menit)
5. Update **Supabase → Authentication → Site URL** ke domain baru

---

## Bagian 5 — Verifikasi Post-Deploy

Setelah deploy, cek hal-hal berikut:

```
✅ Homepage muncul — peta artist terload
✅ GEO panel berfungsi — marker terlihat
✅ SONGS panel — daftar lagu muncul
✅ WIKI panel — konten Wikipedia terlihat
✅ YouTube embed — video memutar
✅ SoundCloud embed — player terload untuk lagu tanpa YouTube
✅ Routing SPA — refresh halaman tidak 404 (dihandle vercel.json rewrites)
✅ HTTPS aktif — gembok hijau di browser
```

---

## Bagian 6 — Update & Redeploy

Setiap kali push ke branch `main`, Vercel **otomatis** rebuild dan redeploy:

```bash
# Setelah edit data artists.ts atau komponen:
git add .
git commit -m "Add 25 new artists - Batch D"
git push origin main
# → Vercel auto-deploy dalam ~2 menit
```

Untuk preview sebelum production:
```bash
git push origin feature/new-artists
# → Vercel buat preview URL: https://trip-hop-archive-git-feature-USERNAME.vercel.app
```

---

## Troubleshooting

### Build gagal: "Cannot find module"
```bash
# Pastikan semua import benar
npm run lint
```

### SPA 404 saat refresh
Pastikan `vercel.json` ada dengan `rewrites` ke `/index.html` — sudah dikonfigurasi.

### Chunk terlalu besar
`artists.ts` adalah ~650KB. Sudah dikonfigurasi di `vite.config.ts` sebagai `manualChunks`. Jika masih error:
```bash
# Cek ukuran
npx vite build 2>&1 | grep "kB"
```

### Environment variable tidak terbaca
- Semua env var untuk Vite **harus** diawali `VITE_`
- Pastikan sudah di-set di Vercel Dashboard, bukan hanya di `.env` lokal
- Setelah tambah env var baru → **Redeploy** manual diperlukan

### Supabase CORS error
Di Supabase → **Project Settings → API → Allowed Origins**, tambahkan:
- `https://trip-hop-archive.vercel.app`
- `http://localhost:5173` (untuk development lokal)

---

## Ringkasan Perintah Cepat

```bash
# Development lokal
cp .env.example .env.local
# isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm install
npx vite dev

# Build production lokal (untuk testing)
npx vite build
npx vite preview

# Deploy ke Vercel
git push origin main   # auto-deploy via Git integration
# ATAU
vercel --prod          # via CLI
```

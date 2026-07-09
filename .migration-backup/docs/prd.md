# Dokumen Kebutuhan

## 1. Ringkasan Aplikasi

**Nama Aplikasi**: TripHop-Map

**Deskripsi**: Aplikasi web interaktif untuk menjelajahi musik trip-hop melalui berbagai antarmuka visualisasi dan penemuan. Aplikasi ini menyediakan pengalaman eksplorasi musik bergaya arsip dengan pemetaan genre interaktif, profil artis, pemutaran lagu, filter suasana hati, navigasi timeline, visualisasi geografis, analisis audio, kurasi lagu langka, pembuat playlist, dan panel informasi kontekstual.

## 2. Pengguna dan Skenario Penggunaan

**Pengguna Target**:
- Penggemar musik trip-hop yang ingin menemukan artis dan lagu
- Peneliti musik yang mengeksplorasi koneksi genre dan hubungan artis
- Pendengar kasual yang mencari lagu langka yang dikurasi
- Pengguna yang ingin membuat dan membagikan playlist kustom

**Skenario Penggunaan Inti**:
- Menjelajahi 280+ artis trip-hop melalui peta berbasis node interaktif
- Menemukan lagu berdasarkan suasana hati, era, atau lokasi geografis
- Mendengarkan lagu melalui pemutaran YouTube terintegrasi
- Membuat dan membagikan playlist kustom
- Meneliti koneksi artis dan karakteristik musik

## 3. Struktur Halaman dan Deskripsi Fungsional

### 3.1 Struktur Halaman

```
Aplikasi TripHop-Map
├── Layar Splash Intro
├── Halaman Autentikasi
│   ├── Halaman Login
│   └── Halaman Signup
└── Antarmuka Aplikasi Utama
    ├── Canvas Peta Genre Interaktif
    ├── Panel Artis
    ├── Panel Lagu
    ├── Sidebar Filter Suasana Hati
    ├── Timeline Scrubber
    ├── Panel Peta Geografis
    ├── Panel Sound DNA
    ├── Panel Deep Cuts
    ├── Pembuat Playlist
    ├── Panel Penemuan Lagu
    ├── Panel Wiki
    ├── Fitur Pencarian Artis
    └── Halaman Daftar Artis
```

### 3.2 Layar Splash Intro

**Tujuan**: Layar sambutan yang ditampilkan pada kunjungan pertama

**Fungsionalitas**:
- Menampilkan branding dan pengenalan aplikasi
- Menyediakan titik masuk ke aplikasi utama
- Tutup untuk melanjutkan ke autentikasi atau antarmuka utama

### 3.3 Halaman Autentikasi

#### 3.3.1 Halaman Login

**Fungsionalitas**:
- Pengguna memasukkan username dan password
- Mengirim kredensial untuk autentikasi melalui Supabase
- Navigasi ke aplikasi utama setelah login berhasil
- Menyediakan tautan ke halaman signup

#### 3.3.2 Halaman Signup

**Fungsionalitas**:
- Pengguna memasukkan username dan password untuk membuat akun
- Mengirim registrasi melalui autentikasi Supabase
- Navigasi ke aplikasi utama setelah registrasi berhasil
- Menyediakan tautan ke halaman login

### 3.4 Antarmuka Aplikasi Utama

#### 3.4.1 Canvas Peta Genre Interaktif

**Fungsionalitas**:
- Menampilkan 280+ artis trip-hop sebagai node interaktif
- Mendukung interaksi drag untuk menjelajahi area peta
- Klik node untuk memilih artis dan menampilkan detail di Panel Artis
- Memvisualisasikan hubungan artis dan koneksi genre
- Menerapkan filter dari Sidebar Filter Suasana Hati dan Timeline Scrubber untuk menampilkan/menyembunyikan node

#### 3.4.2 Panel Artis

**Fungsionalitas**:
- Menampilkan detail artis yang dipilih (nama, bio, gambar)
- Menampilkan daftar album artis
- Menampilkan daftar lagu artis
- Klik lagu untuk menampilkan detail di Panel Lagu dan memulai pemutaran

#### 3.4.3 Panel Lagu

**Fungsionalitas**:
- Menampilkan detail lagu yang dipilih (judul, artis, album, tahun rilis)
- Menyematkan pemutar YouTube untuk pemutaran lagu
- Menyediakan kontrol untuk play/pause/seek audio
- Menampilkan metadata dan karakteristik lagu

#### 3.4.4 Sidebar Filter Suasana Hati

**Fungsionalitas**:
- Menampilkan daftar tag suasana hati (misalnya dark, atmospheric, jazzy, downtempo)
- Memungkinkan pengguna memilih/membatalkan pilihan tag suasana hati
- Memfilter artis dan lagu yang ditampilkan di Canvas Peta Genre dan Panel Penemuan Lagu berdasarkan suasana hati yang dipilih

#### 3.4.5 Timeline Scrubber

**Fungsionalitas**:
- Menampilkan slider timeline yang mewakili rentang tahun (misalnya 1990-2025)
- Memungkinkan pengguna menyesuaikan tahun awal dan akhir melalui handle slider
- Memfilter artis dan lagu berdasarkan era/rentang tahun rilis
- Memperbarui Canvas Peta Genre dan Panel Penemuan Lagu berdasarkan timeline yang dipilih

#### 3.4.6 Panel Peta Geografis

**Fungsionalitas**:
- Menampilkan peta dunia dengan lokasi artis yang ditandai
- Menampilkan distribusi artis berdasarkan wilayah geografis
- Klik penanda lokasi untuk memfilter artis berdasarkan wilayah
- Memvisualisasikan penyebaran geografis genre trip-hop

#### 3.4.7 Panel Sound DNA

**Fungsionalitas**:
- Menampilkan visualisasi karakteristik audio untuk lagu atau artis yang dipilih
- Menampilkan metrik seperti tempo, energi, danceability, acousticness, instrumentalness
- Menyajikan data dalam format visual (misalnya radar chart, bar chart)

#### 3.4.8 Panel Deep Cuts

**Fungsionalitas**:
- Menampilkan daftar kurasi lagu trip-hop yang langka
- Menampilkan judul lagu, artis, dan deskripsi singkat
- Klik lagu untuk memutar di Panel Lagu
- Menyediakan penemuan musik yang kurang dikenal

#### 3.4.9 Pembuat Playlist

**Fungsionalitas**:
- Menampilkan playlist saat ini dengan lagu yang ditambahkan
- Menambahkan lagu ke playlist dari Panel Lagu atau Panel Penemuan Lagu
- Menghapus lagu dari playlist
- Mengurutkan ulang lagu melalui drag-and-drop
- Menghasilkan URL yang dapat dibagikan untuk playlist
- Mengekspor playlist ke Spotify (jika pengguna menghubungkan akun Spotify)

#### 3.4.10 Panel Penemuan Lagu

**Fungsionalitas**:
- Menampilkan daftar semua lagu yang dapat dijelajahi di database
- Menerapkan filter dari Sidebar Filter Suasana Hati dan Timeline Scrubber
- Mengurutkan lagu berdasarkan judul, artis, tahun, atau popularitas
- Klik lagu untuk menampilkan detail di Panel Lagu dan memulai pemutaran
- Menambahkan lagu ke Pembuat Playlist

#### 3.4.11 Panel Wiki

**Fungsionalitas**:
- Menampilkan informasi kontekstual terkait artis, lagu, atau genre yang dipilih
- Menampilkan konteks historis, evolusi genre, pengaruh artis
- Menyediakan konten edukatif untuk eksplorasi musik

#### 3.4.12 Fitur Pencarian Artis

**Fungsionalitas**:
- Menampilkan input pencarian untuk mencari artis berdasarkan nama
- Melakukan pencarian real-time saat pengguna mengetik
- Menampilkan hasil pencarian berupa kartu artis yang cocok
- Menyorot bagian nama artis yang sesuai dengan kata kunci pencarian
- Klik kartu artis untuk menampilkan detail di Panel Artis

#### 3.4.13 Halaman Daftar Artis

**Fungsionalitas**:
- Menampilkan daftar semua artis trip-hop di database (151 artis)
- Menampilkan informasi ringkas untuk setiap artis: nama, era (origin/golden/expansion/modern), asal kota/negara, jumlah lagu
- Menyediakan opsi pengurutan: A-Z, berdasarkan era
- Menyediakan filter berdasarkan era (origin/golden/expansion/modern)
- Klik artis untuk menampilkan detail di Panel Artis

### 3.5 Audio Ambient

**Fungsionalitas**:
- Memutar audio ambient vinyl crackle di latar belakang
- Menyediakan toggle untuk mengaktifkan/menonaktifkan audio ambient
- Mempertahankan volume rendah agar tidak mengganggu pemutaran lagu

### 3.6 Tema Visual

**Fungsionalitas**:
- Menerapkan tema gelap di seluruh aplikasi
- Menggunakan font monospace untuk estetika arsip
- Mempertahankan palet warna dan tipografi yang konsisten

## 4. Aturan Bisnis dan Logika

### 4.1 Alur Autentikasi

- Pengguna harus menyelesaikan signup atau login untuk mengakses aplikasi utama
- Autentikasi ditangani melalui Supabase dengan username dan password
- Sesi bertahan di seluruh sesi browser hingga pengguna logout

### 4.2 Data Artis dan Lagu

- Node artis di Canvas Peta Genre mewakili 280+ artis trip-hop
- Setiap artis memiliki album dan lagu terkait yang disimpan di backend
- Data lagu mencakup judul, artis, album, tahun rilis, tag suasana hati, karakteristik audio

### 4.3 Logika Filter

- Sidebar Filter Suasana Hati dan Timeline Scrubber menerapkan filter kumulatif
- Memilih beberapa tag suasana hati menampilkan artis/lagu yang cocok dengan salah satu suasana hati yang dipilih (logika OR)
- Rentang timeline memfilter artis/lagu dengan tahun rilis dalam rentang yang dipilih
- Filter diterapkan ke Canvas Peta Genre, Panel Penemuan Lagu, dan Panel Peta Geografis secara bersamaan

### 4.4 Berbagi Playlist

- Pembuat Playlist menghasilkan URL unik yang dapat dibagikan yang mengkodekan ID lagu playlist
- Mengakses URL yang dibagikan memuat playlist di Pembuat Playlist penerima
- Ekspor Spotify memerlukan pengguna untuk mengautentikasi dengan akun Spotify

### 4.5 Pemutaran YouTube

- Panel Lagu menyematkan pemutar YouTube menggunakan ID video YouTube lagu terkait
- Pemutaran dimulai ketika pengguna mengklik lagu di Panel Artis, Panel Penemuan Lagu, atau Panel Deep Cuts
- Hanya satu lagu yang diputar pada satu waktu; memilih lagu baru menghentikan pemutaran saat ini

### 4.6 Pencarian Artis

- Pencarian dilakukan secara real-time saat pengguna mengetik di input pencarian
- Hasil pencarian mencocokkan nama artis dengan kata kunci pencarian
- Bagian nama yang cocok disorot dalam hasil pencarian

### 4.7 Daftar Artis

- Daftar menampilkan 151 artis trip-hop yang tersedia di database
- Pengurutan A-Z mengurutkan artis berdasarkan nama secara alfabetis
- Pengurutan berdasarkan era mengelompokkan artis berdasarkan era (origin/golden/expansion/modern)
- Filter era menampilkan hanya artis dari era yang dipilih

## 5. Pengecualian dan Kasus Batas

| Skenario | Penanganan |
|----------|------------|
| Pengguna tidak terautentikasi | Redirect ke Halaman Login |
| Node artis tidak memiliki lagu | Menampilkan pesan di Panel Artis yang menunjukkan tidak ada lagu tersedia |
| Lagu tidak memiliki ID video YouTube | Menampilkan pesan di Panel Lagu yang menunjukkan pemutaran tidak tersedia |
| Tidak ada artis yang cocok dengan filter yang dipilih | Menampilkan empty state di Canvas Peta Genre dengan pesan |
| Playlist kosong | Menampilkan empty state di Pembuat Playlist dengan prompt untuk menambahkan lagu |
| URL playlist yang dibagikan tidak valid | Menampilkan pesan error dan redirect ke Pembuat Playlist kosong |
| Ekspor Spotify gagal | Menampilkan pesan error dengan opsi retry |
| Error jaringan saat memuat data | Menampilkan pesan error dengan opsi retry |
| Pencarian artis tidak menemukan hasil | Menampilkan pesan bahwa tidak ada artis yang cocok |
| Daftar artis kosong karena filter | Menampilkan pesan bahwa tidak ada artis di era yang dipilih |

## 6. Kriteria Penerimaan

1. Pengguna membuka aplikasi dan melihat Layar Splash Intro
2. Pengguna menutup layar splash dan navigasi ke Halaman Login
3. Pengguna memasukkan username dan password, klik login, dan berhasil terautentikasi melalui Supabase
4. Pengguna melihat antarmuka aplikasi utama dengan Canvas Peta Genre Interaktif yang menampilkan 280+ node artis
5. Pengguna mengklik node artis, Panel Artis terbuka menampilkan detail artis, album, dan lagu
6. Pengguna mengklik lagu di Panel Artis, Panel Lagu terbuka dengan detail lagu dan pemutaran YouTube dimulai
7. Pengguna memilih tag suasana hati di Sidebar Filter Suasana Hati, Canvas Peta Genre diperbarui untuk menampilkan hanya artis yang cocok
8. Pengguna menyesuaikan Timeline Scrubber untuk memfilter berdasarkan rentang tahun, Canvas Peta Genre dan Panel Penemuan Lagu diperbarui sesuai
9. Pengguna mengklik lagu di Panel Penemuan Lagu, menambahkan ke Pembuat Playlist
10. Pengguna menghasilkan URL yang dapat dibagikan untuk playlist, menyalin URL, dan membagikan dengan pengguna lain
11. Pengguna mengetik nama artis di input pencarian, hasil pencarian menampilkan kartu artis yang cocok dengan highlight nama
12. Pengguna membuka Halaman Daftar Artis, melihat 151 artis dengan informasi ringkas, mengurutkan berdasarkan A-Z, dan memfilter berdasarkan era

## 7. Tidak Termasuk dalam Rilis Ini

- Kustomisasi profil pengguna (avatar, bio, preferensi)
- Fitur sosial (follow artis, berbagi playlist dengan teman, komentar)
- Fungsionalitas pencarian lanjutan (pencarian full-text di seluruh artis, album, lagu)
- Mode offline atau kemampuan progressive web app
- Dukungan multi-bahasa
- Panel admin untuk mengelola data artis/lagu
- Integrasi dengan layanan streaming musik selain Spotify
- Aplikasi native mobile (iOS/Android)
- Pengeditan playlist kolaboratif
- Rekomendasi lagu berdasarkan riwayat mendengarkan
- Konten yang dibuat pengguna (ulasan, rating, tag kustom)
- Visualisasi audio di luar panel Sound DNA
- Ekspor playlist ke format selain Spotify
- Shortcut keyboard untuk navigasi dan kontrol pemutaran
- Fitur aksesibilitas di luar HTML semantik dasar
# Dokumen Persyaratan

## 1. Ikhtisar Aplikasi

**Nama Aplikasi**: Trip-Hop Archive Map

**Deskripsi**: Peta musik interaktif berbasis web dan timeline yang mendokumentasikan evolusi genre Trip-Hop dari akhir 1980-an hingga saat ini. Aplikasi ini berfungsi sebagai arsip hidup dan museum sonik dengan estetika underground tahun 90-an, menampilkan node artis yang dapat dijelajahi, konteks historis, integrasi multimedia, dan manajemen playlist dengan kemampuan ekspor ke Spotify.

## 2. Pengguna dan Kasus Penggunaan

**Pengguna Target**:
- Sejarawan musik dan peneliti
- Penggemar dan kolektor trip-hop
- Penjelajah budaya musik underground
- Mahasiswa musik yang mempelajari evolusi genre

**Kasus Penggunaan Inti**:
- Menjelajahi asal-usul dan evolusi genre Trip-Hop
- Menemukan koneksi dan pengaruh antar artis
- Meneliti konteks historis album dan track
- Menemukan artis serupa dan rilis tersembunyi
- Membuat dan mengelola playlist pribadi
- Mengekspor playlist ke Spotify
- Mengakses playlist tematik yang dikurasi
- Membagikan playlist pribadi dengan orang lain
- Menelusuri dan menemukan lagu di semua artis
- Memfilter dan mencari lagu berdasarkan mood, era, judul, atau artis

## 3. Struktur Halaman dan Deskripsi Fungsional

```
Trip-Hop Archive Map
├── Main Map Canvas
│   ├── Origins Node (1980s-1992)
│   ├── Golden Age Node (1993-1999)
│   ├── Expansion Node (2000-2010)
│   └── Modern Hybrid Node (2010-present)
├── Artist Archive Panel
├── Song Details Panel
├── Playlist Panel
├── Songs Discovery Panel
├── Timeline Slider
├── Filter Controls
└── Geographic Map View
```

### 3.1 Main Map Canvas

**Presentasi Visual**:
- Canvas yang dapat di-zoom tanpa batas dengan peta genre yang dapat dijelajahi
- Empat node era utama yang mewakili periode evolusi Trip-Hop
- Node artis ditampilkan sebagai elemen mengambang dengan thumbnail cover album atau foto artis yang diproses
- Gambar artis ditampilkan sebagai thumbnail melingkar dalam node, menerapkan CSS filter: sepia(1) hue-rotate(190deg) saturate(2) brightness(0.65) untuk efek monokrom biru tua
- Gambar diambil dari URL nyata
- Cover album dirender sebagai versi terindeks monokrom biru
- Garis pengaruh menghubungkan artis terkait dengan encoding visual:
  + Ketebalan garis: tebal (kolaborasi langsung), sedang (pengaruh kuat), tipis (koneksi scene/era)
  + Warna/opacity garis: membedakan kolaborasi vs. pengaruh vs. koneksi label bersama
  + Tooltip hover menampilkan deskripsi hubungan
- Background animasi atmosferik dengan asap, tinta-dalam-air, distorsi cairan biru, efek simulasi feedback loop

**Interaksi**:
- Pergerakan kamera dengan fisika inersia halus
- Fungsi zoom in/out
- Simulasi fisika drift node
- Hover di atas node artis menampilkan overlay metadata
- Klik node artis membuka Artist Archive Panel
- Klik lagu dalam artis membuka Song Details Panel
- Hover di atas garis koneksi menampilkan tooltip dengan deskripsi hubungan

**Konten Node Era**:

*Origins Node (1980s-1992)*:
- Menampilkan akar dalam dub, hip-hop, post-punk, jazz, ambient
- Konteks scene underground Bristol
- Penjelasan kondisi sosial dan musikal
- Node artis: Neneh Cherry, Soul II Soul, The Pop Group/Mark Stewart, Sade, DJ Shadow (early), Nightmares on Wax, Goldie (early), Björk (debut era), On-U Sound/Adrian Sherwood, Keith LeBlanc, LTJ Bukem, The Orb, DJ Spooky, Massive Attack precursor (Wild Bunch), Earthling, Cocteau Twins/Elizabeth Fraser

*Golden Age Node (1993-1999)*:
- Node artis: Massive Attack, Portishead, Tricky, Sneaker Pimps, Morcheeba, UNKLE, DJ Krush, DJ Shadow, Kruder & Dorfmeister, Thievery Corporation, Nightmares on Wax, Moloko, Martina Topley-Bird, Archive, Howie B, Waldeck, Faithless, Björk (Homogenic era), Cocteau Twins/Elizabeth Fraser, Mono (UK), Bowery Electric, Euphoria, Gravediggaz, Guru (Jazzmatazz), Prefuse 73, Tricky (Nearly God alias), Earthling, Antipop Consortium, Portishead (Portishead album 1997)

*Expansion Node (2000-2010)*:
- Node artis: Zero 7, Bonobo, Lamb, Hooverphonic, Röyksopp, Goldfrapp, Beth Orton, Emiliana Torrini, Trentemøller, Telepopmusik, Bitter:Sweet, Thievery Corporation, Air, Yppah, Unkle (War Stories era), Psapp, Charlotte Gainsbourg, Lhasa de Sela, Múm, Prefuse 73, Four Tet, Flying Lotus (early), Erykah Badu (neo-soul/trip-hop crossover), Amy Winehouse (adjacent production style), Portishead (Third 2008), Jose Gonzalez, Lemon Jelly, Cibelle, Andreya Triana, BadBadNotGood, Hiatus Kaiyote, Esthero, El Guincho, Khruangbin

*Modern Hybrid Node (2010-present)*:
- Node artis: FKA Twigs, King Krule, Mount Kimbie, Nicolas Jaar/Darkside, Forest Swords, Floating Points, Moderat, Sevdaliza, Cigarettes After Sex, Chelsea Wolfe, How to Dress Well, Grouper, Actress, Kelsey Lu, Darkstar, Daughter, Zola Jesus, Warpaint, Chromatics, Lebanon Hanover, Andy Stott, Demdike Stare, Raime, Laurel Halo, Kelela, Sampha, Loyle Carner, billy woods, Bon Iver (adjacent), Beach House (adjacent), Burial (additional detail), James Blake (more albums), Flying Lotus (full career), Arca, serpentwithfeet, Tirzah, Jlin, Shackleton, Pinch, Ibeyi, Blue Daisy, Shabazz Palaces, Kode9, Meitei, Foodman, Ovall, Nicola Cruz, C.Tangana, Ceu, Dengue Dengue Dengue, Fatoumata Diawara, Moonchild Sanelly, BLK JKS, Awesome Tapes From Africa collective, Thandiswa Mazwai, Petite Noir, Mdou Moctar, Baloji, Nils Frahm, Apparat, Brandt Brauer Frick, James Holden, dan artis yang memadukan trip-hop dengan electronic, lo-fi, ambient, experimental bass, darkwave

**Posisi Artis**:
- Artis era Origins diposisikan di sisi kiri canvas, koordinat x 0-25% dari lebar canvas
- Artis Golden Age diposisikan tengah-kiri, koordinat x 25-50% dari lebar canvas
- Artis era Expansion diposisikan tengah-kanan, koordinat x 50-75% dari lebar canvas
- Artis Modern Hybrid diposisikan di sisi kanan, koordinat x 75-100% dari lebar canvas
- Artis dalam setiap era tersebar vertikal untuk menghindari tumpang tindih
- Setiap node artis memiliki koordinat x/y yang ditentukan pada canvas tak terbatas
- Jarak minimum antar node memastikan keterbacaan

### 3.2 Artist Archive Panel

**Pemicu**: Klik node artis pada Main Map Canvas

**Tampilan Konten**:
- Biografi lengkap artis
- Signifikansi historis dalam genre Trip-Hop
- Cerita pembentukan
- Pengaruh pada evolusi trip-hop
- Timeline album dengan tanggal rilis
- Kolaborasi kunci
- Asal geografis
- Daftar artis terkait (link yang dapat diklik)
- Daftar lagu dengan fungsi pemutaran
- Tombol Add to Playlist untuk setiap lagu

**Integrasi Media**:
- Embedded media player dengan urutan prioritas: YouTube → SoundCloud → Bandcamp → Archive.org → platform streaming underground
- Auto-fetch dinamis embed berdasarkan ketersediaan

**Interaksi**:
- Tutup panel kembali ke Main Map Canvas
- Klik artis terkait navigasi ke panel artis tersebut
- Klik lagu membuka Song Details Panel
- Klik Add to Playlist menambahkan lagu ke playlist pribadi pengguna

### 3.3 Song Details Panel

**Pemicu**: Klik lagu dari Artist Archive Panel atau map

**Tampilan Konten**:
- Cerita di balik track
- Konteks produksi
- Konteks album
- Dampak budaya
- Analisis lirik
- Sumber sample
- Klasifikasi mood
- BPM
- Key
- Tombol Add to Playlist

**Integrasi Media**:
- Embedded player dengan urutan prioritas yang sama seperti Artist Panel

**Interaksi**:
- Tutup panel kembali ke tampilan sebelumnya
- Navigasi ke artis atau album induk
- Klik Add to Playlist menambahkan lagu ke playlist pribadi pengguna

### 3.4 Playlist Panel

**Pemicu**: Klik ikon atau tombol playlist dari interface utama

**Tampilan Konten**:
- Bagian playlist pribadi pengguna menampilkan item antrian
- Bagian playlist terkurasi yang telah dibuat sebelumnya
- Setiap item playlist menampilkan: judul lagu, nama artis, link YouTube

**Playlist Pribadi Pengguna**:
- Menampilkan semua lagu yang ditambahkan oleh pengguna
- Setiap item menampilkan judul lagu, nama artis, dan link YouTube
- Tombol Remove untuk setiap item
- Tombol Clear All
- Opsi ekspor: Export as YouTube Playlist Link, Copy as Text, Export to Spotify
- Tombol Share Playlist: menyalin URL lengkap dengan data playlist ke clipboard

**Export to Spotify**:
- Tombol memicu alur autentikasi Spotify OAuth PKCE
- Mengarahkan pengguna ke halaman otorisasi Spotify
- Setelah otorisasi, kembali ke aplikasi
- Membuat playlist Spotify baru melalui Spotify Web API
- Mencari setiap track berdasarkan judul + artis dan menambahkan ke playlist
- Menampilkan pesan sukses dengan link ke playlist Spotify yang dibuat

**Playlist Terkurasi yang Telah Dibuat**:
- ESSENTIAL BRISTOL: rekaman dasar Bristol
- LATE NIGHT MELANCHOLY: track lambat, gelap, emosional
- CINEMATIC TRIP-HOP: pilihan yang dipengaruhi film score
- DEEP UNDERGROUND: pilihan langka dan tidak jelas
- MODERN DESCENDANTS: artis kontemporer yang membawa tradisi
- Setiap playlist terkurasi menampilkan daftar lagu dengan link YouTube
- Tombol Play untuk memulai playlist terkurasi
- Opsi untuk menambahkan seluruh playlist ke playlist pribadi

**Interaksi**:
- Klik lagu dalam playlist membuka Song Details Panel
- Klik Export as YouTube Playlist Link menghasilkan URL yang dapat dibagikan
- Klik Copy as Text menyalin teks playlist yang diformat
- Klik Export to Spotify memulai alur OAuth dan pembuatan playlist
- Klik Remove menghapus item dari playlist pribadi
- Klik Clear All mengosongkan playlist pribadi
- Klik Share Playlist menyalin URL lengkap ke clipboard
- Tutup panel kembali ke tampilan sebelumnya

### 3.5 Songs Discovery Panel

**Pemicu**: Klik tab atau tombol Songs dari interface utama

**Tampilan Konten**:
- Daftar yang dapat ditelusuri dari semua lagu di semua artis
- Setiap item lagu menampilkan: judul lagu, nama artis, tag mood, era
- Tombol Add to Playlist untuk setiap lagu
- Tombol Play untuk setiap lagu

**Filter dan Pencarian**:
- Filter berdasarkan mood: dark, melancholic, jazzy, smoky, urban, cinematic
- Filter berdasarkan era: Origins, Golden Age, Expansion, Modern Hybrid
- Pencarian berdasarkan judul lagu atau nama artis
- Beberapa filter dapat diterapkan secara bersamaan

**Interaksi**:
- Klik lagu membuka Song Details Panel
- Klik Add to Playlist menambahkan lagu ke playlist pribadi pengguna
- Klik Play memulai pemutaran melalui embedded player
- Terapkan filter memperbarui daftar lagu yang ditampilkan
- Masukkan query pencarian memfilter daftar lagu secara real-time
- Tutup panel kembali ke tampilan sebelumnya

### 3.6 Timeline Slider

**Fungsionalitas**:
- Timeline horizontal yang mencakup 1980-an hingga saat ini
- Sliding timeline memfilter artis yang terlihat berdasarkan era
- Menyoroti era aktif pada Main Map Canvas
- Menampilkan indikator rentang tahun

### 3.7 Filter Controls

**Filter Mood**:
- Opsi filter: dark, melancholic, jazzy, smoky, urban, cinematic
- Memungkinkan beberapa pilihan
- Memfilter artis dan lagu yang cocok dengan mood yang dipilih

**Filter Lainnya**:
- Filter asal geografis
- Filter era
- Filter tipe pengaruh

### 3.8 Geographic Map View

**Fungsionalitas**:
- Toggle antara peta genre dan peta geografis
- Menampilkan lokasi artis pada peta dunia
- Menyoroti Bristol sebagai titik asal
- Menampilkan penyebaran global Trip-Hop
- Klik lokasi menampilkan artis dari wilayah tersebut

### 3.9 Fitur Khusus

**Interactive Influence Network**:
- Memvisualisasikan koneksi antar artis
- Menampilkan arah dan kekuatan pengaruh
- Filter berdasarkan tipe pengaruh

**Sonic DNA Visualizer**:
- Menampilkan garis keturunan genre dari artis yang dipilih
- Menampilkan breakdown elemen musikal
- Melacak akar ke genre asal

**Discover Similar Engine**:
- Merekomendasikan artis berdasarkan pilihan saat ini
- Mempertimbangkan mood, era, asal geografis, pola pengaruh

**Hidden Deep Cuts Section**:
- Area khusus yang menampilkan rilis trip-hop underground
- Track langka dan artis tidak jelas yang dikurasi
- Dapat diakses melalui eksplorasi atau navigasi khusus

## 4. Aturan Bisnis dan Logika

### 4.1 Aturan Pemrosesan Visual

**Skema Warna**:
- Palet utama: biru monokrom tua yang terinspirasi dari album Dummy Portishead
- Menerapkan efek pengindeksan warna dan posterisasi
- Menggunakan gradien dithered
- Menerapkan bayangan biru-hitam
- Menambahkan overlay grain
- Menerapkan perlakuan fotografi cahaya rendah
- Menyertakan tekstur Xerox dan artefak offset printing
- Menerapkan pemrosesan gambar monokrom dengan efek cahaya biru

**Pemrosesan Cover Album**:
- Mengonversi semua cover album ke versi terindeks monokrom biru
- Menerapkan posterisasi dan dithering
- Mempertahankan pengenalan sambil mencapai estetika arsip

**Pemrosesan Gambar Artis**:
- Mengambil gambar artis dari URL nyata (cover album atau foto artis)
- Menerapkan CSS filter: sepia(1) hue-rotate(190deg) saturate(2) brightness(0.65)
- Merender sebagai thumbnail melingkar yang dipotong dalam lingkaran node artis canvas
- Gambar sesuai dengan estetika arsip monokrom biru tua

### 4.2 Aturan Animasi

**Pergerakan Kamera**:
- Pergerakan inersia halus dengan momentum
- Transisi zoom dengan efek blur-to-focus
- Parallax ambient lambat untuk elemen background

**Perilaku Node**:
- Simulasi fisika drift halus
- Hover memicu efek reaktif noise
- Klik memicu animasi ekspansi

**Transisi**:
- Transisi pixelated antar tampilan
- Overlay glitch VHS pada perubahan state
- Efek gerakan cairan

**Animasi Background**:
- Visual abstrak atmosferik berkelanjutan
- Partikel reaktif audio saat musik diputar

### 4.3 Encoding Visual Garis Koneksi

**Ketebalan Garis**:
- Tebal: kolaborasi langsung antar artis
- Sedang: hubungan pengaruh kuat
- Tipis: koneksi scene/era

**Warna/Opacity Garis**:
- Warna atau tingkat opacity yang berbeda membedakan:
  + Koneksi kolaborasi
  + Koneksi pengaruh
  + Koneksi label bersama

**Tooltip Hover**:
- Menampilkan deskripsi hubungan saat hover di atas garis koneksi
- Menyertakan tipe hubungan dan konteks

### 4.4 Prioritas Embed Media

**Prioritas Sumber Embed**:
1. Embed YouTube
2. Embed SoundCloud
3. Embed Bandcamp
4. Embed Archive.org
5. Embed platform streaming underground

**Logika Fetch**:
- Mencoba sumber dalam urutan prioritas
- Menggunakan embed pertama yang tersedia
- Menampilkan placeholder jika tidak ada embed yang tersedia

### 4.5 Aturan Desain Suara

**Audio Ambient**:
- Crackle vinyl volume rendah diputar saat loading awal
- Suara UI halus yang terinspirasi dari klik tape dan static radio pada interaksi
- Fade in/out halus

### 4.6 Logika Rekomendasi

**Algoritma Discover Similar**:
- Menghitung kesamaan berdasarkan: tag mood, kedekatan era, asal geografis, pengaruh bersama, karakteristik blend genre
- Mengurutkan rekomendasi berdasarkan skor kesamaan
- Menampilkan kecocokan teratas

### 4.7 Aturan Manajemen Playlist

**Add to Playlist**:
- Pengguna mengklik tombol Add to Playlist pada lagu apa pun
- Lagu ditambahkan ke akhir antrian playlist pribadi
- Lagu duplikat diperbolehkan

**Ekspor Playlist**:
- Export as YouTube Playlist Link menghasilkan URL yang dapat dibagikan dengan semua link YouTube
- Copy as Text memformat playlist sebagai: Judul Lagu - Nama Artis (Link YouTube) satu per baris

**Bagikan Playlist**:
- Encode playlist pribadi sebagai string JSON base64 terkompresi
- Tambahkan string yang di-encode ke hash URL (#playlist=...)
- Klik tombol Share Playlist menyalin URL lengkap ke clipboard
- Saat loading halaman, deteksi parameter playlist di hash URL
- Decode hash dan pre-populate playlist

**Ekspor Spotify**:
- Pengguna mengklik tombol Export to Spotify
- Memulai alur Spotify OAuth PKCE
- Redirect ke halaman otorisasi Spotify dengan scope yang diperlukan: playlist-modify-public, playlist-modify-private
- Setelah pengguna mengotorisasi, Spotify redirect kembali dengan kode otorisasi
- Tukar kode untuk access token
- Membuat playlist Spotify baru melalui Spotify Web API
- Untuk setiap lagu dalam playlist pribadi, cari Spotify berdasarkan judul + artis
- Tambahkan track yang ditemukan ke playlist yang dibuat
- Menampilkan pesan sukses dengan link ke playlist Spotify
- Menangani error: kegagalan otorisasi, kegagalan pencarian, error API

**Perilaku Playlist Terkurasi**:
- Playlist yang telah dibuat sebelumnya bersifat read-only
- Pengguna dapat menambahkan seluruh playlist terkurasi ke playlist pribadi
- Pengguna dapat menambahkan lagu individual dari playlist terkurasi ke playlist pribadi

### 4.8 Database Artis dan Posisi

**Cakupan Artis Lengkap**:
- Database mencakup semua artis trip-hop signifikan di semua era
- Setiap artis memiliki metadata lengkap: biografi, album, lagu dengan YouTube ID, asal geografis, era, pengaruh, tag mood, koordinat x/y canvas, hubungan koneksi
- Setiap artis harus memiliki setidaknya 2 lagu dengan YouTube video ID nyata
- Lagu menekankan hidden gems dan deep cuts di samping track terkenal

**Logika Posisi Canvas**:
- Era Origins (1980-1992): koordinat x 0-25% dari lebar canvas, sisi kiri
- Golden Age (1993-1999): koordinat x 25-50% dari lebar canvas, tengah-kiri
- Era Expansion (2000-2010): koordinat x 50-75% dari lebar canvas, tengah-kanan
- Modern Hybrid (2010-present): koordinat x 75-100% dari lebar canvas, sisi kanan
- Artis dalam setiap era tersebar vertikal untuk menghindari tumpang tindih
- Jarak minimum antar node memastikan keterbacaan

**Artis Kontemporer Global (Post-2015)**:
- Artis tambahan dari scene global ditambahkan ke node Modern Hybrid
- Jepang: Meitei, Foodman, Ovall
- Amerika Selatan: Nicola Cruz, C.Tangana, Ceu, Dengue Dengue Dengue
- Afrika: Fatoumata Diawara, Moonchild Sanelly, BLK JKS, Awesome Tapes From Africa collective, Thandiswa Mazwai, Petite Noir, Mdou Moctar, Baloji
- Eropa: Nils Frahm, Apparat, Brandt Brauer Frick, James Holden
- Wilayah lain: Ibeyi, Blue Daisy, Shabazz Palaces, Kode9
- Masing-masing dengan biografi lengkap, album, setidaknya 2 lagu dengan YouTube ID, koordinat, koneksi

**Artis Tambahan Era Origins**:
- Björk (Iceland) - debut era
- Cocteau Twins/Elizabeth Fraser (Scotland)
- On-U Sound/Adrian Sherwood (UK)
- The Pop Group/Mark Stewart (UK)
- Keith LeBlanc (USA)
- Masing-masing dengan data lengkap: biografi, album, lagu dengan YouTube ID, koordinat, koneksi

**Artis Tambahan Era Golden Age**:
- Earthling (UK) - dengan enrichment lengkap
- Antipop Consortium (USA)
- Mono (UK)
- Euphoria (UK)
- Masing-masing dengan data lengkap: biografi, album, lagu dengan YouTube ID, koordinat, koneksi

**Artis Tambahan Era Expansion**:
- Emiliana Torrini (Iceland)
- Bitter:Sweet (USA)
- Charlotte Gainsbourg (France)
- Lhasa de Sela (Canada/Mexico)
- Múm (Iceland)
- Erykah Badu (USA, neo-soul/trip-hop crossover)
- Amy Winehouse (UK, adjacent production style)
- Cibelle (Brazil)
- Andreya Triana (UK)
- BadBadNotGood (Canada)
- Hiatus Kaiyote (Australia)
- Esthero (Canada)
- El Guincho (Spain/Canary Islands)
- Khruangbin (USA)
- Masing-masing dengan data lengkap: biografi, album, lagu dengan YouTube ID, koordinat, koneksi

**Artis Tambahan Era Modern Hybrid**:
- Kelsey Lu (USA)
- billy woods (USA)
- Bon Iver (USA, adjacent)
- Beach House (USA, adjacent)
- Jlin (USA)
- Pinch (UK)
- Raime (UK)
- Darkside/Nicolas Jaar project (USA)
- serpentwithfeet (USA)
- Ibeyi (France/Cuba)
- Blue Daisy (UK)
- Shabazz Palaces (USA)
- Kode9 (UK)
- Meitei (Japan)
- Foodman (Japan)
- Ovall (Japan)
- Nicola Cruz (Ecuador)
- C.Tangana (Spain)
- Ceu (Brazil)
- Dengue Dengue Dengue (Peru)
- Fatoumata Diawara (Mali)
- Moonchild Sanelly (South Africa)
- BLK JKS (South Africa)
- Awesome Tapes From Africa collective (Ghana)
- Thandiswa Mazwai (South Africa)
- Petite Noir (South Africa/Belgium)
- Mdou Moctar (Niger)
- Baloji (DRC/Belgium)
- Nils Frahm (Germany)
- Apparat (Germany)
- Brandt Brauer Frick (Germany)
- James Holden (UK)
- Masing-masing dengan data lengkap: biografi, album, lagu dengan YouTube ID, koordinat, koneksi

### 4.9 Integrasi Songs Discovery

**Data Lagu**:
- Semua lagu di semua artis tersedia di Songs Discovery Panel
- Setiap lagu mencakup: judul, nama artis, YouTube ID, tag mood, era

**Logika Filter dan Pencarian**:
- Filter mood mencocokkan lagu dengan tag mood yang dipilih
- Filter era mencocokkan lagu dari era yang dipilih
- Query pencarian mencocokkan judul lagu atau nama artis (case-insensitive, partial match)
- Beberapa filter diterapkan dengan logika AND
- Filtering real-time saat pengguna mengetik atau memilih filter

**Integrasi dengan Playlist**:
- Tombol Add to Playlist di Songs Discovery Panel menambahkan lagu ke playlist pribadi
- Perilaku yang sama dengan Add to Playlist di panel lain

## 5. Pengecualian dan Kasus Tepi

| Skenario | Penanganan |
|----------|------------|
| Artis/lagu tidak memiliki embed media yang tersedia | Menampilkan placeholder dengan penjelasan teks, menyediakan link eksternal jika tersedia |
| Artis tidak memiliki cover album | Menggunakan placeholder yang dihasilkan dengan gaya arsip dengan nama artis |
| Perangkat pengguna tidak mendukung rendering yang diperlukan | Menampilkan versi statis fallback dengan konten inti yang dapat diakses |
| Kegagalan jaringan selama loading media | Menampilkan opsi retry, menampilkan konten yang di-cache jika tersedia |
| Kombinasi filter tidak menghasilkan hasil | Menampilkan pesan dan menyarankan filter alternatif |
| Artis tidak memiliki data geografis | Dihilangkan dari peta geografis, dipertahankan di peta genre |
| Data pengaruh tidak lengkap | Menampilkan hanya koneksi yang tersedia |
| Timeline slider di tahun batas | Menonaktifkan sliding lebih lanjut ke arah tersebut |
| Pengguna mencoba mengekspor playlist kosong | Menampilkan pesan yang menunjukkan playlist kosong |
| Link YouTube tidak tersedia selama ekspor playlist | Menyertakan teks placeholder untuk link yang tidak tersedia |
| Lagu playlist terkurasi tidak memiliki link YouTube | Menampilkan lagu dengan catatan bahwa link tidak tersedia |
| Pengguna menambahkan lagu yang sama beberapa kali | Memungkinkan duplikat dalam playlist pribadi |
| Data playlist di hash URL rusak atau tidak valid | Mengabaikan hash yang tidak valid, memuat playlist kosong |
| URL gambar artis tidak valid atau gagal dimuat | Menampilkan ikon placeholder default atau inisial nama artis |
| Data playlist terlalu besar menyebabkan URL terlalu panjang | Mengompresi data JSON, memotong atau meminta pengguna jika perlu |
| Otorisasi Spotify OAuth gagal | Menampilkan pesan error, memungkinkan pengguna untuk retry |
| Pencarian Spotify API tidak mengembalikan hasil untuk lagu | Melewati lagu, mencatat kegagalan, melanjutkan dengan lagu yang tersisa |
| Batas rate Spotify API terlampaui | Menampilkan pesan error, menyarankan retry nanti |
| Pengguna menolak otorisasi Spotify | Kembali ke Playlist Panel, menampilkan pesan bahwa otorisasi diperlukan |
| Filter Songs Discovery Panel tidak menghasilkan hasil | Menampilkan pesan yang menunjukkan tidak ada lagu yang cocok dengan filter |
| Query pencarian Songs Discovery Panel tidak menghasilkan hasil | Menampilkan pesan yang menunjukkan tidak ada lagu yang cocok dengan pencarian |

## 6. Kriteria Penerimaan

1. Pengguna mengakses halaman, Main Map Canvas menampilkan empat node era dengan database artis yang diperluas, semua artis yang ditentukan diposisikan pada canvas berdasarkan koordinat x berbasis era, setiap node artis menampilkan thumbnail melingkar dengan filter monokrom biru tua yang diterapkan
2. Pengguna mengklik node FKA Twigs di bagian Modern Hybrid di sisi kanan
3. Artist Archive Panel terbuka menampilkan biografi lengkap, timeline album, embedded media player, dan tombol Add to Playlist
4. Pengguna mengklik tombol Add to Playlist pada salah satu lagu FKA Twigs
5. Pengguna membuka Playlist Panel, melihat lagu ditambahkan ke playlist pribadi dengan link YouTube
6. Pengguna mengklik tombol Export to Spotify, sistem redirect ke halaman otorisasi Spotify
7. Pengguna mengotorisasi aplikasi, sistem redirect kembali dan membuat playlist Spotify dengan lagu dari playlist pribadi
8. Pengguna melihat pesan sukses dengan link ke playlist Spotify yang dibuat
9. Pengguna membuka Songs Discovery Panel, melihat daftar semua lagu di semua artis
10. Pengguna menerapkan filter mood untuk dark dan mencari portishead, melihat daftar lagu yang difilter
11. Pengguna mengklik Add to Playlist pada lagu dari Songs Discovery Panel, lagu ditambahkan ke playlist pribadi
12. Pengguna hover di atas garis koneksi antara dua artis pada Main Map Canvas, melihat tooltip yang menjelaskan tipe hubungan dan konteks

## 7. Tidak Termasuk dalam Rilis Ini

- Akun pengguna dan personalisasi
- Fitur berbagi sosial di luar berbagi URL playlist
- Komentar atau rating pengguna
- Sistem pengajuan artis
- Versi aplikasi mobile
- Mode offline
- Dukungan multi-bahasa
- Fitur aksesibilitas di luar standar web dasar
- Integrasi dengan layanan streaming musik eksternal di luar ekspor Spotify dan embed
- Fungsi pembelian atau download
- Informasi konser atau acara
- Integrasi merchandise
- Newsletter atau sistem notifikasi
- Analitik atau tracking lanjutan
- Fitur komunitas
- Editing kolaboratif
- Kolaborasi atau berbagi playlist antar pengguna di luar berbagi URL
- Fungsi sorting atau reordering playlist
- Fungsi pencarian playlist dalam playlist pribadi
- Ekspor ke Apple Music, YouTube Music, atau platform streaming lain di luar Spotify
- Sinkronisasi playlist otomatis dengan Spotify
- Kontrol pemutaran Spotify dalam aplikasi
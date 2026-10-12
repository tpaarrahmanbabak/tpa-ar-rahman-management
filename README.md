# TPA Ar-Rahman Management App

Aplikasi web manajemen TPA Ar-Rahman yang mencakup:
- Login multi-role
- Dashboard dan navigasi cepat
- Pendaftaran santri
- Profil TPA
- Struktur organisasi
- Generator kartu ucapan
- Penilaian UKT
- Export PDF
- Pengaturan akun khusus admin

## Cara menjalankan

1. Buka file `index.html` di browser.
2. Gunakan login berikut:
   - Admin: ID `admin` / Password `Kevinganteng313`
   - Wali Santri: ID `wali santri` / Password `walisantri123`

## Catatan

- Kredensial admin tidak ditampilkan di halaman login.
- Data disimpan di `localStorage` browser.
- Fitur export PDF dibangun menggunakan library JS via CDN.

## Struktur aplikasi

- `index.html`
- `styles.css`
- `app.js`

## Fitur utama

- Dashboard & navigasi cepat ke seluruh halaman
- Pendaftaran dan manajemen santri
- Profil TPA dengan nama, alamat, tanggal berdiri, sejarah, tagline, dan logo
- Struktur organisasi untuk pengajar dan pengurus
- Kartu ucapan otomatis dengan pratinjau
- Penilaian UKT dengan tingkat Dasar, Menengah, dan Lanjutan
- Download PDF untuk data santri, absensi, leger nilai, dan rapor
- Pengaturan akun hanya untuk admin

## Catatan teknis

Aplikasi ini dibuat sebagai aplikasi web frontend statis agar mudah dijalankan tanpa instalasi server tambahan.

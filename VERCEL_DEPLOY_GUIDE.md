# Panduan Deploy ke Vercel

Konfigurasi untuk Vercel sudah saya siapkan di dalam file `vercel.json`. File ini memastikan aplikasi React (SPA) Anda berjalan lancar saat halaman di-refresh.

## 1. Konfigurasi yang Sudah Ada (Otomatis)

Anda **TIDAK PERLU** mengubah kode apa pun.
*   **File `vercel.json`**: Sudah dibuat untuk menangani routing (agar tidak error 404 saat refresh).
*   **File `package.json`**: Script `build` sudah siap.
*   **File `vite.config.ts`**: Sudah standar untuk Vercel.

## 2. Cara Deploy (Langkah-demi-Langkah)

Ikuti langkah mudah ini untuk meng-online-kan aplikasi:

### Langkah A: Upload ke GitHub (Wajib Dulu)
1.  Download kode ini (tombol Export/Download ZIP).
2.  Ekstrak di komputer.
3.  Upload ke repository GitHub baru Anda (lihat panduan `PANDUAN_SANGAT_MUDAH.md` jika lupa).

### Langkah B: Hubungkan ke Vercel
1.  Buka **[vercel.com](https://vercel.com)**.
2.  Login menggunakan akun **GitHub** Anda.
3.  Di halaman dashboard, klik tombol **"Add New..."** -> Pilih **"Project"**.
4.  Di daftar "Import Git Repository", cari nama repository aplikasi ini (misal: `spensa-digital`).
5.  Klik tombol **Import** di sebelahnya.

### Langkah C: Konfigurasi di Vercel
Di halaman "Configure Project", Vercel biasanya sudah pintar mendeteksi settingan.
Pastikan settingannya seperti ini:

*   **Framework Preset**: `Vite` (Vercel biasanya otomatis memilih ini).
*   **Root Directory**: `./` (Biarkan kosong/default).
*   **Build Command**: `npm run build` (Default).
*   **Output Directory**: `dist` (Default).
*   **Environment Variables**: (Kosongkan saja, kecuali Anda nanti pakai database luar).

### Langkah D: Eksekusi
1.  Klik tombol biru **Deploy**.
2.  Tunggu sekitar 1-2 menit. Anda akan melihat log berjalan.
3.  Jika berhasil, layar akan penuh dengan kembang api (konfeti).
4.  Klik gambar website atau tombol **Visit**.

### Selesai!
Website Anda sekarang sudah online dengan alamat seperti `https://spensa-digital.vercel.app`.
Link ini bisa dibuka di HP, Laptop, atau Tablet siapa saja.

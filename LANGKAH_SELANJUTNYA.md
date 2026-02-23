# Langkah Selanjutnya: Menghubungkan & Mempublish

Setelah Anda membuat repository kosong di GitHub, sekarang saatnya **mengisi** repository tersebut dengan kode aplikasi ini, lalu **membuatnya online (live)** agar bisa diakses orang lain.

## Tahap 1: Upload Kode ke GitHub (Push)

Lakukan ini di **Terminal** komputer Anda (di dalam folder proyek ini):

1.  **Siapkan Git di komputer:**
    ```bash
    git init
    git add .
    git commit -m "Upload aplikasi pertama"
    git branch -M main
    ```

2.  **Hubungkan ke GitHub:**
    *   Copy URL repository Anda dari halaman GitHub (yang berakhiran `.git`).
    *   Ketik perintah ini (ganti URL-nya):
    ```bash
    git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
    ```

3.  **Kirim Kode:**
    ```bash
    git push -u origin main
    ```

*Jika berhasil, halaman GitHub Anda akan berisi banyak file saat di-refresh.*

---

## Tahap 2: Mempublish Aplikasi (Deploy)

Agar aplikasi bisa dibuka di HP atau komputer lain tanpa install, kita gunakan **Vercel** (gratis & mudah).

1.  Buka **[vercel.com](https://vercel.com)** dan **Sign Up** menggunakan akun **GitHub** Anda.
2.  Di dashboard Vercel, klik tombol **"Add New..."** -> **"Project"**.
3.  Anda akan melihat daftar repository GitHub Anda. Cari repository yang baru saja Anda upload, lalu klik **Import**.
4.  Di halaman konfigurasi:
    *   **Framework Preset**: Pastikan terpilih **Vite**.
    *   **Root Directory**: Biarkan `./`.
    *   Klik tombol **Deploy**.

## Selesai! 🎉

Tunggu sekitar 1-2 menit. Vercel akan memberikan **Link Website** (contoh: `https://spensa-app.vercel.app`).

Link tersebut bisa Anda bagikan ke guru-guru lain atau siswa untuk diakses kapan saja.

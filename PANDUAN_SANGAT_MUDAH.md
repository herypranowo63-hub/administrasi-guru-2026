# Panduan Sangat Mudah (Untuk Pemula)

Jika Anda bingung dengan perintah-perintah terminal (layar hitam), gunakan **Cara 1** di bawah ini. Ini cara paling visual dan mudah.

---

## Opsi 1: Cara "Drag & Drop" (Tanpa Terminal)

Cocok jika Anda tidak ingin mengetik perintah kode.

### Langkah 1: Download Kode
1.  Di pojok kanan atas editor ini, cari tombol **Download** atau **Export**.
2.  Pilih **Download as ZIP**.
3.  Setelah selesai, buka file ZIP tersebut dan **Ekstrak** (Extract) isinya ke sebuah folder di komputer Anda.

### Langkah 2: Upload ke GitHub
1.  Buka [github.com](https://github.com) dan login.
2.  Klik tombol **+** di pojok kanan atas -> **New repository**.
3.  Beri nama (misal: `aplikasi-sekolah`), pilih **Public**, lalu klik **Create repository**.
4.  Di halaman selanjutnya, cari tulisan kecil: **"uploading an existing file"**. Klik link tersebut.
5.  Buka folder hasil ekstrak tadi di komputer Anda.
6.  **Pilih semua file** di dalam folder tersebut, lalu **Tarik (Drag & Drop)** ke halaman GitHub di browser.
7.  Tunggu proses upload selesai.
8.  Di bawah, ketik pesan "Upload pertama" pada kotak "Commit changes", lalu klik tombol hijau **Commit changes**.

### Langkah 3: Online-kan dengan Vercel
1.  Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub.
2.  Klik **Add New...** -> **Project**.
3.  Anda akan melihat `aplikasi-sekolah` di daftar. Klik **Import**.
4.  Klik **Deploy**.
5.  Tunggu sebentar, dan aplikasi Anda sudah online!

---

## Opsi 2: Cara Menggunakan Terminal (Lebih Rapi)

Gunakan cara ini jika Anda ingin belajar cara "standar" programmer.

1.  Pastikan sudah install **Git** di komputer.
2.  Buka folder proyek Anda. Klik kanan di ruang kosong -> pilih **"Open in Terminal"** atau **"Git Bash Here"**.
3.  Ketik (copy-paste) perintah ini satu per satu lalu tekan Enter:

    ```bash
    git init
    ```
    *(Menyiapkan folder)*

    ```bash
    git add .
    ```
    *(Memilih semua file)*

    ```bash
    git commit -m "Versi pertama"
    ```
    *(Membungkus file)*

    ```bash
    git branch -M main
    ```
    *(Mengatur cabang utama)*

    ```bash
    git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
    ```
    *(Ganti URL dengan link repository GitHub Anda yang baru dibuat)*

    ```bash
    git push -u origin main
    ```
    *(Mengirim file ke GitHub)*

4.  Lanjut ke **Langkah 3** (Vercel) di atas.

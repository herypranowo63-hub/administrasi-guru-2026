# Panduan Upload ke GitHub & Deploy

Berikut adalah langkah-langkah lengkap dan mudah untuk menyimpan kode aplikasi ini ke GitHub dan mem-publish-nya agar bisa diakses online.

## Bagian 1: Persiapan Awal

Pastikan Anda sudah memiliki:
1.  **Akun GitHub**: Daftar di [github.com](https://github.com) jika belum punya.
2.  **Git Terinstall**: Download dan install [Git SCM](https://git-scm.com/downloads) di komputer Anda.

## Bagian 2: Menyiapkan Kode di Komputer (Local)

Buka terminal (Command Prompt / PowerShell / Terminal VS Code) di folder proyek ini, lalu ketik perintah berikut satu per satu:

1.  **Inisialisasi Git**
    ```bash
    git init
    ```
    *Ini akan membuat folder .git tersembunyi untuk melacak perubahan.*

2.  **Ubah nama cabang utama ke 'main'** (opsional tapi disarankan)
    ```bash
    git branch -M main
    ```

3.  **Siapkan semua file**
    ```bash
    git add .
    ```
    *Perintah ini memasukkan semua file ke dalam daftar tunggu untuk disimpan.*

4.  **Simpan perubahan (Commit)**
    ```bash
    git commit -m "Upload pertama aplikasi SPENSA Digital"
    ```
    *Ini menyimpan "foto" kondisi kode Anda saat ini.*

## Bagian 3: Membuat Repository di GitHub

1.  Buka [github.com/new](https://github.com/new).
2.  Isi **Repository name** (contoh: `spensa-digital`).
3.  Pilih **Public** (agar bisa dilihat orang lain) atau **Private**.
4.  Jangan centang "Add a README file" (karena kita sudah punya).
5.  Klik tombol hijau **Create repository**.

## Bagian 4: Menghubungkan dan Upload (Push)

Setelah repository jadi, Anda akan melihat halaman dengan beberapa kode. Cari bagian **"…or push an existing repository from the command line"**.

Copy dan paste perintah yang muncul di sana ke terminal Anda. Biasanya terlihat seperti ini:

1.  **Hubungkan ke GitHub**
    ```bash
    git remote add origin https://github.com/USERNAME_ANDA/spensa-digital.git
    ```
    *(Ganti `USERNAME_ANDA` dengan username GitHub Anda)*

2.  **Upload Kode**
    ```bash
    git push -u origin main
    ```

*Catatan: Jika diminta login, masukkan username dan password GitHub Anda (atau Personal Access Token jika password tidak bisa).*

## Bagian 5: Mem-publish Aplikasi (Agar Bisa Diakses Online)

Cara termudah adalah menggunakan **Vercel** (gratis dan otomatis):

1.  Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2.  Klik **"Add New..."** > **"Project"**.
3.  Anda akan melihat repository `spensa-digital` yang baru saja Anda upload. Klik **Import**.
4.  Di halaman konfigurasi:
    *   **Framework Preset**: Pilih `Vite`.
    *   **Root Directory**: Biarkan `./`.
    *   Klik **Deploy**.

Tunggu sebentar, dan aplikasi Anda akan live! Anda akan mendapatkan link seperti `https://spensa-digital.vercel.app`.

---

## Cara Update Aplikasi di Masa Depan

Jika Anda mengubah kode (misal: menambah fitur baru), lakukan langkah ini di terminal:

1.  `git add .`
2.  `git commit -m "Menambahkan fitur baru..."`
3.  `git push`

Vercel akan otomatis mendeteksi perubahan dan meng-update website Anda dalam beberapa menit.

# Langkah Selanjutnya: Mengupload Kode ke GitHub

Karena Anda sudah membuat repository kosong di GitHub, sekarang saatnya mengisi repository tersebut dengan kode aplikasi ini.

Ikuti langkah-langkah berikut di **Terminal** (Command Prompt / PowerShell / Terminal VS Code) di dalam folder proyek ini:

### Langkah 1: Inisialisasi Git (Menyiapkan Folder)
Ketik perintah ini untuk memberitahu komputer bahwa folder ini akan dikelola oleh Git.
```bash
git init
```
*(Jika muncul tulisan "Reinitialized existing Git repository", itu tidak apa-apa, lanjut saja).*

### Langkah 2: Memilih Semua File
Perintah ini akan memasukkan semua file aplikasi ke dalam daftar antrian untuk disimpan.
```bash
git add .
```
*(Jangan lupa tanda titik di akhir).*

### Langkah 3: Menyimpan Perubahan (Commit)
Kita akan membungkus file-file tersebut dengan pesan "Upload Pertama".
```bash
git commit -m "Upload Pertama Aplikasi SPENSA"
```

### Langkah 4: Mengubah Nama Cabang Utama
Standar GitHub sekarang menggunakan `main` sebagai cabang utama (dulu `master`).
```bash
git branch -M main
```

### Langkah 5: Menghubungkan ke Repository GitHub Anda
**PENTING:** Anda perlu URL repository yang baru saja Anda buat.
URL-nya biasanya terlihat seperti: `https://github.com/USERNAME_ANDA/NAMA_REPO.git`

Ganti `URL_REPOSITORY_ANDA` di bawah ini dengan URL milik Anda:
```bash
git remote add origin URL_REPOSITORY_ANDA
```
*Contoh: `git remote add origin https://github.com/srisulastri/spensa-app.git`*

### Langkah 6: Mengirim Kode (Push)
Ini adalah langkah terakhir untuk mengirim file dari komputer ke GitHub.
```bash
git push -u origin main
```

---

### Apa yang terjadi setelah Langkah 6?

1.  Terminal mungkin akan meminta **Username** dan **Password** GitHub Anda.
    *   Masukkan Username GitHub Anda.
    *   Untuk Password: Sejak 2021, GitHub **tidak menerima password akun biasa** untuk terminal. Anda harus menggunakan **Personal Access Token (PAT)**.
    *   *Jika Anda belum punya Token, lihat panduan di bawah.*

2.  Jika berhasil, akan muncul tulisan seperti `Branch 'main' set up to track remote branch 'main' from 'origin'`.
3.  Coba refresh halaman repository GitHub Anda. Kode aplikasi seharusnya sudah muncul di sana!

---

### Cara Mendapatkan Password (Personal Access Token) jika Gagal Login

Jika saat `git push` Anda gagal login dengan password akun:

1.  Login ke GitHub.com di browser.
2.  Klik Foto Profil (kanan atas) > **Settings**.
3.  Scroll ke paling bawah kiri > **Developer settings**.
4.  Pilih **Personal access tokens** > **Tokens (classic)**.
5.  Klik **Generate new token** > **Generate new token (classic)**.
6.  Isi Note (misal: "Laptop Sekolah").
7.  Centang kotak **repo** (ini wajib agar bisa upload kode).
8.  Scroll ke bawah, klik **Generate token**.
9.  **COPY kode panjang yang muncul** (ghp_...). Kode ini hanya muncul sekali!
10. Gunakan kode ini sebagai **Password** saat terminal memintanya.

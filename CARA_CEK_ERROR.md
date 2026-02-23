# DIAGNOSA & SOLUSI "BLANK SCREEN"

Jika layar masih putih (blank), biasanya ada 2 penyebab utama:
1.  **Error Kode (JavaScript Crash)**: Ada kode yang error saat dijalankan.
2.  **Gagal Load File (404)**: Browser tidak bisa mengambil file JS/CSS.

## APA YANG BARU SAJA SAYA LAKUKAN?

1.  **Menambah "Error Boundary"**:
    Sekarang, jika ada error kode, layar TIDAK AKAN PUTIH LAGI. Akan muncul pesan error merah.
    *   *Jika muncul pesan merah*: Tolong beritahu saya apa pesan errornya.
    *   *Jika masih putih bersih*: Berarti masalahnya ada di **Vercel Settings** (Gagal Load File).

2.  **Memperbaiki `vercel.json`**:
    Saya mengubah aturan agar Vercel tidak "bingung" membedakan antara halaman website dan file gambar/script.

## TUGAS ANDA (WAJIB)

1.  **Download & Upload Ulang** kode ini ke GitHub.
2.  **Redeploy** di Vercel.
3.  **Buka Website Anda**.

### JIKA MASIH PUTIH (BLANK):
Coba buka **Console Browser** di HP/Laptop:
*   (Di Laptop) Klik Kanan -> Inspect -> Console.
*   Lihat apakah ada tulisan merah?
    *   Jika ada tulisan `Failed to load resource: the server responded with a status of 404`, berarti **Settingan Root Directory** di Vercel salah.
    *   Pastikan di Vercel > Settings > General > **Root Directory** sudah benar (Kosongkan jika `package.json` ada di luar).

### JIKA MUNCUL PESAN ERROR MERAH DI LAYAR:
Tuliskan pesan error tersebut ke saya, dan saya akan perbaiki kodenya detik itu juga.

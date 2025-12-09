# 🚀 Setup Midtrans untuk Testing

## Langkah 1: Registrasi/Login ke Midtrans

### A. Jika Belum Punya Akun (Registrasi Baru)

1. **Buka** https://dashboard.midtrans.com/register
2. **Isi form registrasi**:
   - Email bisnis Anda
   - Password (minimal 8 karakter)
   - Nama lengkap
   - Nomor telepon
3. **Klik "Sign Up"**
4. **Verifikasi email**: Cek inbox email Anda dan klik link verifikasi
5. **Login** dengan akun yang baru dibuat

### B. Jika Sudah Punya Akun (Login)

1. **Buka** https://dashboard.midtrans.com/login
2. **Masukkan**:
   - Email Anda
   - Password Anda
3. **Klik "Sign In"**

---

## Langkah 2: Mendapatkan API Keys (Sandbox)

Setelah login ke dashboard Midtrans:

### 1. **Masuk ke Settings**
   - Di sidebar kiri, klik **"Settings"**
   - Atau langsung ke: https://dashboard.midtrans.com/settings

### 2. **Pilih Access Keys**
   - Klik menu **"Access Keys"**
   - Pastikan Anda di tab **"Sandbox"** (untuk testing)

### 3. **Copy API Keys**
   
   Anda akan melihat 2 keys:
   
   #### **Server Key**
   - Format: `SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx`
   - Digunakan di backend (Laravel)
   - **JANGAN SHARE** key ini ke publik
   
   #### **Client Key**
   - Format: `SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx`
   - Digunakan di frontend (React/JavaScript)
   - Aman untuk digunakan di browser

### 4. **Copy kedua keys tersebut**

---

## Langkah 3: Setup di Project Laravel

### 1. **Buka file `.env`**
   
   Lokasi: `d:\iuran-pgri-main\.env`

### 2. **Tambahkan/Update konfigurasi Midtrans**

   Tambahkan di bagian bawah file `.env`:

   ```env
   # Midtrans Configuration
   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx
   MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx
   MIDTRANS_IS_PRODUCTION=false
   MIDTRANS_IS_SANITIZED=true
   MIDTRANS_IS_3DS=true
   ```

   **Ganti** `xxxxxxxxxxxxxxxxxxxxxxxx` dengan keys yang Anda copy dari dashboard Midtrans.

### 3. **Save file `.env`**

### 4. **Clear config cache** (opsional tapi disarankan)

   Jalankan di terminal:
   ```bash
   php artisan config:clear
   ```

---

## Langkah 4: Testing Pembayaran

### 1. **Buka halaman pembayaran**
   
   URL: http://localhost:8000/kabupaten/dashboard/iuran/create

### 2. **Isi form pembayaran**
   - **Jumlah**: Contoh: 50000 (Rp 50.000)
   - **Deskripsi**: Contoh: "Test Pembayaran Iuran"

### 3. **Klik "Bayar Sekarang"**
   
   Popup Midtrans akan muncul dengan berbagai pilihan pembayaran.

### 4. **Pilih metode pembayaran**
   
   Untuk testing, gunakan **Credit Card**

### 5. **Gunakan Test Credit Card**

   Midtrans menyediakan test card numbers:

   #### ✅ **Success Transaction**
   ```
   Card Number: 4811 1111 1111 1114
   CVV: 123
   Exp Date: 01/25 (atau bulan/tahun di masa depan)
   ```

   #### ⚠️ **Challenge/3DS Transaction**
   ```
   Card Number: 4411 1111 1111 1118
   CVV: 123
   Exp Date: 01/25
   OTP: 112233
   ```

   #### ❌ **Failed Transaction**
   ```
   Card Number: 4911 1111 1111 1113
   CVV: 123
   Exp Date: 01/25
   ```

### 6. **Selesaikan pembayaran**
   
   - Masukkan card number, CVV, dan expiry date
   - Klik "Pay"
   - Untuk 3DS card, masukkan OTP: **112233**
   - Tunggu konfirmasi

### 7. **Verifikasi hasil**
   
   - Anda akan diarahkan kembali ke halaman iuran
   - Cek tabel "Riwayat Pembayaran" di dashboard
   - Status transaksi akan muncul (Berhasil/Pending/Gagal)

---

## Langkah 5: Monitoring Transaksi

### Di Dashboard Midtrans:

1. **Buka** https://dashboard.midtrans.com/transactions
2. **Pilih Environment**: Sandbox
3. **Lihat semua transaksi** yang Anda buat
4. **Klik transaksi** untuk melihat detail lengkap

### Di Aplikasi Laravel:

1. **Dashboard Kabupaten**: http://localhost:8000/kabupaten/dashboard
2. **Scroll ke bawah** untuk melihat "Riwayat Pembayaran"
3. **Atau buka**: http://localhost:8000/kabupaten/dashboard/iuran

---

## 🔧 Troubleshooting

### Problem 1: "Snap token not generated"
**Solusi:**
- Pastikan `MIDTRANS_SERVER_KEY` sudah benar di `.env`
- Jalankan `php artisan config:clear`
- Restart server Laravel

### Problem 2: "Payment popup tidak muncul"
**Solusi:**
- Pastikan `MIDTRANS_CLIENT_KEY` sudah benar di `.env`
- Clear browser cache
- Cek console browser (F12) untuk error

### Problem 3: "Transaction not found"
**Solusi:**
- Pastikan database sudah di-migrate: `php artisan migrate`
- Cek tabel `transactions` di database

### Problem 4: "Webhook not working"
**Solusi:**
- Untuk local testing, webhook tidak akan bekerja
- Gunakan ngrok untuk expose local server:
  ```bash
  ngrok http 8000
  ```
- Set webhook URL di Midtrans dashboard ke ngrok URL

---

## 📚 Referensi

- **Midtrans Docs**: https://docs.midtrans.com/
- **Snap Integration**: https://docs.midtrans.com/en/snap/overview
- **Test Cards**: https://docs.midtrans.com/en/technical-reference/sandbox-test
- **API Reference**: https://api-docs.midtrans.com/

---

## ✅ Checklist Setup

- [ ] Registrasi/Login ke Midtrans Dashboard
- [ ] Copy Server Key dari dashboard
- [ ] Copy Client Key dari dashboard
- [ ] Update file `.env` dengan kedua keys
- [ ] Clear config cache (`php artisan config:clear`)
- [ ] Test pembayaran dengan test card
- [ ] Verifikasi transaksi muncul di dashboard
- [ ] Cek status pembayaran di aplikasi

---

## 🎯 Next Steps

Setelah testing berhasil di Sandbox:

1. **Lengkapi verifikasi bisnis** di Midtrans
2. **Dapatkan Production keys**
3. **Update `.env`**:
   ```env
   MIDTRANS_IS_PRODUCTION=true
   MIDTRANS_SERVER_KEY=Mid-server-xxxxx (production)
   MIDTRANS_CLIENT_KEY=Mid-client-xxxxx (production)
   ```
4. **Setup webhook URL** untuk production
5. **Go Live!** 🚀

---

**Dibuat oleh**: Antigravity AI Assistant
**Tanggal**: 8 Desember 2025
**Project**: PGRI Iuran Management System

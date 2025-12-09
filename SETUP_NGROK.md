# 🚀 Setup Ngrok untuk Midtrans Webhook

## Langkah 1: Download & Install Ngrok

### Cara Termudah (Recommended):

**Via WinGet (Windows Package Manager):**
```powershell
winget install ngrok
```

**Atau Download Manual:**
1. Buka: https://ngrok.com/download/windows
2. Download file ZIP
3. Extract ke folder (contoh: `C:\ngrok`)
4. Tidak perlu install, langsung bisa dijalankan!

---

## Langkah 2: Setup Ngrok Auth Token (Opsional tapi Recommended)

1. **Buat akun gratis** di https://dashboard.ngrok.com/signup
2. **Login** ke dashboard
3. **Copy Auth Token** dari https://dashboard.ngrok.com/get-started/your-authtoken
4. **Jalankan command** (ganti YOUR_AUTH_TOKEN):
   ```powershell
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

---

## Langkah 3: Jalankan Ngrok

Buka **PowerShell** atau **Command Prompt** dan jalankan:

```powershell
ngrok http 8000
```

**Output yang akan muncul:**
```
ngrok

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x
Region                        Asia Pacific (ap)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**PENTING:** Copy URL **Forwarding** (contoh: `https://abc123xyz.ngrok-free.app`)

---

## Langkah 4: Set Webhook URL di Midtrans Dashboard

1. **Login** ke https://dashboard.midtrans.com/
2. **Klik Settings** → **Configuration**
3. **Scroll ke bagian "Payment Notification URL"**
4. **Masukkan URL**:
   ```
   https://abc123xyz.ngrok-free.app/midtrans/notification
   ```
   ⚠️ **Ganti** `abc123xyz.ngrok-free.app` dengan URL ngrok Anda!

5. **Klik "Update Settings"**

---

## Langkah 5: Test Webhook

1. **Lakukan pembayaran baru** di aplikasi Anda
2. **Selesaikan pembayaran** dengan test card
3. **Cek terminal ngrok** - Anda akan melihat request masuk:
   ```
   POST /midtrans/notification    200 OK
   ```

4. **Cek database** - Status transaksi otomatis terupdate!

---

## 🎯 Cara Menggunakan Ngrok

### **Terminal 1: Laravel Server**
```powershell
cd d:\iuran-pgri-main
php artisan serve
```

### **Terminal 2: Ngrok**
```powershell
ngrok http 8000
```

**Biarkan kedua terminal tetap berjalan!**

---

## 📊 Monitoring Ngrok

Buka browser dan akses: http://localhost:4040

Anda akan melihat:
- ✅ Semua HTTP requests yang masuk
- ✅ Request & Response details
- ✅ Replay requests untuk debugging

---

## ⚠️ Catatan Penting

### **1. URL Ngrok Berubah Setiap Restart**
- Setiap kali restart ngrok, URL akan berbeda
- Anda harus update webhook URL di Midtrans lagi
- **Solusi**: Gunakan akun berbayar untuk static domain

### **2. Ngrok Gratis Limitations**
- ✅ 1 tunnel aktif
- ✅ 40 connections/minute
- ❌ URL berubah setiap restart
- ❌ Tidak ada custom domain

### **3. Untuk Production**
- Jangan gunakan ngrok untuk production!
- Deploy ke server dengan domain tetap
- Set webhook URL ke domain production

---

## 🔧 Troubleshooting

### **Problem 1: "command not found: ngrok"**
**Solusi:**
- Pastikan ngrok sudah di-extract
- Jalankan dari folder ngrok: `.\ngrok http 8000`
- Atau tambahkan ke PATH

### **Problem 2: "ERR_NGROK_108"**
**Solusi:**
- Auth token belum di-set
- Jalankan: `ngrok config add-authtoken YOUR_TOKEN`

### **Problem 3: Webhook masih gagal**
**Solusi:**
- Pastikan Laravel server masih running
- Cek URL webhook di Midtrans sudah benar
- Cek route `/midtrans/notification` ada di `routes/web.php`

---

## ✅ Checklist Setup

- [ ] Download & install ngrok
- [ ] Buat akun ngrok (opsional)
- [ ] Set auth token (opsional)
- [ ] Jalankan `ngrok http 8000`
- [ ] Copy URL forwarding
- [ ] Set webhook URL di Midtrans dashboard
- [ ] Test pembayaran
- [ ] Verifikasi webhook berhasil

---

## 📝 Quick Commands

```powershell
# Install via WinGet
winget install ngrok

# Set auth token
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start ngrok
ngrok http 8000

# Start ngrok dengan custom region
ngrok http 8000 --region=ap

# Start ngrok dengan custom subdomain (berbayar)
ngrok http 8000 --subdomain=myapp
```

---

## 🎓 Next Steps

Setelah ngrok berjalan:

1. ✅ **Test pembayaran** - Status akan auto-update
2. ✅ **Monitor di http://localhost:4040** - Lihat webhook requests
3. ✅ **Cek email Midtrans** - Tidak ada error lagi!

---

**Dibuat oleh**: Antigravity AI Assistant  
**Tanggal**: 8 Desember 2025  
**Project**: PGRI Iuran Management System

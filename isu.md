# Panduan Pembuatan GeoUMKM dengan AI (Metode Hemat Token)

Panduan ini dirancang untuk memandu AI (seperti ChatGPT, Claude, Cursor, atau GitHub Copilot) membangun aplikasi **GeoUMKM** secara bertahap.

Dengan memecah tugas menjadi instruksi (prompt) yang kecil dan spesifik, Anda akan menghemat penggunaan token (biaya API lebih murah) dan mengurangi risiko AI berhalusinasi atau memberikan kode yang terpotong.

---

## Instruksi Dasar (Berikan ke AI di awal percakapan)

Sebelum memulai langkah apa pun, berikan _System Prompt_ ini kepada AI Anda untuk memastikan efisiensi kode:

> **PROMPT AWAL UNTUK AI:**
> "Mulai sekarang, jika kode yang kita bahas mencapai atau lebih dari 100 baris, terapkan protokol 'Modular Labeling'. Bagi kode menjadi bagian-bagian logis dan beri tanda komentar yang unik, misalnya `// START: [NAMA_FITUR]` dan `// END: [NAMA_FITUR]`. Jika ada revisi, jangan tampilkan seluruh kode dari awal. Cukup berikan bagian kode di dalam label yang berubah saja menggunakan format:
> nama file: (nama file)
> Label: (Nama Label)
> Tindakan: (Update/Tambah/Hapus)
> Snippet Kode: (Hanya kode terkait)"

---

## Step-by-Step Prompting (Langkah Pengerjaan)

Jangan berikan semua tugas sekaligus. Berikan **satu prompt per percakapan/sesi**, dan baru lanjut ke prompt berikutnya setelah kode sebelumnya berjalan dengan baik.

### STEP 1: Setup Proyek & Konfigurasi Dasar

**Tujuan:** Menginisialisasi struktur dasar Next.js tanpa membuang token untuk logika bisnis.

> **Prompt 1:**
> "Buat instruksi setup proyek Next.js 14 App Router dengan Tailwind CSS dan TypeScript. Sertakan perintah instalasi untuk library tambahan berikut: `mongoose`, `next-auth`, `zod`, `socket.io-client`, `date-fns`, `next-cloudinary`, `@googlemaps/react-wrapper`. Setelah itu, buatkan struktur folder `app/(auth)`, `app/(buyer)`, `app/(seller)`, `app/(admin)`, dan `lib/models`."

### STEP 2: Koneksi Database & Model Dasar (User & Store)

**Tujuan:** Membuat fondasi database bertahap. Jangan buat semua 6 model sekaligus agar AI tidak kehabisan konteks.

> **Prompt 2:**
> "Buatkan file `lib/db/connect.ts` untuk koneksi ke MongoDB. Kemudian, buatkan dua schema Mongoose menggunakan OOP pattern: `User.model.ts` (role: buyer, seller, admin) dan `Store.model.ts` (menyimpan lokasi dalam bentuk GeoJSON 2dsphere index). Terapkan Modular Labeling pada kode Anda."

### STEP 3: Model Lanjutan (Product, Order, Chat)

> **Prompt 3:**
> "Lanjutkan pembuatan schema Mongoose: `Product.model.ts` (dengan array images Cloudinary), `Order.model.ts` (mencatat orderType delivery/pickup dan status), serta `Chat.model.ts` (array of messages untuk 1 orderId)."

### STEP 4: Setup NextAuth.js

**Tujuan:** Menyiapkan autentikasi sebelum membuat UI agar sesi user bisa digunakan.

> **Prompt 4:**
> "Buatkan konfigurasi NextAuth.js v5 di `app/api/auth/[...nextauth]/route.ts` menggunakan CredentialsProvider yang mengecek data email dan password dari `User.model.ts`. Kembalikan session yang memuat role pengguna. Buatkan juga `middleware.ts` untuk memproteksi path `/seller` dan `/admin`."

### STEP 5: Backend API - Geocoding & Toko Terdekat

**Tujuan:** Mengisolasi logika kompleks integrasi Google Maps dan pencarian Geospatial.

> **Prompt 5:**
> "Buatkan service class `lib/services/GeoService.ts` untuk memanggil Google Maps Geocoding API. Lalu, buat endpoint `app/api/stores/nearby/route.ts` yang menggunakan `$nearSphere` MongoDB untuk mencari toko terdekat berdasarkan `lat` dan `lng`."

### STEP 6: UI Foundation (Komponen Modular)

**Tujuan:** Membangun kepingan UI.

> **Prompt 6:**
> "Buatkan komponen UI React dengan Tailwind: `components/ui/Button.tsx`, `components/product/ProductCard.tsx` (desain seperti TikTok Shop dengan prop rating dan harga), serta struktur `components/dashboard/Sidebar.tsx` yang bisa di-collapse."

### STEP 7: Halaman Buyer (Peta & Produk)

> **Prompt 7:**
> "Buatkan halaman `app/(buyer)/page.tsx` yang memuat Google Maps (menggunakan `@googlemaps/react-wrapper`) di bagian atas, dan grid `ProductCard` di bagian bawah. Gunakan dummy data terlebih dahulu."

### STEP 8: Sistem Checkout & Pengiriman

> **Prompt 8:**
> "Buatkan halaman `app/(buyer)/checkout/page.tsx` dengan formulir. Tambahkan toggle untuk memilih 'Delivery' (memunculkan input alamat) atau 'Pickup' (menampilkan info alamat toko). Tambahkan pilihan metode pembayaran 'Cash' atau 'Transfer'."

### STEP 9: Socket.io Server (Chat Real-time)

**Tujuan:** AI sering salah jika dicampur dengan Next.js API biasa. Pisahkan instruksi custom server.

> **Prompt 9:**
> "Berikan kode untuk `server/socket.ts` yang menggunakan `socket.io` untuk membuat fitur chat. Buat event untuk `join:chat` (berdasarkan orderId) dan `message:send`. Jelaskan cara mengintegrasikan file ini dengan custom server Next.js."

### STEP 10: Integrasi Cloudinary

> **Prompt 10:**
> "Buatkan endpoint `app/api/upload/route.ts` untuk menangani proses upload gambar ke Cloudinary. Kemudian buat komponen React `components/product/ImageUploader.tsx` yang memanggil endpoint tersebut dan menampilkan preview gambar."

---

## Tips Ekstra untuk Menghemat Biaya API AI

1. **Gunakan "Continue" atau "Lanjutkan":** Jika kode terpotong, cukup ketik "lanjutkan dari baris [sebutkan baris kode terakhir]".
2. **Review Parsial:** Jika ada error, copy HANYA fungsi yang error beserta pesan errornya, jangan copy seluruh file.
3. **Minta Penjelasan Terpisah:** Saat meminta kode, instruksikan AI: _"Berikan kodenya saja tanpa penjelasan panjang lebar."_ Ini sangat menghemat jumlah token output.

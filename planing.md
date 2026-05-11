# 📍 Perancangan Platform Digital UMKM Berbasis Geolokasi dengan Google API

> **Nama Proyek:** GeoUMKM — Platform Digital UMKM Berbasis Geolokasi
> **Stack:** Next.js 14 · MongoDB · Cloudinary · Google Maps API · Socket.io
> **Tipe:** Web App Responsif (Mobile & Desktop) — Konsep seperti Gojek/GoFood
> **Versi Dokumen:** 4.0.0

---

## 📋 Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Tech Stack](#3-tech-stack)
4. [Struktur Folder Proyek](#4-struktur-folder-proyek)
5. [Database Schema (MongoDB + Mongoose OOP)](#5-database-schema-mongodb--mongoose-oop)
6. [Google API Integration](#6-google-api-integration)
7. [Fitur Per Dashboard](#7-fitur-per-dashboard)
8. [Sistem Delivery & Pickup](#8-sistem-delivery--pickup)
9. [Sistem Pembayaran](#9-sistem-pembayaran)
10. [Real-time Chat (Socket.io)](#10-real-time-chat-socketio)
11. [API Routes (Backend)](#11-api-routes-backend)
12. [Sistem Autentikasi & Role](#12-sistem-autentikasi--role)
13. [Upload Gambar Produk (Cloudinary)](#13-upload-gambar-produk-cloudinary)
14. [UI/UX Responsif — Konsep Gojek + TikTok Shop](#14-uiux-responsif--konsep-gojek--tiktok-shop)
15. [Alur Kerja (User Flow)](#15-alur-kerja-user-flow)
16. [Rencana Pengembangan (Milestone)](#16-rencana-pengembangan-milestone)
17. [Environment Variables](#17-environment-variables)
18. [Deployment](#18-deployment)
19. [Diagram Sistem](#19-diagram-sistem)

---

## 1. Gambaran Umum

**GeoUMKM** adalah platform web yang menghubungkan pelaku UMKM (penjual) dengan pembeli di sekitar lokasi mereka secara real-time, terinspirasi dari konsep **Gojek/GoFood** — pembeli buka app, langsung lihat UMKM terdekat di peta, pilih produk, pesan, lalu pilih **delivery atau pickup**, bayar via **cash atau transfer**, dan bisa **chat langsung** dengan penjual.

### Konsep Utama (Gojek-style)
```
Pembeli buka web → Deteksi lokasi GPS otomatis
        ↓
Tampil daftar UMKM terdekat (sorted by jarak)
        ↓
Filter kategori: Makanan · Minuman · Kerajinan · Fashion · dll
        ↓
Pilih toko → Lihat produk + foto → Tambah ke keranjang
        ↓
Checkout → Pilih: 🚗 Delivery / 🏃 Pickup
        ↓
Pilih bayar: 💵 Cash / 💸 Transfer Bank
        ↓
💬 Chat real-time dengan penjual jika ada pertanyaan
        ↓
Pantau status pesanan secara real-time
```

Platform ini memiliki **3 peran utama**:

| Peran | Akses | Deskripsi |
|-------|-------|-----------|
| 🛒 **Pembeli** | `/buyer/*` | Cari UMKM terdekat, pesan, delivery/pickup, chat penjual |
| 🏪 **Penjual** | `/seller/*` | Kelola toko, produk + foto, terima pesanan, chat pembeli |
| 🛡️ **Admin** | `/admin/*` | Moderasi, kelola user & toko, pantau semua aktivitas |

---

## 2. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│          Next.js 14 App Router — React Components            │
│          Tailwind CSS — Responsif (Mobile & Desktop)         │
│          Socket.io Client — Real-time Chat & Notifikasi      │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP + WebSocket
┌───────────────────────▼─────────────────────────────────────┐
│                NEXT.JS SERVER (Backend)                      │
│         /app/api/** — REST API Routes                        │
│         /server/socket.ts — Socket.io Server                 │
│         NextAuth.js — JWT Session (3 Role)                   │
└──────┬──────────────────┬─────────────────┬─────────────────┘
       │                  │                 │
┌──────▼──────┐  ┌────────▼───────┐  ┌─────▼───────────┐
│  MongoDB    │  │  Google APIs   │  │   Cloudinary    │
│  Mongoose   │  │  Geocoding     │  │  Gambar Produk  │
│  (Atlas)    │  │  Maps JS API   │  │  & Toko         │
│             │  │  Places API    │  │                 │
│  + Chat     │  │                │  │                 │
│    History  │  │                │  │                 │
└─────────────┘  └────────────────┘  └─────────────────┘
```

---

## 3. Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 14.x (App Router) | Framework utama fullstack |
| **React** | 18.x | UI Library |
| **Tailwind CSS** | 3.x | Styling responsif |
| **React Hook Form** | 7.x | Form management (OOP-like) |
| **Zustand** | 4.x | State management global |
| **Socket.io-client** | 4.x | Real-time chat & notifikasi |
| **@googlemaps/react-wrapper** | latest | Wrapper Google Maps untuk React |
| **date-fns** | 3.x | Format tanggal/waktu chat & pesanan |

### Backend (Next.js API Routes + Custom Server)
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js API Routes** | 14.x | REST API endpoint |
| **Socket.io** | 4.x | WebSocket server untuk chat real-time |
| **NextAuth.js** | 5.x | Autentikasi & session (3 role) |
| **Mongoose** | 8.x | ODM MongoDB berbasis class (OOP) |
| **bcryptjs** | 2.x | Hash password |
| **next-cloudinary** | latest | Upload gambar ke Cloudinary |
| **zod** | 3.x | Validasi schema input |

### Database & Storage
| Teknologi | Fungsi |
|-----------|--------|
| **MongoDB Atlas** | Database utama: user, toko, produk, pesanan, chat |
| **Cloudinary** | Storage & CDN gambar produk & toko |

### Google API
| API | Fungsi |
|-----|--------|
| **Maps JavaScript API** | Tampilkan peta interaktif, marker toko terdekat |
| **Geocoding API** | Konversi alamat ↔ koordinat lat/lng |
| **Places API** | Autocomplete pencarian lokasi/toko, detail tempat |

---

## 4. Struktur Folder Proyek

```
geoukmk/
├── app/                              # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (buyer)/                      # Dashboard Pembeli
│   │   ├── layout.tsx                # Bottom nav mobile
│   │   ├── page.tsx                  # 🗺️ Home: peta + UMKM terdekat (Gojek-style)
│   │   ├── explore/page.tsx          # Jelajahi semua kategori
│   │   ├── store/[id]/page.tsx       # Detail toko + produk
│   │   ├── product/[id]/page.tsx     # Detail produk
│   │   ├── cart/page.tsx             # Keranjang belanja
│   │   ├── checkout/page.tsx         # Checkout: pilih delivery/pickup + bayar
│   │   ├── orders/
│   │   │   ├── page.tsx              # Riwayat pesanan
│   │   │   └── [id]/page.tsx         # Detail + tracking status pesanan
│   │   └── chat/
│   │       ├── page.tsx              # Daftar chat
│   │       └── [orderId]/page.tsx    # Chat dengan penjual
│   ├── (seller)/                     # Dashboard Penjual
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx        # Overview: pendapatan, pesanan, produk
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── add/page.tsx          # Form OOP: detail produk + multi-gambar
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx              # Pesanan masuk (delivery & pickup)
│   │   │   └── [id]/page.tsx         # Detail pesanan + update status
│   │   ├── chat/
│   │   │   ├── page.tsx              # Daftar chat pembeli
│   │   │   └── [orderId]/page.tsx    # Chat dengan pembeli
│   │   └── store/
│   │       └── settings/page.tsx     # Pengaturan toko, lokasi, jam buka
│   ├── (admin)/                      # Dashboard Admin
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx        # Overview platform
│   │   ├── users/page.tsx
│   │   ├── stores/page.tsx
│   │   ├── orders/page.tsx           # Semua transaksi
│   │   └── reports/page.tsx
│   ├── api/                          # Backend API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── stores/
│   │   │   ├── route.ts
│   │   │   ├── nearby/route.ts       # GET toko terdekat + jarak
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── status/route.ts   # Update status pesanan
│   │   ├── chat/
│   │   │   └── [orderId]/route.ts    # GET riwayat chat
│   │   ├── payment/
│   │   │   └── confirm/route.ts      # Konfirmasi pembayaran transfer
│   │   ├── geo/
│   │   │   ├── geocode/route.ts
│   │   │   └── places/route.ts
│   │   └── upload/route.ts
│   └── layout.tsx
│
├── server/                           # Custom server untuk Socket.io
│   └── socket.ts                     # Socket.io server setup
│
├── components/
│   ├── map/
│   │   ├── MapContainer.tsx          # Google Maps wrapper
│   │   ├── StoreMarker.tsx           # Marker toko (custom icon per kategori)
│   │   ├── NearbyStoreList.tsx       # List toko terdekat (Gojek-style card)
│   │   ├── DistanceBadge.tsx         # Badge jarak "1.2 km"
│   │   └── LocationPicker.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductForm.tsx           # OOP Form class
│   │   └── ImageUploader.tsx
│   ├── order/
│   │   ├── OrderCard.tsx
│   │   ├── DeliveryPickupToggle.tsx  # Pilih delivery / pickup
│   │   ├── PaymentMethodSelector.tsx # Pilih cash / transfer
│   │   ├── OrderStatusBadge.tsx
│   │   └── OrderTimeline.tsx         # Timeline status pesanan
│   ├── chat/
│   │   ├── ChatWindow.tsx            # Jendela chat real-time
│   │   ├── ChatBubble.tsx            # Bubble pesan
│   │   ├── ChatInput.tsx             # Input + send
│   │   └── ChatNotificationDot.tsx   # Indikator pesan belum dibaca
│   ├── dashboard/
│   │   ├── BuyerBottomNav.tsx        # Mobile bottom nav (Gojek-style)
│   │   ├── SellerSidebar.tsx
│   │   └── AdminSidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       └── CategoryChip.tsx          # Filter kategori UMKM
│
├── lib/
│   ├── db/connect.ts
│   ├── models/                       # Mongoose Models (OOP)
│   │   ├── User.model.ts
│   │   ├── Store.model.ts
│   │   ├── Product.model.ts
│   │   ├── Order.model.ts
│   │   ├── Chat.model.ts             # 🆕 Model pesan chat
│   │   └── Payment.model.ts          # 🆕 Model konfirmasi pembayaran
│   ├── services/
│   │   ├── GeoService.ts
│   │   ├── ProductService.ts
│   │   ├── OrderService.ts
│   │   ├── ChatService.ts            # 🆕 Service chat
│   │   └── PaymentService.ts         # 🆕 Service pembayaran
│   ├── socket/
│   │   └── events.ts                 # Konstanta event Socket.io
│   ├── validations/
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   └── store.schema.ts
│   └── auth.ts
│
├── hooks/
│   ├── useGeolocation.ts
│   ├── useGoogleMaps.ts
│   ├── useNearbyStores.ts
│   ├── useSocket.ts                  # 🆕 Hook Socket.io client
│   └── useChat.ts                    # 🆕 Hook chat real-time
│
├── types/
│   ├── user.ts
│   ├── product.ts
│   ├── store.ts
│   ├── order.ts
│   └── chat.ts
│
├── public/
│   └── icons/                        # Custom map markers per kategori
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 5. Database Schema (MongoDB + Mongoose OOP)

### 5.1 User Model
```typescript
// lib/models/User.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  avatar:    { type: String },
  phone:     { type: String },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
```

### 5.2 Store Model
```typescript
// lib/models/Store.model.ts
export interface IStore extends Document {
  owner: mongoose.Types.ObjectId;    // ref: User
  name: string;
  description: string;
  category: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];   // [longitude, latitude]
  };
  placeId?: string;                  // Google Places ID
  images: string[];                  // Cloudinary URLs
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
}

const StoreSchema = new Schema<IStore>({
  owner:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  description: { type: String },
  category:    { type: String, required: true },
  address:     { type: String, required: true },
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },  // [lng, lat]
  },
  placeId:     { type: String },
  images:      [{ type: String }],
  isVerified:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  rating:      { type: Number, default: 0 },
  totalReviews:{ type: Number, default: 0 },
}, { timestamps: true });

// Index geospatial untuk query toko terdekat
StoreSchema.index({ location: '2dsphere' });
```

### 5.3 Product Model
```typescript
// lib/models/Product.model.ts
export interface IProduct extends Document {
  store: mongoose.Types.ObjectId;    // ref: Store
  seller: mongoose.Types.ObjectId;   // ref: User
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];                  // Array Cloudinary URLs
  stock: number;
  unit: string;                      // 'pcs', 'kg', 'liter', dll
  isAvailable: boolean;
  tags: string[];
}

const ProductSchema = new Schema<IProduct>({
  store:       { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  seller:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true },
  images:      [{ type: String }],   // min 1 gambar
  stock:       { type: Number, default: 0 },
  unit:        { type: String, default: 'pcs' },
  isAvailable: { type: Boolean, default: true },
  tags:        [{ type: String }],
}, { timestamps: true });
```

### 5.4 Order Model
```typescript
// lib/models/Order.model.ts
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;        // snapshot nama produk saat pesan
  price: number;       // snapshot harga saat pesan
  quantity: number;
  image: string;       // snapshot gambar saat pesan
}

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;

  // Delivery atau Pickup
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  estimatedDistance?: number;        // dalam meter (dari Google Maps)
  estimatedDuration?: string;        // estimasi waktu, misal "15 menit"

  // Status pesanan
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_delivery' | 'completed' | 'cancelled';

  // Pembayaran
  paymentMethod: 'cash' | 'transfer';
  paymentStatus: 'waiting' | 'confirmed' | 'paid';
  paymentProof?: string;             // URL Cloudinary bukti transfer

  notes?: string;
  cancelReason?: string;
}

// Status Flow:
// DELIVERY:  pending → confirmed → preparing → on_delivery → completed
// PICKUP:    pending → confirmed → preparing → ready → completed
```

### 5.5 Chat Model
```typescript
// lib/models/Chat.model.ts
export interface IMessage {
  sender: mongoose.Types.ObjectId;   // ref: User
  senderRole: 'buyer' | 'seller';
  content: string;
  type: 'text' | 'image';
  isRead: boolean;
  createdAt: Date;
}

export interface IChat extends Document {
  order: mongoose.Types.ObjectId;    // ref: Order (1 chat per order)
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastMessage: string;
  lastMessageAt: Date;
  buyerUnreadCount: number;
  sellerUnreadCount: number;
}

const ChatSchema = new Schema<IChat>({
  order:   { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  buyer:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seller:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  store:   { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  messages: [{
    sender:     { type: Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String, enum: ['buyer', 'seller'] },
    content:    { type: String, required: true },
    type:       { type: String, enum: ['text', 'image'], default: 'text' },
    isRead:     { type: Boolean, default: false },
    createdAt:  { type: Date, default: Date.now },
  }],
  lastMessage:       { type: String },
  lastMessageAt:     { type: Date },
  buyerUnreadCount:  { type: Number, default: 0 },
  sellerUnreadCount: { type: Number, default: 0 },
}, { timestamps: true });
```

### 5.6 Payment Model
```typescript
// lib/models/Payment.model.ts
export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  amount: number;
  method: 'cash' | 'transfer';

  // Khusus transfer
  bankName?: string;                 // BCA, Mandiri, BRI, dll
  accountNumber?: string;            // Rekening tujuan penjual
  transferProof?: string;            // URL Cloudinary bukti transfer
  transferredAt?: Date;

  status: 'pending' | 'submitted' | 'confirmed' | 'rejected';
  confirmedBy?: mongoose.Types.ObjectId;  // Admin/seller yang konfirmasi
  confirmedAt?: Date;
  rejectionReason?: string;
}
```

---

## 6. Google API Integration

### 6.1 Geocoding API
```typescript
// lib/services/GeoService.ts — Service Class (OOP)
class GeoService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_SERVER_KEY!;
  }

  // Alamat → Koordinat
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results[0].geometry.location;
  }

  // Koordinat → Alamat
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `${this.baseUrl}/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results[0].formatted_address;
  }

  // Autocomplete Places
  async searchPlaces(query: string): Promise<any[]> {
    const url = `${this.baseUrl}/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${this.apiKey}&components=country:id`;
    const res = await fetch(url);
    const data = await res.json();
    return data.predictions;
  }
}

export const geoService = new GeoService();
```

### 6.2 Maps JavaScript API (Frontend)
```typescript
// hooks/useGoogleMaps.ts
import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
      libraries: ['places', 'geometry'],
    });
    loader.load().then(() => setIsLoaded(true));
  }, []);

  return { isLoaded };
};
```

### 6.3 Query Toko Terdekat (MongoDB $nearSphere)
```typescript
// Contoh query toko dalam radius 5km dari lokasi user
const nearbyStores = await Store.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: 'Point',
        coordinates: [userLng, userLat],
      },
      $maxDistance: 5000, // 5km dalam meter
    },
  },
  isActive: true,
});
```

---

## 7. Fitur Per Dashboard

### 🛒 Dashboard Pembeli — Gojek-style
| Fitur | Deskripsi |
|-------|-----------|
| 🗺️ **Peta Utama** | Peta Google Maps fullscreen, marker toko per kategori |
| 📍 **Deteksi Lokasi Otomatis** | GPS browser → tampil UMKM terdekat langsung |
| 📋 **List UMKM Terdekat** | Card sortir by jarak: nama, kategori, rating, "1.2 km" |
| 🏷️ **Filter Kategori** | Chip filter: Makanan · Minuman · Kerajinan · Fashion · dll |
| 🔍 **Search + Autocomplete** | Search toko/produk dengan Places API autocomplete |
| 🏪 **Halaman Toko** | Foto toko, deskripsi, jam buka, semua produk |
| 📦 **Detail Produk** | Galeri foto, deskripsi, harga, stok, tambah ke keranjang |
| 🛒 **Keranjang** | Kelola item sebelum checkout |
| 🚗 **Checkout** | Pilih **Delivery** (input alamat) atau **Pickup** (ambil sendiri) |
| 💵 **Pembayaran** | Pilih **Cash** (bayar saat terima/ambil) atau **Transfer Bank** |
| 📸 **Upload Bukti Transfer** | Foto struk transfer → dikirim ke penjual untuk konfirmasi |
| 📋 **Riwayat Pesanan** | Timeline status: pending → confirmed → siap → selesai |
| 💬 **Chat Real-time** | Chat langsung dengan penjual per pesanan (Socket.io) |
| ⭐ **Rating & Ulasan** | Beri rating bintang + komentar setelah pesanan selesai |

### 🏪 Dashboard Penjual
| Fitur | Deskripsi |
|-------|-----------|
| 📊 **Overview Toko** | Total pendapatan hari ini, pesanan aktif, produk terjual |
| 🏠 **Setup & Edit Toko** | Nama, kategori, deskripsi, foto toko, jam operasional |
| 📍 **Atur Lokasi** | Pilih lokasi di peta (LocationPicker) atau input alamat |
| ➕ **Tambah Produk (OOP Form)** | Nama, harga, stok, satuan, deskripsi, kategori, **multi-gambar** |
| 🖼️ **Upload Gambar Produk** | Upload 1-5 foto per produk (Cloudinary), preview sebelum simpan |
| ✏️ **CRUD Produk** | Edit, hapus, aktif/nonaktif produk |
| 📥 **Pesanan Masuk** | Tab: Delivery / Pickup · Filter by status |
| ✅ **Update Status Pesanan** | Konfirmasi → Sedang Disiapkan → Siap/Dikirim → Selesai |
| 💸 **Konfirmasi Pembayaran** | Lihat bukti transfer dari pembeli, konfirmasi atau tolak |
| 💬 **Chat Real-time** | Balas chat pembeli per pesanan |
| 🏦 **Info Rekening Bank** | Simpan nomor rekening untuk pembayaran transfer |

### 🛡️ Dashboard Admin
| Fitur | Deskripsi |
|-------|-----------|
| 📈 **Overview Platform** | Total user, toko aktif, transaksi, pendapatan platform |
| 👥 **Kelola User** | Lihat, blokir, hapus akun buyer/seller |
| 🏪 **Verifikasi Toko** | Approve/reject pendaftaran toko UMKM baru |
| 📦 **Pantau Produk** | Review produk dilaporkan, hapus konten melanggar |
| 📋 **Semua Transaksi** | Monitor semua pesanan & status pembayaran |
| 🗺️ **Peta Platform** | Lihat distribusi semua toko UMKM di peta |
| 💬 **Monitor Chat** | Pantau aktivitas chat (moderasi jika diperlukan) |
| ⚙️ **Pengaturan Sistem** | Konfigurasi radius default, kategori UMKM, dll |

---

## 8. Sistem Delivery & Pickup

### Pilihan Pengiriman saat Checkout
```
Pembeli pilih tipe pesanan:

🚗 DELIVERY                        🏃 PICKUP
─────────────────                  ─────────────────
Input alamat tujuan                Tidak perlu alamat
Autocomplete Places API            Tampil alamat toko
Estimasi jarak & waktu             Jam siap ambil
  (Google Maps Distance Matrix)    Konfirmasi "Sudah diambil"
```

### Status Flow Pesanan

**Delivery:**
```
pending → confirmed → preparing → on_delivery → completed
   ↓           ↓           ↓            ↓             ↓
 Menunggu   Dikonfirmasi Dimasak/    Sedang       Selesai
 penjual    penjual      Disiapkan   Dikirim
```

**Pickup:**
```
pending → confirmed → preparing → ready → completed
   ↓           ↓           ↓         ↓         ↓
 Menunggu   Dikonfirmasi Dimasak/  Siap     Diambil
 penjual    penjual      Disiapkan Diambil  pembeli
```

### Estimasi Jarak (Google Maps)
```typescript
// Hitung jarak & estimasi waktu dari toko ke alamat pembeli
// Menggunakan Google Maps Distance Matrix API (server-side)
class GeoService {
  async getDistanceMatrix(origin: string, destination: string) {
    const url = `${this.baseUrl}/distancematrix/json
      ?origins=${encodeURIComponent(origin)}
      &destinations=${encodeURIComponent(destination)}
      &key=${this.apiKey}`;
    const data = await fetch(url).then(r => r.json());
    return {
      distance: data.rows[0].elements[0].distance.text,  // "2.3 km"
      duration: data.rows[0].elements[0].duration.text,  // "8 menit"
    };
  }
}
```

---

## 9. Sistem Pembayaran

### Metode Pembayaran
| Metode | Alur | Status Awal |
|--------|------|-------------|
| 💵 **Cash** | Bayar saat terima (delivery) atau ambil (pickup) | `waiting` → `paid` saat penjual konfirmasi |
| 💸 **Transfer Bank** | Transfer ke rekening penjual, upload bukti | `pending` → `submitted` → `confirmed` |

### Alur Transfer Bank
```
Pembeli checkout → Pilih "Transfer Bank"
        ↓
Tampil info rekening penjual (dari Store.bankAccount)
  Contoh: BCA - 1234567890 - a.n. Budi Santoso
        ↓
Pembeli transfer → Foto struk/screenshot
        ↓
Upload bukti transfer (Cloudinary) → POST /api/payment/confirm
        ↓
Penjual terima notif → Cek bukti → Konfirmasi / Tolak
        ↓
Jika dikonfirmasi → Status pesanan: confirmed → preparing
```

### Store Model tambahan (rekening bank penjual)
```typescript
// Tambahan di Store.model.ts
bankAccount?: {
  bankName: string;        // "BCA", "Mandiri", "BRI", "BNI", dll
  accountNumber: string;   // "1234567890"
  accountName: string;     // "Budi Santoso"
}
```

---

## 10. Real-time Chat (Socket.io)

### Konsep Chat
- **1 pesanan = 1 ruang chat** (Chat terikat ke Order ID)
- Chat dimulai setelah pembeli membuat pesanan
- Keduanya (buyer & seller) bisa kirim pesan teks
- Notifikasi badge jumlah pesan belum dibaca

### Socket.io Events
```typescript
// lib/socket/events.ts
export const SOCKET_EVENTS = {
  // Koneksi
  JOIN_CHAT:     'join:chat',          // join room berdasarkan orderId
  LEAVE_CHAT:    'leave:chat',

  // Pesan
  SEND_MESSAGE:  'message:send',       // kirim pesan baru
  NEW_MESSAGE:   'message:new',        // terima pesan masuk (broadcast)
  READ_MESSAGES: 'message:read',       // tandai pesan sudah dibaca

  // Notifikasi
  ORDER_UPDATE:  'order:status_update', // update status pesanan real-time
  UNREAD_COUNT:  'chat:unread_count',  // update badge notifikasi
} as const;
```

### Alur Chat
```
Pembeli/Penjual buka halaman chat
        ↓
Socket.io client: emit JOIN_CHAT(orderId)
        ↓
Server: socket.join(`chat:${orderId}`)
        ↓
Kirim pesan: emit SEND_MESSAGE({ orderId, content, senderRole })
        ↓
Server: simpan ke Chat.messages[] di MongoDB
        ↓
Server: broadcast NEW_MESSAGE ke semua di room `chat:${orderId}`
        ↓
Lawan bicara terima pesan → tampil di ChatWindow real-time
```

### Custom Server (server.ts) untuk Socket.io + Next.js
```typescript
// server/socket.ts
import { Server } from 'socket.io';
import { SOCKET_EVENTS } from '@/lib/socket/events';

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.NEXTAUTH_URL }
  });

  io.on('connection', (socket) => {
    // Join room chat berdasarkan orderId
    socket.on(SOCKET_EVENTS.JOIN_CHAT, (orderId: string) => {
      socket.join(`chat:${orderId}`);
    });

    // Terima & broadcast pesan
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
      // Simpan ke MongoDB
      await ChatService.saveMessage(data);
      // Broadcast ke room
      io.to(`chat:${data.orderId}`).emit(SOCKET_EVENTS.NEW_MESSAGE, data);
    });

    // Update status pesanan real-time
    socket.on(SOCKET_EVENTS.ORDER_UPDATE, (data) => {
      io.to(`chat:${data.orderId}`).emit(SOCKET_EVENTS.ORDER_UPDATE, data);
    });
  });

  return io;
}
```

---

## 11. API Routes (Backend)

### Products
```
GET    /api/products              → Semua produk (filter: kategori, harga, storeId)
POST   /api/products              → Buat produk baru (seller only)
GET    /api/products/[id]         → Detail produk
PUT    /api/products/[id]         → Update produk (seller/admin)
DELETE /api/products/[id]         → Hapus produk (seller/admin)
```

### Stores
```
GET    /api/stores                → Semua toko
GET    /api/stores/nearby         → Toko terdekat (?lat=&lng=&radius=&category=)
                                    → Return: toko + jarak dalam meter + estimasi waktu
POST   /api/stores                → Buat toko baru (seller)
GET    /api/stores/[id]           → Detail toko + semua produk aktif
PUT    /api/stores/[id]           → Update toko (termasuk bankAccount)
```

### Orders
```
GET    /api/orders                → Daftar pesanan (filter by role, status, type)
POST   /api/orders                → Buat pesanan baru (buyer) — type: delivery/pickup
GET    /api/orders/[id]           → Detail pesanan
PUT    /api/orders/[id]/status    → Update status (seller: confirm/prepare/ready/deliver)
                                    Seller: complete (untuk cash pickup)
                                    Buyer: complete (konfirmasi terima delivery)
```

### Payment
```
GET    /api/payment/[orderId]     → Info pembayaran + rekening penjual
POST   /api/payment/confirm       → Submit bukti transfer (buyer upload foto)
PUT    /api/payment/[id]/verify   → Konfirmasi / tolak transfer (seller/admin)
```

### Chat
```
GET    /api/chat/[orderId]        → GET riwayat chat (load awal sebelum Socket.io)
POST   /api/chat/[orderId]/read   → Tandai semua pesan sudah dibaca
```

### Geo (Proxy ke Google API — key aman di server)
```
GET    /api/geo/geocode?address=  → Geocoding alamat → koordinat
GET    /api/geo/reverse?lat=&lng= → Reverse geocoding → alamat
GET    /api/geo/places?q=         → Places autocomplete
GET    /api/geo/distance?orig=&dest= → Estimasi jarak & waktu (Distance Matrix)
```

### Upload
```
POST   /api/upload                → Upload gambar ke Cloudinary
DELETE /api/upload?publicId=      → Hapus gambar dari Cloudinary
```

---

## 12. Sistem Autentikasi & Role

```typescript
// lib/auth.ts — NextAuth.js config
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user._id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  }
};
```

### Proteksi Route per Role
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/seller') && token?.role !== 'seller') {
    return NextResponse.redirect('/login');
  }
  if (pathname.startsWith('/admin') && token?.role !== 'admin') {
    return NextResponse.redirect('/login');
  }
}
```

---

## 13. Upload Gambar Produk (Cloudinary)

### Alur Upload
```
Penjual pilih gambar (max 5)
        ↓
ImageUploader Component (preview lokal)
        ↓
POST /api/upload → Next.js API Route
        ↓
Cloudinary SDK → Upload ke folder /geoukmk/products/
        ↓
Return URL → Simpan ke Product.images[] di MongoDB
```

### Spesifikasi Upload
| Parameter | Nilai |
|-----------|-------|
| Max file per produk | 5 gambar |
| Max ukuran file | 5 MB per gambar |
| Format diterima | JPG, PNG, WebP |
| Auto resize | 800×800px (Cloudinary transform) |
| Folder Cloudinary | `/geoukmk/products/[storeId]/` |

---

## 14. UI/UX Responsif — Konsep Gojek + TikTok Shop

### Breakpoint Tailwind
| Breakpoint | Ukuran | Target |
|------------|--------|--------|
| `default` | < 640px | Mobile (HP) — prioritas utama |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Laptop / Desktop |

---

### Sidebar Navigation (Desktop)

Di desktop, sidebar muncul di sisi kiri secara permanen. Di mobile, sidebar berubah menjadi **bottom navigation** (5 tab di bawah layar). Sidebar bisa dalam 2 mode: **expanded** (lebar, ada label teks) dan **collapsed** (ikon saja, hover untuk tooltip).

#### Struktur Sidebar per Role

**Pembeli (`/buyer`)**
```
┌─────────────────────┐
│  🗺️ GeoUMKM         │  ← Logo + nama app
├─────────────────────┤
│  🏠  Home           │  ← Peta + list UMKM terdekat
│  🔍  Jelajahi       │  ← Browse semua kategori + search
│  🛒  Keranjang  [2] │  ← Badge jumlah item
│  📋  Pesanan        │  ← Riwayat & status pesanan
│  💬  Chat       [1] │  ← Badge pesan belum dibaca
├─────────────────────┤
│  👤  Profil         │
│  ⚙️  Pengaturan     │
└─────────────────────┘
```

**Penjual (`/seller`)**
```
┌─────────────────────┐
│  🗺️ GeoUMKM         │
├─────────────────────┤
│  📊  Dashboard      │  ← Overview pendapatan & statistik
│  🏪  Toko Saya      │  ← Edit info toko + lokasi
│  📦  Produk         │  ← CRUD produk + upload gambar
│  📥  Pesanan    [3] │  ← Pesanan masuk (badge notif)
│  💬  Chat       [2] │  ← Chat dari pembeli
│  💸  Pembayaran     │  ← Konfirmasi transfer masuk
├─────────────────────┤
│  👤  Profil         │
│  ⚙️  Pengaturan     │
└─────────────────────┘
```

**Admin (`/admin`)**
```
┌─────────────────────┐
│  🗺️ GeoUMKM Admin   │
├─────────────────────┤
│  📈  Overview       │
│  👥  Kelola User    │
│  🏪  Kelola Toko    │
│  📦  Produk         │
│  📋  Transaksi      │
│  🗺️  Peta Platform  │
│  💬  Monitor Chat   │
├─────────────────────┤
│  ⚙️  Pengaturan     │
└─────────────────────┘
```

#### Sidebar Collapsed vs Expanded
```typescript
// components/dashboard/Sidebar.tsx — OOP Component
// Kondisi: lg+ → sidebar, <lg → bottom nav

// Expanded (default, lebar 240px)
<aside style="width: 240px">
  <NavItem icon="home" label="Home" href="/buyer" badge={0} />
  <NavItem icon="search" label="Jelajahi" href="/buyer/explore" />
  <NavItem icon="shopping-cart" label="Keranjang" href="/buyer/cart" badge={2} />
</aside>

// Collapsed (lebar 64px, hover = tooltip label)
<aside style="width: 64px">
  <NavItem icon="home" collapsed badge={0} />
</aside>

// Toggle collapse disimpan di localStorage
```

#### Layout Desktop dengan Sidebar
```
┌──────────┬─────────────────────────────────────────────┐
│          │  Topbar: lokasi saya ▾    🔔  👤 Budi       │
│ Sidebar  ├─────────────────────────────────────────────┤
│ 240px    │                                             │
│          │         Area Konten Utama                   │
│ expanded │         (peta / grid produk / dll)          │
│          │                                             │
│  atau    │                                             │
│          │                                             │
│  64px    │                                             │
│ collapsed│                                             │
└──────────┴─────────────────────────────────────────────┘
```

#### Topbar (Desktop)
Topbar muncul di atas area konten, berisi:
- Kiri: **Lokasi aktif** (dropdown pilih lokasi, "Bandung, Jawa Barat ▾")
- Tengah: **Search bar** global (produk & toko)
- Kanan: ikon notifikasi 🔔 + avatar user + nama

---

### Layout Grid Produk — TikTok Shop Style

Di halaman **Home** dan **Jelajahi**, produk & toko ditampilkan dalam grid kotak-kotak 2 kolom (mobile) atau 3-4 kolom (desktop), mirip TikTok Shop / Shopee — bukan list vertikal.

#### Grid Produk (Home Feed)
```
Mobile (2 kolom):          Desktop (4 kolom):
┌─────────┬─────────┐      ┌───┬───┬───┬───┐
│ 🖼️ foto │ 🖼️ foto │      │ 🖼 │ 🖼 │ 🖼 │ 🖼 │
│         │         │      │   │   │   │   │
│ Nama    │ Nama    │      │Nm │Nm │Nm │Nm │
│ Produk  │ Produk  │      │Rp │Rp │Rp │Rp │
│ Rp15rb  │ Rp25rb  │      │⭐  │⭐  │⭐  │⭐  │
│ ⭐ 4.8  │ ⭐ 4.6  │      └───┴───┴───┴───┘
├─────────┼─────────┤
│ 🖼️ foto │ 🖼️ foto │
│  ...    │  ...    │
└─────────┴─────────┘
```

#### Anatomi Satu Card Produk (TikTok Shop style)
```
┌─────────────────┐
│                 │
│   [foto produk] │  ← Gambar persegi (aspect-ratio: 1/1)
│   (Cloudinary)  │     lazy load, object-fit: cover
│                 │
│  🏷️ Diskon 10%  │  ← Badge promosi (optional, top-left overlay)
└─────────────────┤
│ Nama Produk...  │  ← 2 baris maks, ellipsis jika lebih
│ ⭐ 4.8 · 52 terjual │  ← Rating + jumlah terjual
│ Rp 15.000       │  ← Harga, warna aksen
│ 📍 0.4 km       │  ← Jarak toko dari lokasi user
└─────────────────┘
```

#### Implementasi Grid (Tailwind CSS)
```tsx
// components/product/ProductGrid.tsx
<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
  {products.map(product => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>

// ProductCard — menampilkan info produk ala TikTok Shop
<div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
  <div className="aspect-square relative">
    <Image src={product.images[0]} fill className="object-cover" />
    {product.discount && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        -{product.discount}%
      </span>
    )}
  </div>
  <div className="p-2.5 space-y-1">
    <p className="text-sm font-medium line-clamp-2">{product.name}</p>
    <p className="text-xs text-gray-400">⭐ {product.rating} · {product.sold} terjual</p>
    <p className="text-sm font-semibold text-blue-600">Rp {product.price.toLocaleString()}</p>
    <p className="text-xs text-gray-400">📍 {product.store.distance} km</p>
  </div>
</div>
```

#### Section Layout Halaman Home (Pembeli)
Urutan section di halaman home:

1. **Topbar** — lokasi + search + notif
2. **Peta mini** — Google Maps (height: 200px mobile, tersembunyi di desktop jika scroll)
3. **Chip kategori** — scroll horizontal: Semua · Makanan · Minuman · Kerajinan · Fashion · dll
4. **Banner promo** — horizontal scroll card promo toko (optional)
5. **Grid produk "Terdekat dari kamu"** — 2 kolom mobile, 4 kolom desktop, infinite scroll / load more
6. **Section "UMKM Populer minggu ini"** — grid serupa, data berbeda (sorted by rating)

---

### Komponen UI Khas — Lengkap

| Komponen | Deskripsi |
|----------|-----------|
| `Sidebar.tsx` | Sidebar collapsible (expanded/collapsed), responsive → bottom nav di mobile |
| `Topbar.tsx` | Lokasi dropdown + global search + avatar user |
| `ProductGrid.tsx` | Grid 2/3/4 kolom responsif, layout TikTok Shop |
| `ProductCard.tsx` | Card kotak: foto persegi, nama, rating, harga, jarak |
| `NearbyStoreCard.tsx` | Card toko list (nama, kategori, rating, jarak, open/close) |
| `CategoryChip.tsx` | Chip filter kategori, scroll horizontal, active state |
| `OrderStatusTimeline.tsx` | Visual progress bar tahap pesanan |
| `ChatBubble.tsx` | Bubble chat dengan timestamp dan status baca ✓✓ |
| `DeliveryPickupToggle.tsx` | Toggle switch Delivery / Pickup di checkout |
| `PaymentMethodCard.tsx` | Card pilih Cash / Transfer dengan info rekening |
| `DistanceBadge.tsx` | Badge "1.2 km" di card produk/toko |
| `NotificationDot.tsx` | Badge merah jumlah notif di ikon sidebar/bottom nav |

---

### Mobile vs Desktop — Perbedaan Layout

| Elemen | Mobile | Desktop |
|--------|--------|---------|
| Navigasi | Bottom nav 5 tab | Sidebar kiri (expanded/collapsed) |
| Topbar lokasi | Sticky di atas | Bagian topbar kanan sidebar |
| Grid produk | 2 kolom | 3–4 kolom |
| Peta | 200px di atas home | Panel kiri bisa toggle show/hide |
| Sidebar | Tidak ada | 240px expanded / 64px collapsed |
| Chat | Halaman penuh | Panel slide-in dari kanan |

---

## 15. Alur Kerja (User Flow)

### Alur Penjual
```
Register → Pilih role "Penjual"
    ↓
Setup Toko → Nama, kategori, deskripsi, foto, jam buka
    ↓
Input rekening bank (untuk terima pembayaran transfer)
    ↓
Atur Lokasi → Klik di peta ATAU ketik alamat (Places API autocomplete)
    → Geocoding API → simpan koordinat GeoJSON
    ↓
Tambah Produk → Isi form OOP (nama, harga, stok, satuan, deskripsi)
    → Upload 1-5 foto produk → Cloudinary
    ↓
Toko LIVE → Muncul di peta pembeli dengan jarak

─── Saat Ada Pesanan ─────────────────────────────────────
    ↓
Notif pesanan baru masuk (Socket.io)
    ↓
Cek detail: tipe (delivery/pickup), items, pembayaran
    ↓
Jika transfer → cek bukti transfer → konfirmasi/tolak
    ↓
Konfirmasi pesanan → Update status: preparing
    ↓
Selesai siapkan → Update: ready (pickup) atau on_delivery (delivery)
    ↓
Pesanan selesai → completed
    ↓
Chat dengan pembeli jika ada pertanyaan (sepanjang proses)
```

### Alur Pembeli (Gojek-style)
```
Buka Web → Izinkan akses lokasi GPS
    ↓
Peta + List UMKM terdekat muncul (sorted by jarak)
Filter kategori: Makanan / Kerajinan / dll
    ↓
Klik toko → Halaman toko (foto, rating, produk)
    ↓
Pilih produk → Tambah ke keranjang → Bisa dari toko yang sama
    ↓
Checkout →
  ├── Pilih DELIVERY → Input alamat (Places autocomplete)
  │                 → Estimasi jarak & waktu tampil
  └── Pilih PICKUP  → Lihat alamat toko, jam buka
    ↓
Pilih pembayaran →
  ├── CASH    → Bayar saat terima/ambil
  └── TRANSFER → Tampil rekening penjual
               → Transfer → Upload foto bukti
    ↓
Pesanan dikirim → Penjual terima notif real-time
    ↓
Pantau status pesanan (real-time via Socket.io)
    ↓
💬 Chat dengan penjual jika perlu (any time)
    ↓
Pesanan selesai → Beri rating & ulasan ⭐
```

---

## 16. Rencana Pengembangan (Milestone)

### 📅 Fase 1 — Fondasi (Minggu 1-2)
- [ ] Setup project Next.js 14 + TypeScript + Tailwind
- [ ] Konfigurasi MongoDB Atlas + Mongoose
- [ ] Setup NextAuth.js (register, login, 3 role)
- [ ] Buat semua Mongoose Models (User, Store, Product, Order, Chat, Payment)
- [ ] Konfigurasi Cloudinary
- [ ] Setup custom server untuk Socket.io

### 📅 Fase 2 — Backend API (Minggu 3-4)
- [ ] API Routes: products, stores, orders, payment, chat
- [ ] Geo API proxy (Geocoding, Places, Distance Matrix)
- [ ] Upload handler Cloudinary (produk + bukti transfer)
- [ ] Middleware proteksi role
- [ ] MongoDB geospatial index + query nearSphere
- [ ] Socket.io server events (chat + order update)

### 📅 Fase 3 — Dashboard Penjual (Minggu 5-6)
- [ ] Setup toko + LocationPicker (peta)
- [ ] Form produk OOP + ImageUploader multi-gambar
- [ ] CRUD produk
- [ ] Pesanan masuk: tab delivery/pickup, update status
- [ ] Konfirmasi bukti transfer
- [ ] Chat real-time dengan pembeli
- [ ] Input rekening bank toko

### 📅 Fase 4 — Dashboard Pembeli — Gojek-style (Minggu 7-8)
- [ ] Halaman peta utama + list UMKM terdekat (sorted jarak)
- [ ] Filter kategori (chip horizontal)
- [ ] Search Places API autocomplete
- [ ] Halaman toko & detail produk + galeri
- [ ] Keranjang belanja
- [ ] Checkout: toggle delivery/pickup + estimasi jarak
- [ ] Pembayaran: cash / transfer + upload bukti
- [ ] Tracking status pesanan real-time
- [ ] Chat real-time dengan penjual

### 📅 Fase 5 — Dashboard Admin (Minggu 9)
- [ ] Overview & analitik platform
- [ ] Kelola user & verifikasi toko
- [ ] Monitor semua transaksi & pembayaran
- [ ] Peta distribusi toko

### 📅 Fase 6 — Polish & Deploy (Minggu 10)
- [ ] Responsif sempurna (mobile-first)
- [ ] Loading skeleton, error states, empty states
- [ ] Notifikasi badge chat & pesanan
- [ ] Testing
- [ ] Deploy ke Vercel + MongoDB Atlas

---

## 17. Environment Variables

```bash
# .env.local

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoukmk

# Google Maps API (Server-side — JANGAN expose ke client)
GOOGLE_MAPS_SERVER_KEY=AIza...

# Google Maps API (Client-side — hanya Maps JS API)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIza...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

> ⚠️ **Penting:** Gunakan 2 API key Google berbeda:
> - `GOOGLE_MAPS_SERVER_KEY` → server only (Geocoding, Places, Distance Matrix) — **tidak pernah ke browser**
> - `NEXT_PUBLIC_GOOGLE_MAPS_KEY` → Maps JavaScript API browser, **batasi HTTP referrer** di Google Console

---

## 18. Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
# Set semua env vars di Vercel Dashboard → Settings → Environment Variables
```

> ⚠️ **Catatan Socket.io di Vercel:** Vercel adalah serverless, Socket.io perlu persistent server.
> Solusi: Deploy Socket.io server terpisah ke **Railway** atau **Render** (gratis tier tersedia),
> lalu set `NEXT_PUBLIC_SOCKET_URL` ke URL server tersebut.

### Konfigurasi MongoDB Atlas
1. Buat cluster gratis di [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist IP: `0.0.0.0/0` (allow all) untuk Vercel
3. Buat database user & copy connection string ke `MONGODB_URI`

### Google Cloud Console Setup
1. Buat project baru di [console.cloud.google.com](https://console.cloud.google.com)
2. Enable: Maps JavaScript API · Geocoding API · Places API · Distance Matrix API
3. Buat 2 API Key:
   - Key 1 (Server): Restrict → IP address (server Vercel/Railway)
   - Key 2 (Client): Restrict → HTTP referrer (domain Vercel)

---

## 📝 Catatan Teknis Penting

1. **Keamanan API Key Google** — Semua call ke Geocoding, Places, Distance Matrix harus lewat `/api/geo/*` proxy server. Jangan pernah taruh server key di frontend.

2. **Socket.io + Vercel** — Karena Vercel serverless tidak support WebSocket persistent, deploy Socket.io server terpisah di Railway/Render.

3. **Geospatial Index** — `StoreSchema.index({ location: '2dsphere' })` wajib ada agar `$nearSphere` bekerja efisien.

4. **OOP Pattern** — Mongoose schema = class-based model · Service classes kelola business logic · Zod validasi input · React class component atau service-layer pattern untuk form kompleks.

5. **Gambar Produk & Bukti Transfer** — Semua gambar ke Cloudinary, MongoDB hanya simpan URL. Folder terpisah: `/products/` dan `/payments/`.

6. **Koordinat MongoDB** — GeoJSON format: `[longitude, latitude]` (bukan lat, lng). Jangan tertukar!

7. **1 Chat per Pesanan** — Chat room dibuat otomatis saat pesanan dibuat, terikat ke `orderId`. Ini menjaga konteks percakapan tetap relevan.

8. **Status Pesanan** — Alur delivery dan pickup berbeda (lihat Section 8). Pastikan UI menampilkan step yang tepat sesuai `orderType`.

---

---

## 19. Diagram Sistem

Bagian ini berisi 5 diagram UML/sistem yang menggambarkan arsitektur dan alur kerja GeoUMKM secara visual. Gunakan tools seperti **draw.io**, **Lucidchart**, **PlantUML**, atau **Mermaid** untuk render diagram-diagram di bawah ini.

---

### 19.1 Use Case Diagram — Siapa Melakukan Apa

Menunjukkan semua aksi yang dapat dilakukan oleh 3 aktor utama: Pembeli, Penjual, dan Admin. Garis putus-putus = butuh autentikasi login.

```
AKTOR       USE CASE PEMBELI              USE CASE PENJUAL          USE CASE ADMIN
────────    ─────────────────────────    ──────────────────────    ──────────────────────
            • Daftar / masuk akun  ◄──── (shared semua aktor)
            • Lihat peta UMKM
Pembeli ──► • Cari produk / toko
            • Lihat detail produk
            • Tambah ke keranjang
            • Buat pesanan
            • Pilih delivery/pickup
            • Bayar (cash/transfer)
            • Upload bukti transfer
            • Chat dengan penjual
            • Pantau status pesanan
            • Beri ulasan & rating

                                         • Kelola toko & lokasi
                                Penjual ► • Tambah/edit produk
                                         • Upload gambar produk
                                         • Terima & kelola pesanan
                                         • Konfirmasi pembayaran
                                         • Chat dengan pembeli
                                         • Lihat statistik toko

                                                            Admin ► • Verifikasi toko UMKM
                                                                    • Kelola pengguna
                                                                    • Pantau semua transaksi
                                                                    • Monitor aktivitas chat
```

**Mermaid (untuk render otomatis):**
```
Tidak tersedia di Mermaid standar — gunakan draw.io atau PlantUML usecase diagram.
PlantUML syntax:
  @startuml
  left to right direction
  actor Pembeli
  actor Penjual
  actor Admin
  rectangle "Sistem GeoUMKM" {
    (Daftar / Masuk Akun)
    (Lihat Peta UMKM)
    (Buat Pesanan)
    (Pilih Delivery/Pickup)
    (Bayar Cash/Transfer)
    (Chat Real-time)
    (Kelola Toko & Produk)
    (Konfirmasi Pembayaran)
    (Verifikasi Toko)
    (Kelola Pengguna)
  }
  Pembeli --> (Daftar / Masuk Akun)
  Pembeli --> (Lihat Peta UMKM)
  Pembeli --> (Buat Pesanan)
  Pembeli --> (Pilih Delivery/Pickup)
  Pembeli --> (Bayar Cash/Transfer)
  Pembeli --> (Chat Real-time)
  Penjual --> (Daftar / Masuk Akun)
  Penjual --> (Kelola Toko & Produk)
  Penjual --> (Konfirmasi Pembayaran)
  Penjual --> (Chat Real-time)
  Admin --> (Verifikasi Toko)
  Admin --> (Kelola Pengguna)
  @enduml
```

---

### 19.2 Activity Diagram — Alur Kerja Pemesanan Pembeli

Menunjukkan alur lengkap dari pembeli buka web hingga pesanan selesai, termasuk percabangan keputusan delivery/pickup dan cash/transfer.

```
[MULAI]
   │
   ▼
Buka web GeoUMKM
   │
   ▼
Izinkan akses GPS
   │
   ▼
Tampil peta + list UMKM terdekat
   │
   ▼
◆ Sudah login? ──Belum──► Masuk / daftar akun
   │ Ya                          │
   ◄──────────────────────────────┘
   │
   ▼
Filter kategori / cari produk
   │
   ▼
Pilih toko & produk
   │
   ▼
Tambah ke keranjang
   │
   ▼
Checkout
   │
   ▼
◆ Delivery?
   ├── Ya ──► Input alamat pengiriman
   │                │
   └── Tidak ──► Konfirmasi pickup
                    │
   ◄────────────────┘
   │
   ▼
◆ Transfer?
   ├── Ya ──► Transfer bank → Upload bukti foto
   │                              │
   └── Tidak ──► Bayar saat terima/ambil
                    │
   ◄────────────────┘
   │
   ▼
[SISTEM] Simpan Order ke MongoDB
   │
   ▼
[SISTEM] Kirim notifikasi ke Penjual (Socket.io)
   │
   ▼
[PENJUAL] Terima notif → Konfirmasi → Siapkan pesanan
   │
   ▼
[PENJUAL] Update status → Selesai
   │
   ▼
[SELESAI]
```

**Mermaid flowchart:**
```mermaid
flowchart TD
    A([Mulai]) --> B[Buka web GeoUMKM]
    B --> C[Izinkan akses GPS]
    C --> D[Tampil peta + UMKM terdekat]
    D --> E{Sudah login?}
    E -->|Belum| F[Masuk / daftar akun]
    F --> G[Filter & cari produk]
    E -->|Ya| G
    G --> H[Pilih toko & produk]
    H --> I[Tambah ke keranjang]
    I --> J[Checkout]
    J --> K{Delivery?}
    K -->|Ya| L[Input alamat]
    K -->|Tidak| M[Konfirmasi pickup]
    L --> N{Transfer?}
    M --> N
    N -->|Ya| O[Upload bukti transfer]
    N -->|Tidak| P[Bayar saat terima]
    O --> Q[Simpan Order ke MongoDB]
    P --> Q
    Q --> R[Notifikasi ke Penjual via Socket.io]
    R --> S[Penjual konfirmasi & siapkan]
    S --> T[Update status selesai]
    T --> U([Selesai])
```

---

### 19.3 Class Diagram — Struktur Data OOP

Menunjukkan 6 class utama beserta atribut, method, dan relasi antar class di sistem GeoUMKM.

```mermaid
classDiagram
  class User {
    +String _id
    +String name
    +String email
    +String password
    +String role
    +String avatar
    +String phone
    +Date createdAt
    +register()
    +login()
    +updateProfile()
  }

  class Store {
    +String _id
    +ObjectId owner
    +String name
    +String description
    +String category
    +String address
    +GeoPoint location
    +String placeId
    +String[] images
    +BankAccount bankAccount
    +Boolean isVerified
    +Boolean isActive
    +Number rating
    +setupStore()
    +updateLocation()
    +getNearbyStores()
  }

  class Product {
    +String _id
    +ObjectId store
    +ObjectId seller
    +String name
    +String description
    +Number price
    +String category
    +String[] images
    +Number stock
    +String unit
    +Boolean isAvailable
    +addProduct()
    +updateProduct()
    +deleteProduct()
    +uploadImages()
  }

  class Order {
    +String _id
    +ObjectId buyer
    +ObjectId store
    +ObjectId seller
    +OrderItem[] items
    +Number totalAmount
    +String orderType
    +String deliveryAddress
    +GeoPoint deliveryLocation
    +String status
    +String paymentMethod
    +String paymentStatus
    +createOrder()
    +updateStatus()
    +cancelOrder()
  }

  class Chat {
    +String _id
    +ObjectId order
    +ObjectId buyer
    +ObjectId seller
    +Message[] messages
    +String lastMessage
    +Date lastMessageAt
    +Number buyerUnread
    +Number sellerUnread
    +sendMessage()
    +markAsRead()
    +getHistory()
  }

  class Payment {
    +String _id
    +ObjectId order
    +ObjectId buyer
    +Number amount
    +String method
    +String bankName
    +String accountNumber
    +String transferProof
    +String status
    +submitProof()
    +confirmPayment()
    +rejectPayment()
  }

  User "1" --> "0..1" Store : memiliki
  Store "1" --> "0..*" Product : menjual
  User "1" --> "0..*" Order : membuat
  Store "1" --> "0..*" Order : menerima
  Order "1" --> "1" Chat : memiliki
  Order "1" --> "1" Payment : memiliki
```

**Keterangan relasi:**

| Relasi | Kardinalitas | Keterangan |
|--------|-------------|------------|
| User → Store | 1 ke 0..1 | Satu user seller punya maksimal 1 toko |
| Store → Product | 1 ke 0..* | Satu toko punya banyak produk |
| User → Order | 1 ke 0..* | Satu buyer bisa buat banyak pesanan |
| Store → Order | 1 ke 0..* | Satu toko menerima banyak pesanan |
| Order → Chat | 1 ke 1 | Setiap pesanan punya tepat 1 ruang chat |
| Order → Payment | 1 ke 1 | Setiap pesanan punya tepat 1 data pembayaran |

---

### 19.4 Sequence Diagram — Interaksi Antar Objek saat Checkout

Menunjukkan urutan panggilan/pesan antar komponen sistem dalam satu flow checkout lengkap, dari pembeli klik pesan hingga penjual konfirmasi.

```mermaid
sequenceDiagram
  actor Pembeli
  participant Browser
  participant NextAPI as Next.js API
  participant MongoDB
  participant GeoAPI as Google API
  participant SocketIO as Socket.io
  actor Penjual

  Note over Pembeli,Penjual: Alur checkout dan pemesanan

  Pembeli->>Browser: Buka halaman checkout
  Browser->>NextAPI: GET /api/stores/nearby?lat&lng
  NextAPI->>MongoDB: query $nearSphere
  MongoDB-->>NextAPI: daftar toko terdekat
  NextAPI-->>Browser: toko + jarak (km)

  Pembeli->>Browser: Isi alamat pengiriman
  Browser->>NextAPI: GET /api/geo/distance?orig&dest
  NextAPI->>GeoAPI: Distance Matrix API
  GeoAPI-->>NextAPI: jarak & estimasi waktu
  NextAPI-->>Browser: "2.3 km — 8 menit"

  Pembeli->>Browser: Klik Pesan Sekarang
  Browser->>NextAPI: POST /api/orders
  NextAPI->>MongoDB: simpan Order baru
  MongoDB-->>NextAPI: orderId
  NextAPI->>MongoDB: buat Chat kosong (orderId)
  NextAPI-->>Browser: 201 — pesanan dibuat

  NextAPI->>SocketIO: emit order_new (sellerId)
  SocketIO->>Penjual: notifikasi pesanan masuk

  Note over Pembeli,Penjual: Pembeli pilih transfer bank

  Pembeli->>Browser: Upload bukti transfer
  Browser->>NextAPI: POST /api/upload
  NextAPI-->>Browser: URL Cloudinary
  Browser->>NextAPI: POST /api/payment/confirm
  NextAPI->>MongoDB: simpan Payment + proofUrl
  NextAPI->>SocketIO: emit payment_submitted
  SocketIO->>Penjual: notif bukti transfer masuk

  Penjual->>NextAPI: PUT /api/payment/:id/verify
  NextAPI->>MongoDB: update paymentStatus confirmed
  NextAPI->>MongoDB: update orderStatus confirmed
  NextAPI->>SocketIO: emit order_update
  SocketIO->>Pembeli: status pesanan diperbarui

  Note over Pembeli,Penjual: Chat real-time selama proses

  Pembeli->>SocketIO: emit message_send (orderId)
  SocketIO->>MongoDB: simpan pesan di Chat
  SocketIO->>Penjual: emit message_new
```

**Komponen yang terlibat:**

| Komponen | Peran |
|----------|-------|
| Browser | Mengirim request dari sisi klien (React) |
| Next.js API | REST endpoint + business logic server-side |
| MongoDB | Penyimpanan data persisten |
| Google API | Geocoding, Places, Distance Matrix (server-only) |
| Socket.io | WebSocket untuk notifikasi & chat real-time |

---

### 19.5 ERD — Entity Relationship Diagram

Menunjukkan hubungan antar koleksi/tabel MongoDB beserta atribut lengkap dan kardinalitasnya.

```mermaid
erDiagram
  USER {
    ObjectId _id PK
    string name
    string email
    string password
    string role
    string avatar
    string phone
    date createdAt
  }

  STORE {
    ObjectId _id PK
    ObjectId owner FK
    string name
    string description
    string category
    string address
    object location
    string placeId
    array images
    object bankAccount
    boolean isVerified
    boolean isActive
    number rating
    date createdAt
  }

  PRODUCT {
    ObjectId _id PK
    ObjectId store FK
    ObjectId seller FK
    string name
    string description
    number price
    string category
    array images
    number stock
    string unit
    boolean isAvailable
    date createdAt
  }

  ORDER {
    ObjectId _id PK
    ObjectId buyer FK
    ObjectId store FK
    ObjectId seller FK
    array items
    number totalAmount
    string orderType
    string deliveryAddress
    object deliveryLocation
    string status
    string paymentMethod
    string paymentStatus
    string notes
    date createdAt
  }

  CHAT {
    ObjectId _id PK
    ObjectId order FK
    ObjectId buyer FK
    ObjectId seller FK
    array messages
    string lastMessage
    date lastMessageAt
    number buyerUnread
    number sellerUnread
  }

  PAYMENT {
    ObjectId _id PK
    ObjectId order FK
    ObjectId buyer FK
    number amount
    string method
    string bankName
    string accountNumber
    string transferProof
    string status
    date confirmedAt
  }

  USER ||--o| STORE : "memiliki (seller)"
  USER ||--o{ ORDER : "membuat (buyer)"
  STORE ||--o{ PRODUCT : "menjual"
  STORE ||--o{ ORDER : "menerima"
  ORDER ||--|| CHAT : "memiliki"
  ORDER ||--|| PAYMENT : "memiliki"
  USER ||--o{ CHAT : "berpartisipasi"
```

**Notasi kardinalitas:**

| Simbol | Arti |
|--------|------|
| `\|\|` | Tepat satu (wajib) |
| `o\|` | Nol atau satu (opsional) |
| `o{` | Nol atau banyak (opsional) |
| `\|{` | Satu atau banyak (wajib) |

**Catatan desain ERD:**
- `ORDER.items` disimpan sebagai array embedded (bukan referensi) agar snapshot harga & nama produk tetap tersimpan meski produk diedit/dihapus penjual.
- `CHAT.messages` juga embedded array — cocok untuk chat volume rendah per pesanan. Jika perlu, bisa dipisah ke koleksi `MESSAGE` tersendiri.
- `STORE.location` menggunakan format GeoJSON `{type: "Point", coordinates: [lng, lat]}` untuk mendukung query `$nearSphere` MongoDB.
- Semua `ObjectId FK` menggunakan `mongoose.Types.ObjectId` dan di-`populate()` saat query membutuhkan data lengkap.

---

> 📌 **Dokumen ini adalah living document** — update seiring perkembangan proyek.
> Dibuat untuk proyek **GeoUMKM v4.0** | Stack: Next.js 14 · MongoDB · Cloudinary · Google Maps API · Socket.io
> Konsep: Platform UMKM Digital Berbasis Geolokasi — *"Temukan UMKM Terbaik di Sekitarmu"*

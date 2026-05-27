# 🍽️ Numbas — FnB Self-Order System (Frontend)

> **Smart way to order food from your table.**

Numbas adalah sistem **self-order** untuk restoran/kafe (Food & Beverage) yang memungkinkan pelanggan memesan makanan langsung dari meja mereka melalui antarmuka web. Aplikasi ini mendukung **multi-role** — mulai dari customer, cashier, kitchen staff, hingga admin — dengan hak akses yang berbeda di setiap role-nya.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Environment Variables](#-environment-variables)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Folder](#-struktur-folder)
- [Penjelasan Folder](#-penjelasan-folder)
- [Sistem Routing & Role](#-sistem-routing--role)
- [API Endpoints](#-api-endpoints)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [Build untuk Production](#-build-untuk-production)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🔐 **Autentikasi** | Register & Login dengan token-based authentication (Bearer Token) |
| 👤 **Multi-Role** | 4 role: `customer`, `cashier`, `kitchen`, `admin` |
| 🍔 **Self-Order** | Customer dapat melihat menu, menambah ke keranjang, dan membuat pesanan |
| 🧾 **Manajemen Order** | Cashier dapat melihat pesanan dan memproses checkout/pembayaran |
| 👨‍🍳 **Kitchen Display** | Kitchen staff melihat antrian pesanan dan mengupdate status |
| 📊 **Laporan & Analitik** | Admin dapat melihat laporan penjualan, produk terlaris, dan stok rendah |
| 📦 **Manajemen Menu** | Admin mengelola kategori dan produk (CRUD) |
| 🛒 **Keranjang Belanja** | Shopping cart dengan fitur update quantity, catatan per item, dan subtotal |
| 💳 **Multi-Payment** | Mendukung pembayaran Cash, Card, dan QRIS |
| 🌙 **Dark Mode** | Mendukung tema gelap dengan CSS custom properties |

---

## 🛠️ Tech Stack

### Core
| Teknologi | Versi | Deskripsi |
|---|---|---|
| [React](https://react.dev) | 19.x | Library UI berbasis komponen |
| [TypeScript](https://www.typescriptlang.org) | 6.x | Superset JavaScript dengan static typing |
| [Vite](https://vite.dev) | 8.x | Build tool & dev server yang cepat |

### Styling & UI
| Teknologi | Deskripsi |
|---|---|
| [TailwindCSS](https://tailwindcss.com) v4 | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com) | Koleksi komponen UI berbasis Radix UI |
| [Radix UI](https://www.radix-ui.com) | Komponen headless UI yang accessible |
| [Lucide React](https://lucide.dev) | Ikon-ikon SVG modern |
| [Outfit Font](https://fonts.google.com/specimen/Outfit) | Font utama (sans-serif) |
| [Geist Mono](https://vercel.com/font) | Font monospace |

### Manajemen State & Data
| Teknologi | Deskripsi |
|---|---|
| [Zustand](https://zustand-demo.pmnd.rs) | Library state management yang ringan |
| [Axios](https://axios-http.com) | HTTP client untuk komunikasi dengan API |
| [React Router DOM](https://reactrouter.com) v7 | Client-side routing |

### Developer Tools
| Teknologi | Deskripsi |
|---|---|
| [ESLint](https://eslint.org) | Linter untuk kualitas kode |
| [React Compiler](https://react.dev/learn/react-compiler) | Optimasi otomatis React |
| [Babel](https://babeljs.io) | JavaScript compiler (digunakan oleh React Compiler) |

---

## 📦 Prasyarat

Pastikan perangkat kamu sudah terinstal:

- **Node.js** versi `18.x` atau lebih baru → [Download Node.js](https://nodejs.org)
- **npm** versi `9.x` atau lebih baru (biasanya sudah termasuk saat instal Node.js)
- **Git** → [Download Git](https://git-scm.com)
- **Backend API** sudah berjalan di `http://127.0.0.1:8000/api` (atau sesuaikan di `.env`)

Untuk mengecek versi yang terinstal:

```bash
node -v
npm -v
git --version
```

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd FnB_SelfOrderSystem/Frontend
```

### 2. Instal Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file `.env.example` atau buat file `.env` di root project:

```bash
# .env
VITE_API_BASE_URL = .....
```

> **Catatan:** Sesuaikan `VITE_API_BASE_URL` dengan alamat backend API kamu.

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (default Vite).

---

## 🔑 Environment Variables

| Variable | Deskripsi | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL untuk backend REST API | `http://127.0.0.1:8000/api` |

> Semua environment variable yang diakses di client-side **harus** diawali dengan prefix `VITE_` agar dikenali oleh Vite.

---

## 🏃 Menjalankan Aplikasi

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan development server dengan HMR (Hot Module Replacement) |
| `npm run build` | Melakukan type-checking TypeScript lalu build production ke folder `dist/` |
| `npm run preview` | Preview hasil build production secara lokal |
| `npm run lint` | Menjalankan ESLint untuk mengecek kualitas kode |

---

## 📁 Struktur Folder

```
Frontend/
├── public/                     # Aset statis (favicon, icons)
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                 # Aset yang di-import (gambar, font, dll.)
│   ├── components/             # Komponen reusable global
│   │   └── ui/                 # Komponen UI dari shadcn/ui
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── search.tsx
│   ├── constants/              # Nilai konstan/enum yang digunakan di seluruh app
│   │   ├── orderStatus.ts      # Status pesanan + label + CSS class
│   │   ├── paymentMethods.ts   # Metode pembayaran (Cash, Card, QRIS)
│   │   └── roles.ts            # Role pengguna (admin, cashier, kitchen, customer)
│   ├── features/               # Fitur-fitur aplikasi (feature-based architecture)
│   │   ├── auth/               # Fitur autentikasi
│   │   │   ├── api/
│   │   │   │   └── authApi.ts  # API calls: login, register, logout
│   │   │   └── components/
│   │   │       ├── Header.tsx   # Header halaman auth (judul + navigasi)
│   │   │       ├── LoginForm.tsx
│   │   │       └── RegisterForm.tsx
│   │   ├── menu/               # Fitur menu (kategori & produk)
│   │   │   └── api/
│   │   │       ├── categoryApi.ts  # CRUD kategori
│   │   │       └── productApi.ts   # CRUD produk (dengan upload gambar)
│   │   ├── order/              # Fitur pesanan
│   │   │   └── api/
│   │   │       └── orderApi.ts     # CRUD order + update status
│   │   ├── report/             # Fitur laporan
│   │   │   └── api/
│   │   │       └── reportApi.ts    # Laporan penjualan, top produk, low stock
│   │   └── transaction/        # Fitur transaksi/pembayaran
│   │       └── api/
│   │           └── transactionApi.ts  # List & create transaksi
│   ├── layout/                 # Layout wrapper untuk halaman
│   │   └── Authlayout.tsx      # Layout halaman login/register (split-screen)
│   ├── lib/                    # Library/utility functions
│   │   └── utils.ts            # Helper `cn()` untuk merge className (Tailwind)
│   ├── pages/                  # Halaman-halaman aplikasi
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx   # Halaman login
│   │   │   └── RegisterPage.tsx # Halaman register
│   │   └── customer/
│   │       └── Homepage.tsx    # Halaman utama customer
│   ├── routes/                 # Konfigurasi routing
│   │   ├── AppRoutes.tsx       # Definisi semua route aplikasi
│   │   └── ProtectedRoute.tsx  # Route guard (cek auth + role)
│   ├── services/               # Layer service untuk komunikasi API
│   │   ├── apiClient.ts        # Axios instance + interceptors
│   │   ├── endpoints.ts        # Daftar endpoint API
│   │   └── tokenService.ts     # Manajemen token & user di localStorage
│   ├── store/                  # Zustand stores (global state)
│   │   ├── authStore.ts        # State autentikasi (user, token)
│   │   └── cartStore.ts        # State keranjang belanja
│   ├── types/                  # TypeScript type definitions
│   │   ├── api.types.ts        # Tipe response API generik
│   │   ├── auth.types.ts       # Tipe User, LoginPayload, RegisterPayload
│   │   ├── category.types.ts   # Tipe Category
│   │   ├── order.types.ts      # Tipe Order, OrderItem, OrderStatus
│   │   ├── product.types.ts    # Tipe Product, ProductStatus
│   │   ├── report.types.ts     # Tipe SalesReport, TopProduct, LowStock
│   │   └── transaction.types.ts # Tipe Transaction, PaymentMethod
│   ├── index.css               # Global stylesheet + design tokens (CSS variables)
│   └── main.tsx                # Entry point aplikasi React
├── .env                        # Environment variables
├── .gitignore                  # File/folder yang diabaikan Git
├── components.json             # Konfigurasi shadcn/ui
├── eslint.config.js            # Konfigurasi ESLint
├── index.html                  # HTML template utama
├── package.json                # Dependencies & scripts
├── tsconfig.json               # Konfigurasi TypeScript (root)
├── tsconfig.app.json           # Konfigurasi TypeScript (app)
├── tsconfig.node.json          # Konfigurasi TypeScript (node/vite)
└── vite.config.ts              # Konfigurasi Vite
```

---

## 📖 Penjelasan Folder

### `src/assets/`
Berisi aset statis yang di-import ke dalam kode seperti gambar dan ikon. Aset di sini akan diproses oleh Vite saat build (optimasi, hashing, dll).

### `src/components/`
Komponen UI yang **reusable** dan bersifat **generik** — tidak terikat pada fitur tertentu. Saat ini berisi komponen dari **shadcn/ui**:

| Komponen | Deskripsi |
|---|---|
| `button.tsx` | Komponen button dengan berbagai variant (default, destructive, outline, secondary, ghost, link) dan size (sm, default, lg, icon) |
| `input.tsx` | Komponen input field yang sudah di-style |
| `search.tsx` | Komponen search bar |

### `src/constants/`
Berisi nilai-nilai konstan yang digunakan di berbagai tempat dalam aplikasi:

- **`roles.ts`** — Enum role pengguna: `admin`, `cashier`, `kitchen`, `customer`
- **`orderStatus.ts`** — Status pesanan beserta label dan CSS class untuk badge:
  - `pending` → Biru
  - `preparing` → Orange
  - `ready` → Hijau
  - `completed` → Emerald
  - `cancelled` → Merah
- **`paymentMethods.ts`** — Metode pembayaran: `Cash`, `Card`, `QRIS`

### `src/features/`
Folder ini menerapkan **feature-based architecture**. Setiap fitur dikelompokkan berdasarkan domain bisnis dan memiliki sub-folder:

| Feature | Sub-folder | Isi |
|---|---|---|
| `auth` | `api/`, `components/` | API autentikasi + komponen form login & register |
| `menu` | `api/` | API untuk kategori & produk (CRUD) |
| `order` | `api/` | API untuk pesanan (CRUD + update status) |
| `report` | `api/` | API untuk laporan (penjualan, top produk, low stock) |
| `transaction` | `api/` | API untuk transaksi pembayaran |

### `src/layout/`
Berisi komponen layout yang membungkus halaman:

- **`Authlayout.tsx`** — Layout split-screen untuk halaman auth. Sisi kiri menampilkan gambar restoran dengan branding "Numbas", sisi kanan menampilkan form login/register. Responsive (stack vertikal di mobile, horizontal di desktop).

### `src/lib/`
Utility functions yang digunakan di seluruh aplikasi:

- **`utils.ts`** — Berisi fungsi `cn()` yang menggabungkan `clsx` dan `tailwind-merge` untuk merge className Tailwind secara aman (menghindari konflik class).

### `src/pages/`
Berisi komponen halaman utama yang dipetakan ke route. Setiap halaman merangkai layout + komponen feature:

| Halaman | Path | Deskripsi |
|---|---|---|
| `LoginPage.tsx` | `/login` | Halaman login (AuthLayout + Header + LoginForm) |
| `RegisterPage.tsx` | `/register` | Halaman register (AuthLayout + Header + RegisterForm) |
| `Homepage.tsx` | `/customer/home` | Halaman utama customer dengan search bar |

### `src/routes/`
Konfigurasi routing aplikasi:

- **`AppRoutes.tsx`** — Mendefinisikan semua route dan role yang diizinkan mengaksesnya
- **`ProtectedRoute.tsx`** — Komponen guard yang mengecek:
  1. Apakah user sudah login (`isAuthenticated`)
  2. Apakah role user sesuai (`allowedRoles`)

### `src/services/`
Layer komunikasi dengan backend API:

| File | Deskripsi |
|---|---|
| `apiClient.ts` | Axios instance dengan base URL dari env, request interceptor (inject Bearer token), dan response interceptor (auto redirect ke login jika 401) |
| `endpoints.ts` | Objek berisi semua path endpoint API yang terstruktur per domain (auth, categories, products, orders, transactions, reports) |
| `tokenService.ts` | Fungsi untuk menyimpan/mengambil/menghapus token dan data user di `localStorage` |

### `src/store/`
Global state management menggunakan **Zustand**:

| Store | Deskripsi |
|---|---|
| `authStore.ts` | Menyimpan state `user`, `token`, dan `isAuthenticated`. Menyediakan aksi `setAuth()`, `logout()`, dan `hydrateAuth()` (memuat ulang dari localStorage) |
| `cartStore.ts` | Menyimpan state keranjang: `tableNumber`, `items[]`, `notes`. Menyediakan aksi `addItem()`, `removeItem()`, `updateQuantity()`, `updateItemNotes()`, `setNotes()`, `clearCart()`, dan `getSubtotal()` |

### `src/types/`
TypeScript type definitions / interfaces untuk seluruh domain:

| File | Tipe Utama |
|---|---|
| `api.types.ts` | `ApiResponse<T>`, `ApiErrorResponse`, `PaginatedResponse<T>`, `QueryParams` |
| `auth.types.ts` | `UserRole`, `User`, `LoginPayload`, `RegisterPayload`, `AuthResponse` |
| `category.types.ts` | `Category` |
| `order.types.ts` | `OrderStatus`, `OrderItem`, `Order`, `CreateOrderPayload`, `UpdateOrderStatusPayload` |
| `product.types.ts` | `ProductStatus`, `Product`, `ProductQueryParams`, `CreateProductPayload` |
| `report.types.ts` | `SalesReport`, `TopProduct`, `LowStockProduct`, beserta query params |
| `transaction.types.ts` | `PaymentMethod`, `Transaction`, `CreateTransactionPayload` |

---

## 🔒 Sistem Routing & Role

Aplikasi menggunakan **role-based access control (RBAC)** melalui komponen `ProtectedRoute`. Berikut adalah daftar route dan role yang diizinkan:

### Public Routes (tanpa login)

| Route | Halaman |
|---|---|
| `/login` | Halaman Login |
| `/register` | Halaman Register |

### Customer Routes

| Route | Halaman | Roles yang Diizinkan |
|---|---|---|
| `/customer/home` | Homepage | `customer`, `cashier`, `admin` |
| `/customer/new-order` | Buat Pesanan Baru | `customer`, `cashier`, `admin` |
| `/customer/order-summary` | Ringkasan Pesanan | `customer`, `cashier`, `admin` |
| `/customer/orders` | Daftar Pesanan Customer | `customer`, `cashier`, `admin` |
| `/customer/menu` | Menu Makanan | `customer`, `cashier`, `admin` |
| `/customer/history` | Riwayat Pesanan | `customer`, `cashier`, `admin` |
| `/customer/profile` | Profil Customer | `customer`, `cashier`, `admin` |

### Cashier Routes

| Route | Halaman | Roles yang Diizinkan |
|---|---|---|
| `/cashier/table-selection` | Pilih Meja | `cashier`, `admin` |
| `/cashier/checkout/:orderId` | Checkout Pesanan | `cashier`, `admin` |
| `/cashier/orders` | Daftar Pesanan (Kasir) | `cashier`, `admin` |

### Kitchen Routes

| Route | Halaman | Roles yang Diizinkan |
|---|---|---|
| `/kitchen/dashboard` | Dashboard Dapur | `kitchen`, `admin` |
| `/kitchen/queue` | Antrian Pesanan | `kitchen`, `admin` |

### Admin Routes

| Route | Halaman | Roles yang Diizinkan |
|---|---|---|
| `/admin/menu-management` | Manajemen Menu | `admin` |
| `/admin/products` | Manajemen Produk | `admin` |
| `/admin/categories` | Manajemen Kategori | `admin` |
| `/admin/reports` | Laporan | `admin` |

### Redirect setelah Login

Setelah login berhasil, user akan di-redirect berdasarkan role:

| Role | Redirect ke |
|---|---|
| `admin` | `/admin/products` |
| `cashier` | `/cashier/table-selection` |
| `kitchen` | `/kitchen/dashboard` |
| `customer` | `/customer/home` |

---

## 🌐 API Endpoints

Aplikasi ini berkomunikasi dengan backend REST API melalui endpoint-endpoint berikut:

### Authentication

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi user baru |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |

### Categories

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/categories` | Ambil semua kategori |
| `GET` | `/api/categories/:id` | Ambil detail kategori |
| `POST` | `/api/categories` | Buat kategori baru |
| `PUT` | `/api/categories/:id` | Update kategori |
| `DELETE` | `/api/categories/:id` | Hapus kategori |

### Products

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/products` | Ambil semua produk |
| `GET` | `/api/products/:id` | Ambil detail produk |
| `POST` | `/api/products` | Buat produk baru (multipart/form-data) |
| `POST` | `/api/products/:id` | Update produk (dengan `_method: PUT`) |
| `DELETE` | `/api/products/:id` | Hapus produk |

### Orders

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/orders` | Ambil semua pesanan |
| `GET` | `/api/orders/:id` | Ambil detail pesanan |
| `POST` | `/api/orders` | Buat pesanan baru |
| `PATCH` | `/api/orders/:id/status` | Update status pesanan |

### Transactions

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/transactions` | Ambil semua transaksi |
| `POST` | `/api/transactions` | Buat transaksi baru |

### Reports

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/reports/sales` | Laporan penjualan |
| `GET` | `/api/reports/top-products` | Produk terlaris |
| `GET` | `/api/reports/low-stock` | Produk dengan stok rendah |

---

## 🗄️ State Management

### Auth Store (`authStore.ts`)

Mengelola state autentikasi pengguna menggunakan Zustand.

```typescript
// State
user: User | null           // Data user yang sedang login
token: string | null        // JWT/Bearer token
isAuthenticated: boolean    // Status login

// Actions
setAuth(user, token)  // Simpan data auth setelah login/register
logout()              // Hapus data auth dan redirect ke login
hydrateAuth()         // Muat ulang state dari localStorage (saat app startup)
```

### Cart Store (`cartStore.ts`)

Mengelola state keranjang belanja pelanggan.

```typescript
// State
tableNumber: number | null  // Nomor meja
items: CartItem[]            // Daftar item di keranjang
notes: string                // Catatan untuk pesanan

// Actions
setTableNumber(n)            // Set nomor meja
addItem(product)             // Tambah item (atau +1 quantity jika sudah ada)
removeItem(productId)        // Hapus item dari keranjang
updateQuantity(id, qty)      // Update jumlah item (hapus otomatis jika qty <= 0)
updateItemNotes(id, notes)   // Update catatan per item
setNotes(notes)              // Set catatan pesanan global
clearCart()                  // Kosongkan seluruh keranjang
getSubtotal()                // Hitung total harga keranjang
```

---

## 🎨 Design System

Aplikasi menggunakan **CSS Custom Properties (CSS Variables)** untuk design tokens, mendukung **light mode** dan **dark mode**.

### Warna Utama

| Token | Light Mode | Deskripsi |
|---|---|---|
| `--primary` | `oklch(0.6171 0.1375 39.04)` | Warna utama (warm orange/amber) |
| `--background` | `oklch(0.9818 0.0054 95.10)` | Background halaman |
| `--foreground` | `oklch(0.3438 0.0269 95.72)` | Warna teks utama |
| `--card` | `oklch(0.9665 0.0067 97.35)` | Background card |
| `--destructive` | — | Warna untuk aksi berbahaya |

### Font

| Token | Font | Kegunaan |
|---|---|---|
| `--font-sans` | Outfit | Font utama untuk body text |
| `--font-mono` | Geist Mono | Font untuk kode/monospace |
| `--font-serif` | UI Serif | Font fallback serif |

### Mengaktifkan Dark Mode

Tambahkan class `dark` pada elemen parent (biasanya `<html>` atau `<body>`):

```html
<html class="dark">
```

---

## 📦 Build untuk Production

```bash
# Type-check + build
npm run build

# Preview hasil build
npm run preview
```

Hasil build akan tersedia di folder `dist/`. Folder ini siap untuk di-deploy ke server statis seperti **Nginx**, **Vercel**, **Netlify**, atau **Firebase Hosting**.

### Konfigurasi SPA pada Server

Karena aplikasi ini menggunakan client-side routing (React Router), pastikan server dikonfigurasi untuk mengarahkan semua request ke `index.html`:

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## ❓ Troubleshooting

### Port sudah digunakan

Jika port 5173 sudah terpakai, Vite otomatis akan mencari port berikutnya. Atau kamu bisa menentukan port secara manual:

```bash
npx vite --port 3000
```

### Error `401 Unauthorized`

- Pastikan backend API sudah berjalan
- Pastikan `VITE_API_BASE_URL` di file `.env` sudah benar
- Coba login ulang — token mungkin sudah expired

### CORS Error

Pastikan backend sudah mengizinkan origin `http://localhost:5173` di konfigurasi CORS-nya.

### Module not found

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi perubahan"`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

### Konvensi Commit

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: fitur baru
fix: perbaikan bug
docs: perubahan dokumentasi
style: perubahan formatting (bukan CSS)
refactor: refaktor kode
test: penambahan/perbaikan test
chore: perubahan build/tooling
```

---

## 📄 Lisensi

Project ini dibuat sebagai bagian dari program **Dibimbing**.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan React + TypeScript + Vite
</p>

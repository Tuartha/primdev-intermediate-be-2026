# Library API

## Deskripsi Project

Library API adalah sebuah RESTful API untuk sistem manajemen perpustakaan digital yang dibangun menggunakan **Express.js** dan **Prisma ORM** dengan database **PostgreSQL**. API ini menyediakan fitur-fitur lengkap untuk mengelola buku, kategori, pengguna, profil, dan peminjaman buku.

Fitur utama yang tersedia:

- 🔐 **Autentikasi** — Register & Login menggunakan JWT (JSON Web Token)
- 📚 **Manajemen Buku** — CRUD buku dengan dukungan upload cover via Cloudinary
- 📂 **Manajemen Kategori** — CRUD kategori buku
- 👤 **Manajemen Pengguna** — CRUD data pengguna
- 🪪 **Manajemen Profil** — CRUD profil pengguna
- 📖 **Peminjaman Buku** — Sistem peminjaman dan pengembalian buku
- 🛡️ **Role-Based Access Control** — Pembagian akses antara `USER` dan `ADMIN`

### Tech Stack

| Teknologi         | Keterangan                  |
| ----------------- | --------------------------- |
| Express.js v5     | Web framework               |
| Prisma ORM        | Database ORM                |
| PostgreSQL        | Database                    |
| JWT               | Autentikasi token           |
| bcryptjs          | Hashing password            |
| Cloudinary        | Cloud storage untuk gambar  |
| Multer            | Upload file handling        |
| express-validator | Validasi input request      |
| Pino              | Logging                     |
| Vercel            | Deployment platform         |

---

## Folder Structure

```
primdev-intermediate-be-2026/
├── config/
├── controllers/
├── generated/
├── helpers/
├── middleware/
├── prisma/
├── routes/
├── validations/
├── .env                            # Environment variables
├── .gitignore                      # File yang diabaikan Git
├── data.js                         # Data statis / seed data
├── index.js                        # Entry point aplikasi
├── package.json                    # Dependensi & konfigurasi project
├── prisma.config.js                # Konfigurasi Prisma
└── vercel.json                     # Konfigurasi deployment Vercel
```

---

## API Routes

> **Keterangan Ikon:**
>
> 🔓 Public — Tidak memerlukan login
>
> 🔒 Login Required — Memerlukan token JWT di header `Authorization: Bearer <token>`
>
> 🛡️ Admin Only — Memerlukan login **dan** role `ADMIN`

### Auth

| Method | Endpoint         | Akses      | Deskripsi                        |
| ------ | ---------------- | ---------- | -------------------------------- |
| POST   | `/auth/register` | 🔓 Public | Mendaftarkan pengguna baru       |
| POST   | `/auth/login`    | 🔓 Public | Login dan mendapatkan token JWT  |

---

### Books

| Method | Endpoint      | Akses             | Deskripsi                                   |
| ------ | ------------- | ------------------ | ------------------------------------------- |
| GET    | `/books`      | 🔒 Login Required  | Mendapatkan semua data buku                 |
| GET    | `/books/:id`  | 🔒 Login Required  | Mendapatkan detail buku berdasarkan ID      |
| POST   | `/books`      | 🛡️ Admin Only     | Menambahkan buku baru (dengan upload cover) |
| PUT    | `/books/:id`  | 🛡️ Admin Only     | Mengupdate data buku (dengan upload cover)  |
| DELETE | `/books/:id`  | 🛡️ Admin Only     | Menghapus buku berdasarkan ID               |

---

### Categories

| Method | Endpoint           | Akses             | Deskripsi                                  |
| ------ | ------------------ | ------------------ | ------------------------------------------ |
| GET    | `/categories`      | 🔒 Login Required  | Mendapatkan semua data kategori            |
| GET    | `/categories/:id`  | 🔒 Login Required  | Mendapatkan detail kategori berdasarkan ID |
| POST   | `/categories`      | 🛡️ Admin Only     | Menambahkan kategori baru                  |
| PUT    | `/categories/:id`  | 🛡️ Admin Only     | Mengupdate data kategori                   |
| DELETE | `/categories/:id`  | 🛡️ Admin Only     | Menghapus kategori berdasarkan ID          |

---

### Users

| Method | Endpoint      | Akses             | Deskripsi                                    |
| ------ | ------------- | ------------------ | -------------------------------------------- |
| GET    | `/users`      | 🔒 Login Required  | Mendapatkan semua data pengguna              |
| GET    | `/users/:id`  | 🔒 Login Required  | Mendapatkan detail pengguna berdasarkan ID   |
| POST   | `/users`      | 🛡️ Admin Only     | Menambahkan pengguna baru                    |
| PUT    | `/users/:id`  | 🛡️ Admin Only     | Mengupdate data pengguna                     |
| DELETE | `/users/:id`  | 🛡️ Admin Only     | Menghapus pengguna berdasarkan ID            |

---

### Profiles

| Method | Endpoint         | Akses             | Deskripsi                                 |
| ------ | ---------------- | ------------------ | ----------------------------------------- |
| GET    | `/profiles`      | 🔒 Login Required  | Mendapatkan semua data profil             |
| GET    | `/profiles/:id`  | 🔒 Login Required  | Mendapatkan detail profil berdasarkan ID  |
| POST   | `/profiles`      | 🔒 Login Required  | Menambahkan profil baru                   |
| PUT    | `/profiles/:id`  | 🔒 Login Required  | Mengupdate data profil                    |
| DELETE | `/profiles/:id`  | 🔒 Login Required  | Menghapus profil berdasarkan ID           |

---

### Borrowings

| Method | Endpoint                | Akses             | Deskripsi                                     |
| ------ | ----------------------- | ------------------ | --------------------------------------------- |
| GET    | `/borrowings`           | 🔒 Login Required  | Mendapatkan semua data peminjaman             |
| GET    | `/borrowings/:id`       | 🔒 Login Required  | Mendapatkan detail peminjaman berdasarkan ID  |
| POST   | `/borrowings`           | 🔒 Login Required  | Membuat peminjaman buku baru                  |
| PUT    | `/borrowings/:id/return`| 🔒 Login Required  | Mengembalikan buku yang dipinjam              |
| DELETE | `/borrowings/:id`       | 🔒 Login Required  | Menghapus data peminjaman                     |

---

## Author

**Jaya** — TuJayaks

> Dibuat sebagai project kelas **Primakara Developer Intermediate Back-End 2026**.

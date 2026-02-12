# 📙 README – TUGAS 3 (Integrasi Frontend + Backend)

```markdown
# Fullstack Integration – API Version  
Frontend + Backend Integration  
PT Aksamedia Mulia Digital  

## 👨‍💻 Author
Muhammad Ahnaf Zaki  

---

## 🧩 Tech Stack

Frontend:
- React
- React Router
- Context API
- Tailwind CSS
- Axios

Backend:
- Laravel
- MySQL
- REST API

Deployment:
- Vercel (Frontend)
- Railway (Backend)

---

## 🎯 Overview

Project ini merupakan integrasi antara:

- Tugas 1 (Frontend)
- Tugas 2 (Backend API)

Frontend telah di-refactor untuk menggunakan API Laravel sebagai data source utama.

---

## 🔐 Authentication Flow

Login → Backend API → Token → Context API → Protected Routes


---

## 📊 Features

- API-based authentication
- CRUD terhubung ke database
- Search & filter via query params
- Pagination dari Laravel
- Error handling
- Loading state
- Environment variable configuration

---

## 🛠 Installation

Frontend:

```bash
npm install
npm run dev
Backend:

composer install
php artisan migrate --seed
php artisan serve
🌐 Live Demo
Frontend:
https://front-end-test-api.vercel.app/

Backend:
https://back-end-test-production-4bef.up.railway.app/

🧠 Architecture
React (Vercel)
      ↓
Laravel API (Railway)
      ↓
MySQL Database
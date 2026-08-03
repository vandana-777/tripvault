# ✈️ TripVault

TripVault is a MERN Stack travel journal application where users can securely register, log in, and manage their travel memories. This project is being developed as part of the CodGen Internship.

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcryptjs

---

## ✨ Features (Week 1)

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Dashboard
- Display Logged-in User Information
- MongoDB Atlas Integration
- REST API using Express

---

## 📂 Project Structure

```
tripvault/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── index.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Default URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

## 🔐 Authentication APIs

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Get Logged-in User

```
GET /api/auth/me
```

---

## 👩‍💻 Developed By

**J Vandana**

Computer Science Engineering Student

Built as part of the **CodGen Internship Program**.
# 🔐 AuthFlow — Full-Stack Login & Registration System

A professional authentication system built with **React.js**, **Node.js**, **Express**, and **MongoDB**. Features JWT-based auth, a stunning dark UI with particle animations, and a protected user management dashboard.

---

## 📁 Project Structure

```
auth-system/
├── client/                   # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx         # Shared auth page shell with animated bg
│   │   │   ├── AuthLayout.module.css
│   │   │   └── ProtectedRoute.jsx     # Route guard component
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state (React Context)
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx          # Sign-in form
│   │   │   ├── RegisterPage.jsx       # Registration form
│   │   │   ├── DashboardPage.jsx      # Protected user table
│   │   │   ├── Auth.module.css        # Shared form styles
│   │   │   └── Dashboard.module.css
│   │   ├── utils/
│   │   │   └── api.js                 # Axios instance with interceptors
│   │   ├── App.jsx                    # Router with public/protected routes
│   │   ├── main.jsx
│   │   └── index.css                  # CSS variables & global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                   # Node.js backend (Express)
    ├── src/
    │   ├── config/
    │   │   └── db.js                  # MongoDB connection
    │   ├── middleware/
    │   │   └── auth.js                # JWT protect middleware
    │   ├── models/
    │   │   └── User.js                # Mongoose user schema
    │   ├── routes/
    │   │   └── auth.js                # /register, /login, /me endpoints
    │   └── index.js                   # Express app entry point
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

---

### 1. Clone & install

```bash
git clone <your-repo-url>
cd auth-system

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

---

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_system
JWT_SECRET=
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> ☁️ **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string.

---

### 3. Run the project

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

---

## 🔌 API Reference

### Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Auth  | Description              |
|--------|--------------------|-------|--------------------------|
| POST   | `/auth/register`   | None  | Register a new user      |
| POST   | `/auth/login`      | None  | Login with credentials   |
| GET    | `/auth/me`         | JWT   | Get current user         |
| GET    | `/health`          | None  | Server health check      |

### Register — `POST /api/auth/register`

**Request body:**
```json
{
  "name": "John Doe",
  "dateOfBirth": "1995-06-15",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response (201):**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGci...",
  "user": {
    "id": "665abc...",
    "name": "John Doe",
    "dateOfBirth": "1995-06-15T00:00:00.000Z",
    "email": "john@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Login — `POST /api/auth/login`

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response (200):** Same shape as register.

---

## 🏗️ Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Vite 5, React Router v6 |
| Forms     | React Hook Form 7             |
| HTTP      | Axios with interceptors        |
| Notifications | React Hot Toast           |
| Backend   | Node.js, Express 4            |
| Database  | MongoDB + Mongoose 8          |
| Auth      | JWT (jsonwebtoken), bcryptjs  |
| Validation | express-validator            |

---

## ✨ Features

- **Secure registration** — bcrypt password hashing (12 salt rounds)
- **JWT authentication** — stateless tokens stored in localStorage
- **Protected routes** — unauthenticated users redirected to login
- **Animated auth UI** — particle network canvas background, floating orbs
- **Responsive design** — mobile-friendly layout
- **Form validation** — client-side (React Hook Form) + server-side (express-validator)
- **Beautiful dashboard** — sortable, searchable, paginated user table
- **Persistent session** — user info & token saved to localStorage

---

## 🔒 Security Notes

- Passwords are **never** returned in API responses (`select: false`)
- JWT tokens signed with a server-side secret
- Input sanitized and validated on both client and server
- CORS configured to only allow your frontend origin

> **For production:** store JWT in httpOnly cookies instead of localStorage, add rate limiting (express-rate-limit), use HTTPS, and set a strong `JWT_SECRET`.

---

## 📸 Screenshots

- **Login** — Dark navy card with SIGN IN tab active, email/password fields, animated particle background
- **Register** — Same layout with Register tab, four fields (name, DOB, email, password)  
- **Dashboard** — Sidebar nav + sortable user table with status badges and pagination

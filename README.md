# Team Task Manager

A full-stack **Progressive Web App (PWA)** for managing team projects and tasks, built with the MERN stack.

## Features
- 🔐 JWT Authentication (Admin & Member roles)
- 👥 Team management — Admins invite members by email
- 📋 Project & task management with status tracking
- 📊 Dashboard with live metrics (Total, Pending, Processing, Overdue tasks)
- 🌙 Dark / Light theme toggle
- 📱 Mobile-first UI with bottom navigation bar
- 📲 PWA — installable on Android, iOS, and Desktop
- ⏰ IST timezone throughout

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + HttpOnly Cookies |
| PWA | vite-plugin-pwa |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and the API at `http://localhost:8080`.

## Environment Variables (backend/.env)
| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret string |
| `PORT` | Backend port (default: 8080) |
| `NODE_ENV` | `development` or `production` |
| `TZ` | Timezone — set to `Asia/Kolkata` for IST |

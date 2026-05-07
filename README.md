# 📋 Team Task Manager

> A **Progressive Web App (PWA)** for managing team projects, assigning tasks, and tracking work — all in real-time. Built for small teams and assignment workflows where an Admin leads a group of Members.

[![GitHub](https://img.shields.io/badge/GitHub-TeamTaskManager-blue?logo=github)](https://github.com/sandeep-bodapudi/TeamTaskManager)
![Stack](https://img.shields.io/badge/Stack-MERN-green)
![PWA](https://img.shields.io/badge/PWA-Installable-purple)
![Theme](https://img.shields.io/badge/Theme-Dark%20%2F%20Light-yellow)

---

## 📌 What Is This App?

**Team Task Manager** is a role-based task management system designed for teams. It allows an **Admin (Team Lead)** to:
- Create a private team and invite members
- Create projects and assign them to members
- Create tasks inside projects and assign them to specific people
- Monitor overall progress through a live dashboard

A **Member** can:
- View their assigned projects and tasks
- Update task statuses as they work
- Track their own pending, in-progress, and overdue tasks

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | Register & login with JWT tokens stored in secure HttpOnly cookies |
| 👥 **Team Management** | Admins build their own private group — members can't see other teams |
| 📁 **Project Management** | Create projects, set descriptions, assign team members |
| ✅ **Task Management** | Add tasks to projects with title, description, assignee, and due date |
| 🔄 **Live Status Updates** | Members update task status: Pending → In Progress → Completed |
| 📊 **Smart Dashboard** | Real-time count of Total, Pending, Processing, and Overdue tasks |
| 📲 **PWA — Installable** | Works like a native app on Android, iOS, and Desktop |
| 🌙 **Dark / Light Mode** | Toggle between professional dark and light themes |
| ⏰ **IST Timezone** | All dates and times displayed in Indian Standard Time |
| 📱 **Mobile First** | Responsive design with a bottom navigation bar on mobile |

---

## 🏗️ How The App Works

### User Roles

```
┌─────────────────────────────────────────────────┐
│                   ADMIN (Team Lead)              │
│  - Registers as "Admin"                          │
│  - Creates their Team and adds Members           │
│  - Creates Projects and assigns Members          │
│  - Creates Tasks within Projects                 │
│  - Monitors progress on the Dashboard           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                   MEMBER                        │
│  - Registers as "Member"                         │
│  - Waits for an Admin to add them to a Team      │
│  - Can see only their assigned Projects & Tasks  │
│  - Updates task status as work progresses        │
└─────────────────────────────────────────────────┘
```

### Workflow Step by Step

```
1. Admin registers → creates account with role "Admin"
2. Admin goes to Team page → adds members via their email
3. Admin goes to Projects → creates a new project, assigns team members
4. Admin opens a project → creates tasks, assigns each to a member
5. Member logs in → sees their assigned projects and tasks
6. Member changes task status (Pending → In Progress → Completed)
7. Admin monitors the Dashboard for live updates on progress
```

---

## 🖥️ App Pages & What They Do

### 1. Login / Register Page
- New users can register as **Admin** or **Member**
- Existing users log in with email and password
- Secure session managed with JWT cookie (stays logged in for 7 days)

### 2. Dashboard
- Shows a warm time-based greeting (Good Morning / Afternoon / Evening)
- Displays **4 live metric cards**:
  - 🔵 **Total Tasks** — all tasks related to you
  - 🟡 **Pending** — tasks not yet started
  - 🟣 **Processing** — tasks currently in progress
  - 🔴 **Overdue** — tasks past their due date and not completed
- Shows a list of your **In-Progress Tasks** at the bottom, ordered by priority

### 3. Projects Page
- Admin sees all projects they created
- Members see only projects they've been assigned to
- Each project card shows title, description, member count / admin name, and a **progress bar**
- Click any project to open its task list

### 4. Project Details Page
- Shows all tasks inside a project
- Each task displays: title, description, due date (IST), assignee name
- A **status dropdown** lets users change: `Pending → In Progress → Completed`
  - Admins can update any task
  - Members can only update tasks assigned to them
- Admin can add more members via email and create new tasks
- A live **project progress bar** shows % completion at the top

### 5. Team Page *(Admin only)*
- Add team members by their registered email address
- View all current members with their name and email
- Remove a member (they automatically lose access to all projects and tasks get reassigned)

### 6. Settings Page
- Switch between **Dark Mode** and **Light Mode**
- **Install the app** as a PWA:
  - Android/Desktop: one-click install button
  - iPhone/iPad: step-by-step Safari instructions
- View your account info (name, email, role)

---

## 🔒 Security Features

- Passwords are **bcrypt hashed** — never stored in plain text
- Authentication uses **HttpOnly JWT cookies** — JavaScript cannot access the token
- **Role-based access control (RBAC)** — members can't access admin routes
- **IDOR protection** — users can only access data that belongs to their team
- **Input validation** with Zod — all API inputs are validated server-side
- `.env` file with secrets is **never committed** to GitHub

---

## 📲 Installing as a Mobile App (PWA)

### Android / Chrome Desktop
1. Open the app in Chrome browser
2. Go to **Settings → Install App**
3. Click the **Install** button
4. The app will appear on your home screen / taskbar

### iPhone / iPad (Safari)
1. Open the app in **Safari**
2. Tap the **Share button** (⬆) at the bottom
3. Tap **"Add to Home Screen"**
4. Tap **"Add"** — done!

> Once installed, the app opens full-screen like a native app, without the browser address bar.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (cloud) via Mongoose |
| **Authentication** | JSON Web Tokens (JWT) + HttpOnly Cookies |
| **Validation** | Zod |
| **PWA** | vite-plugin-pwa (Workbox) |
| **Icons** | Lucide React |
| **Timezone** | IST (Asia/Kolkata) enforced server + client |

---

## 🚀 Local Setup Guide

### Prerequisites
- Node.js 18 or higher
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### Step 1 — Clone the repository
```bash
git clone https://github.com/sandeep-bodapudi/TeamTaskManager.git
cd TeamTaskManager
```

### Step 2 — Setup the Backend
```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:
```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=any_long_random_secret_string
NODE_ENV=development
TZ=Asia/Kolkata
```

Then install and run:
```bash
npm install
npm run dev
```
Backend runs on → `http://localhost:8080`

### Step 3 — Setup the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on → `http://localhost:5173`

---

## 📁 Project Structure

```
TeamTaskManager/
├── backend/
│   ├── middleware/       # auth, role, validate
│   ├── models/           # User, Project, Task, Team
│   ├── routes/           # auth, projects, tasks, dashboard, teams
│   ├── .env.example      # safe env template
│   └── server.js         # app entry point
│
├── frontend/
│   ├── public/           # PWA icons, manifest
│   └── src/
│       ├── api/          # axios instance
│       ├── context/      # Auth, Theme, Notification contexts
│       ├── pages/        # Dashboard, Projects, ProjectDetails, Team, Login, Settings
│       ├── utils/        # IST date formatter
│       ├── App.jsx        # routes + navigation
│       └── index.css     # design token system
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🧪 Test Accounts (for demo/evaluation)

> Create these yourself after running the app locally:

| Role | How to create |
|---|---|
| Admin | Register with role = **Admin** |
| Member | Register with role = **Member** |

Then log in as Admin → go to **Team** → add the Member's email → assign projects and tasks.

---

## 📸 Screenshots

> *(Add your own screenshots here after running the app)*

| Dashboard (Dark) | Projects | Team Management |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## 👤 Author

**Sandeep Bodapudi**  
GitHub: [@sandeep-bodapudi](https://github.com/sandeep-bodapudi)

---

## 📄 License

This project is for educational/assignment purposes.

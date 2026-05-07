# 📋 Team Task Manager

> A **Progressive Web App (PWA)** for managing team projects, assigning tasks, and tracking work — all in real-time. Built for teams where a Lead assigns and monitors work across members.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20App-Railway-blueviolet)](https://teamtaskmanager-production-d5ab.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-TeamTaskManager-black?logo=github)](https://github.com/sandeep-bodapudi/TeamTaskManager)
![PWA](https://img.shields.io/badge/PWA-Installable-8b5cf6)
![Theme](https://img.shields.io/badge/Theme-Dark%20%2F%20Light-f59e0b)

---

## 🌐 Live Application

### 👉 [https://teamtaskmanager-production-d5ab.up.railway.app](https://teamtaskmanager-production-d5ab.up.railway.app)

> ✅ Hosted on Railway · No installation needed · Just open the link and use it

---

## 🎯 What Is This App?

**Team Task Manager** is a role-based task management system. A **Team Lead (Admin)** creates a private workspace, invites members, creates projects, assigns tasks, and tracks overall progress — all from one dashboard. **Members** log in, view their assigned work, and update task status in real-time.

No spreadsheets. No confusion. One place for the whole team.

---

## 👥 Two Roles

| Role | Who It's For | What They Can Do |
|---|---|---|
| **Admin** | Team Lead | Create team, projects, tasks · Assign work · Monitor dashboard |
| **Member** | Team Member | View assigned projects & tasks · Update task status |

---

## 🚀 Getting Started

### Step 1 — Open the App
**👉 [teamtaskmanager-production-d5ab.up.railway.app](https://teamtaskmanager-production-d5ab.up.railway.app)**

### Step 2 — Create an Account
Click **"Register"** and fill in:
- **Name** — your full name
- **Email** — your email address
- **Password** — minimum 6 characters
- **Role** — choose **Admin** if you're a team lead, or **Member** if you're joining a team

### Step 3 — Log In
Use your email and password. Your session stays active for **7 days** automatically.

---

## 🛠️ How To Use — Admin Guide

### 1️⃣ Build Your Team
- Go to the **Team** page (top navbar on desktop · bottom tab on mobile)
- Enter your team member's **registered email address** and click **Add Member**
- They are now connected to your private workspace

### 2️⃣ Create a Project
- Go to **Projects** → click **New Project**
- Enter a title and description
- Search for team members (type 3+ letters) and click their name to add them
- Click **Create Project**

### 3️⃣ Assign Tasks
- Click on any project card to open it
- Click **New Task** and fill in:
  - Task title & description
  - Which member to assign it to
  - Due date
- Click **Create Task** — the member sees it immediately on their dashboard

### 4️⃣ Monitor Progress
Your **Dashboard** shows live:
- 🔵 **Total Tasks** — all tasks in your workspace
- 🟡 **Pending** — not yet started
- 🟣 **Processing** — currently in progress
- 🔴 **Overdue** — past due date
- 📋 **In-Progress Task List** — live list of active work

### 5️⃣ Manage Team Members
- **Team** page → click **Remove from Team** to remove a member
- Their tasks are automatically reassigned back to you

---

## ✅ How To Use — Member Guide

### Step 1 — Register & Share Your Email
After registering as a **Member**, you'll see:
> *"Looking for an Admin to connect — ask your lead to add your email to their group"*

Share your **registered email address** with your team lead so they can add you.

### Step 2 — View Your Projects
Once your Admin adds you, go to **Projects** — you'll see all projects assigned to you.

### Step 3 — Work on Tasks
- Click a project to see your tasks
- Each task shows: title, description, due date, your name
- Use the **status dropdown** to update progress:
  - `Pending` → not started
  - `In Progress` → currently working
  - `Completed` → finished ✅

### Step 4 — Track on Dashboard
Your **Dashboard** shows your personal task counts and a live list of in-progress tasks.

---

## 📱 Install as a Mobile App (PWA)

No app store needed — install directly from the browser!

### Android / Desktop (Chrome or Edge)
1. Open the app → go to **Settings** page in the app
2. Click the **Install** button
3. App appears on your home screen / taskbar

### iPhone / iPad (Safari only)
1. Open the app in **Safari**
2. Tap the **Share** ⬆ button at the bottom
3. Tap **"Add to Home Screen"**
4. Tap **"Add"** — done!

> Once installed, the app opens **full screen** like a native app — no browser bar.

---

## 🌟 Features

| Feature | Details |
|---|---|
| 🔐 Secure Login | JWT tokens in HttpOnly cookies — XSS safe |
| 👥 Team Isolation | Each Admin has a private team — no data leaks |
| 📋 Projects & Tasks | Full management with assignee, due date, status |
| 📊 Live Dashboard | Real-time metrics and in-progress task list |
| 📱 PWA | Installable on Android, iOS, and Desktop |
| 🌙 Dark / Light Mode | Professional themes, switchable in Settings |
| ⏰ IST Timezone | All dates in Indian Standard Time |
| 📲 Mobile Friendly | Bottom tab navigation on mobile screens |

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + HttpOnly Cookies |
| Validation | Zod |
| Hosting | Railway |
| PWA | vite-plugin-pwa |

---

## 👤 Author

**Sandeep Bodapudi**  
GitHub: [@sandeep-bodapudi](https://github.com/sandeep-bodapudi)

---

## 📄 License

This project is built for educational and assignment purposes.

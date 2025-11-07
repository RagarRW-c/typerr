# 🖋️ Typrr Project

Typrr is a full-stack typing speed and accuracy application built with **React (frontend)**, **Express + Prisma (backend)**, and **SQLite/PostgreSQL** for persistent storage.  
The project is containerized using **Docker Compose** for consistent multi-service deployment.

---

## 🚀 Features

- User registration & login (JWT authentication)
- Typing test with WPM & accuracy tracking
- Leaderboard system for best results
- RESTful API with Prisma ORM
- Frontend served with Vite + React + TypeScript
- Dockerized backend and frontend for easy deployment

---

## 🏗️ Project Structure

```
typrr-project/
├── typrr-frontend/      # React frontend (Vite)
├── typrr-backend/       # Express + Prisma backend
├── docker-compose.yml   # Defines multi-container setup
└── README.md            # Project documentation
```

---

## ⚙️ Installation & Setup (Local Development)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/RagarRW-c/typerr.git
cd typerr
```

### 2️⃣ Backend setup

```bash
cd typrr-backend
npm install
npx prisma migrate deploy
npm run dev
```

### 3️⃣ Frontend setup

```bash
cd typrr-frontend
npm install
npm run dev
```

### 4️⃣ Environment variables

Create `.env` file inside `typrr-backend/` with:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=3003
```

---

## 🐳 Running with Docker Compose

```bash
docker compose up --build
```

Then visit:
- Frontend → http://localhost:5173  
- Backend → http://localhost:3003/api/health  

---

## 📁 Key Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login existing user |
| GET | `/api/leaderboard` | Get leaderboard data |
| POST | `/api/attempts` | Save typing attempt |

---

## 🧱 Technologies Used

- **Frontend:** React, TypeScript, Vite  
- **Backend:** Node.js, Express, Prisma  
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Containerization:** Docker, Docker Compose  
- **Authentication:** JWT (JSON Web Tokens)

---

## 🧪 Development Commands

| Command | Description |
|----------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Run compiled app |
| `npx prisma studio` | Open Prisma UI |

---

## 🧹 Future Improvements

- Add user profile management
- Add multi-language support
- Add typing history graph
- Replace SQLite with hosted PostgreSQL (for deployment)
- Add CI/CD pipeline via GitHub Actions

---

## 📜 License

This project is licensed under the MIT License.

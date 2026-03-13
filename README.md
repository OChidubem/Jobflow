# Jobflow 🚀

**Land your dream job.** A full-stack job application tracker built for students and job seekers.

[![Tests](https://github.com/chidubem/jobflow/actions/workflows/test.yml/badge.svg)](https://github.com/chidubem/jobflow/actions/workflows/test.yml)
[![Build](https://github.com/chidubem/jobflow/actions/workflows/build.yml/badge.svg)](https://github.com/chidubem/jobflow/actions/workflows/build.yml)

> Stop losing track of applications in spreadsheets. Jobflow keeps your entire job search organized in one beautiful place.

---

## 📸 Screenshots

| Dashboard | Add Application | Login |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Add](docs/screenshots/add.png) | ![Login](docs/screenshots/login.png) |

> **[Live Demo →](https://jobflow-snowy.vercel.app)** | **[API Docs →](https://innovative-adaptation-production.up.railway.app/docs)**

---

## ⚡ Features

- 📋 **Track applications** — company, role, status, date, source, URL, notes
- 📊 **Pipeline visualization** — see Applied → Interview → Offer conversion rates live
- 🔍 **Filter & search** — by status, company name, or role title
- 🔐 **Secure auth** — JWT + bcrypt, with Redis-backed token invalidation on logout
- 💬 **Motivational dashboard** — dynamic encouragement based on your progress
- 📱 **Fully responsive** — works on mobile and desktop

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                          │
│              Next.js 14 (TypeScript)                 │
│         localhost:3000 / jobflow.vercel.app          │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (REST)
                     ▼
┌─────────────────────────────────────────────────────┐
│                   FastAPI (Python)                   │
│              localhost:8000 / Railway                │
│                                                      │
│  /auth/register   /auth/login    /auth/logout        │
│  /applications    /applications/:id                  │
└──────────────┬──────────────────┬───────────────────┘
               │                  │
               ▼                  ▼
┌──────────────────────┐  ┌──────────────────────────┐
│   PostgreSQL 16      │  │       Redis 7             │
│   (users, apps)      │  │   (JWT blocklist)         │
└──────────────────────┘  └──────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Fast, type-safe, great DX |
| Backend | FastAPI, Python 3.12 | High performance, auto docs |
| Database | PostgreSQL 16 | Reliable, relational |
| Cache | Redis 7 | JWT blocklist, fast invalidation |
| ORM | SQLAlchemy 2.0 + Alembic | Type-safe queries, migrations |
| Auth | PyJWT + bcrypt | Industry standard |
| Infra | Docker Compose | One-command local setup |
| CI/CD | GitHub Actions | Automated tests + build |
| Tests | pytest + httpx | 29 tests, full coverage |

---

## 📁 Project Structure

```
jobflow/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/            # Route handlers
│   │   │   ├── core/           # Config, JWT, Redis
│   │   │   ├── crud/           # DB operations
│   │   │   ├── models/         # SQLAlchemy ORM
│   │   │   └── schemas/        # Pydantic schemas
│   │   ├── alembic/            # DB migrations
│   │   └── tests/              # pytest suite (29 tests)
│   └── web/                    # Next.js frontend
│       ├── app/                # Pages (login, register, dashboard)
│       ├── components/         # UI components
│       └── lib/                # API client, auth helpers
├── infra/
│   └── docker-compose.yml      # Full stack in one file
├── .github/
│   └── workflows/              # CI/CD pipelines
└── Makefile                    # Dev shortcuts
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone & configure
```bash
git clone https://github.com/chidubem/jobflow.git
cd jobflow
cp apps/api/.env.example apps/api/.env
# Edit .env and set a strong JWT_SECRET_KEY
```

### 2. Start everything
```bash
make up
```

### 3. Run migrations (first time only)
```bash
make migrate
```

### 4. Open the app

| | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| 📖 API Docs | http://localhost:8000/docs |

---

## 🧪 Tests

```bash
make test
```

29 tests covering:
- Auth: register, login, logout, token invalidation, password validation
- Applications: CRUD, status filtering, search, pagination, user isolation

---

## 📋 Makefile Commands

```bash
make up                        # Start all services (Docker)
make down                      # Stop all services
make migrate                   # Run DB migrations
make migration msg="my change" # Generate new migration
make test                      # Run test suite
make logs                      # Stream logs
make dev                       # Run API locally (hot reload)
make web                       # Run frontend locally (hot reload)
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ✗ | Create account |
| `POST` | `/auth/login` | ✗ | Login → JWT |
| `POST` | `/auth/logout` | ✓ | Invalidate token |
| `GET` | `/auth/me` | ✓ | Current user |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/applications` | Create application |
| `GET` | `/applications?status=&search=&skip=&limit=` | List with filters |
| `GET` | `/applications/:id` | Get one |
| `PATCH` | `/applications/:id` | Update |
| `DELETE` | `/applications/:id` | Delete |

---

## 🔐 Environment Variables

```env
DATABASE_URL=postgresql+psycopg://jobflow:jobflow@localhost:5433/jobflow
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) — connect GitHub, auto-deploys |
| Backend + DB + Redis | [Railway](https://railway.app) — one-click deploy |

Set `NEXT_PUBLIC_API_URL` on Vercel to your Railway API URL.

---

<p align="center">Built with ❤️ for students and job seekers everywhere.</p>

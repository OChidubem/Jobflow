# Jobflow 🚀

> **Land your dream job.** Track every application, ace every interview, never miss a follow-up.

Jobflow is a full-stack job application tracker built for students and job seekers. Stop losing track of applications in spreadsheets — Jobflow keeps your entire job search organized in one beautiful place.

---

## ✨ Features

- **Application tracking** — Log every job you apply to with company, role, status, date, source, URL, and notes
- **Pipeline visualization** — See your Applied → Interview → Offer conversion rates at a glance
- **Smart filtering** — Filter by status, search by company or role, paginate through results
- **JWT Authentication** — Secure login/register with bcrypt password hashing
- **Real logout** — Tokens are invalidated via Redis blocklist on logout
- **Motivational dashboard** — Dynamic greeting and encouragement based on your job search progress
- **Fully responsive** — Works beautifully on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| Database | PostgreSQL 16 |
| Cache / Auth | Redis 7 |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Auth | JWT (PyJWT) + bcrypt |
| Infra | Docker Compose |
| Tests | pytest + httpx |

---

## 📁 Project Structure

```
jobflow/
├── apps/
│   ├── api/                  # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/          # Route handlers (auth, applications)
│   │   │   ├── core/         # Config, security, Redis client
│   │   │   ├── crud/         # Database operations
│   │   │   ├── db/           # SQLAlchemy base, session, models
│   │   │   ├── models/       # ORM models (User, Application)
│   │   │   └── schemas/      # Pydantic request/response schemas
│   │   ├── alembic/          # Database migrations
│   │   ├── tests/            # pytest test suite
│   │   └── requirements.txt
│   └── web/                  # Next.js frontend
│       ├── app/              # Pages (login, register, dashboard)
│       ├── components/       # UI components
│       └── lib/              # API client, auth helpers
└── infra/
    └── docker-compose.yml    # PostgreSQL, Redis, API, Web
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone the repo

```bash
git clone https://github.com/your-username/jobflow.git
cd jobflow
```

### 2. Set up environment variables

```bash
cp apps/api/.env.example apps/api/.env
```

Open `apps/api/.env` and set a strong `JWT_SECRET_KEY`.

### 3. Start everything

```bash
make up
```

This builds and starts all 4 services: PostgreSQL, Redis, the API, and the frontend.

### 4. Run database migrations

```bash
make migrate
```

Only needed on first run or after pulling new migrations.

### 5. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API docs (Swagger) | http://localhost:8000/docs |

---

## 🧪 Running Tests

```bash
make test
```

29 tests covering auth (register, login, logout, token invalidation) and full CRUD for applications including filtering, search, and pagination.

---

## 📋 Available Commands

```bash
make up           # Start all Docker services
make down         # Stop all services
make logs         # Stream logs from all services
make ps           # Show running containers
make migrate      # Run database migrations
make migration msg="describe change"  # Generate a new migration
make test         # Run the test suite
make dev          # Run API locally with hot reload (outside Docker)
make web          # Run frontend locally with hot reload (outside Docker)
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a new account |
| `POST` | `/auth/login` | Login (OAuth2 form) → JWT |
| `POST` | `/auth/login-json` | Login (JSON body) → JWT |
| `POST` | `/auth/logout` | Invalidate token |
| `GET` | `/auth/me` | Get current user |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/applications` | Create an application |
| `GET` | `/applications` | List applications (filter, search, paginate) |
| `GET` | `/applications/{id}` | Get a single application |
| `PATCH` | `/applications/{id}` | Update an application |
| `DELETE` | `/applications/{id}` | Delete an application |

Query params for `GET /applications`: `status`, `search`, `skip`, `limit`

---

## 🗄 Application Status Flow

```
applied → interview → offer
                   ↘ rejected
       ↘ withdrawn
```

| Status | Meaning |
|---|---|
| `applied` | Submitted application |
| `interview` | Got a response / interview scheduled |
| `offer` | Received an offer 🎉 |
| `rejected` | Application was rejected |
| `withdrawn` | You withdrew the application |

---

## 🔐 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET_KEY` | Secret key for signing JWTs | — |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry time | `60` |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run `make test` to ensure everything passes
5. Open a pull request

---

<p align="center">Built with ❤️ for students and job seekers everywhere.</p>

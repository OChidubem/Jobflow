# Jobflow 🚀

A professional job application tracking app built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📊 **Analytics Dashboard** - Charts showing application trends and status breakdown
- 🗂️ **Kanban Board** - Drag-and-drop job cards through pipeline stages
- 📋 **Jobs List** - Searchable, filterable table of all applications
- 👥 **Contacts** - Track recruiters and hiring managers
- 🔐 **Authentication** - Secure email/password auth with NextAuth.js

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM + SQLite
- **Auth**: NextAuth.js v4
- **State**: TanStack Query (React Query)
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Seed with demo data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Account

- **Email**: demo@jobflow.app
- **Password**: password123

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Job Statuses

| Status | Description |
|--------|-------------|
| Wishlist | Jobs you want to apply to |
| Applied | Application submitted |
| Phone Screen | Initial phone/video screening |
| Technical Interview | Technical round(s) |
| Final Interview | Final round |
| Offer | Received an offer |
| Rejected | Application rejected |

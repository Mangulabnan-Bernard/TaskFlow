# TaskFlow — Management Suite

A high-performance project management tool for planning, tracking, and shipping
work. The **frontend** (Next.js, in [`frontend/`](frontend/)) is feature-complete on mock
data — app shell, UI library, dashboard, auth screens, and a Kanban board. The
**backend** (NestJS, in [`backend/`](backend/)) provides the full API — auth, projects,
tasks, and an auto-logged changelog. Next up: wiring the two together.

## Tech Stack

**Frontend (`frontend/`)**

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-based theme tokens — no `tailwind.config.js`)
- [@dnd-kit](https://dndkit.com) — drag-and-drop for the Kanban board
- [Axios](https://axios-http.com) — API client (JWT attached via interceptor)

**Backend (`backend/`)**

- [NestJS 11](https://nestjs.com) (TypeScript, Node.js)
- MySQL via [Prisma 6](https://www.prisma.io) (ORM)
- JWT auth (passport-jwt) + bcrypt password hashing

## Sprint Plan (10 sprints)

### Phase 1 — Frontend (Sprints 1–3)

**Sprint 1 — Scaffold + app shell + dashboard (FE)** ✅

- [x] Next.js + Tailwind + TypeScript scaffold
- [x] Folder structure and domain types
- [x] Sidebar, Topbar, MainLayout (app shell)
- [x] Reusable UI: Button, Input, Modal, Badge (+ Card, Avatar, ProgressBar)
- [x] Dashboard page — project cards with hardcoded dummy data

**Sprint 2 — Auth UI (FE)** ✅

- [x] Login page — form, styled inputs and buttons
- [x] Signup page — shared `AuthForm`
- [x] Basic field validation (required) with error-state support on inputs
- [x] Navigation between login ↔ signup

**Sprint 3 — Kanban board + task UI (FE)** ✅

- [x] Kanban page: 3 columns (Todo / In Progress / Done) with dummy task cards
- [x] Drag-and-drop with @dnd-kit (visual only, no API) — moving a card updates its status + column counts
- [x] Create / edit task modal UI
- [x] Changelog sidebar UI (static dummy entries)

### Phase 2 — Backend (Sprints 4–6)

**Sprint 4 — NestJS setup + Auth API (BE)** ✅

- [x] Init NestJS, connect MySQL with Prisma
- [x] `User` model, sign-up / sign-in endpoints (`POST /api/auth/register`, `/api/auth/login`)
- [x] JWT auth + bcrypt password hashing
- [x] Auth guard middleware (`JwtAuthGuard`, protecting `GET /api/auth/me`)

**Sprint 5 — Projects + Tasks API (BE)** ✅

- [x] Project model + CRUD endpoints (owner-scoped, JWT-guarded)
- [x] Task model + CRUD + PATCH status endpoint

**Sprint 6 — Changelog + seeding API (BE)** ✅

- [x] Changelog model — auto-log on task update
- [x] `GET /api/changelogs` endpoint
- [x] `POST /api/seed` — database seed endpoint

### Phase 3 — Integration (Sprints 7–8)

**Sprint 7 — Wire FE to BE (Both)** ✅

- [x] Axios instance; wire login / signup to Auth API, store JWT
- [x] Replace dummy project / task data with real API calls (dashboard projects, Kanban board)
- [x] Protected routes — redirect to login if no token
- [x] Create project / task forms persist via the API; Topbar shows the user + logout

**Sprint 8 — Interactivity + real-time (Both)** ✅

- [x] Drag-and-drop triggers real PATCH status API (optimistic, rolls back on error)
- [x] Changelog sidebar fetches real data
- [x] Status updates reflected across the UI (board, dashboard progress, changelog)

### Phase 4 — Polish & Delivery (Sprints 9–10)

**Sprint 9 — Bug fixes + polish (Both)** ✅

- [x] Fix broken flows and edge cases
- [x] Toast notifications, loading spinners, empty states
- [x] Error handling — invalid login, failed requests
- [x] Responsive layout pass (sidebar collapses into a drawer on small screens)

**Sprint 10 — README + deploy + submit (Buffer)**

- [ ] Finalize README: overview, setup steps, `.env` template, known issues
- [ ] Optional: deploy FE (Vercel), BE (Render / Railway)
- [ ] Final code review and cleanup
- [ ] Submit GitHub link

## Current Status

**Frontend (Sprints 1–3)** — complete; `npm run build` and `npm run lint` pass. App
shell, UI library, dashboard, auth screens, and the Kanban board (drag-and-drop, task
modal, changelog sidebar) are in place. Dashboard widgets without an API source
(deadlines, activity, workload) still use mock data from
[`frontend/lib/data.ts`](frontend/lib/data.ts).

**Backend (Sprints 4–6)** — the NestJS app in [`backend/`](backend/) is built and
**verified end-to-end** against MySQL (via Prisma). Sprint 4: `register`/`login` issue
JWTs (bcrypt-hashed passwords), `JwtAuthGuard` protects `GET /api/auth/me`. Sprint 5:
owner-scoped **Project** and **Task** CRUD plus `PATCH /api/tasks/:id/status` — all
JWT-guarded (401 without a token). Sprint 6: a **Changelog** model auto-logs task
creations and status/title changes, surfaced at `GET /api/changelogs` (per-user, newest
first); `POST /api/seed` populates an idempotent demo dataset (user, projects, tasks,
changelog) and returns the demo login. `DATABASE_URL` comes from `backend/.env`; the
schema is applied with `prisma db push`.

**Integration (Sprints 7–8)** — the frontend talks to the API via Axios
([`frontend/lib/api.ts`](frontend/lib/api.ts)). Login / signup hit the Auth API and store
the JWT (attached to every request by an interceptor); the `(app)` shell is guarded and
redirects to `/login` without a token. The dashboard's Active Projects and the Kanban
board load real data, and the New Project / New Task forms persist through the API. The
API base URL comes from `NEXT_PUBLIC_API_URL` (see [`frontend/.env.example`](frontend/.env.example)).
Sprint 8 makes the board live: dragging a card fires a real `PATCH /tasks/:id/status`
(optimistic, rolling back on error), the changelog sidebar reads `GET /changelogs`, and a
status change ripples to the board counts, dashboard progress, and changelog via a small
event bus ([`frontend/lib/events.ts`](frontend/lib/events.ts)).

**Polish (Sprint 9)** — a toast system ([`frontend/components/ui/Toast.tsx`](frontend/components/ui/Toast.tsx))
surfaces success/error feedback for creates, edits, and failed requests; loading spinners
and empty/error states cover the dashboard, board, and changelog; and a responsive pass
collapses the sidebar into a slide-in drawer (hamburger in the topbar) on small screens.

**Next up — Sprint 10 (buffer):** finalize the README, optional deploy, final cleanup, and
submit.

## Getting Started

### Frontend (`frontend/`)

```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL (defaults to http://localhost:3001/api)
npm run dev                  # http://localhost:3000  (redirects to /login)
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

Start the backend first (below), then sign in with the seeded demo account
(`demo@taskflow.dev` / `password123`) after calling `POST /api/seed` — or create your own
account from the signup page. The frontend dev server must be allowed by the backend's
CORS origin (`FRONTEND_URL`, default `http://localhost:3000`).

### Backend (`backend/`)

Requires a local MySQL instance.

```bash
cd backend
npm install                   # also generates the Prisma client (postinstall)
cp .env.example .env          # set DATABASE_URL (+ a JWT secret)
# create the database once, e.g.:  CREATE DATABASE taskflow;
npm run db:push               # create tables from the Prisma schema
npm run start:dev             # http://localhost:3001/api  (health: GET /api/health)
```

To load demo data, `POST /api/seed` once the server is running — it creates a
`demo@taskflow.dev` / `password123` user with sample projects, tasks, and changelog
entries, and returns those credentials.

API endpoints (all under `/api`; everything except `auth/*` and `seed` needs `Authorization: Bearer <token>`):
- `POST /auth/register` · `POST /auth/login` → `{ token, user }` · `GET /auth/me`
- `GET` / `POST /projects` · `GET` / `PATCH` / `DELETE /projects/:id`
- `GET /projects/:id/tasks` · `POST /tasks` · `PATCH` / `DELETE /tasks/:id` · `PATCH /tasks/:id/status`
- `GET /changelogs` — the current user's recent task activity (newest first)
- `POST /seed` — reset + load the demo dataset (open; blocked in production unless `ALLOW_SEED=true`)

For a step-by-step way to verify the API in Postman, see [`TESTING.md`](TESTING.md).

## Project Structure

```
frontend/                   # Next.js app
├─ app/
│  ├─ (app)/              # Authed shell (AuthGuard): dashboard, projects, tasks, team, analytics, settings, support
│  ├─ (auth)/             # Login / signup (centered card, no shell)
│  ├─ globals.css         # Tailwind v4 theme tokens (dark theme)
│  ├─ layout.tsx          # Root layout (fonts, metadata, AuthProvider)
│  └─ page.tsx            # Redirects → /login
├─ components/
│  ├─ ui/                 # Button, Input, Select, Badge, Modal, Card, Avatar, ProgressBar, Toast, Spinner
│  ├─ layout/             # Sidebar (drawer on mobile), Topbar (user + logout + menu), FAB, MobileNav, PlaceholderPage
│  ├─ dashboard/          # ActiveProjects (live), ProjectCard, DeadlineItem, ActivityItem, WorkloadChart
│  ├─ board/              # Kanban: KanbanBoard, KanbanColumn, TaskCard, TaskModal, ChangelogSidebar
│  ├─ auth/               # AuthForm (login + signup), AuthGuard (route protection)
│  ├─ project/            # NewProjectModal (+ context provider)
│  └─ icons.tsx           # Inline SVG icon set
└─ lib/
   ├─ api.ts              # Axios client: token storage, interceptors, typed API calls
   ├─ auth.tsx            # AuthProvider + useAuth (JWT state)
   ├─ events.ts           # Tiny event bus to refresh lists after writes
   ├─ data.ts             # Mock data (dashboard widgets without an API source)
   └─ utils.ts            # cn() classname helper

backend/                    # NestJS API (its own app — run separately)
├─ prisma/
│  └─ schema.prisma       # data models (User, Project, Task, Changelog) + MySQL datasource
├─ src/
│  ├─ auth/               # register/login, JWT strategy + JwtAuthGuard, DTOs
│  ├─ users/              # UsersService (Prisma)
│  ├─ projects/           # Projects CRUD (service, controller, DTOs)
│  ├─ tasks/              # Tasks CRUD + PATCH status (service, controller, DTOs)
│  ├─ changelog/          # auto-logged task history + GET /changelogs
│  ├─ seed/               # POST /seed — idempotent demo dataset
│  ├─ common/             # CurrentUser decorator
│  ├─ prisma/             # PrismaService + global PrismaModule
│  ├─ app.module.ts       # wires Prisma + Auth + Projects + Tasks + Changelog + Seed
│  └─ main.ts             # bootstrap: /api prefix, CORS, ValidationPipe
└─ .env.example           # DATABASE_URL + JWT config template
```

The UI is a fixed dark theme. Brand and surface colors are defined as Tailwind v4
`@theme` tokens in [`frontend/app/globals.css`](frontend/app/globals.css) (e.g. `--color-brand`,
`--color-surface`), which generate the `bg-*`, `text-*`, and `border-*` utilities
used throughout.


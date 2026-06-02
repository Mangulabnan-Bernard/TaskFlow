# TaskFlow — Management Suite

A high-performance project management tool for planning, tracking, and shipping
work. This repository currently contains the **frontend foundation**: the
application shell, a reusable UI component library, the authentication screens,
and the dashboard overview, all built against mock data ahead of the backend.

## Tech Stack

**Frontend (in this repo)**

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-based theme tokens — no `tailwind.config.js`)

**Backend (planned)**

- [NestJS](https://nestjs.com) + Node.js
- MySQL via [TypeORM](https://typeorm.io)
- JWT auth + bcrypt password hashing; Axios on the client

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the root path redirects to
`/dashboard`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project Structure

```
app/
├─ (app)/                 # Authenticated shell (sidebar + topbar)
│  ├─ dashboard/          # Dashboard overview
│  ├─ projects/ tasks/ team/ analytics/ settings/ support/
│  └─ layout.tsx
├─ (auth)/                # Login / signup (no shell, centered card)
│  ├─ login/ signup/
│  └─ layout.tsx
├─ globals.css            # Tailwind v4 theme tokens (dark theme)
├─ layout.tsx             # Root layout (fonts, metadata)
└─ page.tsx               # Redirects → /dashboard

components/
├─ ui/                    # Button, Input, Badge, Modal, Card, Avatar, ProgressBar
├─ layout/                # Sidebar, Topbar, FAB, PlaceholderPage
├─ dashboard/             # ProjectCard, DeadlineItem, ActivityItem, WorkloadChart
├─ auth/                  # AuthForm (shared by login + signup)
├─ project/               # NewProjectModal (+ context provider)
└─ icons.tsx              # Inline SVG icon set

lib/
├─ data.ts                # Mock data (shaped close to the future API)
└─ utils.ts               # cn() classname helper
```

The UI is a fixed dark theme. Brand and surface colors are defined as Tailwind v4
`@theme` tokens in [`app/globals.css`](app/globals.css) (e.g. `--color-brand`,
`--color-surface`), which generate the `bg-*`, `text-*`, and `border-*` utilities
used throughout.

## 10-Day Sprint Plan

### Phase 1 — Frontend (Days 1–3)

**Day 1 — Scaffold + app shell + dashboard (FE)** ✅

- [x] Next.js + Tailwind + TypeScript scaffold
- [x] Folder structure and domain types
- [x] Sidebar, Topbar, MainLayout (app shell)
- [x] Reusable UI: Button, Input, Modal, Badge (+ Card, Avatar, ProgressBar)
- [x] Dashboard page — project cards with hardcoded dummy data

**Day 2 — Auth UI (FE)** ✅

- [x] Login page — form, styled inputs and buttons
- [x] Signup page — shared `AuthForm`
- [x] Basic field validation (required) with error-state support on inputs
- [x] Navigation between login ↔ signup

**Day 3 — Kanban board + task UI (FE)**

- [ ] Kanban page: 3 columns (Todo / In Progress / Done) with dummy task cards
- [ ] Drag-and-drop with @dnd-kit (visual only, no API)
- [ ] Create / edit task modal UI
- [ ] Changelog sidebar UI (static dummy entries)

### Phase 2 — Backend (Days 4–6)

**Day 4 — NestJS setup + Auth API (BE)**

- [ ] Init NestJS, connect MySQL with TypeORM
- [ ] User entity, sign-up / sign-in endpoints
- [ ] JWT auth + bcrypt password hashing
- [ ] Auth guard middleware

**Day 5 — Projects + Tasks API (BE)**

- [ ] Project entity + CRUD endpoints
- [ ] Task entity + CRUD + PATCH status endpoint

**Day 6 — Changelog + seeding API (BE)**

- [ ] Changelog entity — auto-log on task update
- [ ] `GET /api/changelogs` endpoint
- [ ] `POST /api/seed` — database seed endpoint

### Phase 3 — Integration (Days 7–8)

**Day 7 — Wire FE to BE (Both)**

- [ ] Axios instance; wire login / signup to Auth API, store JWT
- [ ] Replace dummy project / task data with real API calls
- [ ] Protected routes — redirect to login if no token

**Day 8 — Interactivity + real-time (Both)**

- [ ] Drag-and-drop triggers real PATCH status API
- [ ] Changelog sidebar fetches real data
- [ ] Status updates reflected across the UI

### Phase 4 — Polish & Delivery (Days 9–10)

**Day 9 — Bug fixes + polish (Both)**

- [ ] Fix broken flows and edge cases
- [ ] Toast notifications, loading spinners, empty states
- [ ] Error handling — invalid login, failed requests
- [ ] Responsive layout pass

**Day 10 — README + deploy + submit (Buffer)**

- [ ] Finalize README: overview, setup steps, `.env` template, known issues
- [ ] Optional: deploy FE (Vercel), BE (Render / Railway)
- [ ] Final code review and cleanup
- [ ] Submit GitHub link

## Current Status

Days 1–2 are complete and verified (`npm run build` and `npm run lint` both pass) —
the app shell, UI component library, dashboard, and auth screens are in place. All
data on screen is mock data from [`lib/data.ts`](lib/data.ts); there is no backend
wired up yet, so the "New Project" modal and auth forms are UI-only until the APIs
land in Phase 2.

**Next up — Day 3:** the Kanban board, task modal, and changelog sidebar.

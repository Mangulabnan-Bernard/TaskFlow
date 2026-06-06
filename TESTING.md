# TaskFlow — Backend API Testing Guide

A step-by-step way to check that the backend works, using **Postman** (or any REST
client — Insomnia, Thunder Client, `curl`, etc.).

> **Note:** The frontend is not connected to the backend yet (that's Sprint 7), so for
> now you test the **API directly**. The Kanban board in the UI still uses mock data and
> will not change when you call these endpoints.

---

## 1. Before you start

You need:

- **Node.js** installed.
- A running **MySQL** server, with a database created (e.g. `CREATE DATABASE taskflow;`).
- A `backend/.env` file with `DATABASE_URL` and a `JWT_SECRET` (copy `backend/.env.example`).

Then, from the repo root:

```bash
cd backend
npm install        # installs deps and generates the Prisma client
npm run db:push    # creates the tables from the Prisma schema
```

## 2. Start the server

```bash
cd backend
npm run start:dev
```

- Default address: **`http://localhost:3001/api`**
- Quick check it's alive: open `http://localhost:3001/api/health` in a browser → you
  should see `{"status":"ok","service":"taskflow-api"}`.

> **Port already in use?** If you see `EADDRINUSE: address already in use :::3001`,
> another app is on port 3001. Run on a different port instead:
>
> ```powershell
> $env:PORT = 3005    # PowerShell
> npm run start:dev
> ```
>
> Then replace `3001` with `3005` in every URL below.

## 3. The token rule (read this first)

Most routes are **protected** — they need a login token.

1. You get a `token` from **register** or **login** (a long text string).
2. In Postman, open the **Authorization** tab → set **Type: Bearer Token** → paste the
   token in the box (paste the token only — Postman adds the word `Bearer` for you).
3. Only `auth/register`, `auth/login`, `health`, and `seed` work **without** a token.

> **Time-saver:** In Postman you can save the token once as a variable (e.g. `{{token}}`)
> and reuse it on every request, instead of pasting it each time.

**JSON bodies:** when a step has a body, use **Body → raw → JSON**.

---

## Sprint 4 — Auth (accounts & login)

Endpoints: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.

### Step 1 — Make a new account
- **POST** `http://localhost:3001/api/auth/register`
- Body (raw → JSON):
  ```json
  { "name": "Test User", "email": "test@taskflow.dev", "password": "secret123" }
  ```
- ✅ Returns a `token` and your `user`. (Password must be **6+ characters**; email must
  be a valid email.)

### Step 2 — Log in
- **POST** `http://localhost:3001/api/auth/login`
- Body (raw → JSON):
  ```json
  { "email": "test@taskflow.dev", "password": "secret123" }
  ```
- ✅ Returns a `token`. **Copy it** for the next step.

### Step 3 — See who you are (protected)
- **GET** `http://localhost:3001/api/auth/me`
- Authorization: **Bearer Token** (paste your token).
- ✅ Returns your `id`, `email`, and `name`.

### Make sure the security works (these should FAIL on purpose)

| Try this | Expected result | What it proves |
| --- | --- | --- |
| Step 3 **without** a token | `401 Unauthorized` | Protected routes need a token |
| Step 1 again with the **same email** | `409 Conflict` | No duplicate accounts |
| Step 2 with a **wrong password** | `401 Unauthorized` | The password is really checked |
| Step 1 with `"password": "123"` | `400 Bad Request` | Validation works (too short) |

---

## Sprint 5 — Projects & Tasks (CRUD)

Everything here needs the **Bearer token** from Sprint 4 (Step 2). You only ever see
**your own** projects and tasks.

> Tip: instead of registering, you can run **`POST /api/seed`** (see Sprint 6) to get a
> ready-made account `demo@taskflow.dev` / `password123` with sample data.

### Step 1 — Create a project
- **POST** `http://localhost:3001/api/projects`
- Body (raw → JSON):
  ```json
  { "name": "My First Project", "description": "Just testing." }
  ```
- ✅ Returns the new project. **Copy its `id`.** (`description` is optional.)

### Step 2 — List your projects
- **GET** `http://localhost:3001/api/projects`
- ✅ Returns an array of your projects, each with a task count.

### Step 3 — Get one project (with its tasks)
- **GET** `http://localhost:3001/api/projects/PROJECT_ID`
- ✅ Returns that project including its `tasks` list.

### Step 4 — Update a project
- **PATCH** `http://localhost:3001/api/projects/PROJECT_ID`
- Body (raw → JSON):
  ```json
  { "name": "Renamed Project" }
  ```
- ✅ Returns the updated project.

### Step 5 — Create a task in that project
- **POST** `http://localhost:3001/api/tasks`
- Body (raw → JSON):
  ```json
  { "projectId": "PROJECT_ID", "title": "My first task" }
  ```
- ✅ Returns the new task (status defaults to `TODO`). **Copy its `id`.**
  (Optional fields: `description`, and `status` = `TODO` / `IN_PROGRESS` / `DONE`.)

### Step 6 — List the project's tasks
- **GET** `http://localhost:3001/api/projects/PROJECT_ID/tasks`
- ✅ Returns the tasks in that project.

### Step 7 — Update a task
- **PATCH** `http://localhost:3001/api/tasks/TASK_ID`
- Body (raw → JSON):
  ```json
  { "title": "Updated title", "status": "IN_PROGRESS" }
  ```
- ✅ Returns the updated task.

### Step 8 — Change only a task's status
- **PATCH** `http://localhost:3001/api/tasks/TASK_ID/status`
- Body (raw → JSON):
  ```json
  { "status": "DONE" }
  ```
- ✅ Returns the task with the new status. (This is the endpoint the board's
  drag-and-drop will use.)

### Step 9 — Delete a task, then a project
- **DELETE** `http://localhost:3001/api/tasks/TASK_ID` → ✅ `{ "id": "..." }`
- **DELETE** `http://localhost:3001/api/projects/PROJECT_ID` → ✅ `{ "id": "..." }`
  (Deleting a project also deletes its tasks.)

### Ownership check (should FAIL on purpose)
- Use a project/task `id` that isn't yours (or a made-up one) → `404 Not Found`
  ("Project not found" / "Task not found"). This proves you can only touch your own data.

---

## Sprint 6 — Changelog & Seed

Two features: a **changelog** that records task changes automatically, and a **seed**
endpoint that loads demo data.

### Step 1 — Add demo data
- **POST** `http://localhost:3001/api/seed` (no token, no body)
- ✅ Returns the demo login and counts:
  ```json
  { "message": "Database seeded",
    "credentials": { "email": "demo@taskflow.dev", "password": "password123" },
    "projects": 2, "tasks": 7 }
  ```

### Step 2 — Log in as the demo user
- **POST** `http://localhost:3001/api/auth/login`
- Body: `{ "email": "demo@taskflow.dev", "password": "password123" }`
- ✅ **Copy the `token`.**

### Step 3 — See your projects
- **GET** `http://localhost:3001/api/projects` (Bearer token)
- ✅ Two projects. **Copy one project's `id`** — use the `id` field, **not** `ownerId`.

### Step 4 — See that project's tasks
- **GET** `http://localhost:3001/api/projects/PROJECT_ID/tasks` (Bearer token)
- ✅ Find a task with `"status": "TODO"` and **copy its `id`**.

### Step 5 — Look at the changelog (before)
- **GET** `http://localhost:3001/api/changelogs` (Bearer token)
- ✅ A list of past task changes, newest first. **Note how many items there are.**

### Step 6 — Change a task's status
- **PATCH** `http://localhost:3001/api/tasks/TASK_ID/status` (Bearer token)
- Body: `{ "status": "IN_PROGRESS" }`
- ✅ The task status changes.

### Step 7 — Look at the changelog again (after)
- **GET** `http://localhost:3001/api/changelogs` (Bearer token)
- ✅ The list now has **one more item**, and the **top item** is your change
  (`field: "status"`, `from: "TODO"`, `to: "IN_PROGRESS"`). This proves the app logged
  the change **by itself**.

> ⚠️ **`POST /api/seed` wipes and recreates the demo data with brand-new IDs every time
> you call it.** If you re-seed, your old project/task IDs stop working — just run Step 3
> again to get the new IDs. Don't re-seed in the middle of a flow.

---

## Endpoint reference

Base URL: `http://localhost:3001/api` · 🔒 = needs `Authorization: Bearer <token>`

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| GET | `/health` | — | — |
| POST | `/auth/register` | — | `{ name, email, password }` |
| POST | `/auth/login` | — | `{ email, password }` |
| GET | `/auth/me` | 🔒 | — |
| GET | `/projects` | 🔒 | — |
| POST | `/projects` | 🔒 | `{ name, description? }` |
| GET | `/projects/:id` | 🔒 | — |
| PATCH | `/projects/:id` | 🔒 | `{ name?, description? }` |
| DELETE | `/projects/:id` | 🔒 | — |
| GET | `/projects/:id/tasks` | 🔒 | — |
| POST | `/tasks` | 🔒 | `{ projectId, title, description?, status? }` |
| PATCH | `/tasks/:id` | 🔒 | `{ title?, description?, status? }` |
| PATCH | `/tasks/:id/status` | 🔒 | `{ status }` |
| DELETE | `/tasks/:id` | 🔒 | — |
| GET | `/changelogs` | 🔒 | — |
| POST | `/seed` | — | — |

`status` is one of: `TODO`, `IN_PROGRESS`, `DONE`.

---

## Common problems

| You see | Why | Fix |
| --- | --- | --- |
| `404 "Project not found"` | You used the wrong ID (often `ownerId` instead of `id`), or you re-seeded and the ID is stale | Re-run `GET /projects` and copy the `id` field |
| `401 Unauthorized` | No token, wrong token, or token in the wrong place | Add the token in **Authorization → Bearer Token** |
| `400 Bad Request` | Body fails validation (e.g. password < 6, missing `title`, invalid email) | Check the field rules in the reference above |
| `409 Conflict` | Registering an email that already exists | Use a different email, or just log in |
| `EADDRINUSE :::3001` | Port 3001 is taken | Start with `$env:PORT=3005` and use that port |
| Empty `[]` from `/projects` | New account with no data yet | Create a project, or run `POST /seed` |

---

## Ideas to add later

- **Save a Postman Collection** (export the requests above) and commit it so other devs
  don't rebuild them by hand.
- **Automated tests** — the project already has Jest + supertest set up (`npm run test`,
  `npm run test:e2e`); adding `*.spec.ts` files would let CI check these flows
  automatically instead of clicking through Postman.
- **Seed safety** — `POST /seed` is open so you can bootstrap a fresh DB; it is blocked
  when `NODE_ENV=production` unless `ALLOW_SEED=true`. Keep that in mind before deploying.
- **Frontend testing** — once Sprint 7 wires the UI to the API, add a short "log in
  through the browser and watch the board load real data" section here.

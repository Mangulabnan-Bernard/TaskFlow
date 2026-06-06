# TaskFlow Backend Testing Guide

This guide will help you test the TaskFlow backend using Postman.

> Note: As of Sprint 7 the frontend is wired to this API. This guide covers testing the API directly (Postman); to test through the UI, run the frontend (`cd frontend && npm run dev`) and sign in with the seeded demo account after calling `POST /seed`.

---

# Setup

## Requirements

Make sure you have:

* Node.js installed
* MySQL running
* A TaskFlow database created
* A configured `.env` file

Example:

```env
DATABASE_URL="mysql://user:password@localhost:3306/taskflow"
JWT_SECRET="your-secret-key"
```

Install dependencies and create database tables:

```bash
cd backend
npm install
npm run db:push
```

---

# Start the Backend

```bash
npm run start:dev
```

Default URL:

```text
http://localhost:3001/api
```

Check if it is running:

```text
http://localhost:3001/api/health
```

Expected result:

```json
{
  "status": "ok",
  "service": "taskflow-api"
}
```

If port 3001 is already in use:

```powershell
$env:PORT=3005
npm run start:dev
```

Then use port 3005 instead.

---

# Authentication

Most endpoints require a login token.

Workflow:

```text
Register
   ↓
Login
   ↓
Receive JWT Token
   ↓
Use Token on Protected Endpoints
```

In Postman:

1. Open Authorization tab
2. Select Bearer Token
3. Paste the token

Public endpoints:

```text
POST /auth/register
POST /auth/login
GET  /health
POST /seed
```

Everything else requires authentication.

---

# Sprint 4 – Authentication

## Create Account

Request:

```http
POST /auth/register
```

Body:

```json
{
  "name": "Test User",
  "email": "test@taskflow.dev",
  "password": "secret123"
}
```

Expected Result:

* User created
* JWT token returned

---

## Login

Request:

```http
POST /auth/login
```

Body:

```json
{
  "email": "test@taskflow.dev",
  "password": "secret123"
}
```

Expected Result:

* JWT token returned

Save the token for later requests.

---

## Get Current User

Request:

```http
GET /auth/me
```

Authorization:

```text
Bearer Token
```

Expected Result:

```json
{
  "id": "...",
  "name": "Test User",
  "email": "test@taskflow.dev"
}
```

---

## Validation Checks

These should fail:

| Test                          | Expected         |
| ----------------------------- | ---------------- |
| No token on `/auth/me`        | 401 Unauthorized |
| Duplicate email               | 409 Conflict     |
| Wrong password                | 401 Unauthorized |
| Password shorter than 6 chars | 400 Bad Request  |

---

# Sprint 5 – Projects and Tasks

All endpoints below require authentication.

---

## Create Project

Request:

```http
POST /projects
```

Body:

```json
{
  "name": "My First Project",
  "description": "Testing project"
}
```

Expected Result:

* Project created
* Save the project ID

---

## Get Projects

Request:

```http
GET /projects
```

Expected Result:

* List of your projects

---

## Get Single Project

Request:

```http
GET /projects/{PROJECT_ID}
```

Expected Result:

* Project details
* Related tasks

---

## Update Project

Request:

```http
PATCH /projects/{PROJECT_ID}
```

Body:

```json
{
  "name": "Updated Project Name"
}
```

Expected Result:

* Project updated

---

## Create Task

Request:

```http
POST /tasks
```

Body:

```json
{
  "projectId": "PROJECT_ID",
  "title": "My First Task"
}
```

Expected Result:

* Task created
* Status defaults to TODO

---

## Get Project Tasks

Request:

```http
GET /projects/{PROJECT_ID}/tasks
```

Expected Result:

* All tasks in the project

---

## Update Task

Request:

```http
PATCH /tasks/{TASK_ID}
```

Body:

```json
{
  "title": "Updated Task",
  "status": "IN_PROGRESS"
}
```

Expected Result:

* Task updated

---

## Update Task Status

Request:

```http
PATCH /tasks/{TASK_ID}/status
```

Body:

```json
{
  "status": "DONE"
}
```

Expected Result:

* Status updated

---

## Delete Task

Request:

```http
DELETE /tasks/{TASK_ID}
```

Expected Result:

```json
{
  "id": "..."
}
```

---

## Delete Project

Request:

```http
DELETE /projects/{PROJECT_ID}
```

Expected Result:

```json
{
  "id": "..."
}
```

Deleting a project also deletes all associated tasks.

---

# Sprint 6 – Changelog and Seed Data

Sprint 6 introduces:

1. Automatic task history tracking
2. Demo data generation

---

## Seed Database

Request:

```http
POST /seed
```

Expected Result:

```json
{
  "message": "Database seeded",
  "credentials": {
    "email": "demo@taskflow.dev",
    "password": "password123"
  }
}
```

---

## Login as Demo User

Request:

```http
POST /auth/login
```

Body:

```json
{
  "email": "demo@taskflow.dev",
  "password": "password123"
}
```

Save the returned token.

---

## View Projects

Request:

```http
GET /projects
```

Expected Result:

* Two demo projects

Save one project ID.

---

## View Tasks

Request:

```http
GET /projects/{PROJECT_ID}/tasks
```

Expected Result:

* Demo tasks

Save a task ID with status TODO.

---

## View Changelog

Request:

```http
GET /changelogs
```

Expected Result:

* List of task history entries

---

## Change Task Status

Request:

```http
PATCH /tasks/{TASK_ID}/status
```

Body:

```json
{
  "status": "IN_PROGRESS"
}
```

Expected Result:

* Status updated successfully

---

## Verify Changelog

Request:

```http
GET /changelogs
```

Expected Result:

* New entry appears at the top
* Shows the status change

Example:

```text
Task Status Changed
TODO → IN_PROGRESS
```

This confirms automatic logging is working.

---

# Available Endpoints

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | /health             |
| POST   | /auth/register      |
| POST   | /auth/login         |
| GET    | /auth/me            |
| GET    | /projects           |
| POST   | /projects           |
| GET    | /projects/:id       |
| PATCH  | /projects/:id       |
| DELETE | /projects/:id       |
| GET    | /projects/:id/tasks |
| POST   | /tasks              |
| PATCH  | /tasks/:id          |
| PATCH  | /tasks/:id/status   |
| DELETE | /tasks/:id          |
| GET    | /changelogs         |
| POST   | /seed               |

Task statuses:

```text
TODO
IN_PROGRESS
DONE
```

---

# Common Errors

| Error            | Cause                    |
| ---------------- | ------------------------ |
| 401 Unauthorized | Missing or invalid token |
| 404 Not Found    | Invalid project/task ID  |
| 400 Bad Request  | Validation error         |
| 409 Conflict     | Email already exists     |
| EADDRINUSE       | Port already being used  |

---

# Sprint 6 Success Checklist

Sprint 6 is working if:

✅ Backend starts successfully

✅ Seed endpoint creates demo data

✅ Login returns a JWT token

✅ Projects and tasks can be retrieved

✅ Task status updates correctly

✅ Changelog automatically records task changes

# Waste Disposal System

Multi-role web application with shared online data using Supabase.

## Modules

- User: register/login, request pickups, submit complaints, make payments
- Collector: view assigned pickups and update status
- Admin: manage users, assign collectors, monitor pickups and complaints

## Project Structure

- Frontend (static pages + vanilla JS): root folder
- Backend API (Express + Supabase): `backend/`

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (ES modules)
- Node.js + Express
- Supabase Postgres
- JWT auth + bcrypt

## Quick Start (Local)

### 0) One-command startup (recommended)

From the project root:

```bash
npm install
npm run dev
```

This starts:

- Backend API on `http://localhost:5000`
- Frontend static server on `http://localhost:3000`

Now both backend and frontend run together, so refreshing frontend pages continues to work without starting services separately.

### 1) Backend

```bash
cd backend
npm install
copy .env.example .env
```

Set real values in `backend/.env`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `CLIENT_URL`
- `PORT`

Then run database schema in Supabase SQL Editor:

- `backend/supabase/schema.sql`

Start backend:

```bash
npm run dev
```

### 2) Frontend

Open the root folder with a static server (VS Code Live Server is fine) and access:

- `index.html`
- `auth.html`

By default frontend uses `http://localhost:5000/api`.

## Demo Admin Account

After running `backend/supabase/schema.sql`:

- Email: `admin@gmail.com`
- Password: `Admin@123`

## Deployment

- Backend: Render (set backend env vars)
- Frontend: Vercel (set API base to your Render backend)

Backend is ready-to-run on Render using [render.yaml](render.yaml).

After backend deploy, connect frontend by opening:

`https://waste-disposal-system.vercel.app/?apiBase=https://<your-render-service>.onrender.com/api`

For deployment details, see `backend/README.md`.

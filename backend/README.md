# WDS Backend API (Supabase + MongoDB)

Backend service for the Waste Disposal System frontend.

## Stack

- Node.js + Express
- Supabase Postgres (`@supabase/supabase-js` with service role key)
- MongoDB (`mongoose`) for v2 APIs and chatbot data
- JWT authentication
- bcrypt password hashing

## Prerequisites

- Node.js 18+
- A Supabase project

## 1) Configure Environment

Copy `.env.example` to `.env` and set real values:

```env
PORT=5000
NODE_ENV=development
PRIMARY_DB=mongo
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
MONGODB_URI=mongodb://127.0.0.1:27017/wds_ai_chatbot
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
```

## 2) Database Setup Options

### Option A: Supabase

Set `PRIMARY_DB=supabase` in `.env` to use Supabase as primary.

Open Supabase SQL Editor and run:

- `supabase/schema.sql`

This creates all required tables and seeds the admin account:

- Email: `admin@gmail.com`
- Password: `Admin@123`

### Option B: MongoDB

Keep `PRIMARY_DB=mongo` (default) to use MongoDB as primary for `/api` controllers.

Start MongoDB (local install or Docker):

```bash
docker compose up -d
```

Then seed default records:

```bash
npm run db:init
```

This seeds:

- Admin: `admin@gmail.com` / `Admin@123`
- Collector: `collector@wds.local` / `Collector@123`
- User: `user@wds.local` / `User@123`

## 3) Install and Run

```bash
npm install
npm run dev
```

Server starts on:

- API: `http://localhost:5000/api`
- Health: `http://localhost:5000/health`

## Health and Readiness

- `GET /health` returns service status and database mode.
- If Supabase env vars are missing, API routes return `503` with missing keys.

## API Routes

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/check-email`
- `POST /api/auth/reset-password`
- `GET /api/auth/me` (auth)

### Users
- `POST /api/users` (admin)
- `GET /api/users` (admin)
- `GET /api/users/collectors` (admin)
- `GET /api/users/:id` (auth, self or admin)
- `PUT /api/users/:id/profile` (auth, self or admin)
- `PUT /api/users/:id/password` (auth, self or admin)
- `DELETE /api/users/:id` (admin)

### Pickups
- `POST /api/pickups` (auth)
- `GET /api/pickups` (auth)
- `GET /api/pickups/:id` (auth)
- `PUT /api/pickups/:id/status` (collector/admin)
- `PUT /api/pickups/:id/assign` (admin)
- `DELETE /api/pickups/:id` (admin)

### Complaints
- `POST /api/complaints` (auth)
- `GET /api/complaints` (auth)
- `PUT /api/complaints/:id/status` (admin)
- `DELETE /api/complaints/:id` (admin)

### Payments
- `POST /api/payments` (auth)
- `GET /api/payments` (auth)
- `GET /api/payments/:id` (auth)

### Feedback
- `POST /api/feedback` (auth)
- `GET /api/feedback` (auth)

### Mongo v2 APIs
- `GET /api/v2/health`
- `POST /api/v2/auth/register`
- `POST /api/v2/auth/login`
- `POST /api/v2/complaints`
- `PATCH /api/v2/complaints/:id/status`
- `GET /api/v2/collector/tasks`
- `POST /api/v2/collector/tasks/:id/update`
- `GET /api/v2/admin/complaints`

## Production Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.
- Set `CLIENT_URL` to your deployed frontend origin.
- Use a strong `JWT_SECRET` in production.

## Deploy Backend On Render (Ready-To-Run)

This repository now includes a Render Blueprint at [render.yaml](../render.yaml) with backend service defaults.

### 1) Push to GitHub

Render deploys from your Git repository, so ensure your latest code is pushed.

### 2) Create Render Service Using Blueprint

1. Open Render Dashboard.
2. Click New + -> Blueprint.
3. Select your repository.
4. Render will detect [render.yaml](../render.yaml) and create service `waste-disposal-system-backend`.

### 3) Set Required Environment Variables

In Render service settings, set these values:

- `MONGODB_URI` = your MongoDB Atlas connection string
- `JWT_SECRET` = long random secret

Optional (only if you use Supabase mode or fallback):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Reference file: [backend/.env.render.example](.env.render.example)

### 4) Verify Deployment

After deploy completes, open:

- `https://<your-render-service>.onrender.com/health`

You should see a JSON response with `status: ok`.

### 5) Connect Vercel Frontend To Render Backend

Open your Vercel site once with `apiBase`:

`https://waste-disposal-system.vercel.app/?apiBase=https://<your-render-service>.onrender.com/api`

The frontend stores this value and will use it for all future API calls.

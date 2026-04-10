-- Run this in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  phone text,
  address text,
  role text not null default 'user' check (role in ('admin', 'user', 'collector')),
  employee_id text unique,
  profile_image text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  waste_type text not null,
  quantity integer not null default 1,
  address text not null,
  preferred_date timestamptz not null,
  status text not null default 'Pending' check (status in ('Pending', 'Assigned', 'In-Progress', 'Completed')),
  collector_id uuid references public.users(id) on delete set null,
  notes text,
  payment_id uuid,
  fee numeric(10,2) not null default 50,
  created_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'Open' check (status in ('Open', 'In-Progress', 'Resolved', 'Closed')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  resolution text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pickup_request_id uuid references public.pickup_requests(id) on delete set null,
  amount numeric(10,2) not null,
  method text not null,
  status text not null default 'Paid' check (status in ('Pending', 'Paid', 'Failed', 'Refunded')),
  transaction_id text unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_pickup_user on public.pickup_requests(user_id);
create index if not exists idx_pickup_collector on public.pickup_requests(collector_id);
create index if not exists idx_complaints_user on public.complaints(user_id);
create index if not exists idx_payments_user on public.payments(user_id);

-- Demo admin account (password is Admin@123 hashed with bcrypt)
insert into public.users (name, email, password_hash, phone, address, role, employee_id)
values (
  'System Admin',
  'admin@gmail.com',
  '$2a$10$3ZVNaT1mDjRrAXjGAsgtQuasEQ5OO1R.PgM15DYTkmr2Xl58zZZ8a',
  '000-000-0000',
  'Operations Center',
  'admin',
  'ADM-0001'
)
on conflict (email) do nothing;

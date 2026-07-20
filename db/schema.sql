-- Galych Agro — database schema (PostgreSQL / Vercel Postgres)
-- Run this once against your database before first deploy.

create table if not exists site_content (
  id smallint primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

create table if not exists login_attempts (
  id bigserial primary key,
  ip text not null,
  success boolean not null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_login_attempts_ip_time
  on login_attempts (ip, attempted_at);

-- Seed the single content row with an empty placeholder if it doesn't exist yet.
-- The app will populate it with real default content on first read if this row
-- is missing entirely, but inserting an empty shell here is a safe default too.
insert into site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

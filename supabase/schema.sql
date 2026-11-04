-- =====================================================================
-- ZUGZWANG — Supabase schema
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Enumerations
-- ---------------------------------------------------------------------
do $$ begin
  create type lead_source as enum ('chessboard', 'whatsapp', 'booking', 'website_form');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'booked', 'completed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id                       uuid primary key default gen_random_uuid(),
  full_name                text not null check (char_length(full_name) between 2 and 100),
  email                    text check (email is null or char_length(email) <= 254),
  whatsapp_number          text check (whatsapp_number is null or char_length(whatsapp_number) <= 20),
  social_platform          text check (social_platform is null or social_platform in ('chesscom','lichess','instagram','other')),
  social_handle            text check (social_handle is null or char_length(social_handle) <= 60),
  chess_level              text check (chess_level is null or chess_level in ('beginner','improving','intermediate','advanced','not_sure')),
  learning_goal            text check (learning_goal is null or char_length(learning_goal) <= 1000),
  preferred_contact_method text check (preferred_contact_method is null or preferred_contact_method in ('email','whatsapp','social')),
  source                   lead_source not null default 'website_form',
  consent_at               timestamptz not null,
  status                   lead_status not null default 'new',
  created_at               timestamptz not null default now(),
  -- At least one way to reach the visitor must be supplied.
  constraint leads_has_contact check (
    email is not null or whatsapp_number is not null or social_handle is not null
  )
);

create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------
-- feedback  (requires manual approval before public display)
-- ---------------------------------------------------------------------
create table if not exists public.feedback (
  id                uuid primary key default gen_random_uuid(),
  name              text check (name is null or char_length(name) <= 100),
  message           text not null check (char_length(message) between 5 and 2000),
  chess_experience  text check (chess_experience is null or chess_experience in ('new','beginner','intermediate','advanced')),
  allow_public      boolean not null default false,
  approved          boolean not null default false,
  created_at        timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- RLS is enabled and NO policies are created for the anon / authenticated
-- roles on `leads`, so anonymous visitors can neither read nor write it.
-- All writes go through the server-side API routes, which use the secret
-- (service_role) key. That key bypasses RLS and never reaches the browser.
-- ---------------------------------------------------------------------
alter table public.leads    enable row level security;
alter table public.feedback enable row level security;

alter table public.leads    force row level security;
alter table public.feedback force row level security;

-- Defence in depth: remove any default table privileges from browser roles.
revoke all on public.leads    from anon, authenticated;
revoke all on public.feedback from anon, authenticated;

-- Only approved + public-permitted feedback may ever be read with the public key.
-- (The website itself reads testimonials through the server, but this policy makes
--  the rule explicit and safe if you ever query it from the browser.)
create policy "Public can read approved testimonials"
  on public.feedback
  for select
  to anon, authenticated
  using (approved = true and allow_public = true);

grant select (id, name, message, chess_experience, created_at) on public.feedback to anon, authenticated;

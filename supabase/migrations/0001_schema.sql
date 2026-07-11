-- LOFTZ Phase 1 schema (plan 1.2, docs/02, D-18/D-19/D-24).
-- LOFTZ-only, deliberately simple: brochure + booking/visit requests.
-- No guest accounts (D-19). Erasmus Lisboa is a separate DB (D-24).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Residences (named buildings, each with its own identity)
-- ---------------------------------------------------------------------------
create table if not exists public.residences (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,              -- e.g. "MS61"
  slug          text not null unique,              -- e.g. "ms-61"
  name          text not null,                     -- e.g. "MS 61"
  neighborhood  text,
  address       text,
  city          text not null default 'Lisbon',
  latitude      double precision,
  longitude     double precision,
  description   text,
  bathrooms     integer,
  facilities    text[] not null default '{}',
  cleaning_frequency text,
  floor_plan_url text,
  video_url     text,
  sort_index    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rooms
-- ---------------------------------------------------------------------------
create table if not exists public.rooms (
  id              uuid primary key default gen_random_uuid(),
  residence_id    uuid not null references public.residences(id) on delete cascade,
  slug            text not null unique,            -- e.g. "ms-61-room-1"
  name            text not null,                   -- e.g. "Room 1"
  internal_ref    text,                            -- e.g. "1005.123"
  monthly_price   numeric(10,2),
  currency        text not null default 'EUR',
  size_m2         numeric(6,2),
  bed_type        text,                            -- 'single' | 'double'
  private_bathroom boolean not null default false,
  features        text[] not null default '{}',    -- terrace, balcony, washer, dryer, ...
  description     text,
  room_contents   text[] not null default '{}',
  available_from  date,
  ical_url        text,                            -- source Google Calendar feed
  platform_links  jsonb not null default '{}'::jsonb, -- public URLs on OTAs (I-04)
  status          text not null default 'active',  -- 'active' | 'hidden'
  sort_index      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists rooms_residence_idx on public.rooms(residence_id);
create index if not exists rooms_status_idx on public.rooms(status);

-- ---------------------------------------------------------------------------
-- Photos (Drive folder order preserved via sort_index). residence-level photos
-- (common areas) have room_id null.
-- ---------------------------------------------------------------------------
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  residence_id  uuid not null references public.residences(id) on delete cascade,
  room_id       uuid references public.rooms(id) on delete cascade,
  category      text not null default 'room',      -- 'room' | 'common' | 'other'
  storage_path  text not null,
  url           text not null,
  alt           text,
  sort_index    integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists photos_room_idx on public.photos(room_id);
create index if not exists photos_residence_idx on public.photos(residence_id);

-- ---------------------------------------------------------------------------
-- Availability (busy periods imported from iCal feeds — plan 2.x fills this)
-- ---------------------------------------------------------------------------
create table if not exists public.availability (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.rooms(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  source      text,                                -- 'uniplaces' | 'spotahome' | ...
  summary     text,
  created_at  timestamptz not null default now()
);
create index if not exists availability_room_idx on public.availability(room_id, start_date);

-- ---------------------------------------------------------------------------
-- Eligibility conditions (D-18) — one row per room; nulls mean "no restriction".
-- LOFTZ has a single host (Henrique); the same engine is reused per-host on EL.
-- ---------------------------------------------------------------------------
create table if not exists public.eligibility_conditions (
  room_id          uuid primary key references public.rooms(id) on delete cascade,
  age_min          integer,
  age_max          integer,
  gender           text,                           -- 'any' | 'male' | 'female'
  allow_smoking    boolean not null default false,
  allow_parties    boolean not null default false,
  allow_pets       boolean not null default false,
  house_rules      text[] not null default '{}',   -- extra rules the guest accepts
  min_stay_months  integer,
  max_stay_months  integer,
  turnover_gap_days integer,
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Guest profiles (D-19) — captured per request, never behind a login.
-- ---------------------------------------------------------------------------
create table if not exists public.guest_profiles (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  nationality   text,
  date_of_birth date,
  email         text not null,
  phone         text,
  occupation    text,                              -- 'student' | 'worker' | 'other'
  gender        text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Requests (booking + visit)
-- ---------------------------------------------------------------------------
create table if not exists public.requests (
  id                  uuid primary key default gen_random_uuid(),
  room_id             uuid references public.rooms(id) on delete set null,
  guest_profile_id    uuid references public.guest_profiles(id) on delete set null,
  type                text not null,               -- 'booking' | 'visit'
  check_in            date,
  check_out           date,
  visit_at            timestamptz,
  message             text,
  accepted_house_rules boolean not null default false,
  eligibility_passed  boolean,
  eligibility_notes   text,
  status              text not null default 'new', -- 'new' | 'contacted' | 'closed'
  created_at          timestamptz not null default now()
);
create index if not exists requests_room_idx on public.requests(room_id);
create index if not exists requests_created_idx on public.requests(created_at desc);

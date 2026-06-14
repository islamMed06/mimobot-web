-- ============================================================
-- MimoBot Web — Tables Supabase
-- ============================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Propriétaire voit son profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Propriétaire modifie son profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Insertion inscription"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Leçons (publiées ou brouillon)
create table if not exists public.lessons (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  content         text,
  class_level     text check (class_level in ('1AM','2AM','3AM','4AM')),
  duration_minutes int,
  tags            text[] default '{}',
  published       boolean not null default false,
  price           numeric(10,2) default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.lessons enable row level security;

create policy "Tout le monde voit les leçons publiées"
  on public.lessons for select
  using (published = true OR auth.uid() in (select id from public.profiles));

create policy "Propriétaire gère les leçons"
  on public.lessons for insert using (auth.uid() in (select id from public.profiles));
create policy "Propriétaire modifie"
  on public.lessons for update using (auth.uid() in (select id from public.profiles));
create policy "Propriétaire supprime"
  on public.lessons for delete using (auth.uid() in (select id from public.profiles));

create trigger on_lessons_updated
  before update on public.lessons
  for each row execute function public.handle_updated_at();

-- Exercices
create table if not exists public.exercises (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  type            text not null check (type in ('multiple_choice','fill_blank','matching','writing')),
  questions       text not null,
  correct_answers text not null,
  class_level     text check (class_level in ('1AM','2AM','3AM','4AM')),
  published       boolean not null default false,
  price           numeric(10,2) default 0,
  created_at      timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "Tout le monde voit les exercices publiés"
  on public.exercises for select
  using (published = true OR auth.uid() in (select id from public.profiles));

create policy "Propriétaire gère exercices"
  on public.exercises for insert using (auth.uid() in (select id from public.profiles));
create policy "Propriétaire modifie exos"
  on public.exercises for update using (auth.uid() in (select id from public.profiles));
create policy "Propriétaire supprime exos"
  on public.exercises for delete using (auth.uid() in (select id from public.profiles));

-- Ressources (PDF, images)
create table if not exists public.resources (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  file_url        text not null,
  file_type       text not null,
  file_size       int,
  class_level     text check (class_level in ('1AM','2AM','3AM','4AM')),
  tags            text[] default '{}',
  published       boolean not null default false,
  price           numeric(10,2) default 0,
  created_at      timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Tout le monde voit ressources publiées"
  on public.resources for select
  using (published = true OR auth.uid() in (select id from public.profiles));

create policy "Propriétaire gère ressources"
  on public.resources for insert using (auth.uid() in (select id from public.profiles));
create policy "Propriétaire modifie ressources"
  on public.resources for update using (auth.uid() in (select id from public.profiles));
create policy "Propriétaire supprime ressources"
  on public.resources for delete using (auth.uid() in (select id from public.profiles));

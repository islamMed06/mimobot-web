-- ============================================================
-- MimoBot Web — Tables de la base de données Supabase
-- ============================================================

-- 1. Profils utilisateurs (rattachés à auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'teacher' check (role in ('teacher', 'student')),
  class_level text check (class_level in ('1AM','2AM','3AM','4AM')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Les utilisateurs modifient leur propre profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Insertion lors de l'inscription"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger pour updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 2. Leçons
create table if not exists public.lessons (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  description     text,
  content         text,
  class_level     text check (class_level in ('1AM','2AM','3AM','4AM')),
  duration_minutes int,
  tags            text[] default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.lessons enable row level security;

create policy "Professeurs voient leurs leçons"
  on public.lessons for select
  using (auth.uid() = teacher_id);

create policy "Professeurs créent des leçons"
  on public.lessons for insert
  with check (auth.uid() = teacher_id);

create policy "Professeurs modifient leurs leçons"
  on public.lessons for update
  using (auth.uid() = teacher_id);

create policy "Professeurs suppriment leurs leçons"
  on public.lessons for delete
  using (auth.uid() = teacher_id);

create trigger on_lessons_updated
  before update on public.lessons
  for each row execute function public.handle_updated_at();

-- 3. Exercices
create table if not exists public.exercises (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  lesson_id       uuid references public.lessons(id) on delete set null,
  title           text not null,
  type            text not null check (type in ('multiple_choice','fill_blank','matching','writing')),
  questions       text not null,
  correct_answers text not null,
  class_level     text check (class_level in ('1AM','2AM','3AM','4AM')),
  created_at      timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "Professeurs voient leurs exercices"
  on public.exercises for select
  using (auth.uid() = teacher_id);

create policy "Professeurs créent des exercices"
  on public.exercises for insert
  with check (auth.uid() = teacher_id);

create policy "Professeurs modifient leurs exercices"
  on public.exercises for update
  using (auth.uid() = teacher_id);

create policy "Professeurs suppriment leurs exercices"
  on public.exercises for delete
  using (auth.uid() = teacher_id);

-- 4. Ressources (PDF, images, etc.)
create table if not exists public.resources (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  description     text,
  file_url        text not null,
  file_type       text not null,
  file_size       int,
  class_level     text check (class_level in ('1AM','2AM','3AM','4AM')),
  tags            text[] default '{}',
  created_at      timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Professeurs voient leurs ressources"
  on public.resources for select
  using (auth.uid() = teacher_id);

create policy "Professeurs ajoutent des ressources"
  on public.resources for insert
  with check (auth.uid() = teacher_id);

create policy "Professeurs modifient leurs ressources"
  on public.resources for update
  using (auth.uid() = teacher_id);

create policy "Professeurs suppriment leurs ressources"
  on public.resources for delete
  using (auth.uid() = teacher_id);

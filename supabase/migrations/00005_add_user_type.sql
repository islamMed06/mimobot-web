ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text check (user_type in ('teacher', 'student'));

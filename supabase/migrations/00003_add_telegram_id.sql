ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_id text UNIQUE;

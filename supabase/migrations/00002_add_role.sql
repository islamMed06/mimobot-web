alter table public.profiles add column if not exists role text not null default 'free' check (role in ('free', 'premium', 'admin'));

update public.profiles set role = 'admin' where id in (select id from public.profiles order by created_at asc limit 1);

create policy "Admin voit tous les profils"
  on public.profiles for select
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admin modifie tous les profils"
  on public.profiles for update
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

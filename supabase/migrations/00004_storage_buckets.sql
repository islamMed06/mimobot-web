-- Bucket pour les fichiers ressources (PDF, images, audio, video)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources',
  'resources',
  true,
  52428800, -- 50 MB
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
)
on conflict (id) do nothing;

-- Policies pour le bucket resources
create policy "Lecture publique des fichiers ressources"
  on storage.objects for select
  using (bucket_id = 'resources');

create policy "Upload fichiers ressources (admin uniquement)"
  on storage.objects for insert
  with check (
    bucket_id = 'resources'
    and auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "Modification fichiers ressources (admin uniquement)"
  on storage.objects for update
  using (
    bucket_id = 'resources'
    and auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "Suppression fichiers ressources (admin uniquement)"
  on storage.objects for delete
  using (
    bucket_id = 'resources'
    and auth.uid() in (select id from public.profiles where role = 'admin')
  );

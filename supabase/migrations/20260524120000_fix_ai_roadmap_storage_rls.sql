-- Fix: "new row violates row-level security policy" on automation image upload
-- Run in Supabase SQL Editor if uploads fail after creating the bucket.

-- Ensure bucket exists (public read for getPublicUrl)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ai-roadmap-automations',
  'ai-roadmap-automations',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Allow anon portal to resolve the bucket (required before insert on some projects)
drop policy if exists "ai_roadmap_automations_bucket_read" on storage.buckets;
create policy "ai_roadmap_automations_bucket_read"
  on storage.buckets
  for select
  to public
  using (id = 'ai-roadmap-automations');

-- Objects: read / write for portal (anon + authenticated + public role)
drop policy if exists "ai_roadmap_automations_public_read" on storage.objects;
drop policy if exists "ai_roadmap_automations_portal_insert" on storage.objects;
drop policy if exists "ai_roadmap_automations_portal_update" on storage.objects;
drop policy if exists "ai_roadmap_automations_portal_delete" on storage.objects;
drop policy if exists "ai_roadmap_automations_select" on storage.objects;
drop policy if exists "ai_roadmap_automations_insert" on storage.objects;
drop policy if exists "ai_roadmap_automations_update" on storage.objects;
drop policy if exists "ai_roadmap_automations_delete" on storage.objects;

create policy "ai_roadmap_automations_select"
  on storage.objects
  for select
  to public
  using (bucket_id = 'ai-roadmap-automations');

create policy "ai_roadmap_automations_insert"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'ai-roadmap-automations');

create policy "ai_roadmap_automations_update"
  on storage.objects
  for update
  to public
  using (bucket_id = 'ai-roadmap-automations')
  with check (bucket_id = 'ai-roadmap-automations');

create policy "ai_roadmap_automations_delete"
  on storage.objects
  for delete
  to public
  using (bucket_id = 'ai-roadmap-automations');

-- AI Roadmap live dashboard — shared snapshot (portal /airoadmapdashboard)
-- Run in Supabase SQL Editor or: supabase db push

create table if not exists public.ai_roadmap_snapshot (
  workspace_id text primary key default 'axxiom',
  payload jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);

comment on table public.ai_roadmap_snapshot is
  'Singleton JSON snapshot of roadmap categories, blocks, and automations for the strategy portal.';

create index if not exists ai_roadmap_snapshot_updated_at_idx
  on public.ai_roadmap_snapshot (updated_at desc);

alter table public.ai_roadmap_snapshot enable row level security;

-- Internal portal: hub password is the app gate; anon key stays in env only.
-- Tighten later with Supabase Auth (see docs/SUPABASE_AI_ROADMAP.md).
drop policy if exists "ai_roadmap_snapshot_portal_rw" on public.ai_roadmap_snapshot;
create policy "ai_roadmap_snapshot_portal_rw"
  on public.ai_roadmap_snapshot
  for all
  to anon, authenticated
  using (workspace_id = 'axxiom')
  with check (workspace_id = 'axxiom');

-- Realtime (required for live multi-user updates):
-- Dashboard → Database → Publications → supabase_realtime → add ai_roadmap_snapshot

insert into public.ai_roadmap_snapshot (workspace_id, payload)
values ('axxiom', '[]'::jsonb)
on conflict (workspace_id) do nothing;

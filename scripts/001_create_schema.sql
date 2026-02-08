-- Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Scripts table
create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  game_name text,
  script_content text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.scripts enable row level security;

create policy "scripts_select_public" on public.scripts for select using (is_public = true or auth.uid() = user_id);
create policy "scripts_insert_own" on public.scripts for insert with check (auth.uid() = user_id);
create policy "scripts_update_own" on public.scripts for update using (auth.uid() = user_id);
create policy "scripts_delete_own" on public.scripts for delete using (auth.uid() = user_id);

-- Checkpoints (key system steps)
create table if not exists public.checkpoints (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.scripts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  step_number integer not null,
  title text not null,
  provider text not null check (provider in ('lootlabs', 'linkvertise', 'workink')),
  monetization_url text not null,
  created_at timestamptz default now()
);

alter table public.checkpoints enable row level security;

create policy "checkpoints_select_public" on public.checkpoints for select using (true);
create policy "checkpoints_insert_own" on public.checkpoints for insert with check (auth.uid() = user_id);
create policy "checkpoints_update_own" on public.checkpoints for update using (auth.uid() = user_id);
create policy "checkpoints_delete_own" on public.checkpoints for delete using (auth.uid() = user_id);

-- Generated keys
create table if not exists public.keys (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.scripts(id) on delete cascade,
  key_value text unique not null,
  device_id text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.keys enable row level security;

create policy "keys_select_all" on public.keys for select using (true);
create policy "keys_insert_all" on public.keys for insert with check (true);

-- Checkpoint completions (tracks which steps a device has completed)
create table if not exists public.checkpoint_completions (
  id uuid primary key default gen_random_uuid(),
  checkpoint_id uuid not null references public.checkpoints(id) on delete cascade,
  device_id text not null,
  completed_at timestamptz default now(),
  unique(checkpoint_id, device_id)
);

alter table public.checkpoint_completions enable row level security;

create policy "completions_select_all" on public.checkpoint_completions for select using (true);
create policy "completions_insert_all" on public.checkpoint_completions for insert with check (true);

-- Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'username', 'User')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

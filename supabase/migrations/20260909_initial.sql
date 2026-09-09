create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text, plan text not null default 'free', age_confirmed boolean not null default false, created_at timestamptz not null default now());

create table if not exists public.conversations (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null default 'After Dark chat', mode text not null default 'Flirty', created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role text not null check (role in ('user','assistant')), content text not null, created_at timestamptz not null default now());

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy profiles_self_select on public.profiles for select using (auth.uid() = id);
create policy profiles_self_insert on public.profiles for insert with check (auth.uid() = id);
create policy profiles_self_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy conversations_self_all on public.conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy messages_self_all on public.messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists conversations_user_updated_idx on public.conversations(user_id, updated_at desc);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);

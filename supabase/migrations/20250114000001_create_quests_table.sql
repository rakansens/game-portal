-- quests テーブルの作成
create table public.quests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  type text,
  platform text,
  points integer,
  status text not null default 'draft',
  difficulty integer not null,
  is_important boolean default false,
  is_limited boolean default false,
  category text,
  tags text[] default '{}',
  exp_reward integer not null default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  participants_limit integer,
  participant_count integer default 0,
  order_position integer,
  estimated_time integer,
  required_points integer,
  auto_progress boolean default false,
  verification_required boolean default false,
  verification_type text,
  max_attempts integer,
  cooldown_period integer,
  external_url text,
  banner_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint quests_status_check check (status in ('draft', 'active', 'completed', 'archived')),
  constraint quests_verification_type_check check (verification_type in ('manual', 'automatic'))
);

-- インデックスの作成
create index quests_order_position_idx on public.quests(order_position);
create index quests_status_idx on public.quests(status);
create index quests_type_idx on public.quests(type);
create index quests_category_idx on public.quests(category);

-- RLSポリシーの設定
alter table public.quests enable row level security;

create policy "Anyone can view quests"
on public.quests for select
to public
using (true);

create policy "Authenticated users can manage quests"
on public.quests for all
to authenticated
using (true)
with check (true);
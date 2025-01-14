-- 既存のテーブルを削除
drop table if exists public.quests cascade;

-- シンプル化したクエストテーブルを作成
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  points integer not null default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  participants_limit integer,
  required_points integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLSポリシーを設定
alter table public.quests enable row level security;

-- 管理者のみがCRUD操作可能
create policy "管理者のみがクエストを管理可能" on public.quests
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- 一般ユーザーは閲覧のみ可能
create policy "一般ユーザーはクエストを閲覧可能" on public.quests
  for select
  to authenticated
  using (true);

-- updated_atを自動更新するトリガー
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_quests_updated_at
  before update on public.quests
  for each row
  execute function public.handle_updated_at();
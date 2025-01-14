-- 既存のテーブルと関連するオブジェクトを削除
drop table if exists public.quests cascade;
drop function if exists public.handle_updated_at cascade;
drop function if exists public.update_quest_order cascade;

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
create function public.handle_updated_at()
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

-- サンプルデータを挿入
insert into public.quests (title, description, points, start_date, end_date, participants_limit, required_points)
values
  ('初めてのクエスト', '新規ユーザー向けの簡単なクエストです', 100, now(), now() + interval '7 days', 100, 0),
  ('中級者向けクエスト', '経験を積んだユーザー向けのクエストです', 200, now(), now() + interval '14 days', 50, 100),
  ('上級者向けクエスト', '熟練ユーザー向けの難しいクエストです', 500, now(), now() + interval '30 days', 20, 300);
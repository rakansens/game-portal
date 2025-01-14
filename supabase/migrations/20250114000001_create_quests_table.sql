-- クエストテーブルを作成
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  points integer not null default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  participants_limit integer,
  required_points integer default 0,
  order_position integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLSポリシーを設定
alter table public.quests enable row level security;

-- 全てのユーザー（匿名含む）が閲覧可能
create policy "全てのユーザーがクエストを閲覧可能" on public.quests
  for select
  to anon, authenticated
  using (true);

-- 管理者のみがCRUD操作可能
create policy "管理者のみがクエストを管理可能" on public.quests
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

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

-- update_quest_order_after_delete関数を作成
create or replace function public.update_quest_order_after_delete(target_position integer)
returns void
language plpgsql
as $$
begin
  update public.quests
  set order_position = order_position - 1
  where order_position > target_position;
end;
$$;

-- update_quests_order関数を作成
create or replace function public.update_quests_order(quest_updates jsonb)
returns void
language plpgsql
as $$
declare
  quest jsonb;
begin
  for quest in select * from jsonb_array_elements(quest_updates)
  loop
    update public.quests
    set order_position = (quest->>'order_position')::integer
    where id = (quest->>'id')::uuid;
  end loop;
end;
$$;

-- サンプルデータを挿入
insert into public.quests (title, description, points, start_date, end_date, participants_limit, required_points, order_position)
values
  ('Twitterでフォロー', '公式Twitterアカウントをフォローしよう', 100, now(), now() + interval '7 days', null, 0, 0),
  ('Discordに参加', 'コミュニティDiscordサーバーに参加しよう', 150, now(), now() + interval '14 days', null, 0, 1),
  ('デイリーチェックイン', '毎日ログインして報酬をゲット', 50, now(), now() + interval '30 days', null, 0, 2),
  ('コミュニティチャレンジ', 'コミュニティメンバーと協力してタスクを達成しよう', 300, now(), now() + interval '10 days', 100, 100, 3),
  ('リミテッドイベント', '期間限定の特別なイベントに参加しよう', 500, now(), now() + interval '3 days', 50, 200, 4);
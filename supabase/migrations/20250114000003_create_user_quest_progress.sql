-- ユーザーのクエスト進捗を管理するテーブル
create table public.user_quest_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  quest_id uuid not null references public.quests(id) on delete cascade,
  status text not null default 'in_progress',
  completed_at timestamp with time zone,
  attempts integer default 0,
  last_attempt_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_quest_progress_status_check check (status in ('in_progress', 'completed', 'failed')),
  constraint user_quest_progress_unique unique (user_id, quest_id)
);

-- インデックスの作成
create index user_quest_progress_user_id_idx on public.user_quest_progress(user_id);
create index user_quest_progress_quest_id_idx on public.user_quest_progress(quest_id);
create index user_quest_progress_status_idx on public.user_quest_progress(status);

-- RLSポリシーの設定
alter table public.user_quest_progress enable row level security;

create policy "Users can view their own progress"
on public.user_quest_progress for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can manage their own progress"
on public.user_quest_progress for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
# Game Portal

LINE LIFFを活用したゲームポータルサイトです。ユーザーがモバイル端末上で手軽にゲーム系コンテンツ（クエスト）を楽しめるプラットフォームを提供します。

## 機能

- LINE LIFFによるユーザー認証
- クエスト一覧表示
- クエスト詳細表示
- クエスト参加機能
- ユーザープロフィール管理
- 管理者機能（クエスト管理、ユーザー管理）

## 技術スタック

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Authentication: LINE LIFF SDK
- State Management: Zustand

## 開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/rakansens/game-portal.git
cd game-portal
```

2. 依存パッケージのインストール:
```bash
npm install
```

3. 環境変数の設定:
- `.env.example`をコピーして`.env`を作成
- 必要な環境変数を設定
```bash
cp .env.example .env
```

4. Supabaseのセットアップ:
- [Supabase](https://supabase.com)でプロジェクトを作成
- プロジェクトのURLとAnon Keyを`.env`ファイルに設定
- 以下のSQLを実行してテーブルを作成:

```sql
-- quests テーブル
create table public.quests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  difficulty integer not null,
  reward integer not null,
  category text not null,
  tags text[] default '{}',
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシーの設定
alter table public.quests enable row level security;
create policy "Quests are viewable by everyone" on public.quests
  for select using (true);
create policy "Quests are insertable by authenticated users" on public.quests
  for insert with check (auth.role() = 'authenticated');
create policy "Quests are updatable by authenticated users" on public.quests
  for update using (auth.role() = 'authenticated');

-- user_quests テーブル
create table public.user_quests (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  quest_id uuid references public.quests(id) not null,
  status text default 'NOT_STARTED' not null,
  progress integer default 0 not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_quests_status_check check (status in ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
);

-- RLSポリシーの設定
alter table public.user_quests enable row level security;
create policy "User quests are viewable by owner" on public.user_quests
  for select using (auth.uid() = user_id);
create policy "User quests are insertable by owner" on public.user_quests
  for insert with check (auth.uid() = user_id);
create policy "User quests are updatable by owner" on public.user_quests
  for update using (auth.uid() = user_id);
```

5. 開発サーバーの起動:
```bash
npm run dev
```

## LINE LIFF設定

1. [LINE Developers Console](https://developers.line.biz/console/)で新しいLIFFアプリを作成
2. 作成したLIFFアプリのIDを`.env`ファイルの`NEXT_PUBLIC_LIFF_ID`に設定

## デプロイ

1. Supabaseプロジェクトの設定
2. 環境変数の設定
3. ビルドとデプロイ
```bash
npm run build
npm start
```

## ライセンス

MIT

## 作者

rakansens

-- ユーザーテーブルにLINE関連のフィールドを追加
ALTER TABLE users
ADD COLUMN IF NOT EXISTS line_user_id text UNIQUE,
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS picture_url text,
ADD COLUMN IF NOT EXISTS status_message text,
ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_users_line_user_id ON users(line_user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_blocked ON users(is_blocked);

-- ユーザークエスト関連のテーブル
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_quests (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_quest_id ON user_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_completed_at ON user_quests(completed_at);

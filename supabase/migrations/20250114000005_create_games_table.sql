-- 管理者テーブルの作成
CREATE TABLE IF NOT EXISTS administrators (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ゲームテーブルの作成
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  play_url TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- RLSの設定
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- 公開済みゲームの参照ポリシー（全ユーザー）
CREATE POLICY "公開済みゲームは全ユーザーが参照可能" ON games
  FOR SELECT
  USING (status = 'published');

-- 管理者向けの全権限ポリシー
CREATE POLICY "管理者は全ての操作が可能" ON games
  FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM administrators
  ));

-- インデックスの作成
CREATE INDEX IF NOT EXISTS games_status_idx ON games (status);
CREATE INDEX IF NOT EXISTS games_category_idx ON games (category);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON games (created_at DESC);

-- サンプルデータの挿入
INSERT INTO games (title, description, thumbnail_url, play_url, category, status) VALUES
(
  'ブロックパズル',
  'ブロックを組み合わせて列を消していくクラシックなパズルゲーム。シンプルながら奥深い戦略性が魅力です。',
  'https://example.com/images/block-puzzle.jpg',
  'https://example.com/games/block-puzzle',
  'パズル',
  'published'
),
(
  'スペースシューター',
  '宇宙を舞台にした横スクロールシューティングゲーム。様々な敵と武器、アップグレードシステムを楽しめます。',
  'https://example.com/images/space-shooter.jpg',
  'https://example.com/games/space-shooter',
  'アクション',
  'published'
),
(
  'クイズマスター',
  '様々なジャンルの問題に挑戦できるクイズゲーム。一人でも友達とも楽しめる教育的な要素も含んだゲームです。',
  'https://example.com/images/quiz-master.jpg',
  'https://example.com/games/quiz-master',
  '教育',
  'published'
); 
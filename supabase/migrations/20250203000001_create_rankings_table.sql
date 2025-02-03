-- ランキングテーブルの作成
CREATE TABLE IF NOT EXISTS rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES users(line_user_id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  rank integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_rankings_user_id ON rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_rankings_points ON rankings(points DESC);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON rankings(rank);

-- ランクの自動計算と更新のための関数
CREATE OR REPLACE FUNCTION update_rankings()
RETURNS trigger AS $$
DECLARE
  current_rank integer;
BEGIN
  -- 全ユーザーのランクを更新
  WITH ranked_users AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY points DESC) as new_rank
    FROM rankings
  )
  UPDATE rankings r
  SET rank = ru.new_rank
  FROM ranked_users ru
  WHERE r.id = ru.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ポイント変更時にランクを自動更新するトリガー
CREATE TRIGGER rankings_points_changed
  AFTER INSERT OR UPDATE OF points ON rankings
  FOR EACH ROW
  EXECUTE FUNCTION update_rankings();

-- 更新日時を自動的に更新するトリガー
CREATE TRIGGER update_rankings_updated_at
  BEFORE UPDATE ON rankings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- レベル計算のための関数
CREATE OR REPLACE FUNCTION calculate_level(points integer)
RETURNS integer AS $$
BEGIN
  -- 100ポイントごとにレベルアップ
  RETURN GREATEST(1, FLOOR(points::float / 100) + 1)::integer;
END;
$$ LANGUAGE plpgsql;

-- ポイント変更時にレベルを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_level()
RETURNS trigger AS $$
BEGIN
  IF NEW.points != OLD.points OR OLD.points IS NULL THEN
    NEW.level := calculate_level(NEW.points);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rankings_level_update
  BEFORE INSERT OR UPDATE OF points ON rankings
  FOR EACH ROW
  EXECUTE FUNCTION update_level();

-- クエスト完了時にポイントを加算する関数
CREATE OR REPLACE FUNCTION add_quest_points()
RETURNS trigger AS $$
BEGIN
  -- クエスト完了時
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- ランキングレコードがなければ作成
    INSERT INTO rankings (user_id, points)
    SELECT 
      u.line_user_id,
      COALESCE(
        (SELECT points FROM rankings WHERE user_id = u.line_user_id),
        0
      ) + q.points
    FROM users u
    CROSS JOIN quests q
    WHERE u.id = NEW.user_id
    AND q.id = NEW.quest_id
    ON CONFLICT (user_id) DO UPDATE
    SET points = rankings.points + EXCLUDED.points;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- クエスト完了時にポイントを加算するトリガー
CREATE TRIGGER quest_completion_points
  AFTER UPDATE OF completed_at ON user_quests
  FOR EACH ROW
  EXECUTE FUNCTION add_quest_points();

-- クエスト完了数を計算する関数
CREATE OR REPLACE FUNCTION count_completed_quests_by_user()
RETURNS TABLE (
  user_id text,
  completed_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.line_user_id,
    COUNT(uq.quest_id)::bigint
  FROM users u
  LEFT JOIN user_quests uq ON u.id = uq.user_id AND uq.completed_at IS NOT NULL
  GROUP BY u.line_user_id;
END;
$$ LANGUAGE plpgsql;
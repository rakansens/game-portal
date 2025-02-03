-- rankingsテーブルの削除
DROP TRIGGER IF EXISTS rankings_points_changed ON rankings;
DROP TRIGGER IF EXISTS update_rankings_updated_at ON rankings;
DROP TRIGGER IF EXISTS rankings_level_update ON rankings;

DROP FUNCTION IF EXISTS update_rankings();
DROP FUNCTION IF EXISTS calculate_level(integer);
DROP FUNCTION IF EXISTS update_level();

DROP TABLE IF EXISTS rankings;

-- クエスト完了時のポイント加算処理を修正
CREATE OR REPLACE FUNCTION add_quest_points()
RETURNS trigger AS $$
BEGIN
  -- クエスト完了時
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- ユーザーのポイントを更新
    UPDATE users
    SET total_points = total_points + (
      SELECT points 
      FROM quests 
      WHERE id = NEW.quest_id
    )
    WHERE line_user_id = (
      SELECT line_user_id 
      FROM users 
      WHERE id = NEW.user_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
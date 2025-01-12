-- order_positionカラムが存在しない場合は作成
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'quests' 
        AND column_name = 'order_position'
    ) THEN
        ALTER TABLE quests ADD COLUMN order_position integer;
    END IF;
END $$;

-- 既存のレコードにorder_positionを設定（作成日時順）
WITH indexed_quests AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as rn
  FROM quests
  WHERE order_position IS NULL
)
UPDATE quests
SET order_position = indexed_quests.rn
FROM indexed_quests
WHERE quests.id = indexed_quests.id
AND quests.order_position IS NULL;

-- order_positionにNOT NULL制約を追加
ALTER TABLE quests ALTER COLUMN order_position SET NOT NULL;

-- order_positionにデフォルト値を設定（新規作成時は最後尾に追加）
ALTER TABLE quests ALTER COLUMN order_position SET DEFAULT (
  SELECT COALESCE(MAX(order_position) + 1, 0) FROM quests
);

-- インデックスを作成してパフォーマンスを向上
CREATE INDEX IF NOT EXISTS quests_order_position_idx ON quests(order_position);

-- order_indexをorder_positionのエイリアスとして作成
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'quests' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE quests ADD COLUMN order_index integer GENERATED ALWAYS AS (order_position) STORED;
    END IF;
END $$;
-- questsテーブルにorder_indexカラムを追加（既に存在しない場合のみ）
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'quests' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE quests ADD COLUMN order_index integer;
    END IF;
END $$;

-- 既存のレコードにorder_indexを設定（作成日時順）
WITH indexed_quests AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as rn
  FROM quests
  WHERE order_index IS NULL
)
UPDATE quests
SET order_index = indexed_quests.rn
FROM indexed_quests
WHERE quests.id = indexed_quests.id
AND quests.order_index IS NULL;

-- order_indexにNOT NULL制約を追加
ALTER TABLE quests ALTER COLUMN order_index SET NOT NULL;

-- order_indexにデフォルト値を設定（新規作成時は最後尾に追加）
ALTER TABLE quests ALTER COLUMN order_index SET DEFAULT (
  SELECT COALESCE(MAX(order_index) + 1, 0) FROM quests
);

-- インデックスを作成してパフォーマンスを向上
CREATE INDEX IF NOT EXISTS quests_order_index_idx ON quests(order_index);
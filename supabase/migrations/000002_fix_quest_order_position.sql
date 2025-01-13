-- order_positionのNOT NULL制約を削除し、デフォルト値を設定
ALTER TABLE quests ALTER COLUMN order_position DROP NOT NULL;

-- order_positionがNULLの場合のデフォルト値を設定
UPDATE quests SET order_position = (
  SELECT COALESCE(MAX(order_position), 0) + 1
  FROM quests
  WHERE order_position IS NOT NULL
)
WHERE order_position IS NULL;

-- インデックスを作成（存在しない場合のみ）
CREATE INDEX IF NOT EXISTS quests_order_position_idx ON quests(order_position);

-- order_indexカラムが存在する場合は削除
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'quests' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE quests DROP COLUMN order_index;
    END IF;
END $$; 
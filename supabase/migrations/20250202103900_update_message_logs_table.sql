-- 既存のカラムを確認
DO $$ 
BEGIN
  -- is_broadcast カラムの追加
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'message_logs' AND column_name = 'is_broadcast') THEN
    ALTER TABLE message_logs ADD COLUMN is_broadcast BOOLEAN DEFAULT FALSE;
  END IF;

  -- target_usersのカラム型を変更
  IF EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'message_logs' AND column_name = 'target_users') THEN
    ALTER TABLE message_logs ALTER COLUMN target_users TYPE jsonb USING target_users::jsonb;
  END IF;

  -- message_contentのカラム型を変更
  IF EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'message_logs' AND column_name = 'message_content') THEN
    ALTER TABLE message_logs ALTER COLUMN message_content TYPE jsonb USING message_content::jsonb;
  END IF;
END $$;

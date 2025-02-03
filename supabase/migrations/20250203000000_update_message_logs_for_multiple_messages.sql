-- メッセージグループテーブルの作成
CREATE TABLE IF NOT EXISTS message_groups (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  target_users jsonb,
  status text NOT NULL,
  error_message text,
  is_broadcast boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id)
);

-- message_logsテーブルの変更
ALTER TABLE message_logs
ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES message_groups(id) ON DELETE CASCADE;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_message_logs_group_id ON message_logs(group_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_created_at ON message_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_message_groups_created_at ON message_groups(created_at);

-- 既存のデータを移行するための関数
CREATE OR REPLACE FUNCTION migrate_existing_message_logs()
RETURNS void AS $$
DECLARE
  log_record RECORD;
  new_group_id uuid;
BEGIN
  FOR log_record IN SELECT * FROM message_logs WHERE group_id IS NULL LOOP
    -- 新しいメッセージグループを作成
    INSERT INTO message_groups (
      target_users,
      status,
      error_message,
      is_broadcast,
      created_at,
      created_by
    ) VALUES (
      log_record.target_users,
      log_record.status,
      log_record.error_message,
      log_record.is_broadcast,
      log_record.created_at,
      log_record.created_by
    ) RETURNING id INTO new_group_id;

    -- メッセージログを更新
    UPDATE message_logs
    SET group_id = new_group_id
    WHERE id = log_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 既存のデータを移行
SELECT migrate_existing_message_logs();

-- 移行関数を削除
DROP FUNCTION migrate_existing_message_logs();

-- message_logsテーブルから不要になったカラムを削除
ALTER TABLE message_logs
DROP COLUMN IF EXISTS target_users,
DROP COLUMN IF EXISTS is_broadcast;

-- group_idをNOT NULLに設定
ALTER TABLE message_logs
ALTER COLUMN group_id SET NOT NULL;
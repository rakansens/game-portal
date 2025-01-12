#!/bin/bash

# ローカルSupabaseのデータベース接続情報
DB_HOST="localhost"
DB_PORT="54322" # Supabase CLIのデフォルトポート
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="postgres"

# ダンプファイルの場所
DUMP_FILE="supabase_dump.sql"

# データベースにダンプを適用
PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  -f $DUMP_FILE

echo "Restore completed"

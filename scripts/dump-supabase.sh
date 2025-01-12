#!/bin/bash

# Supabaseのデータベース接続情報
DB_HOST="db.xhcvtikzqbgpjzhmnsbu.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="Hiro091540@@"

# ダンプファイルの保存先
DUMP_FILE="supabase_dump.sql"

# スキーマとデータのダンプを作成
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  -F p \
  --no-owner \
  --no-acl \
  --schema=public \
  > $DUMP_FILE

echo "Dump completed: $DUMP_FILE"

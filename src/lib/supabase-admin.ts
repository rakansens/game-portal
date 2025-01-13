import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * 管理者用Supabaseクライアント
 * SERVICE_ROLE_KEYを使用するため、APIルート内でのみ使用すること
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * トランザクションを実行する
 */
export async function withTransaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    await supabaseAdmin.rpc('begin_transaction');
    const result = await callback();
    await supabaseAdmin.rpc('commit_transaction');
    return result;
  } catch (error) {
    await supabaseAdmin.rpc('rollback_transaction');
    throw error;
  }
}

/**
 * APIエラーレスポンスを生成する
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  error?: unknown
) {
  if (error) {
    console.error(`Error: ${message}`, error);
  }
  return Response.json({ error: message }, { status });
}

/**
 * 認証チェック
 * TODO: 実際の認証ロジックを実装する
 */
export async function checkAdminAuth() {
  // 開発環境では認証をスキップ
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // TODO: 本番環境用の認証チェックを実装
  throw new Error('Not implemented');
}
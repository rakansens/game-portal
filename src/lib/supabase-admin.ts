import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function checkAdminAuth() {
  // 開発環境では認証をスキップ
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const {
    data: { session },
  } = await supabaseAdmin.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
}

export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  const { error: beginError } = await supabaseAdmin.rpc('begin_transaction');
  if (beginError) throw beginError;

  try {
    const result = await fn();
    const { error: commitError } = await supabaseAdmin.rpc('commit_transaction');
    if (commitError) throw commitError;
    return result;
  } catch (error) {
    const { error: rollbackError } = await supabaseAdmin.rpc('rollback_transaction');
    if (rollbackError) {
      console.error('Failed to rollback transaction:', rollbackError);
    }
    throw error;
  }
}

export function createErrorResponse(message: string, status: number = 500, details?: any) {
  return Response.json(
    {
      error: message,
      details,
    },
    { status }
  );
}
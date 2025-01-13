import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * クライアント用Supabaseクライアント
 * ANON_KEYを使用し、読み取り専用の操作のみ許可
 */
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

/**
 * クエストの取得
 * 公開されているクエストのみを取得
 */
export async function fetchPublicQuests() {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('status', 'active')
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * クエストの詳細取得
 * 公開されているクエストのみを取得
 */
export async function fetchPublicQuestById(id: string) {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data;
}
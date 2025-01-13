import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../src/types/supabase';
import { createErrorResponse } from '../../../src/lib/supabase-admin';
import { toPublicQuest } from '../../../src/types/quest';

// ユーザー向けのSupabaseクライアント（読み取り専用）
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    // 公開クエストのみを取得するクエリを構築
    let query = supabase
      .from('quests')
      .select('*')
      .eq('status', 'active')
      .order('order_position', { ascending: true });

    // フィルター条件を追加
    if (type) {
      query = query.eq('type', type);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) throw new Error('No data returned from database');

    // レスポンスデータを整形
    const formattedData = data.map(quest => 
      toPublicQuest(quest, isQuestAvailable(quest))
    );

    return Response.json(formattedData);
  } catch (error) {
    return createErrorResponse('Failed to fetch quests', 500, error);
  }
}

// クエストが現在利用可能かどうかを判定
function isQuestAvailable(quest: Database['public']['Tables']['quests']['Row']): boolean {
  const now = new Date();
  const startDate = quest.start_date ? new Date(quest.start_date) : null;
  const endDate = quest.end_date ? new Date(quest.end_date) : null;

  // 開始日時チェック
  if (startDate && startDate > now) {
    return false;
  }

  // 終了日時チェック
  if (endDate && endDate < now) {
    return false;
  }

  // 参加人数制限チェック
  if (
    quest.participants_limit !== null &&
    quest.participant_count !== null &&
    quest.participant_count >= quest.participants_limit
  ) {
    return false;
  }

  return true;
}

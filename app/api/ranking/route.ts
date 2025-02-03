import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Database } from '@/types/database';

type QuestStat = {
  user_id: string;
  completed_count: number;
};

type UserWithRanking = Database['public']['Tables']['users']['Row'] & {
  rankings: {
    level: number;
    rank: number;
  }[];
};

export async function GET() {
  try {
    // ユーザー情報とランキングを取得(ポイント順)
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        line_user_id,
        display_name,
        picture_url,
        total_points,
        rankings!inner(
          level,
          rank
        )
      `)
      .order('total_points', { ascending: false }) as { data: UserWithRanking[] | null; error: any };

    if (error) {
      console.error('Error fetching rankings:', error);
      throw error;
    }

    // クエスト完了数を取得
    const { data: questStats, error: questError } = await supabaseAdmin.rpc(
      'count_completed_quests_by_user'
    ) as { data: QuestStat[] | null; error: any };

    if (questError) {
      console.error('Error fetching quest stats:', questError);
      throw questError;
    }

    // クエスト完了数をマッピング
    const questCountMap = new Map(
      questStats?.map((stat: QuestStat) => [stat.user_id, stat.completed_count]) || []
    );

    // レスポンスデータの整形
    const rankings = users?.map((user, index) => ({
      id: user.line_user_id,
      rank: index + 1,
      username: user.display_name || 'Unknown User',
      points: user.total_points,
      avatar_url: user.picture_url,
      level: user.rankings[0]?.level || 1,
      quest_completed: questCountMap.get(user.line_user_id) || 0
    })) || [];

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Error in rankings API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}
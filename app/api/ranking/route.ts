import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type QuestStat = {
  user_id: string;
  completed_count: number;
};

export async function GET() {
  try {
    // ユーザー情報を取得(ポイント順)
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        line_user_id,
        display_name,
        picture_url,
        total_points
      `)
      .order('total_points', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
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

    // レベルを計算する関数
    const calculateLevel = (points: number) => Math.floor(points / 100) + 1;

    // レスポンスデータの整形
    const rankings = users?.map((user, index) => ({
      id: user.line_user_id,
      rank: index + 1,
      username: user.display_name || 'Unknown User',
      points: user.total_points,
      avatar_url: user.picture_url,
      level: calculateLevel(user.total_points),
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
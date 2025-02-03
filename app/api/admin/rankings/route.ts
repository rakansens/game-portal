import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Database } from '@/types/database';

type QuestStat = {
  user_id: string;
  completed_count: number;
};

export async function GET() {
  try {
    // ランキング情報を取得(ユーザー情報も含む)
    const { data: rankings, error } = await supabaseAdmin
      .from('rankings')
      .select(`
        *,
        user:users!inner(
          line_user_id,
          display_name,
          picture_url,
          total_points
        )
      `)
      .order('rank');

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
      questStats?.map(stat => [stat.user_id, stat.completed_count]) || []
    );

    // レスポンスデータの整形
    const formattedRankings = rankings?.map(ranking => ({
      id: ranking.id,
      rank: ranking.rank,
      username: ranking.user.display_name || 'Unknown User',
      points: ranking.points,
      avatar_url: ranking.user.picture_url,
      level: ranking.level,
      quest_completed: questCountMap.get(ranking.user.line_user_id) || 0,
      user_id: ranking.user.line_user_id
    }));

    return NextResponse.json(formattedRankings || []);
  } catch (error) {
    console.error('Error in rankings API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { user_id, points } = data;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ポイントの更新(トリガーによってレベルとランクが自動更新される)
    const { error } = await supabaseAdmin
      .from('rankings')
      .upsert({
        user_id,
        points: points || 0
      });

    if (error) {
      console.error('Error updating ranking:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in rankings API:', error);
    return NextResponse.json(
      { error: 'Failed to update ranking' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Ranking ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('rankings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ranking:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in rankings API:', error);
    return NextResponse.json(
      { error: 'Failed to delete ranking' },
      { status: 500 }
    );
  }
}
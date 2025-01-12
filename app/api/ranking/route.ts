import { NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/supabase';
import { RankingProgress, RankingUser } from '../../../src/types/ranking';

export async function GET() {
  try {
    // ユーザーの総EXPとポイントを集計
    const { data, error } = await supabase
      .from('user_quest_progress')
      .select(`
        user_id,
        quests (exp_reward, points),
        profiles!user_quest_progress_user_id_fkey (display_name, avatar_url)
      `)
      .eq('status', 'COMPLETED');

    if (error) {
      console.error('Error fetching ranking data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ranking data' },
        { status: 500 }
      );
    }

    // ユーザーごとの集計を計算
    const userStats = (data as RankingProgress[]).reduce((acc: Record<string, RankingUser>, progress) => {
      const userId = progress.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          display_name: progress.profiles[0]?.display_name || null,
          avatar_url: progress.profiles[0]?.avatar_url || null,
          total_exp: 0,
          total_points: 0,
          completed_quests: 0
        };
      }

      const quest = progress.quests[0];
      if (quest) {
        acc[userId].total_exp += quest.exp_reward;
        acc[userId].total_points += quest.points;
      }
      acc[userId].completed_quests += 1;

      return acc;
    }, {});

    // 配列に変換してEXP順にソート
    const rankings = Object.values(userStats).sort(
      (a, b) => b.total_exp - a.total_exp
    );

    return NextResponse.json(rankings);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
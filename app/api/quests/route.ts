import { NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/supabase';

export const revalidate = 0; // キャッシュを無効化

export async function GET() {
  try {
    const { data: quests, error } = await supabase
      .from('quests')
      .select(`
        *,
        participant_count,
        participants_limit,
        start_date,
        end_date,
        is_limited,
        is_important,
        status,
        type,
        platform,
        points,
        difficulty,
        order_position
      `)
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quests' },
        { status: 500 }
      );
    }

    // デバッグ用のログ出力
    console.log('Fetched quests:', JSON.stringify(quests, null, 2));

    return NextResponse.json(quests);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

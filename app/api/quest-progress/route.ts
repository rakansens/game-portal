import { NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userId, questId, progress, status } = await request.json();

    const { data, error } = await supabase
      .from('user_quest_progress')
      .upsert({
        user_id: userId,
        quest_id: questId,
        progress,
        status,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating quest progress:', error);
      return NextResponse.json(
        { error: 'Failed to update quest progress' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('user_quest_progress')
      .select(`
        *,
        quests (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching quest progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quest progress' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
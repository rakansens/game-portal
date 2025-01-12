import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../src/types/supabase';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quest' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const quest = await request.json();
    const { data, error } = await supabase
      .from('quests')
      .insert([quest])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json(
      { error: 'Failed to create quest' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const quest = await request.json();
    console.log('Received quest data:', quest);

    // 更新データの準備
    const updateData = {
      title: quest.title,
      description: quest.description,
      type: quest.type,
      platform: quest.platform,
      points: quest.points || 0,
      status: quest.status,
      difficulty: quest.difficulty || 1,
      is_important: quest.is_important || false,
      is_limited: quest.is_limited || false,
      category: quest.category,
      tags: quest.tags,
      exp_reward: quest.exp_reward || quest.points || 0,
      is_active: true,
      estimated_time: quest.estimated_time,
      required_points: quest.required_points || 0,
      auto_progress: quest.auto_progress || false,
      verification_required: quest.verification_required || false,
      verification_type: quest.verification_type,
      max_attempts: quest.max_attempts,
      cooldown_period: quest.cooldown_period,
      external_url: quest.external_url,
      start_date: quest.start_date,
      end_date: quest.end_date,
      participants_limit: quest.participants_limit,
      banner_url: quest.banner_url,
    };

    console.log('Updating with data:', updateData);

    const { data, error } = await supabase
      .from('quests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned after update');
      throw new Error('Failed to update quest: No data returned');
    }

    console.log('Update successful:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update quest' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json(
      { error: 'Failed to delete quest' },
      { status: 500 }
    );
  }
}
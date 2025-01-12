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
    // リクエストボディの検証
    let quest;
    try {
      quest = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    console.log('Received quest data:', quest);

    // 必須フィールドの検証
    if (!quest.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // 更新データの準備（自動生成フィールドと外部キーを除外）
    const updateData = {
      title: quest.title,
      description: quest.description,
      type: quest.type,
      platform: quest.platform,
      points: quest.points || 0,
      status: quest.status || 'draft',
      difficulty: quest.difficulty || 1,
      is_important: quest.is_important || false,
      is_limited: quest.is_limited || false,
      order_position: quest.order_position,
      estimated_time: quest.estimated_time || 0,
      required_points: quest.required_points || 0,
      auto_progress: quest.auto_progress || false,
      verification_required: quest.verification_required || false,
      verification_type: quest.verification_type || 'manual',
      max_attempts: quest.max_attempts,
      cooldown_period: quest.cooldown_period || 0,
      external_url: quest.external_url,
      start_date: quest.start_date,
      end_date: quest.end_date,
      participants_limit: quest.participants_limit,
      banner_url: quest.banner_url,
    };

    console.log('Updating quest with data:', updateData);

    // まず、更新対象のクエストが存在するか確認
    const { data: existingQuest, error: fetchError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing quest:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch existing quest: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!existingQuest) {
      console.error('Quest not found:', id);
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    console.log('Existing quest:', existingQuest);

    // データを更新（2段階で実行）
    // 1. まず更新を実行
    const { error: updateError } = await supabase
      .from('quests')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: `Failed to update quest: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 2. 更新されたデータを取得
    const { data: updatedQuest, error: fetchUpdatedError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchUpdatedError) {
      console.error('Error fetching updated quest:', fetchUpdatedError);
      return NextResponse.json(
        { error: `Failed to fetch updated quest: ${fetchUpdatedError.message}` },
        { status: 500 }
      );
    }

    if (!updatedQuest) {
      console.error('No data returned after update');
      return NextResponse.json(
        { error: 'Failed to update quest: No data returned' },
        { status: 500 }
      );
    }

    console.log('Update successful:', updatedQuest);
    return NextResponse.json(updatedQuest);
  } catch (error) {
    console.error('Error updating quest:', error);
    const message = error instanceof Error ? error.message : 'Failed to update quest';
    console.error('Error message:', message);
    return NextResponse.json(
      { error: message },
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
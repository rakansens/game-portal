import { NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/supabase';
import { validateQuestProgress } from '../../../src/lib/validations/quest';

export async function POST(request: Request) {
  try {
    // セッションチェック
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // リクエストデータのバリデーション
    const body = await request.json();
    const validation = validateQuestProgress(body);

    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { questId, progress, status } = validation.data;

    // トランザクション開始
    const { error: beginError } = await supabase.rpc('begin_transaction');
    if (beginError) throw beginError;

    try {
      // クエストの存在確認と状態チェック
      const { data: quest, error: questError } = await supabase
        .from('quests')
        .select('status, verification_required')
        .eq('id', questId)
        .single();

      if (questError || !quest) {
        throw new Error('Quest not found');
      }

      if (quest.status !== 'active') {
        throw new Error('Quest is not active');
      }

      // 進捗データの更新
      const { data, error } = await supabase
        .from('user_quest_progress')
        .upsert({
          user_id: session.user.id,
          quest_id: questId,
          progress,
          status,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // トランザクションのコミット
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw commitError;

      return NextResponse.json(data);
    } catch (error) {
      // ロールバック
      const { error: rollbackError } = await supabase.rpc('rollback_transaction');
      if (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
      throw error;
    }
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // セッションチェック
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('user_quest_progress')
      .select(`
        *,
        quests (*)
      `)
      .eq('user_id', session.user.id);

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
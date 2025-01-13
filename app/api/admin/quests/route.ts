import { NextRequest } from 'next/server';
import {
  supabaseAdmin,
  withTransaction,
  createErrorResponse,
  checkAdminAuth,
} from '../../../../src/lib/supabase-admin';
import { validateQuest, validateQuestUpdate } from '../../../../src/lib/validations/quest';

export async function GET(request: NextRequest) {
  try {
    await checkAdminAuth();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('quests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return createErrorResponse('Quest not found', 404);

      return Response.json(data);
    }

    const { data, error } = await supabaseAdmin
      .from('quests')
      .select('*')
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('No data returned from database');

    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse('Failed to fetch quests', 500, { message: error.message });
    }
    return createErrorResponse('Failed to fetch quests', 500);
  }
}

export async function POST(request: Request) {
  try {
    await checkAdminAuth();

    // リクエストデータのバリデーション
    const body = await request.json();
    const validation = validateQuest(body);

    if (validation.error) {
      return createErrorResponse(
        'Invalid request data',
        400,
        validation.error
      );
    }

    const quest = validation.data;

    // トランザクション内で新規クエストを作成
    const result = await withTransaction(async () => {
      // 最大のorder_positionを取得
      const { data: maxOrderQuest } = await supabaseAdmin
        .from('quests')
        .select('order_position')
        .order('order_position', { ascending: false })
        .limit(1)
        .single();

      const newOrderPosition = maxOrderQuest ? maxOrderQuest.order_position + 1 : 0;
      quest.order_position = newOrderPosition;

      const { data, error } = await supabaseAdmin
        .from('quests')
        .insert([quest])
        .select()
        .single();

      if (error) throw error;
      return data;
    });

    return Response.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse('Failed to create quest', 500, { message: error.message });
    }
    return createErrorResponse('Failed to create quest', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await checkAdminAuth();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('ID is required', 400);
    }

    // リクエストデータのバリデーション
    const body = await request.json();
    const validation = validateQuestUpdate(body);

    if (validation.error) {
      return createErrorResponse(
        'Invalid request data',
        400,
        validation.error
      );
    }

    const quest = validation.data;

    const { data, error } = await supabaseAdmin
      .from('quests')
      .update(quest)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return createErrorResponse('Quest not found', 404);

    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse('Failed to update quest', 500, { message: error.message });
    }
    return createErrorResponse('Failed to update quest', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await checkAdminAuth();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('ID is required', 400);
    }

    // トランザクション内で削除と並び順の更新を実行
    await withTransaction(async () => {
      // 削除対象のクエストの現在の並び順を取得
      const { data: targetQuest } = await supabaseAdmin
        .from('quests')
        .select('order_position')
        .eq('id', id)
        .single();

      if (!targetQuest) throw new Error('Quest not found');

      // クエストを削除
      const { error: deleteError } = await supabaseAdmin
        .from('quests')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // 削除したクエストより後ろの並び順を更新
      const { error: updateError } = await supabaseAdmin.rpc('update_quest_order_after_delete', {
        target_position: targetQuest.order_position
      });

      if (updateError) throw updateError;
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse('Failed to delete quest', 500, { message: error.message });
    }
    return createErrorResponse('Failed to delete quest', 500);
  }
}
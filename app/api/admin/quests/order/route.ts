import { NextRequest } from 'next/server';
import {
  supabaseAdmin,
  createErrorResponse,
  checkAdminAuth,
} from '../../../../../src/lib/supabase-admin';
import { validateQuestOrder } from '../../../../../src/lib/validations/quest';

export async function PUT(request: NextRequest) {
  try {
    // 管理者権限チェック
    await checkAdminAuth();

    // リクエストデータのバリデーション
    const body = await request.json();
    const validation = validateQuestOrder(body);

    if (validation.error) {
      return createErrorResponse(
        'Invalid request data',
        400,
        validation.error
      );
    }

    const { quests } = validation.data;

    // 一括更新を実行
    const { error } = await supabaseAdmin.rpc(
      'update_quests_order',
      { quest_updates: quests }
    );

    if (error) {
      console.error('Error updating quest order:', error);
      return createErrorResponse(
        '並び順の更新に失敗しました',
        500,
        error
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    // エラーログからスタックトレースを除外
    if (error instanceof Error) {
      return createErrorResponse(
        '並び順の更新に失敗しました',
        500,
        { message: error.message }
      );
    }
    return createErrorResponse('並び順の更新に失敗しました', 500);
  }
}
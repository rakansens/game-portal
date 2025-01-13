import { NextRequest } from 'next/server';
import {
  supabaseAdmin,
  withTransaction,
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

    // トランザクション内でバルク更新を実行
    await withTransaction(async () => {
      for (const quest of quests) {
        const { error } = await supabaseAdmin
          .from('quests')
          .update({ order_position: quest.order_position })
          .eq('id', quest.id);

        if (error) {
          console.error('Error updating quest order:', error);
          throw error;
        }
      }
    });

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
import { NextRequest } from 'next/server';
import {
  supabaseAdmin,
  withTransaction,
  createErrorResponse,
  checkAdminAuth,
} from '../../../../../src/lib/supabase-admin';

export async function PUT(request: NextRequest) {
  try {
    // 管理者権限チェック
    await checkAdminAuth();

    const { quests } = await request.json();

    // バルク更新のためのデータを準備
    const updates = quests.map(({ id, order_position }: { id: string; order_position: number }) => ({
      id,
      order_position,
    }));

    // トランザクション内でバルク更新を実行
    await withTransaction(async () => {
      for (const update of updates) {
        const { error } = await supabaseAdmin
          .from('quests')
          .update({ order_position: update.order_position })
          .eq('id', update.id);

        if (error) {
          console.error('Error updating quest order:', error);
          throw error;
        }
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/admin/quests/order:', error);
    return createErrorResponse(
      '並び順の更新に失敗しました',
      500,
      error
    );
  }
}
import { NextRequest } from 'next/server';
import {
  supabaseAdmin,
  createErrorResponse,
  checkAdminAuth,
} from '../../../../../src/lib/supabase-admin';

export async function PUT(request: NextRequest) {
  try {
    await checkAdminAuth();

    const body = await request.json();
    console.log('Update order request body:', body);

    if (!body.quests || !Array.isArray(body.quests)) {
      return createErrorResponse('Invalid request data: expected quests array', 400);
    }

    const { error } = await supabaseAdmin.rpc('update_quests_order', {
      quest_updates: JSON.stringify(body.quests)
    });

    if (error) {
      console.error('Error updating quest order:', error);
      return createErrorResponse('Failed to update quest order', 500, error);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PUT error details:', error);
    if (error instanceof Error) {
      return createErrorResponse('Failed to update quest order', 500, { message: error.message });
    }
    return createErrorResponse('Failed to update quest order', 500);
  }
}
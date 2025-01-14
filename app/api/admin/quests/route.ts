import { NextRequest } from 'next/server';
import {
  supabaseAdmin,
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
      .order('order_position', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('No data returned from database');

    return Response.json(data);
  } catch (error) {
    console.error('GET error details:', error);
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
    console.log('Request body:', body);
    const validation = validateQuest(body);

    if (validation.error) {
      console.log('Validation error:', validation.error);
      return createErrorResponse(
        'Invalid request data',
        400,
        validation.error
      );
    }

    const quest = validation.data;
    console.log('Validated quest:', quest);

    // 最大のorder_positionを取得
    const { data: maxOrderQuest, error: orderError } = await supabaseAdmin
      .from('quests')
      .select('order_position')
      .order('order_position', { ascending: false })
      .limit(1)
      .single();

    if (orderError) {
      console.error('Error fetching max order:', orderError);
      return createErrorResponse('Failed to fetch max order', 500, orderError);
    }

    const newOrderPosition = maxOrderQuest ? maxOrderQuest.order_position + 1 : 0;
    quest.order_position = newOrderPosition;

    console.log('Inserting quest with data:', quest);
    const { data, error } = await supabaseAdmin
      .from('quests')
      .insert([quest])
      .select()
      .single();

    if (error) {
      console.error('Insert error details:', error);
      return createErrorResponse('Failed to insert quest', 500, error);
    }

    if (!data) {
      console.error('No data returned after insert');
      return createErrorResponse('Failed to create quest: No data returned', 500);
    }

    return Response.json(data);
  } catch (error) {
    console.error('POST error full details:', error);
    if (error instanceof Error) {
      return createErrorResponse('Failed to create quest', 500, { 
        message: error.message,
        details: error
      });
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
    console.log('Update quest request body:', body);
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

    if (error) {
      console.error('Update error:', error);
      return createErrorResponse('Failed to update quest', 500, error);
    }

    if (!data) {
      return createErrorResponse('Quest not found', 404);
    }

    return Response.json(data);
  } catch (error) {
    console.error('PUT error details:', error);
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

    const { error: deleteError } = await supabaseAdmin
      .from('quests')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting quest:', deleteError);
      return createErrorResponse('Failed to delete quest', 500, deleteError);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE error details:', error);
    if (error instanceof Error) {
      return createErrorResponse('Failed to delete quest', 500, { message: error.message });
    }
    return createErrorResponse('Failed to delete quest', 500);
  }
}
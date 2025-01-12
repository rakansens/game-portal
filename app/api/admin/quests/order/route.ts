import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../../src/types/supabase';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function PUT(request: NextRequest) {
  try {
    const { quests } = await request.json();

    // 並び順の更新を一括で行う
    for (const { id, order_index } of quests) {
      const { error } = await supabase
        .from('quests')
        .update({ order_position: order_index })
        .eq('id', id);

      if (error) {
        console.error('Error updating quest order:', error);
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating quests order:', error);
    return NextResponse.json(
      { error: 'Failed to update quests order' },
      { status: 500 }
    );
  }
}
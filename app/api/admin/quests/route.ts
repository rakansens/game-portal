import { NextResponse } from 'next/server';
import { supabase } from '../../../../src/lib/supabase';
import { Quest } from '../../../../src/types/supabase';

type CreateQuestInput = Omit<Quest, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'modified_by'>;

export async function POST(request: Request) {
  try {
    const input = await request.json() as CreateQuestInput;
    
    // TODO: 管理者権限のチェック
    // const session = await getSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { data, error } = await supabase
      .from('quests')
      .insert([{
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // created_by: session.user.id,
        // modified_by: session.user.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating quest:', error);
      return NextResponse.json(
        { error: 'Failed to create quest' },
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

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    
    // TODO: 管理者権限のチェック
    
    const { data, error } = await supabase
      .from('quests')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        // modified_by: session.user.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quest:', error);
      return NextResponse.json(
        { error: 'Failed to update quest' },
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Quest ID is required' },
        { status: 400 }
      );
    }

    // TODO: 管理者権限のチェック

    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quest:', error);
      return NextResponse.json(
        { error: 'Failed to delete quest' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
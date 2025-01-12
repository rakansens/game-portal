import { NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/supabase';

export async function GET() {
  try {
    const { data: quests, error } = await supabase
      .from('quests')
      .select('*')
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quests' },
        { status: 500 }
      );
    }

    return NextResponse.json(quests);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
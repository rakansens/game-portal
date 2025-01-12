import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../src/types/supabase';

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

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: true }); // バックアップのソート順

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from Supabase');
      throw new Error('No data returned from database');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

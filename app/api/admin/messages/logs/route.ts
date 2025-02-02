import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data: logs, error } = await supabase
      .from('message_logs')
      .select('*, users(display_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching message logs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch message logs: ${errorMessage}` },
      { status: 500 }
    );
  }
}

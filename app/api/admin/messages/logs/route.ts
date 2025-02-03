import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Database } from '@/types/database';

type MessageLog = Database['public']['Tables']['message_logs']['Row'];

export async function GET() {
  try {
    console.log('Fetching message logs from Supabase...');
    const { data: logs, error } = await supabaseAdmin
      .from('message_logs')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Supabase response:', { logs, error });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!logs) {
      console.log('No logs found');
      return NextResponse.json([]);
    }

    console.log('Found logs:', logs.length);
    console.log('Raw logs:', JSON.stringify(logs, null, 2));

    if (!logs) {
      return NextResponse.json([]);
    }

    console.log('Formatted logs:', JSON.stringify(logs, null, 2));
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

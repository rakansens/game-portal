import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('line_user_id, display_name, picture_url')
      .order('display_name');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
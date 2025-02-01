import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { line_user_id, display_name, picture_url, status_message } = await request.json();

    // ユーザーが存在するか確認
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('line_user_id', line_user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116はレコードが見つからない場合のエラー
      throw fetchError;
    }

    if (existingUser) {
      // ユーザーが存在する場合は更新
      const { error: updateError } = await supabase
        .from('users')
        .update({
          display_name,
          picture_url,
          status_message,
          last_login_at: new Date().toISOString(),
        })
        .eq('line_user_id', line_user_id);

      if (updateError) throw updateError;
    } else {
      // ユーザーが存在しない場合は新規作成
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          line_user_id,
          display_name,
          picture_url,
          status_message,
          last_login_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    return NextResponse.json(
      { error: 'Failed to save user data' },
      { status: 500 }
    );
  }
}

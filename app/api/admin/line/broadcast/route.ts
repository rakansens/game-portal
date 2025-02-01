import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const lineChannelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // ブロックされていないユーザーのIDを取得
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('line_user_id')
      .eq('is_blocked', false);

    if (userError) throw userError;

    // メッセージ送信のログを記録
    const { error: logError } = await supabase
      .from('message_logs')
      .insert({
        message_type: 'text',
        message_content: message,
        target_type: 'multicast',
        target_count: users?.length ?? 0,
      });

    if (logError) throw logError;

    // LINEメッセージング APIを呼び出し
    const response = await fetch('https://api.line.me/v2/bot/message/multicast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lineChannelAccessToken}`,
      },
      body: JSON.stringify({
        to: users?.map(user => user.line_user_id),
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('LINE Messaging API error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

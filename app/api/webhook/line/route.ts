import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

const channelSecret = process.env.LINE_MESSAGING_CHANNEL_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function validateSignature(body: string, signature: string): boolean {
  if (!channelSecret) return false;
  const hmac = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');
  return hmac === signature;
}

async function saveUserProfile(userId: string) {
  try {
    // LINE Profile APIを呼び出してユーザー情報を取得
    const profileResponse = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });

    if (!profileResponse.ok) {
      console.error('Failed to fetch user profile:', await profileResponse.text());
      return;
    }

    const profile = await profileResponse.json();

    // Supabaseにユーザー情報を保存
    const { error } = await supabase.from('users').upsert({
      line_user_id: profile.userId,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl,
      status_message: profile.statusMessage,
      last_login_at: new Date().toISOString(),
    }, {
      onConflict: 'line_user_id',
    });

    if (error) {
      console.error('Failed to save user:', error);
    } else {
      console.log('Successfully saved user:', profile.displayName);
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

export async function POST(request: Request) {
  console.log('Webhook received');

  const headersList = headers();
  const signature = headersList.get('x-line-signature');
  console.log('Signature:', signature);
  console.log('Channel Secret:', channelSecret);
  
  if (!signature) {
    return new NextResponse('Missing signature', { status: 401 });
  }

  const body = await request.text();
  if (!validateSignature(body, signature)) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const webhookData = JSON.parse(body);

  try {
    for (const event of webhookData.events) {
      // ユーザーIDを取得
      const userId = event.source.userId;
      
      if (event.type === 'follow' || event.type === 'message') {
        // フォローイベントまたはメッセージイベント時にユーザー情報を保存
        await saveUserProfile(userId);
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

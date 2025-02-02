import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST() {
  try {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'LINE Channel Access Tokenが設定されていません' },
        { status: 500 }
      );
    }

    // LINE Messaging APIを使用してフォロワーリストを取得
    const response = await fetch('https://api.line.me/v2/bot/followers/ids', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'フォロワーリストの取得に失敗しました' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const userIds = data.userIds;

    // 各ユーザーのプロフィール情報を取得して保存
    const profiles = await Promise.all(
      userIds.map(async (userId: string) => {
        const profileResponse = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          console.error(`Failed to fetch profile for user ${userId}:`, await profileResponse.text());
          return null;
        }

        return profileResponse.json();
      })
    );

    // 有効なプロフィール情報のみを抽出
    const validProfiles = profiles.filter((profile): profile is any => profile !== null);

    // Supabaseにユーザー情報を一括保存
    const { error } = await supabase.from('users').upsert(
      validProfiles.map(profile => ({
        line_user_id: profile.userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
        status_message: profile.statusMessage,
        last_login_at: new Date().toISOString(),
      })),
      { onConflict: 'line_user_id' }
    );

    if (error) {
      console.error('Error saving user profiles:', error);
      return NextResponse.json(
        { error: 'ユーザー情報の保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${validProfiles.length}人のユーザー情報を同期しました`,
    });
  } catch (error) {
    console.error('Error syncing users:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の同期に失敗しました' },
      { status: 500 }
    );
  }
}

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env.localを読み込む
dotenv.config({ path: '.env.local' });

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

async function getFollowers(): Promise<string[]> {
  let start: string | undefined;
  const allUserIds: string[] = [];

  while (true) {
    const url = `https://api.line.me/v2/bot/followers/ids${start ? `?start=${start}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get followers: ${response.statusText}`);
    }

    const data = await response.json();
    allUserIds.push(...data.userIds);

    if (!data.next) break;
    start = data.next;
  }

  return allUserIds;
}

async function getUserProfile(userId: string): Promise<LineProfile> {
  const response = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user profile: ${response.statusText}`);
  }

  return response.json();
}

async function syncUsers() {
  try {
    console.log('Getting LINE followers...');
    const userIds = await getFollowers();
    console.log(`Found ${userIds.length} followers`);

    for (const userId of userIds) {
      try {
        console.log(`Processing user: ${userId}`);
        const profile = await getUserProfile(userId);

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
          console.error(`Failed to save user ${userId}:`, error);
          continue;
        }

        console.log(`Saved user: ${profile.displayName}`);
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
      }

      // LINE APIの制限に対応するため、各リクエスト間で少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Sync completed!');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// スクリプトを実行
syncUsers();

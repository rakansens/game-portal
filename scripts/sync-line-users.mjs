import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localを読み込む
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!LINE_CHANNEL_ACCESS_TOKEN || !supabaseUrl || !supabaseServiceKey) {
  console.error('Required environment variables are missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getFollowers() {
  console.log('Using Channel Access Token:', LINE_CHANNEL_ACCESS_TOKEN);

  let start;
  const allUserIds = [];

  while (true) {
    const url = `https://api.line.me/v2/bot/followers/ids${start ? `?start=${start}` : ''}`;
    console.log('Requesting URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.log('Error response body:', errorBody);
      throw new Error(`Failed to get followers: ${response.statusText} (${response.status}) - ${errorBody}`);
    }

    const data = await response.json();
    allUserIds.push(...data.userIds);

    if (!data.next) break;
    start = data.next;
  }

  return allUserIds;
}

async function getUserProfile(userId) {
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
  } finally {
    process.exit(0);
  }
}

// スクリプトを実行
syncUsers();

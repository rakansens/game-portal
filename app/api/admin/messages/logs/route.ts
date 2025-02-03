import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Database } from '@/types/database';

type MessageGroup = Database['public']['Tables']['message_groups']['Row'] & {
  messages: Database['public']['Tables']['message_logs']['Row'][];
};

export async function GET() {
  try {
    console.log('Fetching message logs from Supabase...');
    
    // メッセージグループを取得
    const { data: groups, error: groupsError } = await supabaseAdmin
      .from('message_groups')
      .select(`
        *,
        messages:message_logs(
          message_type,
          message_content,
          status,
          error_message,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (groupsError) {
      console.error('Error fetching message groups:', groupsError);
      throw groupsError;
    }

    if (!groups) {
      console.log('No logs found');
      return NextResponse.json([]);
    }

    // ユーザー情報を取得
    const lineUserIds = groups.flatMap(group => 
      (group.target_users as { id: string }[]).map(user => user.id)
    );

    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('line_user_id, display_name, picture_url')
      .in('line_user_id', lineUserIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    // ユーザー情報をマップ
    const userMap = new Map(users?.map(user => [user.line_user_id, user]));

    // グループごとのメッセージを整形
    const logs = groups.map(group => {
      // ユーザー情報を組み込む
      const targetUsers = (group.target_users as { id: string }[]).map(user => {
        const userInfo = userMap.get(user.id);
        return {
          id: user.id,
          display_name: userInfo?.display_name,
          picture_url: userInfo?.picture_url
        };
      });

      return {
        id: group.id,
        message_type: group.messages[0]?.message_type || 'unknown',
        message_content: group.messages[0]?.message_content || {},
        target_users: targetUsers,
        status: group.status,
        error_message: group.error_message,
        created_at: group.created_at,
        created_by: group.created_by,
        is_broadcast: group.is_broadcast,
        additional_messages: group.messages.slice(1)
      };
    });

    console.log('Found logs:', logs.length);
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

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

    // ユーザー情報を取得
    const userIds = logs.flatMap(log => 
      Array.isArray(log.target_users) 
        ? log.target_users.map((user: any) => user.id)
        : []
    );

    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('line_user_id, display_name, picture_url, status_message')
        .in('line_user_id', userIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      // ログにユーザー情報を追加
      const logsWithUsers = logs.map(log => ({
        ...log,
        target_users: Array.isArray(log.target_users)
          ? log.target_users.map((targetUser: any) => {
              const user = users?.find(u => u.line_user_id === targetUser.id);
              return user ? {
                ...targetUser,
                display_name: user.display_name,
                picture_url: user.picture_url,
                status_message: user.status_message
              } : targetUser;
            })
          : log.target_users
      }));

      console.log('Found logs:', logsWithUsers.length);
      console.log('Raw logs:', JSON.stringify(logsWithUsers, null, 2));
      return NextResponse.json(logsWithUsers);
    }

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

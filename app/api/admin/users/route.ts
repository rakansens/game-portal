import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { LineUser } from '@/types/line';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        quests:user_quests(
          quest_id,
          quest:quests(name),
          points,
          completed_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const lineUsers: LineUser[] = users.map((user) => ({
      id: user.line_user_id,
      displayName: user.display_name,
      pictureUrl: user.picture_url,
      statusMessage: user.status_message,
      email: user.email,
      isBlocked: user.is_blocked,
      registeredAt: user.created_at,
      lastLoginAt: user.last_login_at,
      totalPoints: user.total_points,
      completedQuests: user.quests
        .filter((q: any) => q.completed_at)
        .map((q: any) => ({
          questId: q.quest_id,
          questName: q.quest.name,
          points: q.points,
          completedAt: q.completed_at,
        })),
      currentQuests: user.quests
        .filter((q: any) => !q.completed_at)
        .map((q: any) => ({
          questId: q.quest_id,
          questName: q.quest.name,
          points: q.points,
          completedAt: '',
        })),
    }));

    return NextResponse.json(lineUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch users: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, isBlocked } = await request.json();

    const { error } = await supabase
      .from('users')
      .update({ is_blocked: isBlocked })
      .eq('line_user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

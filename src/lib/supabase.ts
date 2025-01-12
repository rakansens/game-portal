import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データ取得用のユーティリティ関数
export const getQuests = async () => {
  const { data: quests, error } = await supabase
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quests:', error);
    return [];
  }

  return quests;
};

export const getQuestById = async (id: string) => {
  const { data: quest, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quest:', error);
    return null;
  }

  return quest;
};

export const getUserQuests = async (userId: string) => {
  const { data: userQuests, error } = await supabase
    .from('user_quests')
    .select(`
      *,
      quests (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user quests:', error);
    return [];
  }

  return userQuests;
};

// データ更新用のユーティリティ関数
export const createUserQuest = async (userId: string, questId: string) => {
  const { data, error } = await supabase
    .from('user_quests')
    .insert([
      {
        user_id: userId,
        quest_id: questId,
        status: 'IN_PROGRESS',
        progress: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user quest:', error);
    return null;
  }

  return data;
};

export const updateUserQuestProgress = async (
  userQuestId: string,
  progress: number,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
) => {
  const { data, error } = await supabase
    .from('user_quests')
    .update({ progress, status, updated_at: new Date().toISOString() })
    .eq('id', userQuestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user quest progress:', error);
    return null;
  }

  return data;
};

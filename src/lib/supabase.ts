import { createClient } from '@supabase/supabase-js';
import { Database, Quest, UserQuestProgress, Profile, GachaItem } from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// クエスト関連の関数
export const getQuests = async (): Promise<Quest[]> => {
  const { data: quests, error } = await supabase
    .from('quests')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quests:', error);
    return [];
  }

  return quests;
};

export const getQuestById = async (id: string): Promise<Quest | null> => {
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

// ユーザークエスト進捗関連の関数
export const getUserQuestProgress = async (userId: string): Promise<UserQuestProgress[]> => {
  const { data: progress, error } = await supabase
    .from('user_quest_progress')
    .select(`
      *,
      quests (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user quest progress:', error);
    return [];
  }

  return progress;
};

export const startQuest = async (userId: string, questId: string): Promise<UserQuestProgress | null> => {
  const { data, error } = await supabase
    .from('user_quest_progress')
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
    console.error('Error starting quest:', error);
    return null;
  }

  return data;
};

export const updateQuestProgress = async (
  progressId: string,
  progress: number,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
): Promise<UserQuestProgress | null> => {
  const updates: any = {
    progress,
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'COMPLETED') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('user_quest_progress')
    .update(updates)
    .eq('id', progressId)
    .select()
    .single();

  if (error) {
    console.error('Error updating quest progress:', error);
    return null;
  }

  return data;
};

// プロフィール関連の関数
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
};

export const updateProfile = async (
  userId: string,
  updates: { display_name?: string; avatar_url?: string }
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
};

// ガチャ関連の関数
export const getGachaItems = async (): Promise<GachaItem[]> => {
  const { data: items, error } = await supabase
    .from('gacha_items')
    .select('*')
    .order('rarity', { ascending: false });

  if (error) {
    console.error('Error fetching gacha items:', error);
    return [];
  }

  return items;
};

export const getUserGachaItems = async (userId: string) => {
  const { data: items, error } = await supabase
    .from('user_gacha_items')
    .select(`
      *,
      gacha_items (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user gacha items:', error);
    return [];
  }

  return items;
};

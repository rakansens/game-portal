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
  try {
    console.log('Fetching quests from Supabase...');
    
    const { data, error } = await supabase
      .from('quests')
      .select('*');

    console.log('Raw Supabase response:', {
      data: data ? JSON.stringify(data, null, 2) : null,
      error: error ? {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      } : null
    });

    if (error) {
      throw new Error(`Failed to fetch quests: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No quests found in the database');
      return [];
    }

    // データの構造を確認
    console.log('Quest data structure:', {
      totalQuests: data.length,
      fields: Object.keys(data[0]),
      firstQuest: data[0]
    });

    const quests = data as Quest[];
    return quests;
  } catch (err) {
    console.error('Failed to fetch quests:', err);
    throw err;
  }
};

export const getQuestById = async (id: string): Promise<Quest | null> => {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quest:', error);
      throw new Error(`Failed to fetch quest: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error fetching quest:', err);
    return null;
  }
};

// ユーザークエスト進捗関連の関数
export const getUserQuestProgress = async (userId: string): Promise<UserQuestProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('user_quest_progress')
      .select(`
        *,
        quests (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user quest progress:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching user quest progress:', err);
    return [];
  }
};

export const startQuest = async (userId: string, questId: string): Promise<UserQuestProgress | null> => {
  try {
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
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error starting quest:', err);
    return null;
  }
};

export const updateQuestProgress = async (
  progressId: string,
  progress: number,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
): Promise<UserQuestProgress | null> => {
  try {
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
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error updating quest progress:', err);
    return null;
  }
};

// プロフィール関連の関数
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
};

export const updateProfile = async (
  userId: string,
  updates: { display_name?: string; avatar_url?: string }
): Promise<Profile | null> => {
  try {
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
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error updating profile:', err);
    return null;
  }
};

// ガチャ関連の関数
export const getGachaItems = async (): Promise<GachaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('gacha_items')
      .select('*')
      .order('rarity', { ascending: false });

    if (error) {
      console.error('Error fetching gacha items:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching gacha items:', err);
    return [];
  }
};

export const getUserGachaItems = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_gacha_items')
      .select(`
        *,
        gacha_items (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user gacha items:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching user gacha items:', err);
    return [];
  }
};

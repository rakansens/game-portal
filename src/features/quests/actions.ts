import { supabase } from '@/lib/supabase/client';
import type { Quest } from '@/types/shared';

/**
 * 公開中のクエストを取得
 */
export async function fetchPublicQuests() {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('status', 'published')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data: data as Quest[], error: null };
  } catch (error) {
    console.error('Error fetching quests:', error);
    return { data: null, error: 'クエストの取得に失敗しました' };
  }
}

/**
 * 公開中のクエストを1件取得
 */
export async function fetchPublicQuestById(id: string) {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('status', 'published')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Quest, error: null };
  } catch (error) {
    console.error('Error fetching quest:', error);
    return { data: null, error: 'クエストの取得に失敗しました' };
  }
}

/**
 * クエストに参加
 */
export async function joinQuest(questId: string, userId: string) {
  try {
    // 参加上限チェック
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('participants_limit, participant_count')
      .eq('id', questId)
      .single();

    if (questError) throw questError;

    if (
      quest.participants_limit !== null &&
      quest.participant_count >= quest.participants_limit
    ) {
      return { data: null, error: '参加上限に達しています' };
    }

    // 既に参加済みかチェック
    const { data: existing, error: existingError } = await supabase
      .from('quest_participants')
      .select('id')
      .eq('quest_id', questId)
      .eq('user_id', userId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existing) {
      return { data: null, error: '既に参加済みです' };
    }

    // トランザクション開始
    const { error: participantError } = await supabase
      .from('quest_participants')
      .insert([
        {
          quest_id: questId,
          user_id: userId,
        },
      ]);

    if (participantError) throw participantError;

    // 参加者数をインクリメント
    const { error: updateError } = await supabase.rpc('increment_participant_count', {
      quest_id: questId,
    });

    if (updateError) throw updateError;

    return { data: true, error: null };
  } catch (error) {
    console.error('Error joining quest:', error);
    return { data: null, error: 'クエストへの参加に失敗しました' };
  }
}
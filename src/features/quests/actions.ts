import { supabase } from '@/lib/supabase/client';
import type { Quest, QuestFormData } from '@/types/quest';

/**
 * 公開中のクエストを取得
 */
export async function fetchPublicQuests() {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('status', 'active')
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // データベースの型をQuestFormData型に変換
    const quests = data.map((item): Quest => ({
      id: item.id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      title: item.title,
      description: item.description,
      type: item.type,
      platform: item.platform,
      points: item.points,
      status: item.status,
      difficulty: item.difficulty,
      is_important: item.is_important,
      is_limited: item.is_limited,
      category: item.category,
      tags: item.tags,
      exp_reward: item.exp_reward,
      start_date: item.start_date,
      end_date: item.end_date,
      participants_limit: item.participants_limit,
      participant_count: item.participant_count,
      order_position: item.order_position,
      estimated_time: item.estimated_time,
      required_points: item.required_points,
      auto_progress: item.auto_progress,
      verification_required: item.verification_required,
      verification_type: item.verification_type,
      max_attempts: item.max_attempts,
      cooldown_period: item.cooldown_period,
      external_url: item.external_url,
      banner_url: item.banner_url,
    }));

    return { data: quests, error: null };
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
      .eq('status', 'active')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    const quest: Quest = {
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      title: data.title,
      description: data.description,
      type: data.type,
      platform: data.platform,
      points: data.points,
      status: data.status,
      difficulty: data.difficulty,
      is_important: data.is_important,
      is_limited: data.is_limited,
      category: data.category,
      tags: data.tags,
      exp_reward: data.exp_reward,
      start_date: data.start_date,
      end_date: data.end_date,
      participants_limit: data.participants_limit,
      participant_count: data.participant_count,
      order_position: data.order_position,
      estimated_time: data.estimated_time,
      required_points: data.required_points,
      auto_progress: data.auto_progress,
      verification_required: data.verification_required,
      verification_type: data.verification_type,
      max_attempts: data.max_attempts,
      cooldown_period: data.cooldown_period,
      external_url: data.external_url,
      banner_url: data.banner_url,
    };

    return { data: quest, error: null };
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
import { supabase } from '@/lib/supabase/client';
import { Quest } from '@/types/supabase';

/**
 * 公開クエスト一覧を取得
 */
export async function fetchPublicQuests() {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('status', 'active')
      .order('order_position', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch public quests:', error);
    return { data: null, error: 'クエストの取得に失敗しました' };
  }
}

/**
 * 公開クエストの詳細を取得
 */
export async function fetchPublicQuestById(id: string) {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select(`
        *,
        quest_progress(
          status,
          started_at,
          completed_at
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch public quest:', error);
    return { data: null, error: 'クエストの取得に失敗しました' };
  }
}

/**
 * クエストの進捗を更新
 */
export async function updateQuestProgress(questId: string, status: string) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('認証が必要です');

    const { data, error } = await supabase
      .from('quest_progress')
      .upsert({
        quest_id: questId,
        user_id: user.id,
        status,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Failed to update quest progress:', error);
    return { data: null, error: '進捗の更新に失敗しました' };
  }
}

/**
 * クエストの利用可能状態をチェック
 */
export function isQuestAvailable(quest: Quest): boolean {
  const now = new Date();
  const startDate = quest.start_date ? new Date(quest.start_date) : null;
  const endDate = quest.end_date ? new Date(quest.end_date) : null;

  // 開始日時チェック
  if (startDate && startDate > now) {
    return false;
  }

  // 終了日時チェック
  if (endDate && endDate < now) {
    return false;
  }

  // 参加人数制限チェック
  if (
    quest.participants_limit !== null &&
    quest.participant_count !== null &&
    quest.participant_count >= quest.participants_limit
  ) {
    return false;
  }

  return true;
}
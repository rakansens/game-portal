import { Quest } from '@/types/supabase';
import * as adminApi from '@/lib/api/admin';

/**
 * クエスト一覧を取得
 */
export async function fetchQuests() {
  try {
    const quests = await adminApi.fetchQuests();
    return { data: quests, error: null };
  } catch (error) {
    console.error('Failed to fetch quests:', error);
    return { data: null, error: 'クエストの取得に失敗しました' };
  }
}

/**
 * クエストを作成
 */
export async function createQuest(quest: Partial<Quest>) {
  try {
    const newQuest = await adminApi.createQuest(quest);
    return { data: newQuest, error: null };
  } catch (error) {
    console.error('Failed to create quest:', error);
    return { data: null, error: 'クエストの作成に失敗しました' };
  }
}

/**
 * クエストを更新
 */
export async function updateQuest(id: string, quest: Partial<Quest>) {
  try {
    const updatedQuest = await adminApi.updateQuest(id, quest);
    return { data: updatedQuest, error: null };
  } catch (error) {
    console.error('Failed to update quest:', error);
    return { data: null, error: 'クエストの更新に失敗しました' };
  }
}

/**
 * クエストを削除
 */
export async function deleteQuest(id: string) {
  try {
    await adminApi.deleteQuest(id);
    return { error: null };
  } catch (error) {
    console.error('Failed to delete quest:', error);
    return { error: 'クエストの削除に失敗しました' };
  }
}

/**
 * クエストの並び順を更新
 */
export async function updateQuestsOrder(quests: Quest[]) {
  try {
    await adminApi.updateQuestsOrder(quests);
    return { error: null };
  } catch (error) {
    console.error('Failed to update quests order:', error);
    return { error: '並び順の更新に失敗しました' };
  }
}
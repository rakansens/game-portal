import type { Database } from './database';

export type QuestProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuestFilters {
  search: string;
}

export type Quest = Database['public']['Tables']['quests']['Row'];
export type QuestInsert = Database['public']['Tables']['quests']['Insert'];
export type QuestUpdate = Database['public']['Tables']['quests']['Update'];

// 管理者用フォームデータ型
export interface QuestFormData {
  title: string;
  description: string;
  points: number | null;
  start_date: string | null;
  end_date: string | null;
  participants_limit: number | null;
  required_points: number | null;
}

// 公開用クエスト型（管理用フィールドを除外）
export interface PublicQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  start_date: string | null;
  end_date: string | null;
  participants_limit: number | null;
  required_points: number;
  is_available: boolean;
  progress_status: QuestProgressStatus;
}

export type CreateQuestInput = QuestFormData;
export type UpdateQuestInput = Partial<QuestFormData> & { id: string };

// 型変換関数
export function toPublicQuest(quest: Quest, isAvailable: boolean): PublicQuest {
  return {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    points: quest.points,
    start_date: quest.start_date,
    end_date: quest.end_date,
    participants_limit: quest.participants_limit,
    required_points: quest.required_points,
    is_available: isAvailable,
    progress_status: 'not_started'
  };
}
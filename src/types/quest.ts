import { Database } from './supabase';

export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived';
export type QuestType = 'normal' | 'limited_time' | 'roulette';
export type VerificationType = 'manual' | 'automatic';
export type QuestProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuestFilters {
  search: string;
  type: string;
  status: string;
}

export type Quest = Database['public']['Tables']['quests']['Row'];
export type QuestInsert = Database['public']['Tables']['quests']['Insert'];
export type QuestUpdate = Database['public']['Tables']['quests']['Update'];

// 管理者用フォームデータ型
export interface QuestFormData {
  title: string;
  description: string;
  type: string | null;
  platform: string | null;
  points: number | null;
  status: QuestStatus;
  difficulty: number;
  is_important: boolean;
  is_limited: boolean;
  category: string | null;
  tags: string[] | null;
  exp_reward: number;
  start_date: string | null;
  end_date: string | null;
  participants_limit: number | null;
  participant_count?: number | null;
  order_position: number;
  estimated_time?: number | null;
  required_points?: number | null;
  auto_progress?: boolean;
  verification_required?: boolean;
  verification_type?: VerificationType | null;
  max_attempts?: number | null;
  cooldown_period?: number | null;
  external_url?: string | null;
  banner_url?: string | null;
}

// 公開用クエスト型（管理用フィールドを除外）
export interface PublicQuest {
  id: string;
  title: string;
  description: string;
  type: string | null;
  platform: string | null;
  difficulty: number;
  exp_reward: number;
  points: number | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  is_limited: boolean;
  is_important: boolean;
  category: string | null;
  tags: string[] | null;
  participants_limit: number | null;
  participant_count: number | null;
  estimated_time: number | null;
  required_points: number | null;
  verification_required: boolean;
  verification_type: string | null;
  max_attempts: number | null;
  cooldown_period: number | null;
  external_url: string | null;
  banner_url: string | null;
  is_available: boolean;
  progress_status: QuestProgressStatus;
}

export type CreateQuestInput = Omit<QuestFormData, 'participant_count'>;
export type UpdateQuestInput = Partial<CreateQuestInput> & { id: string };

// 型ガード関数
export function isQuestStatus(value: string): value is QuestStatus {
  return ['draft', 'active', 'completed', 'archived'].includes(value);
}

export function isQuestType(value: string): value is QuestType {
  return ['normal', 'limited_time', 'roulette'].includes(value);
}

export function isVerificationType(value: string): value is VerificationType {
  return ['manual', 'automatic'].includes(value);
}

// 型変換関数
export function toPublicQuest(quest: Quest, isAvailable: boolean): PublicQuest {
  return {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    type: quest.type,
    platform: quest.platform,
    difficulty: quest.difficulty,
    exp_reward: quest.exp_reward,
    points: quest.points,
    status: quest.status,
    start_date: quest.start_date,
    end_date: quest.end_date,
    is_limited: quest.is_limited,
    is_important: quest.is_important,
    category: quest.category,
    tags: quest.tags,
    participants_limit: quest.participants_limit,
    participant_count: quest.participant_count,
    estimated_time: quest.estimated_time,
    required_points: quest.required_points,
    verification_required: quest.verification_required,
    verification_type: quest.verification_type,
    max_attempts: quest.max_attempts,
    cooldown_period: quest.cooldown_period,
    external_url: quest.external_url,
    banner_url: quest.banner_url,
    is_available: isAvailable,
    progress_status: 'not_started'
  };
}
import { Database } from './supabase';

export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived';
export type QuestType = 'normal' | 'limited_time' | 'roulette';
export type VerificationType = 'manual' | 'automatic';

export interface QuestFilters {
  search: string;
  type: string;
  status: string;
}

export type Quest = Database['public']['Tables']['quests']['Row'];
export type QuestInsert = Database['public']['Tables']['quests']['Insert'];
export type QuestUpdate = Database['public']['Tables']['quests']['Update'];

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
  order_index: number;
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
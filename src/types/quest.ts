import { Database } from './supabase';

export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived';
export type QuestType = 'normal' | 'limited_time' | 'roulette';

export interface QuestFilters {
  search: string;
  type: string;
  status: string;
}

export interface QuestFormData {
  title: string;
  description: string;
  type: string | null;
  platform: string | null;
  points: number | null;
  status: QuestStatus;
  difficulty: number;
  is_important: boolean | null;
  is_limited: boolean | null;
  category: string | null;
  tags: string[] | null;
  exp_reward: number | null;
  is_active: boolean;
  estimated_time: number | null;
  required_points: number | null;
  auto_progress: boolean | null;
  verification_required: boolean | null;
  verification_type: string | null;
  max_attempts: number | null;
  cooldown_period: number | null;
  external_url: string | null;
  start_date: string | null;
  end_date: string | null;
  participants_limit: number | null;
  banner_url: string | null;
  order_position: number | null;
}

export type CreateQuestInput = QuestFormData;
export type UpdateQuestInput = Partial<QuestFormData> & { id: string };
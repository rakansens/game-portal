export type QuestType = 'normal' | 'limited_time' | 'roulette';
export type QuestPlatform = 'discord' | 'x' | string;
export type QuestStatus = 'draft' | 'published' | 'archived';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  platform?: QuestPlatform;
  difficulty: number;
  points: number;
  is_important: boolean;
  is_limited: boolean;
  start_date: string | null;
  end_date: string | null;
  participants_limit: number | null;
  participant_count: number;
  status: QuestStatus;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface QuestProgress {
  id: string;
  quest_id: string;
  user_id: string;
  status: 'in_progress' | 'completed' | 'failed';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestParticipant {
  id: string;
  quest_id: string;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: 'admin' | 'user';
  points: number;
  created_at: string;
  updated_at: string;
}
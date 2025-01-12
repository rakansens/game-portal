import { Quest } from './supabase';

export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived';
export type QuestType = 'normal' | 'limited_time' | 'roulette';
export type VerificationType = 'manual' | 'automatic';

export type QuestFormData = Omit<Quest, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'modified_by'>;
export type CreateQuestInput = Partial<QuestFormData>;
export type UpdateQuestInput = Partial<QuestFormData> & { id: string };

export interface QuestForm extends QuestFormData {
  status: QuestStatus;
  type: QuestType;
  verification_type: VerificationType;
}

export interface QuestFilters {
  search: string;
  type: string;
  status: string;
}
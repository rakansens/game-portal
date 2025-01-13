import { Database } from './database';

// データベースの型から派生した基本型
export type Quest = Database['public']['Tables']['quests']['Row'];
export type QuestProgress = Database['public']['Tables']['quest_progress']['Row'];

// クエストのステータス
export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived';

// クエストの種類
export type QuestType = 'normal' | 'limited_time' | 'roulette';

// プラットフォーム
export type Platform = 'discord' | 'x' | null;

// 進捗ステータス
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

// 検証タイプ
export type VerificationType = 'manual' | 'automatic' | null;

// APIレスポンスの基本型
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ページネーション用の型
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  hasMore: boolean;
}

// フィルター用の型
export interface QuestFilters {
  search?: string;
  type?: QuestType;
  status?: QuestStatus;
  platform?: Platform;
  isLimited?: boolean;
  isImportant?: boolean;
}

// ソート用の型
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// 公開用クエスト型（管理用フィールドを除外）
export interface PublicQuest {
  id: string;
  title: string;
  description: string;
  type: string | null;
  platform: Platform;
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
  verification_type: VerificationType;
  max_attempts: number | null;
  cooldown_period: number | null;
  external_url: string | null;
  banner_url: string | null;
  is_available: boolean;
  progress_status: ProgressStatus;
}

// エラー型
export interface ValidationError {
  path: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
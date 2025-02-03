export interface UserRanking {
  id: string;
  rank: number;
  username: string;
  points: number;
  avatar_url: string | null;
  level: number;
  quest_completed: number;
  user_id: string;
}

export interface RankingFormData {
  user_id: string;
  points: number;
}

export interface RankingResponse {
  id: string;
  rank: number;
  username: string;
  points: number;
  avatar_url: string | null;
  level: number;
  quest_completed: number;
  user_id: string;
}

export interface RankingError {
  error: string;
}
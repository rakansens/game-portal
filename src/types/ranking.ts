export interface RankingUser {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_exp: number;
  total_points: number;
  completed_quests: number;
}

export interface RankingProgress {
  user_id: string;
  quests: {
    exp_reward: number;
    points: number;
  }[];
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  }[];
}

export interface RankingData {
  user_id: string;
  quests: Array<{
    exp_reward: number;
    points: number;
  }>;
  profiles: Array<{
    display_name: string | null;
    avatar_url: string | null;
  }>;
}
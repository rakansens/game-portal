export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          avatar_url?: string;
          level: number;
          exp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          avatar_url?: string;
          level?: number;
          exp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          avatar_url?: string;
          level?: number;
          exp?: number;
          updated_at?: string;
        };
      };
      quests: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: number;
          exp_reward: number;
          category: string;
          tags: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          difficulty: number;
          exp_reward: number;
          category: string;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          difficulty?: number;
          exp_reward?: number;
          category?: string;
          tags?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
      };
      user_quest_progress: {
        Row: {
          id: string;
          user_id: string;
          quest_id: string;
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress: number;
          started_at: string;
          completed_at?: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_id: string;
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress?: number;
          started_at?: string;
          completed_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quest_id?: string;
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress?: number;
          completed_at?: string;
          updated_at?: string;
        };
      };
      gacha_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          rarity: number;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          rarity: number;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          rarity?: number;
          image_url?: string;
        };
      };
      user_gacha_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          obtained_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          obtained_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          obtained_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string | null;
  platform: string | null;
  points: number | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  difficulty: number;
  is_important: boolean;
  is_limited: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  modified_by: string | null;
  completion_rate: number | null;
  participant_count: number | null;
  order_position: number | null;
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
  category: string | null;
  tags: string[] | null;
  exp_reward: number;
  is_active: boolean;
}
export type UserQuestProgress = Tables<'user_quest_progress'>;
export type Profile = Tables<'profiles'>;
export type GachaItem = Tables<'gacha_items'>;
export type UserGachaItem = Tables<'user_gacha_items'> & {
  gacha_items: GachaItem | null;
};

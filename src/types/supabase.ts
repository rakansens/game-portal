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
      quests: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: number;
          reward: number;
          category: string;
          tags: string[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          difficulty: number;
          reward: number;
          category: string;
          tags?: string[];
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          difficulty?: number;
          reward?: number;
          category?: string;
          tags?: string[];
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_quests: {
        Row: {
          id: string;
          user_id: string;
          quest_id: string;
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress: number;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_id: string;
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress?: number;
          started_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quest_id?: string;
          status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
          progress?: number;
          started_at?: string;
          updated_at?: string;
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

export type Quest = Tables<'quests'>;
export type UserQuest = Tables<'user_quests'> & {
  quests: Quest | null;
};

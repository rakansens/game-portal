export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      message_groups: {
        Row: {
          id: string;
          target_users: Json;
          status: string;
          error_message: string | null;
          is_broadcast: boolean;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          target_users?: Json;
          status: string;
          error_message?: string | null;
          is_broadcast?: boolean;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          target_users?: Json;
          status?: string;
          error_message?: string | null;
          is_broadcast?: boolean;
          created_at?: string;
          created_by?: string | null;
        };
      };
      message_logs: {
        Row: {
          id: string;
          message_type: string;
          message_content: Json;
          group_id: string;
          status: string;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_type: string;
          message_content: Json;
          group_id: string;
          status: string;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_type?: string;
          message_content?: Json;
          group_id?: string;
          status?: string;
          error_message?: string | null;
          created_at?: string;
        };
      };
      quests: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          points?: number;
          created_at?: string;
        };
      };
      quest_progress: {
        Row: {
          user_id: string;
          quest_id: string;
          points: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          quest_id: string;
          points?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          quest_id?: string;
          points?: number;
          completed_at?: string | null;
          created_at?: string;
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
}
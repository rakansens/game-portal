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
      quests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          type: string | null
          platform: string | null
          points: number | null
          status: string
          difficulty: number
          is_important: boolean
          is_limited: boolean
          category: string | null
          tags: string[] | null
          exp_reward: number
          start_date: string | null
          end_date: string | null
          participants_limit: number | null
          participant_count: number | null
          order_position: number
          estimated_time: number | null
          required_points: number | null
          auto_progress: boolean
          verification_required: boolean
          verification_type: string | null
          max_attempts: number | null
          cooldown_period: number | null
          external_url: string | null
          banner_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          type?: string | null
          platform?: string | null
          points?: number | null
          status?: string
          difficulty?: number
          is_important?: boolean
          is_limited?: boolean
          category?: string | null
          tags?: string[] | null
          exp_reward?: number
          start_date?: string | null
          end_date?: string | null
          participants_limit?: number | null
          participant_count?: number | null
          order_position?: number
          estimated_time?: number | null
          required_points?: number | null
          auto_progress?: boolean
          verification_required?: boolean
          verification_type?: string | null
          max_attempts?: number | null
          cooldown_period?: number | null
          external_url?: string | null
          banner_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          type?: string | null
          platform?: string | null
          points?: number | null
          status?: string
          difficulty?: number
          is_important?: boolean
          is_limited?: boolean
          category?: string | null
          tags?: string[] | null
          exp_reward?: number
          start_date?: string | null
          end_date?: string | null
          participants_limit?: number | null
          participant_count?: number | null
          order_position?: number
          estimated_time?: number | null
          required_points?: number | null
          auto_progress?: boolean
          verification_required?: boolean
          verification_type?: string | null
          max_attempts?: number | null
          cooldown_period?: number | null
          external_url?: string | null
          banner_url?: string | null
        }
      }
      quest_progress: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          quest_id: string
          user_id: string
          status: string
          started_at: string | null
          completed_at: string | null
          attempts: number
          verification_status: string | null
          verification_data: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          quest_id: string
          user_id: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          attempts?: number
          verification_status?: string | null
          verification_data?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          quest_id?: string
          user_id?: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          attempts?: number
          verification_status?: string | null
          verification_data?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
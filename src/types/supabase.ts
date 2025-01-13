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
          title: string
          description: string
          type: string | null
          platform: string | null
          difficulty: number
          exp_reward: number
          points: number | null
          status: string
          start_date: string | null
          end_date: string | null
          is_limited: boolean
          is_important: boolean
          created_at: string
          updated_at: string
          order_index: number
          tags: string[] | null
          category: string | null
          participants_limit: number | null
          participant_count: number | null
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
          title: string
          description: string
          type?: string | null
          platform?: string | null
          difficulty: number
          exp_reward: number
          points?: number | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          is_limited?: boolean
          is_important?: boolean
          created_at?: string
          updated_at?: string
          order_index?: number
          tags?: string[] | null
          category?: string | null
          participants_limit?: number | null
          participant_count?: number | null
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
          title?: string
          description?: string
          type?: string | null
          platform?: string | null
          difficulty?: number
          exp_reward?: number
          points?: number | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          is_limited?: boolean
          is_important?: boolean
          created_at?: string
          updated_at?: string
          order_index?: number
          tags?: string[] | null
          category?: string | null
          participants_limit?: number | null
          participant_count?: number | null
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
          user_id: string
          quest_id: string
          status: string
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_id: string
          status?: string
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quest_id?: string
          status?: string
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
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

export type Quest = Database['public']['Tables']['quests']['Row']
export type QuestProgress = Database['public']['Tables']['quest_progress']['Row']

export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived'
export type VerificationType = 'manual' | 'automatic'

export interface QuestFormData {
  title: string
  description: string
  type: string | null
  platform: string | null
  difficulty: number
  exp_reward: number
  points: number | null
  status: QuestStatus
  start_date: string | null
  end_date: string | null
  is_limited: boolean
  is_important: boolean
  tags: string[] | null
  category: string | null
  participants_limit: number | null
  participant_count: number | null
  order_index: number
  estimated_time?: number | null
  required_points?: number | null
  auto_progress?: boolean
  verification_required?: boolean
  verification_type?: VerificationType | null
  max_attempts?: number | null
  cooldown_period?: number | null
  external_url?: string | null
  banner_url?: string | null
}

export type UserQuestProgress = QuestProgress & {
  quest: Quest
}

export interface Profile {
  id: string
  user_id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export interface GachaItem {
  id: string
  name: string
  description: string
  rarity: number
  image_url: string
  created_at: string
}

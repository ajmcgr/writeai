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
      content: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_draft: boolean | null
          is_generated: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          is_generated?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          is_generated?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          id: string
          content_id: string
          version: number
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          content_id: string
          version: number
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          content_id?: string
          version?: number
          content?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          daily_uses: number | null
          id: string
          last_use_date: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          daily_uses?: number | null
          id?: string
          last_use_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          daily_uses?: number | null
          id?: string
          last_use_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
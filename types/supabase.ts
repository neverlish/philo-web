export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      collective_post_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      collective_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          philosopher_name: string | null
          prescription_id: string | null
          author_name: string
          likes_count: number
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          philosopher_name?: string | null
          prescription_id?: string | null
          author_name: string
          likes_count?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          philosopher_name?: string | null
          prescription_id?: string | null
          author_name?: string
          likes_count?: number
          created_at?: string | null
        }
        Relationships: []
      }
      ai_prescriptions: {
        Row: {
          id: string
          user_id: string
          conversation_id: string | null
          concern: string
          philosopher_name: string
          philosopher_school: string
          philosopher_era: string
          quote_text: string
          quote_meaning: string
          quote_application: string
          title: string
          subtitle: string
          created_at: string | null
          user_intention: string | null
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id?: string | null
          concern: string
          philosopher_name: string
          philosopher_school: string
          philosopher_era: string
          quote_text: string
          quote_meaning: string
          quote_application: string
          title: string
          subtitle: string
          created_at?: string | null
          user_intention?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string | null
          concern?: string
          philosopher_name?: string
          philosopher_school?: string
          philosopher_era?: string
          quote_text?: string
          quote_meaning?: string
          quote_application?: string
          title?: string
          subtitle?: string
          created_at?: string | null
          user_intention?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prescription_reflections: {
        Row: {
          id: string
          prescription_id: string
          user_id: string
          reflection_text: string
          created_at: string | null
        }
        Insert: {
          id?: string
          prescription_id: string
          user_id: string
          reflection_text: string
          created_at?: string | null
        }
        Update: {
          id?: string
          prescription_id?: string
          user_id?: string
          reflection_text?: string
          created_at?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          initial_concern: string | null
          messages: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          initial_concern?: string | null
          messages?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          initial_concern?: string | null
          messages?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          check_in_date: string
          checked_in_at: string | null
          streak_count: number | null
        }
        Insert: {
          id?: string
          user_id: string
          check_in_date: string
          checked_in_at?: string | null
          streak_count?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          check_in_date?: string
          checked_in_at?: string | null
          streak_count?: number | null
        }
        Relationships: []
      }
      concerns: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_custom: boolean | null
          text: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_custom?: boolean | null
          text: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_custom?: boolean | null
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      philosophers: {
        Row: {
          application: string | null
          core_idea: string
          created_at: string | null
          description: string | null
          era: string
          id: string
          image_url: string | null
          keywords: string[] | null
          name: string
          name_en: string
          region: string
          updated_at: string | null
          years: string | null
        }
        Insert: {
          application?: string | null
          core_idea: string
          created_at?: string | null
          description?: string | null
          era: string
          id?: string
          image_url?: string | null
          keywords?: string[] | null
          name: string
          name_en: string
          region: string
          updated_at?: string | null
          years?: string | null
        }
        Update: {
          application?: string | null
          core_idea?: string
          created_at?: string | null
          description?: string | null
          era?: string
          id?: string
          image_url?: string | null
          keywords?: string[] | null
          name?: string
          name_en?: string
          region?: string
          updated_at?: string | null
          years?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          application: string
          book: string | null
          category: string | null
          concerns: string[] | null
          created_at: string | null
          date_scheduled: string | null
          id: string
          meaning: string
          philosopher_id: string
          text: string
          updated_at: string | null
        }
        Insert: {
          application: string
          book?: string | null
          category?: string | null
          concerns?: string[] | null
          created_at?: string | null
          date_scheduled?: string | null
          id?: string
          meaning: string
          philosopher_id: string
          text: string
          updated_at?: string | null
        }
        Update: {
          application?: string
          book?: string | null
          category?: string | null
          concerns?: string[] | null
          created_at?: string | null
          date_scheduled?: string | null
          id?: string
          meaning?: string
          philosopher_id?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_read_quotes: {
        Row: {
          id: string
          quote_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          quote_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          quote_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_saved_philosophers: {
        Row: {
          created_at: string | null
          id: string
          philosopher_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          philosopher_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          philosopher_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_saved_prescriptions: {
        Row: {
          id: string
          user_id: string
          prescription_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prescription_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prescription_id?: string
          saved_at?: string
        }
        Relationships: []
      }
      user_saved_quotes: {
        Row: {
          created_at: string | null
          id: string
          quote_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          quote_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          quote_id?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          current_concerns: string[] | null
          email: string | null
          id: string
          interests: string[] | null
          nickname: string | null
          onboarded: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_concerns?: string[] | null
          email?: string | null
          id: string
          interests?: string[] | null
          nickname?: string | null
          onboarded?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_concerns?: string[] | null
          email?: string | null
          id?: string
          interests?: string[] | null
          nickname?: string | null
          onboarded?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

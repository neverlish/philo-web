export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_prescriptions: {
        Row: {
          concern: string
          conversation_id: string | null
          created_at: string | null
          id: string
          philosopher_era: string
          philosopher_name: string
          philosopher_school: string
          quote_application: string
          quote_meaning: string
          quote_text: string
          subtitle: string
          theme_tags: string[] | null
          title: string
          user_id: string
          user_intention: string | null
        }
        Insert: {
          concern: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          philosopher_era: string
          philosopher_name: string
          philosopher_school: string
          quote_application: string
          quote_meaning: string
          quote_text: string
          subtitle: string
          theme_tags?: string[] | null
          title: string
          user_id: string
          user_intention?: string | null
        }
        Update: {
          concern?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          philosopher_era?: string
          philosopher_name?: string
          philosopher_school?: string
          quote_application?: string
          quote_meaning?: string
          quote_text?: string
          subtitle?: string
          theme_tags?: string[] | null
          title?: string
          user_id?: string
          user_intention?: string | null
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          check_in_date: string
          checked_in_at: string | null
          id: string
          streak_count: number | null
          user_id: string
        }
        Insert: {
          check_in_date?: string
          checked_in_at?: string | null
          id?: string
          streak_count?: number | null
          user_id: string
        }
        Update: {
          check_in_date?: string
          checked_in_at?: string | null
          id?: string
          streak_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collective_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collective_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "collective_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      collective_posts: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          likes_count: number
          philosopher_name: string | null
          prescription_id: string | null
          user_id: string
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          philosopher_name?: string | null
          prescription_id?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          philosopher_name?: string | null
          prescription_id?: string | null
          user_id?: string
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
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          prescription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          prescription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          prescription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "ai_prescriptions"
            referencedColumns: ["id"]
          },
        ]
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
      prescription_reflections: {
        Row: {
          created_at: string | null
          id: string
          prescription_id: string
          reflection_text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prescription_id: string
          reflection_text: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prescription_id?: string
          reflection_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_reflections_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "ai_prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_id?: string
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
        Relationships: [
          {
            foreignKeyName: "quotes_philosopher_id_fkey"
            columns: ["philosopher_id"]
            isOneToOne: false
            referencedRelation: "philosophers"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_read_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_read_quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_saved_philosophers_philosopher_id_fkey"
            columns: ["philosopher_id"]
            isOneToOne: false
            referencedRelation: "philosophers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_philosophers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_prescriptions: {
        Row: {
          id: string
          prescription_id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          prescription_id: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          prescription_id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_prescriptions_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "ai_prescriptions"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_saved_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

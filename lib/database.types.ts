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
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          theme: 'light' | 'dark' | 'auto'
          background_style: 'solid' | 'gradient' | 'dots'
          background_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: 'light' | 'dark' | 'auto'
          background_style?: 'solid' | 'gradient' | 'dots'
          background_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: 'light' | 'dark' | 'auto'
          background_style?: 'solid' | 'gradient' | 'dots'
          background_color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          profile_id: string
          title: string
          url: string
          type: 'link' | 'product'
          price: number | null
          currency: string | null
          image_url: string | null
          gradient_style: 'none' | 'gradient-1' | 'gradient-2' | 'gradient-3' | 'gradient-4'
          icon: string | null
          position: number
          is_active: boolean
          clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          url: string
          type?: 'link' | 'product'
          price?: number | null
          currency?: string | null
          image_url?: string | null
          gradient_style?: 'none' | 'gradient-1' | 'gradient-2' | 'gradient-3' | 'gradient-4'
          icon?: string | null
          position?: number
          is_active?: boolean
          clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          url?: string
          type?: 'link' | 'product'
          price?: number | null
          currency?: string | null
          image_url?: string | null
          gradient_style?: 'none' | 'gradient-1' | 'gradient-2' | 'gradient-3' | 'gradient-4'
          icon?: string | null
          position?: number
          is_active?: boolean
          clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          profile_id: string
          platform: string
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          platform: string
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          platform?: string
          url?: string
          position?: number
          created_at?: string
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Link = Tables<'links'>
export type SocialLink = Tables<'social_links'>

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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          image?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          times_used: number
          usage_limit: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          times_used?: number
          usage_limit?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          times_used?: number
          usage_limit?: number | null
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          active: boolean
          content_blocks: Json | null
          created_at: string | null
          ends_at: string | null
          hero_image: string | null
          slug: string
          starts_at: string | null
          title: string
        }
        Insert: {
          active?: boolean
          content_blocks?: Json | null
          created_at?: string | null
          ends_at?: string | null
          hero_image?: string | null
          slug: string
          starts_at?: string | null
          title: string
        }
        Update: {
          active?: boolean
          content_blocks?: Json | null
          created_at?: string | null
          ends_at?: string | null
          hero_image?: string | null
          slug?: string
          starts_at?: string | null
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          coupon_code: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount: number
          id: string
          items: Json
          notes: string | null
          shipping: number
          status: string
          subtotal: number
          total: number
          tracking_token: string
          wilaya_code: string
          wilaya_name: string
        }
        Insert: {
          address: string
          coupon_code?: string | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount?: number
          id?: string
          items: Json
          notes?: string | null
          shipping: number
          status?: string
          subtotal: number
          total: number
          tracking_token?: string
          wilaya_code: string
          wilaya_name: string
        }
        Update: {
          address?: string
          coupon_code?: string | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount?: number
          id?: string
          items?: Json
          notes?: string | null
          shipping?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_token?: string
          wilaya_code?: string
          wilaya_name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          availability: string
          brand: string
          category: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          features: string[] | null
          id: string
          image: string
          low_stock_threshold: number
          name: string
          price: number
          short_description: string | null
          slug: string
          specifications: Json | null
          stock_quantity: number
        }
        Insert: {
          availability?: string
          brand: string
          category: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id: string
          image: string
          low_stock_threshold?: number
          name: string
          price: number
          short_description?: string | null
          slug: string
          specifications?: Json | null
          stock_quantity?: number
        }
        Update: {
          availability?: string
          brand?: string
          category?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image?: string
          low_stock_threshold?: number
          name?: string
          price?: number
          short_description?: string | null
          slug?: string
          specifications?: Json | null
          stock_quantity?: number
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      wilayas: {
        Row: {
          code: string
          name_ar: string
          name_fr: string
          shipping_price: number
        }
        Insert: {
          code: string
          name_ar: string
          name_fr: string
          shipping_price?: number
        }
        Update: {
          code?: string
          name_ar?: string
          name_fr?: string
          shipping_price?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      track_order: {
        Args: { p_phone: string; p_token: string }
        Returns: {
          address: string
          coupon_code: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount: number
          id: string
          items: Json
          notes: string | null
          shipping: number
          status: string
          subtotal: number
          total: number
          tracking_token: string
          wilaya_code: string
          wilaya_name: string
        }[]
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      validate_coupon: {
        Args: { coupon_code: string; order_subtotal: number }
        Returns: {
          discount_type: string
          discount_value: number
          message: string
          valid: boolean
        }[]
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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

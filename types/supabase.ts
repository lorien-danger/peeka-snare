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
      code_trigger: {
        Row: {
          browser: string | null
          browser_fingerprint: string | null
          city: string | null
          country_code: string | null
          device_brand: string | null
          device_model: string | null
          ip_address: string
          is_bot: boolean | null
          is_mobile: boolean | null
          isp: string | null
          latitude: number | null
          longitude: number | null
          operating_system: string | null
          proxy: boolean | null
          region: string | null
          tor: boolean | null
          tracking_code: string
          triggered_at: string
          user_agent: string | null
          uuid: string
          vpn: boolean | null
        }
        Insert: {
          browser?: string | null
          browser_fingerprint?: string | null
          city?: string | null
          country_code?: string | null
          device_brand?: string | null
          device_model?: string | null
          ip_address: string
          is_bot?: boolean | null
          is_mobile?: boolean | null
          isp?: string | null
          latitude?: number | null
          longitude?: number | null
          operating_system?: string | null
          proxy?: boolean | null
          region?: string | null
          tor?: boolean | null
          tracking_code: string
          triggered_at?: string
          user_agent?: string | null
          uuid?: string
          vpn?: boolean | null
        }
        Update: {
          browser?: string | null
          browser_fingerprint?: string | null
          city?: string | null
          country_code?: string | null
          device_brand?: string | null
          device_model?: string | null
          ip_address?: string
          is_bot?: boolean | null
          is_mobile?: boolean | null
          isp?: string | null
          latitude?: number | null
          longitude?: number | null
          operating_system?: string | null
          proxy?: boolean | null
          region?: string | null
          tor?: boolean | null
          tracking_code?: string
          triggered_at?: string
          user_agent?: string | null
          uuid?: string
          vpn?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "code_trigger_tracking_code_fkey"
            columns: ["tracking_code"]
            isOneToOne: false
            referencedRelation: "tracking_code"
            referencedColumns: ["code"]
          }
        ]
      }
      tracking_code: {
        Row: {
          code: string
          created_at: string
          file_name: string
          file_size: number | null
          type: Database["public"]["Enums"]["file_type"] | null
        }
        Insert: {
          code: string
          created_at?: string
          file_name: string
          file_size?: number | null
          type?: Database["public"]["Enums"]["file_type"] | null
        }
        Update: {
          code?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          type?: Database["public"]["Enums"]["file_type"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_tracking_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      file_extension: "png" | "jpg" | "mov" | "mp4" | "pdf" | "docx" | "doc"
      file_type: "image" | "video" | "document" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

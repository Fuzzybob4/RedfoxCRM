export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          owner_id?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          company: string | null
          notes: string | null
          created_at: string
          updated_at: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          company?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          company?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          customer_id: string
          amount: number
          due_date: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          amount: number
          due_date: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          amount?: number
          due_date?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity?: number
          unit_price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          total?: number
          created_at?: string
        }
      }
      estimates: {
        Row: {
          id: string
          customer_id: string
          amount: number
          description: string | null
          status: string
          valid_until: string | null
          created_at: string
          updated_at: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          amount: number
          description?: string | null
          status?: string
          valid_until?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          amount?: number
          description?: string | null
          status?: string
          valid_until?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          customer_id: string | null
          status: string
          priority: string
          budget: number | null
          progress: number
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          customer_id?: string | null
          status?: string
          priority?: string
          budget?: number | null
          progress?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          customer_id?: string | null
          status?: string
          priority?: string
          budget?: number | null
          progress?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
          organization_id?: string | null
        }
      }
      company_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          business_type: string | null
          company_size: string | null
          phone_number: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          business_type?: string | null
          company_size?: string | null
          phone_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          business_type?: string | null
          company_size?: string | null
          phone_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          website?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

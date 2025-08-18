export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone_number: string | null
          company_name: string | null
          subscription_type: string | null
          billing_period: string | null
          cost: number | null
          default_org: string | null
          job_title: string | null
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone_number?: string | null
          company_name?: string | null
          subscription_type?: string | null
          billing_period?: string | null
          cost?: number | null
          default_org?: string | null
          job_title?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone_number?: string | null
          company_name?: string | null
          subscription_type?: string | null
          billing_period?: string | null
          cost?: number | null
          default_org?: string | null
          job_title?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

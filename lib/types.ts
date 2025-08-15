export interface Customer {
  id: string
  org_id: string
  owner_id?: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  lead_status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
  customer_type: "residential" | "commercial"
  source?: string
  notes?: string
  tags?: string[]
  custom_fields?: Record<string, any>
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Organization {
  id: string
  name: string
  plan: "free" | "pro" | "business" | "enterprise"
  address?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  stripe_customer_id?: string
  owner_id: string
  settings?: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  org_id: string
  user_id: string
  role: "owner" | "admin" | "manager" | "employee" | "viewer"
  department?: string
  job_title?: string
  permissions?: Record<string, any>
  is_active: boolean
  hired_date?: string
  terminated_date?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  org_id: string
  customer_id: string
  assigned_to?: string
  name: string
  description?: string
  project_type: "lighting" | "landscaping" | "maintenance" | "other"
  status: "planning" | "in_progress" | "completed" | "cancelled" | "on_hold"
  start_date?: string
  end_date?: string
  estimated_hours?: number
  actual_hours?: number
  budget?: number
  actual_cost?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Estimate {
  id: string
  org_id: string
  customer_id: string
  project_id?: string
  created_by?: string
  estimate_number: string
  title: string
  description?: string
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired"
  subtotal: number
  tax_rate: number
  tax_amount: number
  total_amount: number
  valid_until?: string
  notes?: string
  terms?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  org_id: string
  customer_id: string
  project_id?: string
  estimate_id?: string
  created_by?: string
  invoice_number: string
  title: string
  description?: string
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
  subtotal: number
  tax_rate: number
  tax_amount: number
  total_amount: number
  amount_paid: number
  due_date?: string
  paid_date?: string
  notes?: string
  terms?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  org_id: string
  name: string
  description?: string
  category?: string
  unit_price: number
  cost: number
  unit: string
  is_service: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LineItem {
  id: string
  org_id: string
  estimate_id?: string
  invoice_id?: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number
  total: number
  sort_order: number
  created_at: string
}

export interface ActivityLog {
  id: string
  org_id: string
  user_id?: string
  entity_type: string
  entity_id: string
  action: string
  description?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface Invite {
  id: string
  org_id: string
  email: string
  role: "admin" | "manager" | "employee" | "viewer"
  department?: string
  job_title?: string
  invited_name?: string
  invited_by?: string
  accepted_at?: string
  expires_at: string
  created_at: string
}

export interface Profile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  default_org?: string
  job_title?: string
  department?: string
  created_at: string
  updated_at: string
}

// Role-based permission helpers
export const ROLE_PERMISSIONS = {
  owner: {
    canManageOrg: true,
    canManageEmployees: true,
    canManageCustomers: true,
    canManageProjects: true,
    canManageFinancials: true,
    canViewReports: true,
    canManageSettings: true,
  },
  admin: {
    canManageOrg: false,
    canManageEmployees: true,
    canManageCustomers: true,
    canManageProjects: true,
    canManageFinancials: true,
    canViewReports: true,
    canManageSettings: true,
  },
  manager: {
    canManageOrg: false,
    canManageEmployees: false,
    canManageCustomers: true,
    canManageProjects: true,
    canManageFinancials: true,
    canViewReports: true,
    canManageSettings: false,
  },
  employee: {
    canManageOrg: false,
    canManageEmployees: false,
    canManageCustomers: true, // Only assigned customers
    canManageProjects: true, // Only assigned projects
    canManageFinancials: false,
    canViewReports: false,
    canManageSettings: false,
  },
  viewer: {
    canManageOrg: false,
    canManageEmployees: false,
    canManageCustomers: false,
    canManageProjects: false,
    canManageFinancials: false,
    canViewReports: true,
    canManageSettings: false,
  },
} as const

export type Role = keyof typeof ROLE_PERMISSIONS
export type Permission = keyof typeof ROLE_PERMISSIONS.owner

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

export function canAccessCustomer(userRole: Role, customerOwnerId?: string, userId?: string): boolean {
  if (userRole === "owner" || userRole === "admin" || userRole === "manager") {
    return true
  }
  if (userRole === "employee" && customerOwnerId === userId) {
    return true
  }
  return false
}

export function canAccessProject(userRole: Role, projectAssignedTo?: string, userId?: string): boolean {
  if (userRole === "owner" || userRole === "admin" || userRole === "manager") {
    return true
  }
  if (userRole === "employee" && projectAssignedTo === userId) {
    return true
  }
  return false
}

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          plan: "free" | "pro" | "business" | "enterprise"
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          stripe_customer_id: string | null
          owner_id: string
          settings: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: "free" | "pro" | "business" | "enterprise"
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          stripe_customer_id?: string | null
          owner_id: string
          settings?: Record<string, any>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: "free" | "pro" | "business" | "enterprise"
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          stripe_customer_id?: string | null
          owner_id?: string
          settings?: Record<string, any>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      memberships: {
        Row: {
          id: string
          org_id: string
          user_id: string
          role: "owner" | "admin" | "manager" | "employee" | "viewer"
          department: string | null
          job_title: string | null
          permissions: Record<string, any>
          is_active: boolean
          hired_date: string | null
          terminated_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          user_id: string
          role?: "owner" | "admin" | "manager" | "employee" | "viewer"
          department?: string | null
          job_title?: string | null
          permissions?: Record<string, any>
          is_active?: boolean
          hired_date?: string | null
          terminated_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string
          role?: "owner" | "admin" | "manager" | "employee" | "viewer"
          department?: string | null
          job_title?: string | null
          permissions?: Record<string, any>
          is_active?: boolean
          hired_date?: string | null
          terminated_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invites: {
        Row: {
          id: string
          org_id: string
          email: string
          role: "admin" | "manager" | "employee" | "viewer"
          department: string | null
          job_title: string | null
          invited_name: string | null
          invited_by: string
          accepted_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          email: string
          role?: "admin" | "manager" | "employee" | "viewer"
          department?: string | null
          job_title?: string | null
          invited_name?: string | null
          invited_by: string
          accepted_at?: string | null
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          email?: string
          role?: "admin" | "manager" | "employee" | "viewer"
          department?: string | null
          job_title?: string | null
          invited_name?: string | null
          invited_by?: string
          accepted_at?: string | null
          expires_at?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          org_id: string
          owner_id: string | null
          first_name: string
          last_name: string
          email: string | null
          phone_number: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          lead_status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
          customer_type: "residential" | "commercial"
          source: string | null
          notes: string | null
          tags: string[] | null
          custom_fields: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          owner_id?: string | null
          first_name: string
          last_name: string
          email?: string | null
          phone_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          lead_status?: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
          customer_type?: "residential" | "commercial"
          source?: string | null
          notes?: string | null
          tags?: string[] | null
          custom_fields?: Record<string, any>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          owner_id?: string | null
          first_name?: string
          last_name?: string
          email?: string | null
          phone_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          lead_status?: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
          customer_type?: "residential" | "commercial"
          source?: string | null
          notes?: string | null
          tags?: string[] | null
          custom_fields?: Record<string, any>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
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

// Convenience types
export type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"]
export type MembershipRow = Database["public"]["Tables"]["memberships"]["Row"]
export type InviteRow = Database["public"]["Tables"]["invites"]["Row"]
export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"]
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type InsertOrganization = Database["public"]["Tables"]["organizations"]["Insert"]
export type InsertMembership = Database["public"]["Tables"]["memberships"]["Insert"]
export type InsertInvite = Database["public"]["Tables"]["invites"]["Insert"]
export type InsertCustomer = Database["public"]["Tables"]["customers"]["Insert"]
export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"]

// User roles
export type UserRole = "owner" | "admin" | "manager" | "employee" | "viewer"

// Lead status
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"

// Customer type
export type CustomerType = "residential" | "commercial"

// Plan types
export type PlanType = "free" | "pro" | "business" | "enterprise"

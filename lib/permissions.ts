export type UserRole = "super_admin" | "admin" | "manager" | "user" | "viewer"

export interface Permission {
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

type Feature =
  | "dashboard"
  | "customers"
  | "invoices"
  | "estimates"
  | "projects"
  | "reports"
  | "mapping"
  | "scheduling"
  | "products"
  | "sales"
  | "settings"
  | "admin"
  | "billing"
  | "users"
  | "resources"

const fullAccess: Permission = { canView: true, canCreate: true, canEdit: true, canDelete: true }
const viewOnly: Permission = { canView: true, canCreate: false, canEdit: false, canDelete: false }
const noAccess: Permission = { canView: false, canCreate: false, canEdit: false, canDelete: false }
const createEdit: Permission = { canView: true, canCreate: true, canEdit: true, canDelete: false }

const allFeatures: Feature[] = [
  "dashboard",
  "customers",
  "invoices",
  "estimates",
  "projects",
  "reports",
  "mapping",
  "scheduling",
  "products",
  "sales",
  "settings",
  "admin",
  "billing",
  "users",
  "resources",
]

export const rolePermissions: Record<UserRole, Record<Feature, Permission>> = {
  super_admin: Object.fromEntries(allFeatures.map((f) => [f, fullAccess])) as Record<Feature, Permission>,

  admin: {
    ...Object.fromEntries(allFeatures.map((f) => [f, fullAccess])),
    billing: viewOnly,
    users: createEdit,
  } as Record<Feature, Permission>,

  manager: {
    dashboard: createEdit,
    customers: createEdit,
    invoices: createEdit,
    estimates: fullAccess,
    projects: createEdit,
    reports: viewOnly,
    mapping: createEdit,
    scheduling: fullAccess,
    products: createEdit,
    sales: createEdit,
    settings: viewOnly,
    admin: noAccess,
    billing: noAccess,
    users: viewOnly,
    resources: createEdit,
  },

  user: {
    dashboard: createEdit,
    customers: createEdit,
    invoices: viewOnly,
    estimates: createEdit,
    projects: createEdit,
    reports: viewOnly,
    mapping: viewOnly,
    scheduling: createEdit,
    products: viewOnly,
    sales: viewOnly,
    settings: viewOnly,
    admin: noAccess,
    billing: noAccess,
    users: noAccess,
    resources: viewOnly,
  },

  viewer: {
    dashboard: viewOnly,
    customers: viewOnly,
    invoices: viewOnly,
    estimates: viewOnly,
    projects: viewOnly,
    reports: viewOnly,
    mapping: viewOnly,
    scheduling: viewOnly,
    products: viewOnly,
    sales: viewOnly,
    settings: noAccess,
    admin: noAccess,
    billing: noAccess,
    users: noAccess,
    resources: viewOnly,
  },
}

export function hasPermission(role: UserRole, feature: Feature, action: keyof Permission): boolean {
  return rolePermissions[role]?.[feature]?.[action] ?? false
}

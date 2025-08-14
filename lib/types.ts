export interface Customer {
  id: number
  owner_id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  city: string
  state: string
  zip: string
  lead_status: string
  created_at?: string
  updated_at?: string
}

// Next.js 15 async params types
export type PageProps<T = any> = {
  params: Promise<T>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export type DynamicPageProps<T = { [key: string]: string }> = PageProps<T>

// Common param types
export interface UserIdParams {
  userId: string
}

export interface ReportParams {
  reportId?: string
}

// Utility function to handle async params
export async function resolveParams<T>(params: Promise<T>): Promise<T> {
  return await params
}

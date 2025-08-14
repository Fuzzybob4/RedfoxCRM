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


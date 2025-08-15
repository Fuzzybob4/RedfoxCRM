-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (Business entities)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  stripe_customer_id TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee/User memberships within organizations
CREATE TABLE IF NOT EXISTS memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'employee', 'viewer')),
  department TEXT,
  job_title TEXT,
  permissions JSONB DEFAULT '{}', -- Custom permissions per user
  is_active BOOLEAN DEFAULT true,
  hired_date DATE,
  terminated_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Employee invitations
CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'viewer')),
  department TEXT,
  job_title TEXT,
  invited_name TEXT,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, email)
);

-- Customers table (per organization)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id), -- Employee who manages this customer
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  customer_type TEXT DEFAULT 'residential' CHECK (customer_type IN ('residential', 'commercial')),
  source TEXT, -- How they found us
  notes TEXT,
  tags TEXT[], -- Array of tags
  custom_fields JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id), -- Employee assigned to project
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT DEFAULT 'lighting' CHECK (project_type IN ('lighting', 'landscaping', 'maintenance', 'other')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled', 'on_hold')),
  start_date DATE,
  end_date DATE,
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),
  budget DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estimates/Quotes table
CREATE TABLE IF NOT EXISTS estimates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  estimate_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, estimate_number)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  invoice_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, invoice_number)
);

-- Products/Services table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit_price DECIMAL(10,2) DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  unit TEXT DEFAULT 'each',
  is_service BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Line items for estimates and invoices
CREATE TABLE IF NOT EXISTS line_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((estimate_id IS NOT NULL AND invoice_id IS NULL) OR (estimate_id IS NULL AND invoice_id IS NOT NULL))
);

-- Activity/Audit log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL, -- 'customer', 'project', 'invoice', etc.
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'viewed'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add default_org to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS default_org UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and admins can update organizations" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true
    )
  );

-- RLS Policies for Memberships
CREATE POLICY "Users can view memberships for their organizations" ON memberships
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Owners and admins can manage memberships" ON memberships
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true
    )
  );

-- RLS Policies for Customers
CREATE POLICY "Users can view customers in their organization" ON customers
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage customers based on role" ON customers
  FOR ALL USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND (
        m.role IN ('owner', 'admin', 'manager') OR
        (m.role = 'employee' AND owner_id = auth.uid())
      )
    )
  );

-- RLS Policies for Projects
CREATE POLICY "Users can view projects in their organization" ON projects
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage projects based on role and assignment" ON projects
  FOR ALL USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND (
        m.role IN ('owner', 'admin', 'manager') OR
        (m.role = 'employee' AND assigned_to = auth.uid())
      )
    )
  );

-- RLS Policies for Estimates
CREATE POLICY "Users can view estimates in their organization" ON estimates
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage estimates based on role" ON estimates
  FOR ALL USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND m.role IN ('owner', 'admin', 'manager', 'employee')
    )
  );

-- RLS Policies for Invoices
CREATE POLICY "Users can view invoices in their organization" ON invoices
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage invoices based on role" ON invoices
  FOR ALL USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND m.role IN ('owner', 'admin', 'manager', 'employee')
    )
  );

-- RLS Policies for Products
CREATE POLICY "Users can view products in their organization" ON products
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins and managers can manage products" ON products
  FOR ALL USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND m.role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for Line Items
CREATE POLICY "Users can view line items for accessible estimates/invoices" ON line_items
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can manage line items based on role" ON line_items
  FOR ALL USING (
    org_id IN (
      SELECT m.org_id FROM memberships m
      WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND m.role IN ('owner', 'admin', 'manager', 'employee')
    )
  );

-- RLS Policies for Activity Log
CREATE POLICY "Users can view activity log for their organization" ON activity_log
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "System can insert activity log" ON activity_log
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Invites
CREATE POLICY "Users can view invites for their organizations" ON invites
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Owners and admins can manage invites" ON invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_memberships_active ON memberships(is_active);
CREATE INDEX IF NOT EXISTS idx_customers_org_id ON customers(org_id);
CREATE INDEX IF NOT EXISTS idx_customers_owner_id ON customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_estimates_org_id ON estimates(org_id);
CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_products_org_id ON products(org_id);
CREATE INDEX IF NOT EXISTS idx_line_items_estimate_id ON line_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_line_items_invoice_id ON line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_org_id ON activity_log(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_invites_org_id ON invites(org_id);
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);
CREATE INDEX IF NOT EXISTS idx_profiles_default_org ON profiles(default_org);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to deactivate employee access
CREATE OR REPLACE FUNCTION deactivate_employee(
  p_org_id UUID,
  p_user_id UUID,
  p_terminated_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the person doing the termination has permission
  IF NOT EXISTS (
    SELECT 1 FROM memberships 
    WHERE org_id = p_org_id 
    AND user_id = p_terminated_by 
    AND role IN ('owner', 'admin') 
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to terminate employee';
  END IF;

  -- Deactivate the membership
  UPDATE memberships 
  SET 
    is_active = false,
    terminated_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE org_id = p_org_id AND user_id = p_user_id;

  -- Log the activity
  INSERT INTO activity_log (org_id, user_id, entity_type, entity_id, action, description)
  VALUES (
    p_org_id, 
    p_terminated_by, 
    'membership', 
    p_user_id, 
    'deactivated', 
    'Employee access terminated'
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reactivate employee access
CREATE OR REPLACE FUNCTION reactivate_employee(
  p_org_id UUID,
  p_user_id UUID,
  p_reactivated_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the person doing the reactivation has permission
  IF NOT EXISTS (
    SELECT 1 FROM memberships 
    WHERE org_id = p_org_id 
    AND user_id = p_reactivated_by 
    AND role IN ('owner', 'admin') 
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to reactivate employee';
  END IF;

  -- Reactivate the membership
  UPDATE memberships 
  SET 
    is_active = true,
    terminated_date = NULL,
    updated_at = NOW()
  WHERE org_id = p_org_id AND user_id = p_user_id;

  -- Log the activity
  INSERT INTO activity_log (org_id, user_id, entity_type, entity_id, action, description)
  VALUES (
    p_org_id, 
    p_reactivated_by, 
    'membership', 
    p_user_id, 
    'reactivated', 
    'Employee access restored'
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity automatically
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (
    org_id, 
    user_id, 
    entity_type, 
    entity_id, 
    action, 
    description,
    metadata
  )
  VALUES (
    COALESCE(NEW.org_id, OLD.org_id),
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      WHEN TG_OP = 'DELETE' THEN 'deleted'
    END,
    CASE 
      WHEN TG_OP = 'INSERT' THEN TG_TABLE_NAME || ' created'
      WHEN TG_OP = 'UPDATE' THEN TG_TABLE_NAME || ' updated'
      WHEN TG_OP = 'DELETE' THEN TG_TABLE_NAME || ' deleted'
    END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create activity logging triggers
CREATE TRIGGER log_customers_activity AFTER INSERT OR UPDATE OR DELETE ON customers FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_projects_activity AFTER INSERT OR UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_estimates_activity AFTER INSERT OR UPDATE OR DELETE ON estimates FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_invoices_activity AFTER INSERT OR UPDATE OR DELETE ON invoices FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Insert some default data for testing (optional)
-- You can remove this section if you don't want test data

-- Default product categories for lighting/landscaping business
INSERT INTO products (org_id, name, description, category, unit_price, is_service) 
SELECT 
  o.id,
  product.name,
  product.description,
  product.category,
  product.unit_price,
  product.is_service
FROM organizations o
CROSS JOIN (
  VALUES 
    ('Holiday Light Installation', 'Professional holiday lighting installation service', 'Lighting', 150.00, true),
    ('Holiday Light Removal', 'Safe removal and storage of holiday lights', 'Lighting', 75.00, true),
    ('Landscape Design', 'Custom landscape design consultation', 'Landscaping', 200.00, true),
    ('Tree Trimming', 'Professional tree trimming and pruning', 'Landscaping', 100.00, true),
    ('LED String Lights', 'Commercial grade LED string lights', 'Products', 25.00, false),
    ('Extension Cords', 'Outdoor rated extension cords', 'Products', 15.00, false),
    ('Timers', 'Programmable outdoor timers', 'Products', 30.00, false)
) AS product(name, description, category, unit_price, is_service)
WHERE o.created_at > NOW() - INTERVAL '1 hour'; -- Only for newly created orgs

COMMENT ON TABLE organizations IS 'Business entities that use the CRM system';
COMMENT ON TABLE memberships IS 'Employee relationships to organizations with roles and permissions';
COMMENT ON TABLE customers IS 'Customer database per organization with lead tracking';
COMMENT ON TABLE projects IS 'Projects/jobs for customers with assignment tracking';
COMMENT ON TABLE estimates IS 'Quotes and estimates sent to customers';
COMMENT ON TABLE invoices IS 'Invoices and billing for completed work';
COMMENT ON TABLE products IS 'Products and services offered by the organization';
COMMENT ON TABLE activity_log IS 'Audit trail of all system activities';
COMMENT ON FUNCTION deactivate_employee IS 'Safely removes employee access while preserving data';
COMMENT ON FUNCTION reactivate_employee IS 'Restores employee access to the system';

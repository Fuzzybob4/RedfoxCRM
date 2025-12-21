-- RedFox CRM MVP Tables
-- Run this script to create all missing tables for a working MVP

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoices from their organization" ON invoices
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create invoices for their organization" ON invoices
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update invoices from their organization" ON invoices
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete invoices from their organization" ON invoices
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

-- ============================================
-- ESTIMATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  estimate_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estimates RLS
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view estimates from their organization" ON estimates
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create estimates for their organization" ON estimates
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update estimates from their organization" ON estimates
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete estimates from their organization" ON estimates
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects from their organization" ON projects
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create projects for their organization" ON projects
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update projects from their organization" ON projects
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete projects from their organization" ON projects
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'each',
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products from their organization" ON products
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create products for their organization" ON products
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update products from their organization" ON products
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete products from their organization" ON products
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid())
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_estimates_org_id ON estimates(org_id);
CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);

CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_products_org_id ON products(org_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

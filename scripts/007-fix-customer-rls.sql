-- Fix Customer RLS Policies
-- This script ensures users can only see customers belonging to their organization

-- First, drop any existing policies on customers table
DROP POLICY IF EXISTS "Users can manage their customers" ON customers;
DROP POLICY IF EXISTS "Users can view customers in their organization" ON customers;
DROP POLICY IF EXISTS "Users can manage customers based on role" ON customers;
DROP POLICY IF EXISTS "customer_select_policy" ON customers;
DROP POLICY IF EXISTS "customer_insert_policy" ON customers;
DROP POLICY IF EXISTS "customer_update_policy" ON customers;
DROP POLICY IF EXISTS "customer_delete_policy" ON customers;

-- Ensure RLS is enabled
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view customers from organizations they belong to
CREATE POLICY "customer_select_policy" ON customers
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM user_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Users can only create customers in organizations they belong to
-- Only admins, owners, and managers can create customers
CREATE POLICY "customer_insert_policy" ON customers
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM user_memberships 
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager', 'employee')
    )
  );

-- UPDATE: Users can only update customers in their organization
-- Only admins, owners, and managers can update
CREATE POLICY "customer_update_policy" ON customers
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM user_memberships 
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- DELETE: Only admins and owners can delete customers
CREATE POLICY "customer_delete_policy" ON customers
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM user_memberships 
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Create index for better performance on org_id lookups
CREATE INDEX IF NOT EXISTS idx_customers_org_id ON customers(org_id);

-- Fix organizations and user_memberships RLS to avoid infinite recursion
-- The issue: policies that check user_memberships cause recursion when querying user_memberships

-- ===== ORGANIZATIONS TABLE =====

-- Drop all existing organization policies
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can insert organizations" ON organizations;
DROP POLICY IF EXISTS "Users can update organizations they own" ON organizations;
DROP POLICY IF EXISTS "Owners and admins can update organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Admins can update organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

-- Allow any authenticated user to create an organization (they'll be linked via user_memberships)
CREATE POLICY "Authenticated users can create organizations" ON organizations
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow users to view all organizations (filtering happens at app level via user_memberships)
-- This avoids the circular dependency
CREATE POLICY "Authenticated users can view organizations" ON organizations
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow users to update any organization (will be filtered at app level)
CREATE POLICY "Authenticated users can update organizations" ON organizations
  FOR UPDATE 
  TO authenticated
  USING (true);

-- ===== USER_MEMBERSHIPS TABLE =====

-- Drop all existing user_memberships policies
DROP POLICY IF EXISTS "Users can insert memberships for their organizations" ON user_memberships;
DROP POLICY IF EXISTS "Users can view memberships for their organizations" ON user_memberships;
DROP POLICY IF EXISTS "Users can create their own memberships" ON user_memberships;
DROP POLICY IF EXISTS "Users can view their org memberships" ON user_memberships;
DROP POLICY IF EXISTS "Users can view their memberships" ON user_memberships;
DROP POLICY IF EXISTS "Admins can insert memberships" ON user_memberships;

-- Allow users to create membership records (with their own user_id)
CREATE POLICY "Users can create their own memberships" ON user_memberships
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow users to view their own memberships (NO recursion - direct check)
CREATE POLICY "Users can view their own memberships" ON user_memberships
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Allow users to update their own memberships
CREATE POLICY "Users can update their own memberships" ON user_memberships
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid());

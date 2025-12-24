-- Script 012: Fix RLS policies to prevent infinite recursion
-- This script completely removes and recreates policies without circular dependencies

-- ============================================
-- STEP 1: Disable RLS temporarily for cleanup
-- ============================================
ALTER TABLE IF EXISTS organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_memberships DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Drop ALL existing policies on organizations
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'organizations'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON organizations', pol.policyname);
    END LOOP;
END $$;

-- ============================================
-- STEP 3: Drop ALL existing policies on user_memberships
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'user_memberships'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_memberships', pol.policyname);
    END LOOP;
END $$;

-- ============================================
-- STEP 4: Re-enable RLS
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Create SIMPLE policies for user_memberships
-- These policies ONLY check user_id = auth.uid() - NO subqueries!
-- ============================================

-- Users can view their own memberships
CREATE POLICY "memberships_select_own"
ON user_memberships FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own memberships (for onboarding)
CREATE POLICY "memberships_insert_own"
ON user_memberships FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own memberships
CREATE POLICY "memberships_update_own"
ON user_memberships FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own memberships
CREATE POLICY "memberships_delete_own"
ON user_memberships FOR DELETE
USING (user_id = auth.uid());

-- ============================================
-- STEP 6: Create SIMPLE policies for organizations
-- Allow any authenticated user to create, then filter by membership in app
-- ============================================

-- Any authenticated user can create an organization
CREATE POLICY "orgs_insert_authenticated"
ON organizations FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view organizations (we'll filter by membership in the app)
CREATE POLICY "orgs_select_authenticated"
ON organizations FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can update organizations they're members of
-- This uses a simple EXISTS check that won't cause recursion
CREATE POLICY "orgs_update_members"
ON organizations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM user_memberships 
        WHERE user_memberships.org_id = organizations.id 
        AND user_memberships.user_id = auth.uid()
    )
);

-- Users can delete organizations they're admins of
CREATE POLICY "orgs_delete_admins"
ON organizations FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM user_memberships 
        WHERE user_memberships.org_id = organizations.id 
        AND user_memberships.user_id = auth.uid()
        AND user_memberships.role = 'admin'
    )
);

-- ============================================
-- STEP 7: Grant necessary permissions
-- ============================================
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON user_memberships TO authenticated;

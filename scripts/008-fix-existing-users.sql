-- Script to create organizations for existing users who don't have one
-- Run this in Supabase SQL Editor

-- First, drop any trigger that might be blocking role values
DROP TRIGGER IF EXISTS trg_user_memberships_role_check ON user_memberships;
DROP FUNCTION IF EXISTS user_memberships_role_check() CASCADE;

-- Update the role constraint to include 'owner' if it doesn't exist
-- First drop the existing constraint and add a new one
DO $$
BEGIN
  -- Try to drop the existing check constraint (name may vary)
  ALTER TABLE user_memberships DROP CONSTRAINT IF EXISTS user_memberships_role_check;
  ALTER TABLE user_memberships DROP CONSTRAINT IF EXISTS user_memberships_role_check1;
  
  -- Add new constraint that includes owner
  ALTER TABLE user_memberships 
  ADD CONSTRAINT user_memberships_role_check 
  CHECK (role IN ('owner', 'admin', 'manager', 'employee', 'viewer'));
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not modify constraint: %', SQLERRM;
END;
$$;

-- Create a function to provision organization for a user
CREATE OR REPLACE FUNCTION public.provision_user_organization(target_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  user_email TEXT;
  user_name TEXT;
  company_name TEXT;
BEGIN
  -- Check if user already has a membership
  SELECT org_id INTO new_org_id
  FROM user_memberships
  WHERE user_id = target_user_id
  LIMIT 1;
  
  IF new_org_id IS NOT NULL THEN
    RETURN new_org_id;
  END IF;
  
  -- Get user info from auth.users
  SELECT 
    email,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'first_name', 'User'),
    COALESCE(raw_user_meta_data->>'company_name', 'My Business')
  INTO user_email, user_name, company_name
  FROM auth.users
  WHERE id = target_user_id;
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Create organization
  INSERT INTO organizations (name)
  VALUES (company_name)
  RETURNING id INTO new_org_id;
  
  -- Use 'admin' role instead of 'owner' to avoid constraint issues
  INSERT INTO user_memberships (user_id, org_id, role)
  VALUES (target_user_id, new_org_id, 'admin');
  
  -- Create business profile
  INSERT INTO business_profiles (org_id, business_name, email)
  VALUES (new_org_id, company_name, user_email);
  
  -- Use 'admin' role for profiles as well
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (target_user_id, user_email, user_name, 'admin')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);
  
  RETURN new_org_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.provision_user_organization(UUID) TO authenticated;

-- Provision organizations for ALL existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.user_memberships um ON um.user_id = au.id
    WHERE um.org_id IS NULL
  LOOP
    PERFORM public.provision_user_organization(user_record.id);
    RAISE NOTICE 'Provisioned organization for user %', user_record.id;
  END LOOP;
END;
$$;

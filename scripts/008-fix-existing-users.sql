-- Script to create organizations for existing users who don't have one
-- Run this in Supabase SQL Editor

-- First, let's see which users are missing organizations
-- SELECT 
--   au.id as user_id,
--   au.email,
--   au.raw_user_meta_data->>'company_name' as company_name,
--   um.org_id
-- FROM auth.users au
-- LEFT JOIN public.user_memberships um ON um.user_id = au.id
-- WHERE um.org_id IS NULL;

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
  
  -- Create membership with owner role
  INSERT INTO user_memberships (user_id, org_id, role)
  VALUES (target_user_id, new_org_id, 'owner');
  
  -- Create business profile
  INSERT INTO business_profiles (org_id, business_name, email)
  VALUES (new_org_id, company_name, user_email);
  
  -- Create/update profile
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (target_user_id, user_email, user_name, 'owner')
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

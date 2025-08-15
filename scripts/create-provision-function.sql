-- Create the provision_first_org function
CREATE OR REPLACE FUNCTION public.provision_first_org(
  p_business_name TEXT,
  p_plan TEXT DEFAULT 'pro',
  p_company_size TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_website TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  org_id UUID;
  user_id UUID;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Insert the organization
  INSERT INTO organizations (name, plan, owner_id, address, phone, email, website)
  VALUES (p_business_name, p_plan, user_id, p_address, p_phone, p_email, p_website)
  RETURNING id INTO org_id;

  -- Create membership
  INSERT INTO memberships (org_id, user_id, role, is_active)
  VALUES (org_id, user_id, 'owner', true);

  -- Update user profile with default org
  UPDATE profiles 
  SET default_org = org_id 
  WHERE id = user_id;

  RETURN org_id;
END;
$$;

-- Create the provision_first_org function
CREATE OR REPLACE FUNCTION provision_first_org(
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
  v_user_id UUID;
  v_org_id UUID;
BEGIN
  -- Get the current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Create the organization
  INSERT INTO organizations (name, plan, owner_id, address, phone, email, website)
  VALUES (p_business_name, p_plan, v_user_id, p_address, p_phone, p_email, p_website)
  RETURNING id INTO v_org_id;

  -- Create membership for the user
  INSERT INTO memberships (user_id, org_id, role)
  VALUES (v_user_id, v_org_id, 'owner');

  -- Update user's default organization
  UPDATE profiles 
  SET default_org = v_org_id
  WHERE id = v_user_id;

  RETURN v_org_id;
END;
$$;

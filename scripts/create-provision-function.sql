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
RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Create the organization
  INSERT INTO organizations (
    name,
    plan,
    owner_id,
    address,
    phone,
    email,
    website,
    is_active
  ) VALUES (
    p_business_name,
    p_plan,
    current_user_id,
    p_address,
    p_phone,
    p_email,
    p_website,
    true
  ) RETURNING id INTO new_org_id;

  -- Create owner membership
  INSERT INTO memberships (
    org_id,
    user_id,
    role,
    is_active
  ) VALUES (
    new_org_id,
    current_user_id,
    'owner',
    true
  );

  -- Update user's default org in profiles
  UPDATE profiles 
  SET default_org = new_org_id 
  WHERE id = current_user_id;

  -- Return the organization ID
  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the provision_first_org function
CREATE OR REPLACE FUNCTION public.provision_first_org(
  p_name TEXT,
  p_plan TEXT DEFAULT 'pro',
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
    RAISE EXCEPTION 'You must be authenticated to create an organization';
  END IF;

  -- Check if user already has an organization
  IF EXISTS (
    SELECT 1 FROM memberships 
    WHERE user_id = v_user_id AND is_active = true
  ) THEN
    RAISE EXCEPTION 'User already belongs to an organization';
  END IF;

  -- Create the organization
  INSERT INTO organizations (
    name, 
    plan, 
    owner_id, 
    address, 
    phone, 
    email, 
    website
  )
  VALUES (
    p_name,
    p_plan,
    v_user_id,
    p_address,
    p_phone,
    p_email,
    p_website
  )
  RETURNING id INTO v_org_id;

  -- Create owner membership
  INSERT INTO memberships (
    org_id,
    user_id,
    role,
    is_active,
    hired_date
  )
  VALUES (
    v_org_id,
    v_user_id,
    'owner',
    true,
    CURRENT_DATE
  );

  -- Set as default organization in profiles
  UPDATE profiles 
  SET default_org = v_org_id 
  WHERE id = v_user_id;

  -- Log the activity
  INSERT INTO activity_log (
    org_id, 
    user_id, 
    entity_type, 
    entity_id, 
    action, 
    description
  )
  VALUES (
    v_org_id, 
    v_user_id, 
    'organization', 
    v_org_id, 
    'created', 
    'Organization created and user set as owner'
  );

  -- Return the organization ID
  RETURN v_org_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.provision_first_org TO authenticated;

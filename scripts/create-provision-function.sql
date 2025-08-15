-- Create the provision_first_org function
CREATE OR REPLACE FUNCTION public.provision_first_org(
  p_name TEXT,
  p_plan TEXT DEFAULT 'pro',
  p_address TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_website TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_org_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Insert the organization
  INSERT INTO public.organizations (
    name,
    plan,
    owner_id,
    address,
    phone,
    email,
    website,
    is_active
  ) VALUES (
    p_name,
    p_plan::TEXT,
    current_user_id,
    p_address,
    p_phone,
    p_email,
    p_website,
    true
  )
  RETURNING id INTO new_org_id;

  -- Create owner membership
  INSERT INTO public.memberships (
    org_id,
    user_id,
    role,
    is_active,
    hired_date
  ) VALUES (
    new_org_id,
    current_user_id,
    'owner',
    true,
    CURRENT_DATE
  );

  -- Update user's default org
  UPDATE public.profiles 
  SET default_org = new_org_id,
      updated_at = NOW()
  WHERE id = current_user_id;

  -- Return the organization ID
  RETURN new_org_id::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.provision_first_org TO authenticated;

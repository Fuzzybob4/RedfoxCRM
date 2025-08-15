-- Create the provision_first_org function
CREATE OR REPLACE FUNCTION provision_first_org(
  org_name TEXT,
  org_plan TEXT DEFAULT 'starter'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  new_org_id UUID;
  result JSON;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- Check if user already has an organization
  IF EXISTS (
    SELECT 1 FROM memberships 
    WHERE user_id = current_user_id 
    AND is_active = true
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User already has an organization'
    );
  END IF;

  -- Create the organization
  INSERT INTO organizations (name, plan, owner_id)
  VALUES (org_name, org_plan, current_user_id)
  RETURNING id INTO new_org_id;

  -- Create membership for the owner
  INSERT INTO memberships (user_id, org_id, role, is_active)
  VALUES (current_user_id, new_org_id, 'owner', true);

  -- Update user's default organization
  UPDATE profiles 
  SET default_org = new_org_id
  WHERE id = current_user_id;

  -- Return success with organization details
  RETURN json_build_object(
    'success', true,
    'org_id', new_org_id,
    'message', 'Organization created successfully'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION provision_first_org(TEXT, TEXT) TO authenticated;

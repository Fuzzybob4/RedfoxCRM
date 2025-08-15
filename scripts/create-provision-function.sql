-- Create the provision_first_org function
CREATE OR REPLACE FUNCTION provision_first_org(
  org_name TEXT,
  org_plan TEXT DEFAULT 'pro',
  company_size TEXT DEFAULT 'small'
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
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Check if user already has an organization
  IF EXISTS (
    SELECT 1 FROM organization_memberships 
    WHERE user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'User already has an organization';
  END IF;

  -- Insert the new organization
  INSERT INTO organizations (name, plan, owner_id, company_size)
  VALUES (org_name, org_plan, current_user_id, company_size)
  RETURNING id INTO new_org_id;

  -- Create membership for the owner
  INSERT INTO organization_memberships (user_id, organization_id, role)
  VALUES (current_user_id, new_org_id, 'owner');

  -- Return success result
  result := json_build_object(
    'success', true,
    'organization_id', new_org_id,
    'message', 'Organization created successfully'
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to create organization'
    );
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION provision_first_org(TEXT, TEXT, TEXT) TO authenticated;

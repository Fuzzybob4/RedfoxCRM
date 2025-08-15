-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Users can update organizations they own" ON organizations;
DROP POLICY IF EXISTS "Users can insert organizations" ON organizations;

DROP POLICY IF EXISTS "Users can view memberships for their organizations" ON memberships;
DROP POLICY IF EXISTS "Users can insert memberships for their organizations" ON memberships;
DROP POLICY IF EXISTS "Users can update memberships for their organizations" ON memberships;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE memberships.organization_id = organizations.id 
      AND memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update organizations they own" ON organizations
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert organizations" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Memberships policies
CREATE POLICY "Users can view memberships for their organizations" ON memberships
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE organizations.id = memberships.organization_id 
      AND organizations.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert memberships for their organizations" ON memberships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE organizations.id = memberships.organization_id 
      AND organizations.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update memberships for their organizations" ON memberships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE organizations.id = memberships.organization_id 
      AND organizations.owner_id = auth.uid()
    )
  );

-- Create function to provision first organization
CREATE OR REPLACE FUNCTION provision_first_org()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION provision_first_org();

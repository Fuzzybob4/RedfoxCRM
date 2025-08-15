-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  stripe_customer_id TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memberships table (users can belong to multiple orgs)
CREATE TABLE IF NOT EXISTS memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Invites table
CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  invited_name TEXT,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, email)
);

-- Add default_org to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS default_org UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and admins can update organizations" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for memberships
CREATE POLICY "Users can view memberships for their organizations" ON memberships
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage memberships" ON memberships
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for invites
CREATE POLICY "Users can view invites for their organizations" ON invites
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage invites" ON invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_invites_org_id ON invites(org_id);
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);
CREATE INDEX IF NOT EXISTS idx_profiles_default_org ON profiles(default_org);

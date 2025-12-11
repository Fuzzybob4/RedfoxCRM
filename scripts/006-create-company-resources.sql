-- Create company_resources table for storing company SOPs, documentation, and other files
CREATE TABLE IF NOT EXISTS public.company_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_company_resources_org_id ON public.company_resources(org_id);
CREATE INDEX IF NOT EXISTS idx_company_resources_category ON public.company_resources(category);

-- Enable RLS
ALTER TABLE public.company_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see resources from their organization
CREATE POLICY "Users can view their organization resources"
  ON public.company_resources
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.user_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Admins and owners can insert resources
CREATE POLICY "Admins can create resources"
  ON public.company_resources
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.user_memberships 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'super_admin')
    )
  );

-- Admins and owners can update resources
CREATE POLICY "Admins can update resources"
  ON public.company_resources
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.user_memberships 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'super_admin')
    )
  );

-- Admins and owners can delete resources
CREATE POLICY "Admins can delete resources"
  ON public.company_resources
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.user_memberships 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner', 'super_admin')
    )
  );

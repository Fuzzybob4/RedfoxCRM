-- Create customer_photos table to store image references
CREATE TABLE IF NOT EXISTS customer_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  photo_url TEXT NOT NULL,
  photo_type TEXT, -- 'front', 'roofline', 'trees', 'after_install', 'other'
  description TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_photos ENABLE ROW LEVEL SECURITY;

-- Users can view photos for customers in their organization
CREATE POLICY "Users can view customer photos from their organization"
ON customer_photos FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM user_memberships 
    WHERE user_id = auth.uid()
  )
);

-- Users can upload photos for customers in their organization
CREATE POLICY "Users can upload customer photos for their organization"
ON customer_photos FOR INSERT
WITH CHECK (
  org_id IN (
    SELECT org_id FROM user_memberships 
    WHERE user_id = auth.uid()
  )
);

-- Users can delete photos they uploaded or admins can delete any
CREATE POLICY "Users can delete customer photos"
ON customer_photos FOR DELETE
USING (
  uploaded_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM user_memberships 
    WHERE user_id = auth.uid() 
    AND org_id = customer_photos.org_id 
    AND role IN ('admin', 'owner')
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_customer_photos_customer_id ON customer_photos(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_photos_org_id ON customer_photos(org_id);

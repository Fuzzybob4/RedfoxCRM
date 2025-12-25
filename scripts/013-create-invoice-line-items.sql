-- Create invoice line items table for detailed invoicing
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add deposit and payment tracking fields to invoices
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT; -- 'stripe', 'cash', 'check', 'wire', etc.

-- Update balance_due for existing invoices
UPDATE invoices 
SET balance_due = total_amount - COALESCE(amount_paid, 0)
WHERE balance_due IS NULL;

-- Create RLS policies for invoice_line_items
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view line items from their organization"
  ON invoice_line_items FOR SELECT
  USING (org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid()));

CREATE POLICY "Users can create line items for their organization"
  ON invoice_line_items FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid()));

CREATE POLICY "Users can update line items from their organization"
  ON invoice_line_items FOR UPDATE
  USING (org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete line items from their organization"
  ON invoice_line_items FOR DELETE
  USING (org_id IN (SELECT org_id FROM user_memberships WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_org_id ON invoice_line_items(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_payment_intent ON invoices(stripe_payment_intent_id);

-- Create function to automatically calculate line totals
CREATE OR REPLACE FUNCTION calculate_line_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total := NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_line_total
  BEFORE INSERT OR UPDATE ON invoice_line_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_line_total();

COMMENT ON TABLE invoice_line_items IS 'Line items for invoices with description, quantity, and pricing';
COMMENT ON COLUMN invoices.deposit_amount IS 'Deposit amount paid upfront';
COMMENT ON COLUMN invoices.balance_due IS 'Remaining balance after deposits and payments';
COMMENT ON COLUMN invoices.stripe_payment_intent_id IS 'Stripe Payment Intent ID for tracking payments';

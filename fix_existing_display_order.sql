-- Since display_order column already exists, we skip ALTER TABLE
-- Just run these parts:

-- Create index for better performance when ordering (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_payment_methods_display_order ON public.payment_methods(user_id, display_order);

-- Function to automatically set display_order for new payment methods
CREATE OR REPLACE FUNCTION set_payment_method_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.display_order IS NULL OR NEW.display_order = 0 THEN
        SELECT COALESCE(MAX(display_order), 0) + 1 
        INTO NEW.display_order 
        FROM public.payment_methods 
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS set_payment_method_order_trigger ON public.payment_methods;
CREATE TRIGGER set_payment_method_order_trigger
    BEFORE INSERT ON public.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION set_payment_method_order();

-- Update existing payment methods to have proper order based on created_at
WITH ordered_methods AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as new_order
    FROM public.payment_methods
)
UPDATE public.payment_methods 
SET display_order = ordered_methods.new_order
FROM ordered_methods 
WHERE payment_methods.id = ordered_methods.id; 
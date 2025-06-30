-- Add tag column to payment_methods table
ALTER TABLE public.payment_methods 
ADD COLUMN tag TEXT; 
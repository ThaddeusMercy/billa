-- Cleanup script to remove Paystack and trial-related database objects
-- Run this to completely remove payment processing functionality

-- Drop transactions table and related objects
DROP TABLE IF EXISTS public.transactions CASCADE;

-- Remove trial_expires_at column from profiles table (if it still exists)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS trial_expires_at;

-- Drop any remaining trial-related indexes
DROP INDEX IF EXISTS idx_profiles_trial_expires_at;

-- Drop trial-related functions (if they exist)
DROP FUNCTION IF EXISTS public.get_trial_status(UUID);

-- Clean up any remaining transaction-related indexes or functions
DROP INDEX IF EXISTS idx_transactions_reference;
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created_at;

-- Note: This script removes all payment processing and trial functionality
-- The app will now be completely free to use 
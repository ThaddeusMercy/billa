-- =====================================================
-- COMPLETE SUPABASE DATABASE SETUP WITH FREE TRIAL
-- =====================================================
-- Copy and paste this entire script into your Supabase SQL editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    trial_expires_at TIMESTAMP WITH TIME ZONE, -- Free trial tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profiles by username" ON public.profiles;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Add public read policy for profiles (for username sharing)
CREATE POLICY "Public can view profiles by username" ON public.profiles
    FOR SELECT USING (username IS NOT NULL);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to check username availability (bypasses RLS)
CREATE OR REPLACE FUNCTION public.check_username_exists(username_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE username = username_param
    );
END;
$$;

-- =====================================================
-- FREE TRIAL FUNCTIONS
-- =====================================================

-- Create index for trial expiration queries
CREATE INDEX IF NOT EXISTS idx_profiles_trial_expires_at ON public.profiles(trial_expires_at);

-- Function to check if user's trial has expired
CREATE OR REPLACE FUNCTION public.is_trial_expired(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    trial_expires TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT trial_expires_at INTO trial_expires
    FROM public.profiles 
    WHERE id = user_id;
    
    -- If no trial_expires_at is set, user has lifetime access
    IF trial_expires IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if trial has expired
    RETURN trial_expires < NOW();
END;
$$;

-- Function to get user's trial status
CREATE OR REPLACE FUNCTION public.get_trial_status(user_id UUID)
RETURNS TABLE(
    has_trial BOOLEAN,
    is_expired BOOLEAN,
    expires_at TIMESTAMP WITH TIME ZONE,
    days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    trial_expires TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT trial_expires_at INTO trial_expires
    FROM public.profiles 
    WHERE id = user_id;
    
    -- If no trial_expires_at is set, user has lifetime access
    IF trial_expires IS NULL THEN
        RETURN QUERY SELECT FALSE, FALSE, NULL::TIMESTAMP WITH TIME ZONE, NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Return trial status
    RETURN QUERY SELECT 
        TRUE,
        trial_expires < NOW(),
        trial_expires,
        GREATEST(0, EXTRACT(DAY FROM trial_expires - NOW())::INTEGER);
END;
$$;

-- =====================================================
-- PAYMENT METHODS TABLE
-- =====================================================

-- Create payment methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('bank', 'crypto', 'digital')),
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    identifier TEXT NOT NULL,
    
    -- Bank specific fields
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    routing_number TEXT,
    
    -- Crypto specific fields
    coin_name TEXT,
    network TEXT,
    wallet_address TEXT,
    
    -- Digital wallet specific fields
    digital_wallet_type TEXT,
    digital_wallet_id TEXT,
    
    -- UI preferences
    selected_color TEXT DEFAULT 'blue',
    icon_type TEXT, -- 'emoji' or 'lucide'
    icon_value TEXT, -- emoji character or lucide icon name
    tag TEXT, -- Optional tag for categorizing payment methods
    display_order INTEGER DEFAULT 0, -- For drag and drop reordering
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can insert own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can update own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Public can view payment methods for profiles" ON public.payment_methods;

-- Create policies for payment methods
CREATE POLICY "Users can view own payment methods" ON public.payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods" ON public.payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON public.payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON public.payment_methods
    FOR DELETE USING (auth.uid() = user_id);

-- Add public read policy for payment methods (for username sharing)
CREATE POLICY "Public can view payment methods for profiles" ON public.payment_methods
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = payment_methods.user_id 
            AND profiles.username IS NOT NULL
        )
    );

-- Create trigger for payment methods updated_at
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON public.payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create index for better performance when ordering
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

-- Create trigger to set order on insert
DROP TRIGGER IF EXISTS set_payment_method_order_trigger ON public.payment_methods;
CREATE TRIGGER set_payment_method_order_trigger
    BEFORE INSERT ON public.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION set_payment_method_order();

-- =====================================================
-- SOCIAL CONNECTIONS TABLE
-- =====================================================

-- Create verified social connections table
CREATE TABLE IF NOT EXISTS public.social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    platform_user_id TEXT NOT NULL, -- Twitter user ID, Instagram ID, etc.
    platform_username TEXT NOT NULL, -- @username
    platform_display_name TEXT,
    platform_avatar_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_token TEXT, -- Encrypted OAuth token
    refresh_token TEXT, -- Encrypted refresh token
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one user per platform account
    UNIQUE(platform, platform_user_id),
    -- Ensure one platform account per user
    UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own social connections" ON public.social_connections;
DROP POLICY IF EXISTS "Users can insert own social connections" ON public.social_connections;
DROP POLICY IF EXISTS "Users can update own social connections" ON public.social_connections;
DROP POLICY IF EXISTS "Users can delete own social connections" ON public.social_connections;

-- Create policies
CREATE POLICY "Users can view own social connections" ON public.social_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social connections" ON public.social_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social connections" ON public.social_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social connections" ON public.social_connections
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- TRANSACTIONS TABLE (FOR PAYSTACK PAYMENTS)
-- =====================================================

-- Create transactions table to store Paystack transaction records
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference TEXT UNIQUE NOT NULL,
    paystack_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'abandoned', 'pending')),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    channel TEXT, -- card, bank, ussd, qr, mobile_money, bank_transfer
    paid_at TIMESTAMP WITH TIME ZONE,
    gateway_response TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can update transactions" ON public.transactions;

-- Create policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON public.transactions
    FOR INSERT WITH CHECK (true); -- Allow system to insert from webhooks

CREATE POLICY "System can update transactions" ON public.transactions
    FOR UPDATE USING (true); -- Allow system to update from webhooks

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- STORAGE BUCKET SETUP (RUN SEPARATELY IF NEEDED)
-- =====================================================

-- Note: Storage buckets are usually created via the Supabase dashboard
-- If you need to create the avatars bucket via SQL, uncomment below:

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/*'])
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- This script creates:
-- ✅ Profiles table with trial support
-- ✅ Payment methods table with ordering
-- ✅ Social connections table
-- ✅ Transactions table for Paystack
-- ✅ All necessary RLS policies
-- ✅ Helper functions for trials
-- ✅ Triggers for auto-updates
-- ✅ Indexes for performance

-- After running this script:
-- 1. Set up your environment variables
-- 2. Configure Paystack (if using payments)
-- 3. Set up storage policies for avatars
-- 4. Test user registration and profile creation
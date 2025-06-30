-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Create policies
CREATE POLICY "Users can view own social connections" ON public.social_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social connections" ON public.social_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social connections" ON public.social_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social connections" ON public.social_connections
    FOR DELETE USING (auth.uid() = user_id);

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
    tag TEXT, -- Optional tag for categorizing payment methods (e.g. "shoes", "vacation", "business")
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for payment methods
CREATE POLICY "Users can view own payment methods" ON public.payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods" ON public.payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON public.payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON public.payment_methods
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for payment methods updated_at
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 
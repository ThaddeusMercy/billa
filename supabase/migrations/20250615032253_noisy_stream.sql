-- Add trial_expires_at column to profiles table for free trial tracking
ALTER TABLE public.profiles 
ADD COLUMN trial_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for trial expiration queries
CREATE INDEX idx_profiles_trial_expires_at ON public.profiles(trial_expires_at);

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
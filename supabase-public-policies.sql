-- Add public read policy for profiles (for username sharing)
CREATE POLICY "Public can view profiles by username" ON public.profiles
    FOR SELECT USING (username IS NOT NULL);

-- Add public read policy for payment methods (for username sharing)
CREATE POLICY "Public can view payment methods for profiles" ON public.payment_methods
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = payment_methods.user_id 
            AND profiles.username IS NOT NULL
        )
    ); 
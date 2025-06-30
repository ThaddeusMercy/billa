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

-- Create policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON public.transactions
    FOR INSERT WITH CHECK (true); -- Allow system to insert from webhooks

CREATE POLICY "System can update transactions" ON public.transactions
    FOR UPDATE USING (true); -- Allow system to update from webhooks

-- Create indexes for better performance
CREATE INDEX idx_transactions_reference ON public.transactions(reference);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate that we have real values (not placeholders) when actually using the client
const hasValidConfig = supabaseUrl !== 'https://placeholder.supabase.co' && 
                      supabaseAnonKey !== 'placeholder-key' &&
                      supabaseUrl.includes('supabase.co') &&
                      supabaseAnonKey.length > 20

// Create client with additional options to prevent server-side issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined', // Only persist sessions in browser
    autoRefreshToken: typeof window !== 'undefined', // Only auto-refresh in browser
  },
})

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  console.log('Checking Supabase configuration:', {
    hasUrl: !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co',
    hasKey: !!supabaseAnonKey && supabaseAnonKey !== 'placeholder-key',
    urlValid: supabaseUrl.includes('supabase.co'),
    keyLength: supabaseAnonKey.length,
    hasValidConfig
  })
  return hasValidConfig
}

export type UserProfile = {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  social_links?: Array<{platform: string, value: string}>

  created_at: string
  updated_at: string
}

export type PaymentMethod = {
  id: string
  user_id: string
  category: 'bank' | 'crypto' | 'digital'
  type: string
  label: string
  identifier: string
  
  // Bank specific fields
  bank_name?: string
  account_number?: string
  account_name?: string
  routing_number?: string
  
  // Crypto specific fields
  coin_name?: string
  network?: string
  wallet_address?: string
  
  // Digital wallet specific fields
  digital_wallet_type?: string
  digital_wallet_id?: string
  
  // UI preferences
  selected_color: string
  icon_type?: string
  icon_value?: string
  tag?: string
  display_order?: number
  
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
      payment_methods: {
        Row: PaymentMethod
        Insert: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PaymentMethod, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
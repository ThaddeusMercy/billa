import { useState, useEffect, useCallback } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase, UserProfile, PaymentMethod, isSupabaseConfigured } from '@/lib/supabase'

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [session, setSession] = useState<Session | null>(null)

  const fetchInitialData = useCallback(async (userId: string) => {
    // Skip data fetching if Supabase is not properly configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping data fetch')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Use maybeSingle() to handle cases where profile doesn't exist yet
      const [profileResponse, paymentMethodsResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('payment_methods').select('*').eq('user_id', userId).order('display_order', { ascending: true })
      ])

      // Handle profile response - it might be null if profile doesn't exist
      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        // Only throw if it's not a "no rows returned" error
        throw profileResponse.error
      }

      // Handle payment methods response
      if (paymentMethodsResponse.error) {
        throw paymentMethodsResponse.error
      }

      // Set profile (might be null if user just signed up)
      setProfile(profileResponse.data)
      setPaymentMethods(paymentMethodsResponse.data || [])

      console.log('Initial data fetched successfully:', {
        profileExists: !!profileResponse.data,
        paymentMethodsCount: paymentMethodsResponse.data?.length || 0
      })

    } catch (error: any) {
      console.error('Error fetching initial data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Prevent server-side execution
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Skip auth setup if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping auth setup')
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchInitialData(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error: any) {
        console.error('Error in getInitialSession:', error)
        setError(error.message)
        setLoading(false)
      }
    }
    
    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      setError(null) // Clear any previous errors
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchInitialData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        setPaymentMethods([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchInitialData])

  useEffect(() => {
    // Prevent server-side execution
    if (typeof window === 'undefined') return

    // Skip session refresh if Supabase is not configured
    if (!isSupabaseConfigured()) return

    const sessionRefreshInterval = setInterval(
      () => {
        supabase.auth.refreshSession()
      },
      4 * 60 * 1000,
    ) // 4 minutes

    return () => {
      clearInterval(sessionRefreshInterval)
    }
  }, [])

  // This effect is no longer needed for rendering, but kept for redirection logic.
  useEffect(() => {
    if (user && profile !== null && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const isOnboardingActive = localStorage.getItem('billa-onboarding-active') === 'true'
      
      if (!profile?.username && currentPath !== '/create-username' && !currentPath.startsWith('/auth/')) {
        window.location.replace('/create-username')
      }
      
      if (profile?.username && currentPath === '/create-username' && !isOnboardingActive) {
        window.location.replace('/dashboard')
      }
    }
  }, [user, profile])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured')

    try {
      console.log('Attempting to update profile with:', updates)

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        })
        throw new Error(error.message || error.details || 'Failed to update profile')
      }
      
      setProfile(data)
      return data
    } catch (error: any) {
      console.error('Error updating profile:', error)
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  const checkUserExists = async (email: string) => {
    if (!isSupabaseConfigured()) return false
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://example.com/fake'
      })
      return !error
    } catch {
      return false
    }
  }

  const signUp = async (email: string, password: string, profileData?: Partial<UserProfile>) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured')
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.')
        }
        throw error
      }
      
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured')
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (typeof window === 'undefined') {
      throw new Error('Google sign-in can only be used in the browser')
    }
    
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured')
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      // If Supabase isn't configured, just clear local state
      setUser(null)
      setProfile(null)
      setSession(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('billa-onboarding-active')
        window.location.replace('/signin')
      }
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Clear local state first to prevent any UI glitches
      setUser(null)
      setProfile(null)
      setSession(null)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear any localStorage/sessionStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('billa-onboarding-active')
        sessionStorage.clear()
        
        // Use replace to prevent back navigation issues
        window.location.replace('/signin')
      }
    } catch (err: any) {
      setError(err.message)
      // Even if signOut fails, clear local state and redirect
      setUser(null)
      setProfile(null)
      setSession(null)
      
      if (typeof window !== 'undefined') {
        window.location.replace('/signin')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    profile,
    session,
    paymentMethods,
    setPaymentMethods,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    checkUserExists,
    loading,
    error,
    isAuthenticated: !!user,
    isConfigured: isSupabaseConfigured(),
  }
}
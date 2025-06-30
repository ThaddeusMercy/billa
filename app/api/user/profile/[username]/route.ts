import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await props.params
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { data: paymentMethods, error: paymentsError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', profile.id)
      .order('display_order', { ascending: true })

    if (paymentsError) {
      console.error('Error fetching payment methods:', paymentsError)
      return NextResponse.json({ error: 'Error fetching payment methods' }, { status: 500 })
    }

    return NextResponse.json({
      ...profile,
      paymentMethods: paymentMethods || []
    })

  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
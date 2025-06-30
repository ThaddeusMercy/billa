import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Use service role key for reliable access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching payment methods:', error)
      return NextResponse.json({ error: 'Error fetching payment methods' }, { status: 500 })
    }

    return NextResponse.json({ data: paymentMethods || [] })

  } catch (error) {
    console.error('Error in payment methods API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, ...paymentMethodData } = await request.json()
    console.log('API: Creating payment method for user:', userId)
    console.log('API: Payment method data:', paymentMethodData)
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    // Use service role key for reliable access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('API: Creating payment method with service role access')

    const { data: paymentMethod, error } = await supabase
      .from('payment_methods')
      .insert({ ...paymentMethodData, user_id: userId })
      .select()
      .single()

    if (error) {
      console.error('API: Database error:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        code: error.code
      }, { status: 500 })
    }

    console.log('API: Payment method created successfully:', paymentMethod)
    return NextResponse.json({ data: paymentMethod })

  } catch (error: any) {
    console.error('API: Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
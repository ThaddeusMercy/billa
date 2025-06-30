import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Use service role key for this operation
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentMethodIds } = await request.json()

    if (!Array.isArray(paymentMethodIds) || paymentMethodIds.length === 0) {
      return NextResponse.json({ error: 'Invalid payment method IDs' }, { status: 400 })
    }

    console.log('Reordering payment methods for user:', user.id)
    console.log('New order:', paymentMethodIds)

    // Update the display_order for each payment method
    const updatePromises = paymentMethodIds.map((id: string, index: number) => 
      supabase
        .from('payment_methods')
        .update({ display_order: index + 1 })
        .eq('id', id)
        .eq('user_id', user.id)
    )

    const results = await Promise.all(updatePromises)
    
    // Check if any updates failed
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Some updates failed:', errors)
      return NextResponse.json({ error: 'Failed to update some payment methods' }, { status: 500 })
    }

    // Fetch updated payment methods
    const { data: updatedMethods, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true })

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch updated payment methods' }, { status: 500 })
    }

    console.log('Payment methods reordered successfully')
    return NextResponse.json({ data: updatedMethods })

  } catch (error) {
    console.error('Error reordering payment methods:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
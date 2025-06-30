import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { username, userId, email } = await request.json()
    
    console.log('API: Creating profile for:', { username, userId, email })
    
    if (!username || !userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use service role key for reliable access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('API: Creating profile with service role access')

    // Try to create/update the profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        username: username
      })
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

    console.log('API: Profile created successfully:', data)
    return NextResponse.json({ data, message: 'Profile created successfully' })

  } catch (error: any) {
    console.error('API: Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, social_links } = await request.json()
    
    console.log('API: Updating social links for user:', userId)
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('profiles')
      .update({ social_links })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('API: Error updating social links:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Social links updated successfully')
    return NextResponse.json({ data, message: 'Social links updated successfully' })

  } catch (error: any) {
    console.error('API: Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
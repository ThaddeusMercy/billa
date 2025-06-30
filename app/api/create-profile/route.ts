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
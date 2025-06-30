import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    console.log('Username check request for:', username)
    
    if (!username || username.length < 3) {
      console.log('Username too short or empty')
      return NextResponse.json({ available: false, error: 'Username must be at least 3 characters' })
    }

    const lowercaseUsername = username.toLowerCase()
    
    // Check reserved usernames first (exact match only)
    const reservedUsernames = ['admin', 'test', 'user', 'billa', 'support', 'api', 'www', 'mail', 'ftp']
    if (reservedUsernames.includes(lowercaseUsername)) {
      console.log('Username is reserved:', lowercaseUsername)
      return NextResponse.json({ available: false })
    }

    // Use anon key for public username checking
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    console.log('Checking username in database:', lowercaseUsername)
    
    // Direct query to check if username exists
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', lowercaseUsername)
      .single()

    console.log('Database query result:', { data, error })

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - username is available
        console.log('Username is available:', lowercaseUsername)
        return NextResponse.json({ available: true })
      } else {
        console.error('Database error checking username:', error)
        return NextResponse.json({ available: false, error: 'Error checking username' })
      }
    }

    // If we got data, username exists and is not available
    const available = !data
    console.log('Username availability:', available)
    return NextResponse.json({ available })

  } catch (error) {
    console.error('Unexpected error in username check:', error)
    return NextResponse.json({ available: false, error: 'Error checking username' })
  }
} 
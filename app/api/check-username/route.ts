import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    
    console.log('Checking username in database:', lowercaseUsername)
    
    // Use RPC call to bypass RLS
    const { data, error } = await supabase.rpc('check_username_exists', {
      username_param: lowercaseUsername
    })

    console.log('RPC result:', { data, error })

    if (error) {
      console.error('Database error checking username:', error)
      // Fallback to direct query if RPC doesn't exist
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('username', { count: 'exact', head: true })
        .eq('username', lowercaseUsername)

      if (countError) {
        console.error('Fallback query error:', countError)
        return NextResponse.json({ available: false, error: 'Error checking username' })
      }
      
      const available = count === 0
      console.log('Fallback result - Username availability:', available)
      return NextResponse.json({ available })
    }

    const available = !data
    console.log('Username availability:', available)
    return NextResponse.json({ available })

  } catch (error) {
    console.error('Unexpected error in username check:', error)
    return NextResponse.json({ available: false, error: 'Error checking username' })
  }
}
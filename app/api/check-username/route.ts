import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
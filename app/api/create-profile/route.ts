import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { username, userId, email } = await request.json()
    
    console.log('API: Creating profile for:', { username, userId, email })
    
    if (!username || !userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const cookieStore = cookies()
    
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

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('Auth verification failed:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.id !== userId) {
      console.log('User ID mismatch:', user.id, 'vs', userId)
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 })
    }

    console.log('API: User authenticated, creating profile...')

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
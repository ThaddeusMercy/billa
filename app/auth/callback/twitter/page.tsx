'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const { user, profile, loading } = useAuthContext()
  const [showWelcome, setShowWelcome] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      // Check if user needs to complete onboarding
      if (!profile?.username) {
        // Check if this is a new Google OAuth user
        const isOAuthUser = user.app_metadata?.provider === 'google'
        const userCreatedRecently = user.created_at && 
          Date.now() - new Date(user.created_at).getTime() < 60000 // Within last minute
        
        if (isOAuthUser && userCreatedRecently) {
          // New Google user - show welcome first
          setIsNewUser(true)
          setShowWelcome(true)
        } else {
          // Existing user or direct access - go to username creation
          router.push('/create-username')
        }
      } else {
        // Existing user with username - redirect to dashboard
        router.push('/dashboard')
      }
    } else if (!loading && !user) {
      // No user session, redirect to signin
      router.push('/signin')
    }
  }, [user, profile, loading, router])

  const handleContinueToUsername = () => {
    setShowWelcome(false)
    router.push('/create-username')
  }

  if (showWelcome && isNewUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-black/10 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Welcome to Billa! 🎉</h1>
            <p className="text-black/60 text-lg">
              Your account has been successfully created with Google.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-black/5 rounded-xl p-4">
              <h3 className="font-semibold text-black mb-2">What's next?</h3>
              <p className="text-sm text-black/60">
                Let's create your unique username and set up your personal payment link.
              </p>
            </div>
          </div>

          <Button
            onClick={handleContinueToUsername}
            className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-base font-medium"
          >
            Continue Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-semibold">Setting up your account...</h2>
        <p className="text-black/60">Please wait while we complete your sign-in</p>
      </div>
    </div>
  )
} 
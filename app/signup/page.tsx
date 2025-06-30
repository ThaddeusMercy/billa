"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, ChromeIcon as Google, PartyPopper, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle, loading, error } = useAuthContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleSignUp = async () => {
    setEmailError("")
    setPasswordError("")
    
    let hasError = false
    
    if (!email.trim()) {
      setEmailError("Please enter your email")
      hasError = true
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      hasError = true
    }
    
    if (!password.trim()) {
      setPasswordError("Please enter a password")
      hasError = true
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters")
      hasError = true
    }
    
    if (hasError) return

    try {
      await signUp(email, password)
      
      toast.success("🎉 Welcome to Billa!", {
        description: "Your account has been created successfully!",
        duration: 3000,
      })
      
      // Let useAuth hook handle the redirect based on username presence
      
    } catch (err: any) {
      console.error('Signup error:', err)
      
      if (err.message.includes('already exists')) {
        toast.error("Account already exists", {
          description: "This email is already registered. Try signing in instead.",
          action: {
            label: "Sign In",
            onClick: () => router.push('/signin')
          }
        })
      }
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google signup error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 lg:flex flex-col justify-between p-8 hidden">
        {/* Logo at top */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-3xl text-black">Billa.</span>
          </Link>
        </div>

        {/* Yellow gradient circles at bottom */}
        <div className="relative h-48 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 -left-0 w-44 h-44 bg-gradient-to-br from-black to-yellow-700 rounded-full opacity-80"></div>
          <div className="absolute bottom-14 right-[-1px] w-20 h-20 bg-gradient-to-br from-black to-yellow-500 rounded-full opacity-60"></div>
          <div className="absolute -bottom-1 right-8 w-16 h-16 bg-gradient-to-br from-black to-yellow-600 rounded-full opacity-40"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-8">
            <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out" style={{ width: '0%' }}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-black/10 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-8 lg:hidden">
              <button onClick={() => router.back()} className="text-black/70 hover:text-black transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <span className="font-bold text-xl sm:text-2xl text-black">Billa.</span>
              </Link>
              <div className="w-5"></div>
            </div>

            <div className="hidden lg:block mb-8">
              <button onClick={() => router.back()} className="text-black/70 hover:text-black transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6 text-center">Create your Billa Profile</h1>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError("")
                  }}
                  className="w-full rounded-full py-4 sm:py-6 border-black/20 text-black text-base"
                  placeholder="you@example.com"
                />
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              <div className="animate-in slide-in-from-top duration-300">
                <label htmlFor="password" className="block text-sm font-medium text-black/70 mb-1">
                  Create a password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-full border-black/20 text-black pr-10 py-4 sm:py-6 text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-black hover:bg-black/90 text-white rounded-full py-4 sm:py-6"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-black/60">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleSignUp}
                className="w-full rounded-full py-4 sm:py-6 border-black/20 flex items-center justify-center gap-2 text-black"
              >
                <Google className="h-4 w-4" />
                Sign up with Google
              </Button>

              <p className="text-center text-sm text-black/60 mt-4 sm:mt-6">
                Already have an account?{" "}
                <Link href="/signin" className="text-black font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


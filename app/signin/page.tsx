"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChromeIcon as Google, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function SigninPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle, loading, error } = useAuthContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async () => {
    if (email && password) {
      try {
        await signIn(email, password)
        
        toast.success("Welcome back!", {
          description: "You've been signed in successfully.",
          duration: 2000,
        })
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
        
      } catch (err) {
        console.error('Signin error:', err)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google signin error:', err)
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
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full max-w-md border border-black/10 shadow-sm">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6 text-center">Sign in to Billa.</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full py-4 sm:py-6 border-black/20 text-black text-base"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black/70 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full py-4 sm:py-6 pr-12 border-black/20 text-black text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-black border-2 border-yellow-500 hover:bg-black/90 text-white rounded-full py-4 sm:py-6"
            >
              {loading ? "Signing in..." : "Sign In"}
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
              onClick={handleGoogleSignIn}
              className="w-full rounded-full py-4 sm:py-6 border-black/20 flex items-center justify-center gap-2 text-black"
            >
              <Google className="h-4 w-4" />
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-black/60 mt-4 sm:mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="text-black font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
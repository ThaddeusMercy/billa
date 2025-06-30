"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/AuthContext"
import { User, Settings, Copy, Menu, X } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import Image from "next/image"

const Header = () => {
  const { user, profile, isAuthenticated } = useAuthContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const getUserBillaUrl = () => {
    const username = profile?.username || user?.email?.split('@')[0] || 'user'
    if (typeof window === 'undefined') return `yourdomain.com/${username}`
    return `${window.location.host}/${username}`
  }

  const getShareableUrl = () => {
    const username = profile?.username || user?.email?.split('@')[0] || 'user'
    if (typeof window === 'undefined') return `https://yourdomain.com/${username}`
    return `${window.location.origin}/${username}`
  }

  const copyBillaUrl = async () => {
    try {
      await navigator.clipboard.writeText(getShareableUrl())
      toast.success("Billa URL copied!", {
        description: "Your link has been copied to clipboard",
        duration: 2000,
      })
    } catch (err) {
      toast.error("Failed to copy URL")
    }
  }

  const truncateUrl = (url: string, maxLength: number = 20) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <header className="w-full py-6 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-full px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <span className="font-bold text-2xl text-gray-900 italic cursor-pointer">Billa</span>
                </Link>
              ) : (
                <span className="font-bold text-2xl text-gray-900 italic">Billa</span>
              )}
            </div>

            {/* Bolt Logo - Mobile Center */}
            <div className="md:hidden">
              <Link 
                href="https://bolt.new/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="https://i.ibb.co/4gNWmf3Z/boltlogo.png" 
                  alt="Bolt Logo" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
                />
              </Link>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Support
              </button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {isAuthenticated ? (
                <Link href="/account" className="block">
                  <div className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-full px-4 py-2 hover:bg-gray-100/80">
                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-700">
                        {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <span className="text-xs text-gray-500 font-mono">
                        {truncateUrl(getUserBillaUrl())}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          copyBillaUrl()
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/signup" className="hidden md:block">
                  <Button className="bg-gray-200 hover:bg-gray-500 hover:text-white text-black rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Bolt Logo - Desktop */}
        <div className="hidden md:block">
          <Link 
            href="https://bolt.new/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image 
              src="https://i.ibb.co/4gNWmf3Z/boltlogo.png" 
              alt="Bolt Logo" 
              width={32} 
              height={32} 
              className="absolute top-1/2 -translate-y-1/2 right-6 w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity" 
            />
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 mt-2 mx-6">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-2xl px-6 py-4 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-left text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
              >
                Support
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header; 
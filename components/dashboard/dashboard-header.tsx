"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Copy, Menu, X } from "lucide-react"
import { FaHome, FaPaperPlane, FaUser } from "react-icons/fa"

interface DashboardHeaderProps {
  username: string
  onProfileClick: () => void
}

export default function DashboardHeader({ username, onProfileClick }: DashboardHeaderProps) {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const currentPath = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const copyToClipboard = () => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(`${window.location.origin}/${username}`)
    setShowCopiedTooltip(true)
    setTimeout(() => setShowCopiedTooltip(false), 2000)
  }

  const navItems = [
    { href: "/dashboard", label: "Home", icon: FaHome },
    { href: "/preview", label: "Preview", icon: FaPaperPlane },
    { href: "/account", label: "Account", icon: FaUser },
  ]

  const getDisplayUrl = () => {
    if (!isClient) return `yourdomain.com/${username}`
    return `${window.location.host}/${username}`
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <Link href="/dashboard">
              <span className="font-bold text-2xl text-black">Billa.</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full relative">
              <span className="text-sm text-gray-600">{getDisplayUrl()}</span>
              <button onClick={copyToClipboard} className="text-gray-400 hover:text-black">
                <Copy className="h-3.5 w-3.5" />
              </button>
              {showCopiedTooltip && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded animate-in fade-in duration-200">
                  Copied!
                </div>
              )}
            </div>
            <button
              onClick={onProfileClick}
              className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-bold"
            >
              {username.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        {showMobileNav && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-3">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPath === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMobileNav(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-orange-50 text-orange-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className={`text-base ${isActive ? "text-orange-500" : ""}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      <div className="md:hidden bg-gray-100 px-4 py-3 flex items-center justify-between relative">
        <span className="text-sm text-gray-600">{getDisplayUrl()}</span>
        <button onClick={copyToClipboard} className="text-gray-400 hover:text-black">
          <Copy className="h-3.5 w-3.5" />
        </button>
        {showCopiedTooltip && (
          <div className="absolute bottom-10 right-4 bg-black text-white text-xs py-1 px-2 rounded animate-in fade-in duration-200">
            Copied!
          </div>
        )}
      </div>
    </>
  )
}


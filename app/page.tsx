"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Globe, Smartphone, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import HowItWorks from "@/components/HowItWorks"
import FeatureHighlights from "@/components/FeatureHighlights"
import Pricing from "@/components/Pricing"
import Footer from "@/components/Footer"
import BillaComponent from "./components/BillaComponent"
import Dashboard from "@/app/dashboard/page"; 
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user, profile, isAuthenticated, loading } = useAuthContext()
  const [domain, setDomain] = useState("yourdomain.com")
  const router = useRouter()

  useEffect(() => {
    setDomain(window.location.host)
  }, [])

  useEffect(() => {
    if (!loading && isAuthenticated && profile?.username) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, profile?.username, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (isAuthenticated && profile?.username) {
    return null
  }

  return (
    <div className="min-h-screen ">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-32 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Right Circle */}
          <div className="absolute -top-4 -right-4 sm:right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-black to-yellow-400 rounded-full opacity-70"></div>
          
          {/* Left Side Yellow Circle */}
          <div className="absolute top-32 sm:top-48 -left-16 sm:-left-30 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-48 lg:h-48 bg-gradient-to-br from-black to-yellow-500 rounded-full opacity-80"></div>
          
          {/* Bottom Right Circle */}
          <div className="absolute hidden lg:block bottom-0 right-20 w-32 h-32 bg-gradient-to-br from-black to-yellow-100 rounded-full opacity-70"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-12 relative z-10">
          {/* Main Heading */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight text-gray-900 px-2">
              Get paid in every way possible through a Universal Payment Profile
            </h1>
           
            <p className="text-lg sm:text-xl lg:text-xl text-gray-600 mt-6 sm:mt-8 px-2">
              One link. Every way to pay.
            </p>
          </div>

          {/* URL Input Section */}
          <div className="max-w-2xl mx-auto px-2">
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
              {/* URL Input */}
              <div className="w-full max-w-md">
                <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-full border border-gray-200 px-3 sm:px-6 py-3 sm:py-4 shadow-sm">
                  <span className="text-gray-900 font-medium text-sm sm:text-base truncate">https://{domain}/</span>
                  <input 
                    type="text" 
                    placeholder={isAuthenticated && profile?.username ? profile.username : "username"}
                    value={(isAuthenticated && profile?.username) ? profile.username : "username"}
                    className="bg-transparent outline-none text-gray-400 font-normal min-w-0 flex-1 text-sm sm:text-base"
                    readOnly={true}
                  />
                </div>
              </div>
              
              {/* Button */}
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-colors text-sm sm:text-base">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Link href="/signup">
                    <button className="bg-gray-900 hover:bg-gray-800 border-2 border-yellow-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-medium transition-colors text-sm sm:text-base">
                      Get started
                    </button>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-500">
                    $5 One time. Forever.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Freedom Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-2xl font-light text-gray-900">
            Collect Payments, dust and living matter
            </h3>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col items-center space-y-6">
            {/* Top Wide Card */}
            <div className="w-full max-w-4xl h-64 bg-yellow-500 rounded-2xl shadow-sm border border-gray-100"></div>
            
            {/* Bottom Two Cards */}
            <div className="flex gap-6 w-full max-w-4xl">
              <div className="flex-1 h-48 bg-yellow-500 rounded-2xl shadow-sm border border-gray-100"></div>
              <div className="flex-1 h-48 bg-yellow-500 rounded-2xl shadow-sm border border-gray-100"></div>
            </div>
          </div>
        </div>
      </section>

      {/* <BillaComponent /> */}
    
      {/* How It Works Section */}
      <HowItWorks />

      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* Pricing */}
      <Pricing />

      {/* Footer */}
      <Footer />
    </div>
  )
}


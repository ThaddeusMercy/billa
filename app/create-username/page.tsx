"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, User, Sparkles, CreditCard, Smartphone, Wallet, ArrowRight, Instagram, Github, Linkedin, Youtube, Globe, Copy, Plus, X as XClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuthContext } from "@/contexts/AuthContext"

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default function CreateUsernamePage() {
  const router = useRouter()
  const { updateProfile, user, profile, loading } = useAuthContext()
  const [username, setUsername] = useState("")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'twitter', value: '' }
  ])
  const [isClient, setIsClient] = useState(false)
  const [showSocialConfirm, setShowSocialConfirm] = useState(false)
  const [showSweetScreen, setShowSweetScreen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <XIcon className="w-5 h-5 text-black/60" />
      case 'instagram':
        return <Instagram className="w-5 h-5 text-black/60" />
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-black/60" />
      case 'github':
        return <Github className="w-5 h-5 text-black/60" />
      case 'youtube':
        return <Youtube className="w-5 h-5 text-black/60" />
      case 'website':
        return <Globe className="w-5 h-5 text-black/60" />
      default:
        return <Globe className="w-5 h-5 text-black/60" />
    }
  }

  const getSocialPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'X (Twitter)'
      case 'instagram':
        return 'Instagram'
      case 'linkedin':
        return 'LinkedIn'
      case 'github':
        return 'GitHub'
      case 'youtube':
        return 'YouTube'
      case 'website':
        return 'Website'
      default:
        return platform
    }
  }

  const validateAndExtractUsername = (platform: string, inputValue: string) => {
    if (!inputValue.trim()) return inputValue

    try {
      let url: URL
      if (inputValue.startsWith('http://') || inputValue.startsWith('https://')) {
        url = new URL(inputValue)
      } else {
        url = new URL(`https://${inputValue}`)
      }

      const validDomains: Record<string, string[]> = {
        twitter: ['twitter.com', 'x.com'],
        instagram: ['instagram.com'],
        linkedin: ['linkedin.com'],
        github: ['github.com'],
        youtube: ['youtube.com'],
        website: []
      }

      if (platform !== 'website' && validDomains[platform]) {
        const isValidDomain = validDomains[platform].some(domain => 
          url.hostname === domain || url.hostname === `www.${domain}`
        )
        
        if (!isValidDomain) {
          toast.error(`Please enter a valid ${platform} URL`)
          return null
        }
      }

      const pathParts = url.pathname.split('/').filter(part => part.length > 0)
      
      if (platform === 'website') {
        return url.toString().replace(/^https?:\/\//, '')
      } else if (pathParts.length > 0) {
        let username = pathParts[0]
        
        if (platform === 'linkedin' && pathParts[0] === 'in' && pathParts[1]) {
          username = pathParts[1]
        }
        
        return username
      } else {
        toast.error('Please enter a valid profile URL')
        return null
      }
    } catch (error) {
      toast.error('Please enter a valid URL')
      return null
    }
  }

  const updateSocialLink = (index: number, field: 'platform' | 'value', newValue: string) => {
    if (field === 'value') {
      const currentPlatform = socialLinks[index]?.platform || 'twitter'
      const extractedValue = validateAndExtractUsername(currentPlatform, newValue)
      
      if (extractedValue === null) return
      
      setSocialLinks(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: extractedValue }
        return updated
      })
    } else {
      setSocialLinks(prev => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: newValue }
        return updated
      })
    }
  }

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { platform: 'twitter', value: '' }])
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index))
  }

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null)
      return
    }

    console.log('Frontend: Starting username check for:', value)
    setIsChecking(true)
    
    try {
      console.log('Frontend: Making API call to /api/check-username')
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: value })
      })
      
      console.log('Frontend: API response status:', response.status)
      
      const data = await response.json()
      console.log('Frontend: API response data:', data)
      
      setIsAvailable(data.available)
    } catch (error) {
      console.error('Frontend: Error checking username:', error)
      setIsAvailable(false)
    } finally {
    setIsChecking(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(value)
    if (value.length >= 3) {
      checkUsername(value)
    } else {
      setIsAvailable(null)
    }
  }

  const handleCreateUsername = async () => {
    if (!username || !isAvailable || !user) return
    
    console.log('🚀 Starting username creation process...')
    setIsCreating(true)
    localStorage.setItem('billa-onboarding-active', 'true')
    
    try {
      console.log('📝 Creating username for user:', user.id, 'username:', username)
      console.log('📧 User email:', user.email)
      
      // Try the auth hook method first
      try {
        console.log('🔄 Trying updateProfile method...')
        await updateProfile({ username })
        console.log('✅ updateProfile succeeded!')
      } catch (authError) {
        console.log('❌ Auth hook failed, trying API approach:', authError)
        
        console.log('📡 Making API call to /api/create-profile...')
        const startTime = Date.now()
        
        // Create an API endpoint to handle this server-side with proper permissions
        const response = await fetch('/api/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            userId: user.id,
            email: user.email
          })
        })
        
        const endTime = Date.now()
        console.log(`⏱️ API call took ${endTime - startTime}ms`)
        console.log('📥 API response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.log('❌ API error response:', errorData)
          throw new Error(errorData.error || 'Failed to create profile')
        }
        
        const data = await response.json()
        console.log('✅ API approach succeeded:', data)
      }
      
      console.log('🎉 Username creation successful!')
      toast.success("🎉 Username created!", {
        description: `Your Billa link is ready: ${getDisplayUrl(username)}`,
        duration: 4000,
      })
      
      setShowOnboarding(true)
    } catch (error: any) {
      console.error('💥 Error creating username:', error)
      toast.error(error.message || 'Failed to create username')
      setIsCreating(false)
      localStorage.removeItem('billa-onboarding-active')
    }
  }

  const getDisplayUrl = (usernameParam?: string) => {
    const name = usernameParam || username || 'yourname'
    return `billa.gg/${name}`
  }

  const getShareableUrl = (usernameParam?: string) => {
    const name = usernameParam || username
    if (!isClient) return `https://billa.gg/${name}`
    return `${window.location.origin}/${name}`
  }

  return (
    <>
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
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-black/10 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-8 lg:hidden">
               
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-bold text-xl sm:text-2xl text-black">Billa.</span>
                </Link>
                <div className="w-5"></div>
              </div>

             

              <div className="text-center mb-6 sm:mb-8">
                {/* <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-black/70" />
                </div> */}
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">Almost done! Create your username</h1>
            <p className="text-black/60 text-sm sm:text-base">This will be your personal Billa payment link</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black/70 mb-2">
                Choose your username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 text-sm">
                  billa.gg/
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="yourname"
                  className="pl-16 h-12 rounded-xl border-2 border-black/10 focus:border-black/20 text-base"
                  disabled={isCreating}
                />
                {isChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  </div>
                )}
                {isAvailable === true && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {isAvailable === false && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XClose className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              
              {username.length > 0 && username.length < 3 && (
                <p className="mt-2 text-sm text-red-500">Username must be at least 3 characters</p>
              )}
              {isAvailable === true && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  {getDisplayUrl()} is available!
                </p>
              )}
              {isAvailable === false && (
                <p className="mt-2 text-sm text-red-500">Username is not available</p>
              )}
            </div>

            <div className="bg-black/5 rounded-xl p-4">
              <p className="text-sm text-black/70 mb-2">Your Billa link will be:</p>
              <p className="font-mono text-black bg-white rounded-lg p-3 border text-sm">
                {getDisplayUrl(username)}
              </p>
            </div>
          </div>

          <div className="mt-8">
           
            
            <Button
              onClick={handleCreateUsername}
              disabled={!username || isAvailable !== true || isCreating || !user}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-xl h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                "Create My Billa"
              )}
            </Button>

            <p className="text-center text-xs text-black/50 mt-2">
              Choose carefully - usernames cannot be changed
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 lg:left-80 bg-white flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-sm sm:max-w-lg my-4 sm:my-0">
            <div className="mb-4 sm:mb-8 px-2">
              <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out" style={{ width: '66%' }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-black/10 shadow-lg transform animate-in zoom-in-95 duration-300">
              <div className="text-center mb-4 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">Welcome, {username}! 🎉</h2>
              <p className="text-sm sm:text-base lg:text-lg text-black/60 px-2">
                Your personal payment link <span className="font-semibold break-all">{getDisplayUrl(username)}</span> is ready
              </p>
            </div>

            <div className="space-y-3 sm:space-y-6 mb-4 sm:mb-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-black text-center mb-2 sm:mb-4">
                Now you can add your payment options:
              </h3>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/5 rounded-xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-black text-sm sm:text-base">Bank Accounts</h4>
                    <p className="text-xs sm:text-sm text-black/60">Connect your bank for direct transfers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/5 rounded-xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-black text-sm sm:text-base">Mobile Wallets</h4>
                    <p className="text-xs sm:text-sm text-black/60">Apple Pay, Google Pay, Venmo, and more</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/5 rounded-xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-black text-sm sm:text-base">Crypto Wallets</h4>
                    <p className="text-xs sm:text-sm text-black/60">Bitcoin, Ethereum, and other currencies</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
                onClick={() => {
                  setShowOnboarding(false)
                  setShowSetup(true)
                }}
                className="w-full bg-black hover:bg-black/90 text-white rounded-full py-4 sm:py-6 text-sm sm:text-base font-medium">
              Let's Get Started
              </Button>

              {/* <button
                onClick={() => {
                setShowOnboarding(false)
                setShowSetup(true)
                  }}
              className="w-full text-black/60 hover:text-black font-medium text-sm sm:text-base mt-2 sm:mt-3"
            >
              Skip for now
            </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Social Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-gray-50 flex z-50 overflow-y-auto">
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
          <div className="flex-1 lg:ml-80 flex flex-col p-3 sm:p-4">
            {/* Continue/Skip Button - Top Right */}
            <div className="w-full flex justify-end mt-2 sm:mt-4 lg:mt-12 mb-2 sm:mb-4">
              <button
                onClick={() => {
                  setShowSetup(false)
                  setShowSweetScreen(true)
                }}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
              >
                Skip For Now
              </button>
            </div>

            {/* Content Container - Centered */}
            <div className="flex-1 flex flex-col justify-start sm:justify-center items-center min-h-0">
              {/* Progress Bar */}
              <div className="w-full max-w-md mb-4 sm:mb-6 lg:mb-8">
                <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="w-full max-w-lg lg:max-w-2xl">
                <div className="text-center mb-4 sm:mb-6 lg:mb-12">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-black mb-2 sm:mb-4">Set up a Few Things</h1>
                  <p className="text-sm sm:text-base lg:text-xl text-gray-600">Connect your social accounts to build your profile</p>
                </div>

                {/* Socials Section - Centered */}
                <div className="flex justify-center">
                  <div className="w-full max-w-lg">
                    <h2 className="text-base sm:text-lg lg:text-2xl font-semibold text-black mb-3 sm:mb-4 lg:mb-6 text-center">Connect Your Socials</h2>
                    <div className="space-y-3 sm:space-y-4">
                      {socialLinks.map((link, index) => (
                        <div key={index} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 hover:border-gray-300 transition-colors">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                                {getSocialIcon(link.platform)}
                              </div>
                              <select
                                value={link.platform}
                                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                className="flex-1 bg-transparent border-none focus:outline-none font-medium text-black text-sm"
                              >
                                <option value="twitter">X (Twitter)</option>
                                <option value="instagram">Instagram</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="github">GitHub</option>
                                <option value="youtube">YouTube</option>
                                <option value="website">Website</option>
                              </select>
                              {socialLinks.length > 1 && (
                                <button
                                  onClick={() => removeSocialLink(index)}
                                  className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                                >
                                  <XClose className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="pl-11">
                              <input
                                type="text"
                                value={link.value}
                                onChange={(e) => updateSocialLink(index, 'value', e.target.value)}
                                placeholder={`Enter ${getSocialPlatformName(link.platform)} URL`}
                                className="w-full bg-transparent border-none focus:outline-none text-base text-black/70 placeholder-black/40"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={addSocialLink}
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 hover:border-gray-400 cursor-pointer transition-colors"
                      >
                        <div className="text-center">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-100 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500">Add Social Account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6 sm:mt-8 lg:mt-12">
                  <Button
                    onClick={async () => {
                      const validSocialLinks = socialLinks.filter(link => link.value.trim() !== '')
                      
                      if (validSocialLinks.length === 0) {
                        setShowSocialConfirm(true)
                        return
                      }

                      try {
                        await updateProfile({ social_links: validSocialLinks })
                        toast.success('Social accounts added successfully!')
                        setShowSetup(false)
                        setShowSweetScreen(true)
                      } catch (error) {
                        console.error('Error saving social links:', error)
                        toast.error('Failed to save social links')
                      }
                    }}
                    className="bg-black hover:bg-gray-800 text-white rounded-full px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-medium"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Confirmation Modal */}
      {showSocialConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-black mb-2">Add your social accounts?</h3>
              <p className="text-gray-600">Adding social accounts helps build your profile and makes it easier for people to connect with you.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setShowSocialConfirm(false)
                }}
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3"
              >
                Add Social Accounts
              </Button>
              
              <Button
                onClick={() => {
                  setShowSocialConfirm(false)
                  setShowSetup(false)
                  setShowSweetScreen(true)
                }}
                variant="outline"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 rounded-full py-3"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sweet Screen - Final Completion */}
      {showSweetScreen && (
        <div className="fixed inset-0 bg-gray-50 flex z-50 overflow-y-auto">
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
          <div className="flex-1 lg:ml-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-lg relative overflow-hidden">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="w-full max-w-xs h-3 bg-gray-200 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-black mb-4">Sweet!</h1>
                <p className="text-xl text-black/80 mb-6">
                  Welcome to billa, {username}!
                </p>
                
                {/* Orange Circle Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mx-auto mb-6"></div>
                
                {/* Link with Checkmark */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-black font-medium">billa.gg/{username}</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <p className="text-black/60 text-base">
                  You can customize your profile later.
                </p>
              </div>

              <Button
                onClick={() => {
                  setShowSweetScreen(false)
                  localStorage.removeItem('billa-onboarding-active')
                  router.push('/dashboard')
                }}
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-4 text-lg font-medium mb-6"
              >
                Let's Go!
              </Button>

              {/* Confetti Elements */}
              <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
                {/* Confetti pieces */}
                <div className="absolute bottom-4 left-8 w-3 h-6 bg-yellow-400 rounded transform rotate-12"></div>
                <div className="absolute bottom-6 left-16 w-4 h-3 bg-orange-400 rounded transform -rotate-45"></div>
                <div className="absolute bottom-8 left-24 w-2 h-4 bg-blue-400 rounded transform rotate-45"></div>
                <div className="absolute bottom-5 left-32 w-3 h-3 bg-green-400 rounded transform -rotate-12"></div>
                
                <div className="absolute bottom-6 right-8 w-3 h-6 bg-blue-500 rounded transform -rotate-12"></div>
                <div className="absolute bottom-4 right-16 w-4 h-3 bg-purple-400 rounded transform rotate-45"></div>
                <div className="absolute bottom-7 right-24 w-2 h-4 bg-yellow-500 rounded transform -rotate-45"></div>
                <div className="absolute bottom-3 right-32 w-3 h-3 bg-orange-500 rounded transform rotate-12"></div>
                
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-green-500 rounded rotate-45"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-6 w-2 h-3 bg-blue-400 rounded -rotate-12"></div>
                <div className="absolute bottom-4 left-1/2 transform translate-x-4 w-4 h-2 bg-purple-500 rounded  rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
"use client"

import { useAuthContext } from "@/contexts/AuthContext"
import { ExternalLink } from "lucide-react"

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

export default function PreviewSection({ paymentMethods }: { paymentMethods: any[] }) {
  const { user, profile } = useAuthContext()

  const getDisplayUsername = () => {
    return profile?.username || user?.email?.split('@')[0] || 'user'
  }

  const getDisplayName = () => {
    return profile?.full_name || getDisplayUsername()
  }

  const getBillaUrl = () => {
    if (typeof window === 'undefined') return `yourdomain.com/${getDisplayUsername()}`
    return `${window.location.host}/${getDisplayUsername()}`
  }

  const getAvatarDisplay = () => {
    if (profile?.avatar_url) {
      return (
        <img 
          src={profile.avatar_url} 
          alt="Profile" 
          className="h-12 w-12 rounded-full object-cover"
        />
      )
    }
    
    return (
      <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl">
        {getDisplayName().charAt(0).toUpperCase()}
      </div>
    )
  }

  const getSocialLinks = () => {
    if (!profile?.social_links || !Array.isArray(profile.social_links)) {
      return []
    }
    return profile.social_links.filter(link => link.value && link.value.trim() !== '')
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <XIcon className="w-3 h-3" />
      case 'instagram':
        return '📷'
      case 'linkedin':
        return '💼'
      case 'github':
        return '🐙'
      case 'youtube':
        return '📺'
      case 'website':
        return '🌐'
      default:
        return '🔗'
    }
  }

  const getSocialUrl = (platform: string, value: string) => {
    const cleanValue = value.replace('@', '').replace(/^https?:\/\//, '')
    
    switch (platform.toLowerCase()) {
      case 'twitter':
        return `https://twitter.com/${cleanValue}`
      case 'instagram':
        return `https://instagram.com/${cleanValue}`
      case 'linkedin':
        return `https://linkedin.com/in/${cleanValue}`
      case 'github':
        return `https://github.com/${cleanValue}`
      case 'youtube':
        return `https://youtube.com/@${cleanValue}`
      case 'website':
        return cleanValue.startsWith('http') ? cleanValue : `https://${cleanValue}`
      default:
        return cleanValue.startsWith('http') ? cleanValue : `https://${cleanValue}`
    }
  }

  return (
    <div className="w-full md:w-1/3">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold text-black mb-4">Live Preview</h3>
        <p className="text-sm text-gray-600 mb-6">This is how your Billa profile looks to others</p>

        <div className="bg-gray-100 text-black p-6 rounded-3xl shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            {getAvatarDisplay()}
            <div>
              <h3 className="font-bold">@{getDisplayUsername()}</h3>
              <p className="text-sm text-gray-600">{getBillaUrl()}</p>
            </div>
          </div>
          
          {profile?.bio && (
            <p className="text-sm mb-4">{profile.bio}</p>
          )}
          
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white p-3 rounded-xl flex items-center gap-3 border">
                <div className={`h-8 w-8 rounded-full ${method.color} flex items-center justify-center`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                    <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4"></path>
                  </svg>
                </div>
                <span className="font-medium">{method.label}</span>
              </div>
            ))}
          </div>

          {getSocialLinks().length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Connect</h4>
              <div className="flex flex-wrap gap-2">
                {getSocialLinks().map((link, index) => (
                  <a
                    key={index}
                    href={getSocialUrl(link.platform, link.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white border rounded-xl text-sm hover:bg-gray-50 transition-colors group"
                  >
                    <span>{getSocialIcon(link.platform)}</span>
                    <span className="text-gray-700">{link.value}</span>
                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


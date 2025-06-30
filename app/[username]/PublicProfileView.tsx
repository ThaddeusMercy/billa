"use client"

import React, { useState } from 'react'
import { 
  Copy, 
  Check, 
  Building2, 
  Bitcoin, 
  Globe,
  Share2,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface PublicProfileViewProps {
  profile: {
    id: string
    username: string
    full_name?: string
    bio?: string
    avatar_url?: string
    paymentMethods: any[]
  }
  username: string
}

export default function PublicProfileView({ profile, username }: PublicProfileViewProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const getBillaUrl = () => {
    if (typeof window === 'undefined') return `yourdomain.com/${username}`
    return `${window.location.host}/${username}`
  }

  const getColorClasses = (colorName: string) => {
    const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
      blue: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', hover: 'hover:bg-blue-100' },
      green: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', hover: 'hover:bg-green-100' },
      orange: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', hover: 'hover:bg-orange-100' },
      purple: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', hover: 'hover:bg-purple-100' },
      emerald: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', hover: 'hover:bg-emerald-100' },
      pink: { bg: 'bg-pink-50 border-pink-200', text: 'text-pink-700', hover: 'hover:bg-pink-100' },
      indigo: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', hover: 'hover:bg-indigo-100' },
      red: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', hover: 'hover:bg-red-100' },
    }
    return colorMap[colorName] || colorMap.blue
  }

  const getMethodIcon = (method: any) => {
    if (method.icon_type === 'emoji' && method.icon_value) {
      return <span className="text-xl">{method.icon_value}</span>
    }
    
    if (method.category === 'bank') {
      return <Building2 className="h-5 w-5" />
    }
    if (method.category === 'crypto') {
      return <Bitcoin className="h-5 w-5" />
    }
    
    return <span className="text-xl">💳</span>
  }

  const getDisplayInfo = (method: any) => {
    if (method.category === 'bank') {
      return {
        title: method.type,
        subtitle: method.account_number,
        detail: method.account_name,
        copyText: method.account_number,
        copyLabel: 'Account Number'
      }
    } else if (method.category === 'crypto') {
      return {
        title: method.type,
        subtitle: method.wallet_address?.length > 20 ? `${method.wallet_address.slice(0, 15)}...${method.wallet_address.slice(-6)}` : method.wallet_address,
        detail: null,
        copyText: method.wallet_address,
        copyLabel: 'Wallet Address'
      }
    } else if (method.category === 'digital') {
      return {
        title: method.type,
        subtitle: method.digital_wallet_id,
        detail: null,
        copyText: method.digital_wallet_id,
        copyLabel: method.type
      }
    }
    return {
      title: method.type,
      subtitle: method.identifier,
      detail: null,
      copyText: method.identifier,
      copyLabel: method.type
    }
  }

  const handleCopy = async (text: string, id: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(id)
      toast.success(`${label || 'Payment info'} copied!`, {
        description: text.length > 30 ? `${text.slice(0, 30)}...` : text
      })
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handlePaymentClick = (method: any) => {
    const info = getDisplayInfo(method)
    handleCopy(info.copyText, method.id.toString(), info.copyLabel)
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${profile.full_name || username}'s Payment Profile`,
        text: `Send payments to ${profile.full_name || username}`,
        url: window.location.href
      })
    } catch (err) {
      handleCopy(window.location.href, 'link')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-6 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl">
                {(profile.full_name || username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2">{profile.full_name || username}</h1>
          {profile.bio && (
            <p className="text-xs sm:text-sm lg:text-base text-black/60 mb-3 sm:mb-4 leading-relaxed max-w-xs sm:max-w-sm lg:max-w-md mx-auto px-2">{profile.bio}</p>
          )}
          
          <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-black/50 mb-3 sm:mb-4 flex-wrap px-2">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="break-all text-center min-w-0">{getBillaUrl()}</span>
            <button
              onClick={() => handleCopy(window.location.href, 'link')}
              className="p-1 hover:bg-black/5 rounded transition-colors flex-shrink-0"
            >
              {copiedItem === 'link' ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="rounded-full border-black/20 text-black/60 hover:bg-black/5 text-xs sm:text-sm"
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Share
          </Button>
        </div>

        {profile.paymentMethods && profile.paymentMethods.length > 0 && (
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-black">Send Payment</h2>
            </div>
            
            {profile.paymentMethods.map((method: any) => (
              <div
                key={method.id}
                className={`w-full p-2.5 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border-2 transition-all hover:shadow-md ${getColorClasses(method.selected_color).bg} ${getColorClasses(method.selected_color).hover} relative`}
              >
                {method.tag && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-[4px] text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-sm border border-white/50 ${getColorClasses(method.selected_color).text}`}>
                      {method.tag}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <div className={getColorClasses(method.selected_color).text}>
                        {getMethodIcon(method)}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePaymentClick(method)}
                      className="flex-1 text-left group min-w-0"
                    >
                      <h3 className={`font-semibold text-xs sm:text-sm lg:text-base ${getColorClasses(method.selected_color).text} truncate`}>
                        {getDisplayInfo(method).title}
                      </h3>
                      <p className={`text-xs sm:text-sm ${getColorClasses(method.selected_color).text} opacity-80 truncate`}>
                        {getDisplayInfo(method).subtitle}
                      </p>
                      {getDisplayInfo(method).detail && (
                        <p className={`text-xs ${getColorClasses(method.selected_color).text} opacity-60 mt-1 truncate hidden sm:block`}>
                          {getDisplayInfo(method).detail}
                        </p>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        const info = getDisplayInfo(method)
                        handleCopy(info.copyText, method.id.toString(), info.copyLabel)
                      }}
                      className={`p-1 sm:p-1.5 lg:p-2 rounded-lg ${getColorClasses(method.selected_color).text} hover:bg-white/50 transition-colors`}
                      title={`Copy ${getDisplayInfo(method).copyLabel || getDisplayInfo(method).title}`}
                    >
                      {copiedItem === method.id.toString() ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handlePaymentClick(method)}
                      className={`p-1 sm:p-1.5 lg:p-2 rounded-lg ${getColorClasses(method.selected_color).text} hover:bg-white/50 transition-colors group`}
                    >
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <a href="/" className="text-xs text-black/40 hover:text-black/60 transition-colors">
            Powered by Billa
          </a>
        </div>
      </div>
    </div>
  )
} 
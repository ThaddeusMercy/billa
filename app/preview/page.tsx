"use client"

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Building2, 
  Bitcoin, 
  Smartphone,
  Globe,
  Heart,
  Share2,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Sidebar from '../components/Sidebar'
import { useAuthContext } from '@/contexts/AuthContext'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'

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

export default function PreviewPage() {
  const router = useRouter()
  const { user, profile, paymentMethods, setPaymentMethods } = useAuthContext()
  const { paymentMethods: methods, loading, deletePaymentMethod } = usePaymentMethods(paymentMethods, setPaymentMethods)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [isPublicPreview, setIsPublicPreview] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [methodToDelete, setMethodToDelete] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  const getDisplayUsername = () => {
    return profile?.username || user?.email?.split('@')[0] || 'user'
  }

  const getDisplayName = () => {
    return profile?.full_name || getDisplayUsername()
  }

  const getBillaUrl = () => {
    if (!isClient) return ''
    return `${window.location.host}/${getDisplayUsername()}`
  }

  const getShareableUrl = () => {
    if (!isClient) return ''
    return `${window.location.origin}/${getDisplayUsername()}`
  }

  const getAvatarDisplay = () => {
    if (profile?.avatar_url) {
      return (
        <img 
          src={profile.avatar_url} 
          alt="Profile" 
          className="w-24 h-24 rounded-full object-cover"
        />
      )
    }
    
    return (
      <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white font-bold text-2xl">
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

  const getMethodIcon = (method: any) => {
    if (method.icon_type === 'emoji' && method.icon_value) {
      return <span className="text-xl">{method.icon_value}</span>
    }
    
    // Default icons based on category
    if (method.category === 'bank') {
      return <Building2 className="h-5 w-5" />
    }
    if (method.category === 'crypto') {
      return <Bitcoin className="h-5 w-5" />
    }
    if (method.category === 'digital') {
      return <span className="text-xl">💳</span>
    }
    
    return <span className="text-xl">💳</span>
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
        subtitle: method.wallet_address.length > 20 ? `${method.wallet_address.slice(0, 15)}...${method.wallet_address.slice(-6)}` : method.wallet_address,
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
    // In real app, this would open the appropriate payment method
    toast.success(`Opening ${method.type}...`, {
      description: `Redirecting to ${getDisplayInfo(method).subtitle}`,
    })
  }

  const handleEdit = (paymentId: string) => {
    const method = methods.find(m => m.id === paymentId)
    if (method) {
      const serializableData = {
        id: method.id,
        type: method.type,
        category: method.category,
        identifier: method.identifier,
        bank_name: method.bank_name,
        account_number: method.account_number,
        account_name: method.account_name,
        routing_number: method.routing_number,
        coin_name: method.coin_name,
        network: method.network,
        wallet_address: method.wallet_address,
        digital_wallet_type: method.digital_wallet_type,
        digital_wallet_id: method.digital_wallet_id,
        selected_color: method.selected_color,
        tag: method.tag
      }
      
      const editData = encodeURIComponent(JSON.stringify(serializableData))
      router.push(`/add-payment?edit=${paymentId}&data=${editData}`)
    }
  }

  const handleDelete = (paymentId: string) => {
    const method = methods.find(m => m.id === paymentId)
    if (method) {
      setMethodToDelete(method)
      setDeleteModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (methodToDelete) {
      try {
        await deletePaymentMethod(methodToDelete.id)
        setDeleteModalOpen(false)
        setMethodToDelete(null)
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setMethodToDelete(null)
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${getDisplayName()}'s Payment Profile`,
        text: `Send payments to ${getDisplayName()}`,
        url: getShareableUrl()
      })
    } catch (err) {
      handleCopy(getShareableUrl(), 'link')
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {!isPublicPreview && <Sidebar />}
      
      {/* Mobile navbar for public preview */}
      {isPublicPreview && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <a href="/" className="text-2xl font-bold text-black">
              Billa.
            </a>
          </div>
        </div>
      )}
      
      <div className={`flex-1 ${!isPublicPreview ? 'lg:ml-60 pt-16 lg:pt-0' : 'pt-16 lg:pt-0'}`}>
        {/* Preview Notice Banner */}
        {!isPublicPreview && (
          <div className="bg-blue-50 border-b border-blue-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1 sm:mt-0 flex-shrink-0"></div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <span className="text-xs sm:text-sm font-medium text-blue-700">Preview Mode</span>
                  <span className="text-xs text-blue-600 mt-0.5 sm:mt-0 leading-tight">
                    This is how your page looks to you. Others will see the public version.
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setIsPublicPreview(true)}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm self-start sm:self-auto flex-shrink-0"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">View Public Preview</span>
              </Button>
            </div>
          </div>
        )}

        {/* Back to Edit Mode (only in public preview) */}
        {isPublicPreview && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => setIsPublicPreview(false)}
              className="bg-black hover:bg-black/90 text-white rounded-full shadow-lg text-xs sm:text-sm"
              size="sm"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Edit
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className={`min-h-screen ${isPublicPreview ? 'bg-gradient-to-br from-gray-50 to-white flex items-center justify-center' : 'bg-white'}`}>
          <div className={`py-4 sm:py-6 lg:py-8 px-4 sm:px-6 w-full ${isPublicPreview ? 'max-w-xl mx-auto' : ''}`}>
            <div className={isPublicPreview ? '' : 'max-w-2xl mx-auto'}>
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex justify-center mb-4">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                      {getDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">{getDisplayName()}</h1>
                <p className="text-sm sm:text-base text-black/60 mb-4 leading-relaxed max-w-xs sm:max-w-md mx-auto px-2">{profile?.bio}</p>
                
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-black/50 mb-4 flex-wrap">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                  {isClient && (
                    <span className="break-all">{getBillaUrl()}</span>
                  )}
                  {isClient && (
                    <button
                      onClick={() => handleCopy(getShareableUrl(), 'link')}
                      className="p-1 hover:bg-black/5 rounded transition-colors"
                    >
                      {copiedItem === 'link' ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  )}
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

              {/* Payment Methods */}
              <div className="space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-black">Send Payment</h2>
                  {!isPublicPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-black/60 hover:text-black h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                </div>
                
                {(methods || []).map((method) => (
                  <div
                    key={method.id}
                    className={`w-full p-3 sm:p-4 rounded-2xl border-2 transition-all hover:shadow-md ${getColorClasses(method.selected_color).bg} ${getColorClasses(method.selected_color).hover} relative group`}
                  >
                    {/* Tag display (always visible if tag exists) */}
                    {method.tag && (
                      <div className="absolute top-0 right-0 z-10">
                        <div className={`px-2 py-1 rounded-[4px] text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-sm border border-white/50 ${getColorClasses(method.selected_color).text}`}>
                          {method.tag}
                        </div>
                      </div>
                    )}

                    {/* Edit/Delete buttons (only in edit mode) */}
                    {!isPublicPreview && (
                      <div className={`absolute top-1 ${method.tag ? 'right-14' : 'right-1'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20`}>
                        <Button
                          onClick={() => handleEdit(method.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 sm:h-7 sm:w-7 p-0 bg-white/90 hover:bg-white shadow-sm"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(method.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 sm:h-7 sm:w-7 p-0 bg-white/90 hover:bg-white text-red-600 shadow-sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <div className={getColorClasses(method.selected_color).text}>
                            {getMethodIcon(method)}
                          </div>
                        </div>
                        <button
                          onClick={() => handlePaymentClick(method)}
                          className="flex-1 text-left group min-w-0"
                        >
                          <h3 className={`font-semibold text-sm sm:text-base ${getColorClasses(method.selected_color).text} truncate`}>{getDisplayInfo(method).title}</h3>
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
                          onClick={() => handleCopy(getDisplayInfo(method).copyText, method.id.toString(), getDisplayInfo(method).copyLabel)}
                          className={`p-1.5 sm:p-2 rounded-lg ${getColorClasses(method.selected_color).text} hover:bg-white/50 transition-colors`}
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
                          className={`p-1.5 sm:p-2 rounded-lg ${getColorClasses(method.selected_color).text} hover:bg-white/50 transition-colors group`}
                        >
                          <ArrowUpRight className={`h-4 w-4 sm:h-5 sm:w-5 ${getColorClasses(method.selected_color).text} opacity-60 group-hover:opacity-100 transition-opacity`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              {getSocialLinks().length > 0 && (
                <div className="border-t border-black/10 pt-4 sm:pt-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <h3 className="text-sm font-medium text-black/60">Connect</h3>
                    {!isPublicPreview && (
                      <Button
                        onClick={() => router.push('/account')}
                        variant="ghost"
                        size="sm"
                        className="text-black/60 hover:text-black h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                    {getSocialLinks().map((link) => (
                      <a
                        key={link.platform}
                        href={getSocialUrl(link.platform, link.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 text-gray-600 rounded-xl text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                      >
                        <span>{getSocialIcon(link.platform)}</span>
                        <span className="truncate max-w-[100px] sm:max-w-none">{link.value}</span>
                        <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-black/10">
                <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-black/40">
                  <span>Made with</span>
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
                  <span>by</span>
                  <a href="/" className="font-semibold text-black hover:underline">Billa</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-black">Delete Payment Method</h3>
              </div>
              
              <p className="text-sm sm:text-base text-black/70 mb-2">
                Are you sure you want to delete <span className="font-medium">{methodToDelete?.type}</span>?
              </p>
              <p className="text-xs sm:text-sm text-red-600 mb-4 sm:mb-6">
                This action cannot be undone. You'll need to re-add this payment method if you want to use it again.
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1 border-black/20 text-black/70 hover:bg-black/5 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
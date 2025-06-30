"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Globe, Edit3, Save, X, Instagram, Github, Linkedin, Youtube, LogOut, Plus, Copy, Check, Trash2, Camera, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { uploadAvatar, deleteAvatar } from '@/lib/upload'
import { supabase } from '@/lib/supabase'


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

const AccountContent = () => {
  const { user, profile, updateProfile, signOut } = useAuthContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  
  const [formData, setFormData] = useState<{
    full_name: string
    username: string
    bio: string
    avatar_url: string
    social_links: Array<{platform: string, value: string}>
  }>({
    full_name: '',
    username: '',
    bio: '',
    avatar_url: '',
    social_links: []
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        social_links: Array.isArray(profile.social_links) ? profile.social_links : []
      })
    }
  }, [profile])



  const getUserBillaUrl = () => {
    const username = formData.username || user?.email?.split('@')[0] || 'user'
    if (!isClient) return `yourdomain.com/${username}`
    return `${window.location.host}/${username}`
  }

  const getShareableUrl = () => {
    const username = formData.username || user?.email?.split('@')[0] || 'user'
    if (!isClient) return `https://yourdomain.com/${username}`
    return `${window.location.origin}/${username}`
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('Saving profile data:', formData)
      await updateProfile(formData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.replace('/signin')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareableUrl())
      setCopied(true)
      toast.success('Link copied!', {
        description: getUserBillaUrl()
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      // Delete old avatar if exists
      if (formData.avatar_url && !formData.avatar_url.startsWith('data:')) {
        await deleteAvatar(formData.avatar_url)
      }

      // Upload new avatar
      const avatarUrl = await uploadAvatar(file, user.id)
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }))

      // Automatically save to database
      await updateProfile({ avatar_url: avatarUrl })
      
      toast.success('Profile picture updated successfully!')
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      toast.error(error.message || 'Failed to upload profile picture')
    } finally {
      setUploading(false)
      // Reset file input
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!formData.avatar_url || formData.avatar_url.startsWith('data:')) return

    setUploading(true)
    try {
      // Delete from storage
      await deleteAvatar(formData.avatar_url)
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        avatar_url: ''
      }))

      // Save to database
      await updateProfile({ avatar_url: '' })
      
      toast.success('Profile picture removed successfully!')
    } catch (error: any) {
      console.error('Avatar removal error:', error)
      toast.error(error.message || 'Failed to remove profile picture')
    } finally {
      setUploading(false)
    }
  }

  const socialPlatforms = [
    { key: 'twitter', label: 'X (Twitter)', icon: XIcon },
    { key: 'instagram', label: 'Instagram', icon: Instagram },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { key: 'github', label: 'GitHub', icon: Github },
    { key: 'youtube', label: 'YouTube', icon: Youtube },
    { key: 'website', label: 'Website', icon: Globe },
  ]

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      social_links: [...(Array.isArray(prev.social_links) ? prev.social_links : []), { platform: 'twitter', value: '' }]
    }))
  }

  const validateAndExtractUsername = (platform: string, inputValue: string) => {
    // If empty, return as is
    if (!inputValue.trim()) return inputValue

    try {
      // Check if it's a URL
      let url: URL
      if (inputValue.startsWith('http://') || inputValue.startsWith('https://')) {
        url = new URL(inputValue)
      } else {
        // Try adding https:// prefix
        url = new URL(`https://${inputValue}`)
      }

      // Validate domain for each platform
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

      // Extract username from URL path
      const pathParts = url.pathname.split('/').filter(part => part.length > 0)
      
      if (platform === 'website') {
        // For website, return the full URL without protocol
        return url.toString().replace(/^https?:\/\//, '')
      } else if (pathParts.length > 0) {
        // For social platforms, extract username (first path segment)
        let username = pathParts[0]
        
        // Handle special cases
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
      const currentLinks = Array.isArray(formData.social_links) ? formData.social_links : []
      const currentPlatform = currentLinks[index]?.platform || 'twitter'
      
      // Validate and extract username
      const extractedValue = validateAndExtractUsername(currentPlatform, newValue)
      
      // If validation failed, don't update
      if (extractedValue === null) return
      
      setFormData(prev => {
        const updated = [...currentLinks]
        updated[index] = { ...updated[index], [field]: extractedValue }
        return { ...prev, social_links: updated }
      })
    } else {
      // For platform changes, update normally
      setFormData(prev => {
        const currentLinks = Array.isArray(prev.social_links) ? prev.social_links : []
        const updated = [...currentLinks]
        updated[index] = { ...updated[index], [field]: newValue }
        return { ...prev, social_links: updated }
      })
    }
  }

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social_links: (Array.isArray(prev.social_links) ? prev.social_links : []).filter((_, i) => i !== index)
    }))
  }



  return (
    <div className="pt-20 md:pt-20 px-4 pb-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Account Settings</h1>
          <p className="text-sm sm:text-base text-black/60 mt-1">Manage your profile and preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-2 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium overflow-hidden">
            <span className="truncate">{getUserBillaUrl()}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-green-200 rounded transition-colors shrink-0"
              title="Copy link"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors flex items-center justify-center min-h-[40px] sm:min-h-[auto]"
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>
  

      {/* Main Content */}
      <div className="max-w-2xl space-y-4 sm:space-y-6 w-full">
        {/* Profile Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-black/10 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="relative w-16 h-16 sm:w-16 sm:h-16 flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center overflow-hidden">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl sm:text-2xl font-semibold text-black/50">
                    {formData.full_name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="absolute -bottom-1 -right-1 flex gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Upload photo"
                  >
                    {uploading ? (
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                  {formData.avatar_url && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploading}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors ml-1"
                      title="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 space-y-4 w-full min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div className="w-full">
                  <label className="block text-xs font-medium text-black/60 mb-1">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
                      placeholder="Enter full name"
                      className="w-full h-9 rounded-lg border-black/20 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-black font-medium">{formData.full_name || 'Not set'}</p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-xs font-medium text-black/60 mb-1">Username</label>
                  <Input
                    value={formData.username}
                    disabled
                    placeholder="Username will be auto-generated"
                    className="w-full h-9 rounded-lg border-black/20 text-sm bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-xs font-medium text-black/60 mb-1">Email</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Mail className="h-4 w-4 text-black/50 shrink-0" />
                  <span className="text-sm text-black truncate flex-1 min-w-0">{user?.email}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs shrink-0">Verified</span>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-xs font-medium text-black/60 mb-1">Bio</label>
                {isEditing ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell us about yourself..."
                    className="w-full min-h-20 rounded-lg border-black/20 text-sm resize-none"
                    maxLength={160}
                  />
                ) : (
                  <p className="text-sm text-black">{formData.bio || (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-black/40 hover:text-black/60 transition-colors"
                    >
                      Set bio
                    </button>
                  )}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-black/10 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-black">Social Links</h3>
            {isEditing && (
              <Button
                onClick={addSocialLink}
                variant="ghost"
                size="sm"
                className="text-black/60 hover:text-black h-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3 w-full">
            {Array.isArray(formData.social_links) && formData.social_links.length > 0 ? (
              formData.social_links.map((link, index) => {
                const platform = socialPlatforms.find(p => p.key === link.platform)
                const Icon = platform?.icon || Globe
                
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-black/60" />
                      </div>
                      
                      {isEditing ? (
                        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
                          <Select
                            value={link.platform}
                            onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                          >
                            <SelectTrigger className="w-full sm:w-32 h-8 rounded-lg border-black/20 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {socialPlatforms.map((platform) => (
                                <SelectItem key={platform.key} value={platform.key}>
                                  {platform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={link.value}
                            onChange={(e) => updateSocialLink(index, 'value', e.target.value)}
                            placeholder={`Enter ${platform?.label} URL`}
                            className="flex-1 h-8 rounded-lg border-black/20 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-black/70 w-20 sm:w-20 shrink-0">{platform?.label}</span>
                          <span className="text-sm text-black flex-1 min-w-0 truncate">{link.value}</span>
                        </>
                      )}
                    </div>
                    
                    {isEditing && (
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-600 transition-colors self-start sm:self-center mt-2 sm:mt-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-black/40 text-sm">No social links added</p>
                {isEditing && (
                  <Button
                    onClick={addSocialLink}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-black/60 hover:text-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add social link
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 w-full">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 rounded-lg min-h-[44px] sm:min-h-[auto]"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          
          {isEditing && (
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full sm:w-auto bg-black hover:bg-black/90 text-white rounded-lg min-h-[44px] sm:min-h-[auto]"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountContent 
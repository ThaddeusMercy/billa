'use client'

import React, { useState, useEffect } from 'react'
import { Twitter, Instagram, Linkedin, Github, Globe, Plus, Check, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { SocialAuthService, SocialConnection, SOCIAL_PLATFORMS } from '@/lib/social-auth'
import { toast } from 'sonner'

const VerifiedSocialLinks = () => {
  const { user } = useAuthContext()
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadSocialConnections()
    }
  }, [user])

  const loadSocialConnections = async () => {
    if (!user) return
    
    try {
      const userConnections = await SocialAuthService.getUserSocialConnections(user.id)
      setConnections(userConnections)
    } catch (error) {
      console.error('Failed to load social connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    setConnecting(platform)
    
    try {
      if (platform === 'twitter') {
        // Generate state for security
        const state = crypto.randomUUID()
        sessionStorage.setItem('oauth_state', state)
        sessionStorage.setItem('oauth_platform', platform)
        
        // Redirect to Twitter OAuth
        const authUrl = SocialAuthService.generateTwitterAuthUrl(state)
        window.location.href = authUrl
      }
      // Add other platforms here
    } catch (error) {
      toast.error('Failed to connect account')
      setConnecting(null)
    }
  }

  const handleDisconnect = async (platform: string) => {
    if (!user) return
    
    try {
      await SocialAuthService.removeSocialConnection(user.id, platform)
      setConnections(prev => prev.filter(conn => conn.platform !== platform))
      toast.success(`${platform} account disconnected`)
    } catch (error) {
      toast.error('Failed to disconnect account')
    }
  }

  const platformIcons = {
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
    website: Globe
  }

  const supportedPlatforms = ['twitter'] // Add more as implemented

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-black/10">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-black">Verified Social Accounts</h3>
          <p className="text-sm text-black/60">Connect your social accounts to verify ownership</p>
        </div>
      </div>

      <div className="space-y-4">
        {supportedPlatforms.map((platform) => {
          const connection = connections.find(c => c.platform === platform)
          const Icon = platformIcons[platform as keyof typeof platformIcons] || Globe
          const isConnecting = connecting === platform

          return (
            <div key={platform} className="flex items-center justify-between p-4 border border-black/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-black/60" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black capitalize">{platform}</span>
                    {connection && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <Check className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  {connection ? (
                    <div className="flex items-center gap-2 text-sm text-black/60">
                      <span>@{connection.platform_username}</span>
                      <a 
                        href={`https://twitter.com/${connection.platform_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-black/40">Not connected</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {connection ? (
                  <Button
                    onClick={() => handleDisconnect(platform)}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(platform)}
                    disabled={isConnecting}
                    size="sm"
                    className="bg-black hover:bg-black/90 text-white"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {connections.length === 0 && (
        <div className="text-center py-6 text-black/40">
          <p className="text-sm">No social accounts connected yet</p>
          <p className="text-xs mt-1">Connect accounts to verify ownership and prevent impersonation</p>
        </div>
      )}
    </div>
  )
}

export default VerifiedSocialLinks 
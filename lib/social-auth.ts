import { supabase } from './supabase'

const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/twitter`

export interface SocialConnection {
  id: string
  user_id: string
  platform: string
  platform_user_id: string
  platform_username: string
  platform_display_name?: string
  platform_avatar_url?: string
  verified_at: string
}

export class SocialAuthService {
  // Generate Twitter OAuth URL
  static generateTwitterAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'tweet.read users.read',
      state: state,
      code_challenge: 'challenge', // In production, use PKCE
      code_challenge_method: 'plain'
    })
    
    return `https://twitter.com/i/oauth2/authorize?${params}`
  }

  // Exchange code for access token
  static async exchangeTwitterCode(code: string): Promise<{
    access_token: string
    refresh_token?: string
    user_data: any
  }> {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: 'challenge'
      })
    })

    const tokens = await tokenResponse.json()
    
    if (!tokens.access_token) {
      throw new Error('Failed to get access token')
    }

    // Fetch user data with access token
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,username,name,profile_image_url', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    const userData = await userResponse.json()
    
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user_data: userData.data
    }
  }

  // Save verified social connection
  static async saveSocialConnection(
    userId: string,
    platform: string,
    platformData: any,
    accessToken: string,
    refreshToken?: string
  ): Promise<SocialConnection> {
    if (typeof window === 'undefined') {
      throw new Error('Social connections can only be saved in the browser')
    }
    const connectionData = {
      user_id: userId,
      platform: platform,
      platform_user_id: platformData.id,
      platform_username: platformData.username,
      platform_display_name: platformData.name,
      platform_avatar_url: platformData.profile_image_url,
      access_token: this.encryptToken(accessToken), // Encrypt in production
      refresh_token: refreshToken ? this.encryptToken(refreshToken) : null
    }

    const { data, error } = await supabase
      .from('social_connections')
      .upsert(connectionData, {
        onConflict: 'user_id,platform'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get user's social connections
  static async getUserSocialConnections(userId: string): Promise<SocialConnection[]> {
    if (typeof window === 'undefined') {
      return []
    }
    const { data, error } = await supabase
      .from('social_connections')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data || []
  }

  // Check if social account is already claimed
  static async checkSocialAccountClaimed(platform: string, platformUserId: string): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false
    }
    const { data, error } = await supabase
      .from('social_connections')
      .select('id')
      .eq('platform', platform)
      .eq('platform_user_id', platformUserId)
      .maybeSingle()

    if (error) throw error
    return !!data
  }

  // Remove social connection
  static async removeSocialConnection(userId: string, platform: string): Promise<void> {
    const { error } = await supabase
      .from('social_connections')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform)

    if (error) throw error
  }

  // Simple encryption (use proper encryption in production)
  private static encryptToken(token: string): string {
    // In production, use proper encryption like AES
    return btoa(token)
  }

  private static decryptToken(encryptedToken: string): string {
    // In production, use proper decryption
    return atob(encryptedToken)
  }
}

// Supported platforms
export const SOCIAL_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    authUrl: SocialAuthService.generateTwitterAuthUrl
  },
  // Add more platforms later
  // instagram: { ... },
  // linkedin: { ... }
} as const

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS 
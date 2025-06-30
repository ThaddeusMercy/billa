"use client"

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import PublicProfileView from './PublicProfileView'

interface PageProps {
  params: {
    username: string
  }
}

interface UserProfile {
  id: string
  username: string
  full_name?: string
  bio?: string
  avatar_url?: string
  paymentMethods: any[]
}

export default function UsernamePage({ params }: PageProps) {
  const { username } = params
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/user/profile/${username}`)
        if (!response.ok) {
          setError(true)
          return
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error || !profile) {
    notFound()
  }

  return <PublicProfileView profile={profile} username={username} />
} 
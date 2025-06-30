'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'

function ProfilePageContent() {
  const router = useRouter()
  const { user, profile, updateProfile, signOut, loading } = useAuthContext()
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()} 
            className="text-black/70 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
          <div className="w-5"></div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-black/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-black">
                  {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 hover:bg-black/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-1">
                Email
              </label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-gray-50 border-gray-200 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-1">
                Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                className="border-black/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-1">
                Full Name
              </label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
                className="border-black/20"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-black hover:bg-black/90 text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
} 
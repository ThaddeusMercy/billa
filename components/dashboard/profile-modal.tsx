"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfileModal({ username, setUsername, onClose }: { username: string; setUsername: (username: string) => void; onClose: () => void }) {
  const [newUsername, setNewUsername] = useState(username)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleSave = () => {
    setUsername(newUsername)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200 border">
        <h3 className="text-xl font-bold text-black mb-6">Manage Profile</h3>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-black flex items-center justify-center text-white font-bold text-3xl relative">
              {newUsername.charAt(0).toUpperCase()}
              <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileImage(URL.createObjectURL(e.target.files[0]))
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">Upload a profile picture</p>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">billa.gg/</span>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="rounded-xl border-gray-300 focus:border-black"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              defaultValue="user@example.com"
              className="rounded-xl border-gray-300 focus:border-black"
              placeholder="Email address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


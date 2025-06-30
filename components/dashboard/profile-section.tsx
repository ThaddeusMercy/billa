"use client"

import { Button } from "@/components/ui/button"

export default function ProfileSection({ bio, setBio, username, onManageProfile }: { bio: string; setBio: (bio: string) => void; username: string; onManageProfile: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center text-white font-bold text-2xl relative">
          {username.charAt(0).toUpperCase()}
          <button
            onClick={onManageProfile}
            className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full"
          >
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
          </button>
        </div>
        <div>
          <h3 className="font-bold text-black">@{username}</h3>
          <p className="text-sm text-gray-600">Update your profile photo and information</p>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-xl border border-gray-300 p-3 min-h-[100px] focus:border-black focus:outline-none"
          placeholder="Tell people about yourself..."
        />
      </div>

      <Button className="bg-black hover:bg-gray-800 text-white rounded-xl">Save Profile</Button>
    </div>
  )
}


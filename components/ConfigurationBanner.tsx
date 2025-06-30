"use client"

import { useState } from 'react'
import { AlertTriangle, X, ExternalLink, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function ConfigurationBanner() {
  const [dismissed, setDismissed] = useState(false)
  const isConfigured = isSupabaseConfigured()

  // Don't show banner if properly configured or dismissed
  if (isConfigured || dismissed) {
    return null
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Supabase Configuration Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Add your Supabase environment variables to Netlify to enable full functionality
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 text-xs"
            onClick={() => window.open('https://app.netlify.com/sites/comforting-hummingbird-73f137/settings/deploys#environment-variables', '_blank')}
          >
            <Settings className="h-3 w-3 mr-1" />
            Netlify Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 text-xs"
            onClick={() => window.open('/DEPLOYMENT_GUIDE.md', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Setup Guide
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
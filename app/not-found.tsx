import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-black mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-black mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            This Billa profile doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-black hover:bg-black/90 text-white px-8">
              Go Home
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            Want to create your own? <Link href="/signup" className="text-black hover:underline font-medium">Sign up for Billa</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
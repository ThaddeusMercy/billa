import Link from "next/link"
import { Twitter, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer id="support" className="bg-white text-black pb-6 pt-16 px-4 sm:pb-8 sm:pt-20">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-12">
          
          {/* Logo */}
          <div className="py-4">
            <span className="font-bold text-3xl text-black">Billa.</span>
          </div>

          {/* Social and Legal sections */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 w-full justify-center">
            <div className="flex flex-col items-center">
              <h4 className="font-bold mb-4 text-black text-lg">Social</h4>
              <div className="flex gap-6 justify-center">
                <Link href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-yellow-500 hover:text-yellow-600 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.2v-3.44a4.85 4.85 0 0 1-1-.63Z"/>
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <h4 className="font-bold mb-4 text-black text-lg">Legal</h4>
              <div className="flex gap-6 text-base">
                <Link href="#" className="text-black/70 hover:text-black transition-colors">
                  Terms
                </Link>
                <Link href="#" className="text-black/70 hover:text-black transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6 w-full">
            <p className="text-sm text-black/70">© {new Date().getFullYear()} Billa. All rights reserved.</p>
          </div>
          
        </div>
      </div>
    </footer>
  )
}

export default Footer; 
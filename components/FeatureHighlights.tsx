import Link from "next/link"
import { ArrowRight, CheckCircle, Globe, Smartphone, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

const FeatureHighlights = () => {
  return (
    <section id="features" className="container mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-black text-white rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white leading-tight sm:leading-normal">Why Choose Billa</h2>
        <p className="text-white/70 max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-sm sm:text-base leading-tight sm:leading-normal">
          The simplest way to receive payments across multiple platforms
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto">
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm border w-full">
          <div className="h-8 w-8 sm:h-12 sm:w-12 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-black leading-tight">Multiple Payment Methods</h3>
          <p className="text-black/70 text-xs sm:text-sm lg:text-base leading-tight sm:leading-normal">Connect all your payment accounts in one place</p>
        </div>
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm border w-full">
          <div className="h-8 w-8 sm:h-12 sm:w-12 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-black leading-tight">One Simple Link</h3>
          <p className="text-black/70 text-xs sm:text-sm lg:text-base leading-tight sm:leading-normal">Share a single link for all your payment options</p>
        </div>
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm border w-full">
          <div className="h-8 w-8 sm:h-12 sm:w-12 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Globe className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-black leading-tight">Works Globally</h3>
          <p className="text-black/70 text-xs sm:text-sm lg:text-base leading-tight sm:leading-normal">Support for both crypto and fiat currencies worldwide</p>
        </div>
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm border w-full">
          <div className="h-8 w-8 sm:h-12 sm:w-12 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Smartphone className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-black leading-tight">Mobile Friendly</h3>
          <p className="text-black/70 text-xs sm:text-sm lg:text-base leading-tight sm:leading-normal">Perfect experience on all devices, especially mobile</p>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 text-center">
        <Link href="/signup">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-medium  w-auto max-w-xs sm:max-w-none">
            Get Started <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default FeatureHighlights; 
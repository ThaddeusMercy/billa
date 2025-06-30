import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const Pricing = () => {
  return (
    <section id="pricing" className="container mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-black leading-tight sm:leading-normal">Simple Pricing</h2>
        <p className="text-black/70 max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-sm sm:text-base leading-tight sm:leading-normal">
          One low price, all features included, no hidden fees
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Free Plan */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-black">$0</span>
                <span className="text-black/70 text-sm">/month</span>
              </div>
              <p className="text-black/70 text-sm">Try Billa with basic features</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Unlimited payment methods</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Random username assigned</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Mobile-friendly link</span>
              </li>
            </ul>
            <Link href="/signup">
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-black rounded-full py-3 font-medium">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro Plan - Most Popular */}
          <div className="bg-black p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-yellow-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-white">$5</span>
                <span className="text-white/70 text-sm">/one-time</span>
              </div>
              <p className="text-white/70 text-sm">Everything you need to get paid</p>
            </div>
                         <ul className="space-y-3 mb-6">
               <li className="flex items-center gap-3">
                 <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                 <span className="text-white text-sm">Unlimited payment methods</span>
               </li>
               <li className="flex items-center gap-3">
                 <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                 <span className="text-white text-sm">Custom username</span>
               </li>
               <li className="flex items-center gap-3">
                 <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                 <span className="text-white text-sm">Full profile customization</span>
               </li>
               <li className="flex items-center gap-3">
                 <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                 <span className="text-white text-sm">Analytics dashboard</span>
               </li>
               <li className="flex items-center gap-3">
                 <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                 <span className="text-white text-sm">Priority support</span>
               </li>
             </ul>
            <Link href="/signup">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black rounded-full py-3 font-medium">
                Get Pro Access
              </Button>
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-black">$49</span>
                <span className="text-black/70 text-sm">/month</span>
              </div>
              <p className="text-black/70 text-sm">For teams and businesses</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Team management</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">API access</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-black text-sm">Dedicated support</span>
              </li>
            </ul>
            <Link href="/signup">
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-black rounded-full py-3 font-medium">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-black/70 text-sm sm:text-base mb-4">
            All plans include secure payments, mobile optimization, and 99.9% uptime
          </p>
          <p className="text-black/70 text-xs sm:text-sm">
            Want to get started? <Link href="/signup" className="text-black font-medium underline">Start free trial</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing 
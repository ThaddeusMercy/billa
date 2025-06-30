import Link from "next/link";
import { ArrowRight, CheckCircle, Globe, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillaComponent() {
  return (
    <section className="container mx-auto py-32 px-4 flex flex-row justify-center items-start bg-white">
      <div className="flex flex-col md:flex-row items-center">
        <div className="bg-black rounded-lg p-8 max-w-sm shadow-lg h-[600px] flex flex-col justify-between">
          <div className="text-center text-white mb-4">
            <h2 className="text-3xl font-bold">Welcome to Billa</h2>
            <p className="text-lg">The smarter way to manage your payments</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md mb-10">
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircle className="text-black mr-2" />
                <span className="text-black">Link all your payment methods</span>
              </li>
              <li className="flex items-center">
                <Smartphone className="text-black mr-2" />
                <span className="text-black">Easy mobile access</span>
              </li>
              <li className="flex items-center">
                <Globe className="text-black mr-2" />
                <span className="text-black">Global reach</span>
              </li>
              <li className="flex items-center">
                <Wallet className="text-black mr-2" />
                <span className="text-black">Secure transactions</span>
              </li>
            </ul>
            <Link href="/signup">
              <Button className="bg-black hover:bg-black/90 text-white rounded-full px-8 py-4 text-lg font-medium mt-8 w-full">
                Sign Up with Billa <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="ml-10">
          <h3 className="text-2xl font-bold mb-4 text-black">Intuitive Payment Management</h3>
          <ul className="space-y-2 text-black">
            <li>LinkTree-like Interface for easy navigation</li>
            <li>Multiple payment methods all in one place</li>
            <li>Focus on relevant data during transactions</li>
          </ul>
        </div>
      </div>
    </section>
  );
} 
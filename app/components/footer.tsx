import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#08042B] border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/redfox-logo-light.png" alt="RedFox CRM" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold text-white">RedFox CRM</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Complete CRM solution for holiday lighting, outdoor lighting, landscaping, and irrigation businesses.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features/customers" className="text-gray-400 hover:text-white transition-colors">
                  Customer Management
                </Link>
              </li>
              <li>
                <Link href="/features/analytics" className="text-gray-400 hover:text-white transition-colors">
                  Analytics & Reporting
                </Link>
              </li>
              <li>
                <Link href="/features/communication" className="text-gray-400 hover:text-white transition-colors">
                  Communication Tools
                </Link>
              </li>
              <li>
                <Link href="/features/scheduling" className="text-gray-400 hover:text-white transition-colors">
                  Scheduling & Dispatch
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-white font-semibold mb-4">Industries</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/industries/holiday-lighting" className="text-gray-400 hover:text-white transition-colors">
                  Holiday Lighting
                </Link>
              </li>
              <li>
                <Link href="/industries/outdoor-lighting" className="text-gray-400 hover:text-white transition-colors">
                  Outdoor Lighting
                </Link>
              </li>
              <li>
                <Link href="/industries/landscaping" className="text-gray-400 hover:text-white transition-colors">
                  Landscaping
                </Link>
              </li>
              <li>
                <Link href="/industries/irrigation" className="text-gray-400 hover:text-white transition-colors">
                  Irrigation
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact-sales" className="text-gray-400 hover:text-white transition-colors">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 RedFox CRM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

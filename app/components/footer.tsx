import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#08042B] border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image src="/redfox-logo-light.png" alt="RedFox CRM" width={32} height={32} />
              <span className="text-lg font-bold text-white">RedFox CRM</span>
            </div>
            <p className="text-white/70 text-sm">
              Complete CRM solution for holiday lighting, outdoor lighting, landscaping, and irrigation businesses.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features/customers" className="text-white/70 hover:text-white text-sm">
                  Customer Management
                </Link>
              </li>
              <li>
                <Link href="/features/scheduling" className="text-white/70 hover:text-white text-sm">
                  Scheduling & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/features/analytics" className="text-white/70 hover:text-white text-sm">
                  Analytics & Reports
                </Link>
              </li>
              <li>
                <Link href="/features/communication" className="text-white/70 hover:text-white text-sm">
                  Communication Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-white font-semibold mb-4">Industries</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/industries/holiday-lighting" className="text-white/70 hover:text-white text-sm">
                  Holiday Lighting
                </Link>
              </li>
              <li>
                <Link href="/industries/outdoor-lighting" className="text-white/70 hover:text-white text-sm">
                  Outdoor Lighting
                </Link>
              </li>
              <li>
                <Link href="/industries/landscaping" className="text-white/70 hover:text-white text-sm">
                  Landscaping
                </Link>
              </li>
              <li>
                <Link href="/industries/irrigation" className="text-white/70 hover:text-white text-sm">
                  Irrigation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-white/70 hover:text-white text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-white/70 hover:text-white text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact-sales" className="text-white/70 hover:text-white text-sm">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-white/70 hover:text-white text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/70 text-sm">© 2024 RedFox CRM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-brand-dark text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/redfox-logo-light.png" alt="RedFox CRM" width={40} height={40} className="w-10 h-10" />
              <span className="text-xl font-bold">RedFox CRM</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              The complete CRM solution for holiday lighting, outdoor lighting, landscaping, and irrigation businesses.
              Streamline your operations and grow your business.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact-sales" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 RedFox CRM. All rights reserved. Built for home service professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}

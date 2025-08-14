import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#08042B] border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03bf7fc8-fb10-405f-8d44-7f4cf9ada575.png%20(1)-EbLykftKwzbq1ybShsTqu4JvXj4z3Y.png"
              alt="RedFox CRM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm text-gray-400 text-center">Streamline workflows for businesses of all sizes.</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <Link href="/features" className="text-white hover:text-[#F5F906] transition-colors">
              Features
            </Link>
            <Link href="/sales" className="text-white hover:text-[#F5F906] transition-colors">
              Contact Sales
            </Link>
            <Link href="/privacy" className="text-white hover:text-[#F5F906] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white hover:text-[#F5F906] transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} RedFox CRM. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

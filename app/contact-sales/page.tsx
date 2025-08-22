"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { MessageCircle } from "lucide-react"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"

export default function ContactSalesPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.from("contact_messages").insert([{ name, email, message }])

      if (error) throw error

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      })

      // Reset form
      setName("")
      setEmail("")
      setMessage("")

      // Optionally, redirect to a thank you page
      // router.push("/thank-you")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08042B] to-[#1A1F2C]">
      <Header />

      <main className="pt-16">
        <div className="flex items-center justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8 min-h-screen">
          <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white/10 p-6 sm:p-8 rounded-xl backdrop-blur-lg shadow-xl">
            <div className="text-center">
              <MessageCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#F67721]" />
              <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-white">Contact Sales</h2>
              <p className="mt-2 text-sm text-gray-300">Fill out the form below and we'll get back to you soon.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-[#F67721] focus:border-[#F67721] h-10 sm:h-12"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-[#F67721] focus:border-[#F67721] h-10 sm:h-12"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-[#F67721] focus:border-[#F67721] min-h-[100px] sm:min-h-[120px]"
                    placeholder="Your message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white transition-colors duration-300 ease-in-out transform hover:scale-105 h-10 sm:h-12 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

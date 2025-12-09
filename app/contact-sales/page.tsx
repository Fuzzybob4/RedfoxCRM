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
    <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-dark/80">
      <Header />

      <main className="pt-16">
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
          <div className="max-w-md w-full space-y-8 bg-card/10 p-8 rounded-xl backdrop-blur-lg shadow-xl border border-border/20">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-brand-orange" />
              <h2 className="mt-6 text-3xl font-extrabold text-foreground">Contact Sales</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill out the form below and we'll get back to you soon.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                  <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="bg-background/10 border-border/20 text-foreground placeholder:text-muted-foreground focus:ring-brand-orange focus:border-brand-orange"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-background/10 border-border/20 text-foreground placeholder:text-muted-foreground focus:ring-brand-orange focus:border-brand-orange"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    className="bg-background/10 border-border/20 text-foreground placeholder:text-muted-foreground focus:ring-brand-orange focus:border-brand-orange"
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
                  className="w-full bg-brand-orange hover:bg-accent hover:text-accent-foreground text-white transition-colors duration-300 ease-in-out transform hover:scale-105"
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

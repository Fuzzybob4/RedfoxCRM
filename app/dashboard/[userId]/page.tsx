"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  MessageCircle,
  Eye,
  Share2,
  Users,
  Mail,
  User,
  LayoutDashboard,
  Activity,
  Map,
  ShoppingBag,
  AlertCircle,
  Users2,
  DollarSign,
  FileText,
  Bell,
  Mic,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface ActivityItem {
  id: number
  icon: JSX.Element
  message: string
  time: string
  type: "success" | "error" | "warning" | "info"
}

export default function DashboardPage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const stats = [
    {
      title: "Messages",
      value: "52",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-red-500",
    },
    {
      title: "Views",
      value: "99",
      icon: <Eye className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Shares",
      value: "23",
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-emerald-500",
    },
    {
      title: "Users",
      value: "50",
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-500",
    },
  ]

  const activities: ActivityItem[] = [
    {
      id: 1,
      icon: <User className="h-5 w-5 text-blue-500" />,
      message: "New record, over 90 views.",
      time: "10 mins",
      type: "info",
    },
    {
      id: 2,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      message: "Database error.",
      time: "15 mins",
      type: "error",
    },
    {
      id: 3,
      icon: <Users className="h-5 w-5 text-yellow-500" />,
      message: "New record, over 40 users.",
      time: "17 mins",
      type: "warning",
    },
    {
      id: 4,
      icon: <MessageCircle className="h-5 w-5 text-red-500" />,
      message: "New comments.",
      time: "25 mins",
      type: "info",
    },
    {
      id: 5,
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      message: "Check transactions.",
      time: "28 mins",
      type: "info",
    },
    {
      id: 6,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      message: "CPU overload.",
      time: "35 mins",
      type: "error",
    },
    {
      id: 7,
      icon: <Share2 className="h-5 w-5 text-emerald-500" />,
      message: "New shares.",
      time: "39 mins",
      type: "success",
    },
  ]

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Overview",
      href: `/dashboard/${params.userId}`,
      active: true,
    },
    { icon: <Eye className="h-5 w-5" />, label: "Sales", href: "/sales" },
    { icon: <Activity className="h-5 w-5" />, label: "Service Trends", href: "/service-trends" },
    { icon: <Map className="h-5 w-5" />, label: "Mapping", href: "/mapping" },
    { icon: <ShoppingBag className="h-5 w-5" />, label: "Orders", href: "/orders" },
    { icon: <Users2 className="h-5 w-5" />, label: "Staff", href: "/staff" },
    { icon: <FileText className="h-5 w-5" />, label: "Reports", href: "/reports" },
    { icon: <Mic className="h-5 w-5" />, label: "Marketing", href: "/marketing" },
    { icon: <DollarSign className="h-5 w-5" />, label: "Payment Portal", href: "/payment-portal" },
  ]

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/signup")
          return
        }

        // Redirect to the correct dashboard URL if needed
        if (user.id !== params.userId) {
          router.push(`/dashboard/${user.id}`)
          return
        }

        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          if (error.code === "PGRST116") {
            // No profile found, create a default one
            const defaultProfile = {
              id: user.id,
              first_name: "New",
              last_name: "User",
              email: user.email,
            }
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert(defaultProfile)
              .single()

            if (insertError) {
              throw insertError
            }

            setUser(defaultProfile)
          } else {
            throw error
          }
        } else {
          setUser({
            id: user.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: user.email!,
          })
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [params.userId, router, toast]) // Added toast to dependencies

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return null // The redirection is handled in loadUserProfile
  }

  return (
    <div className="flex h-screen bg-[#08042B]">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 text-white p-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F67721]">
            {user?.first_name[0]}
          </div>
          <div>
            <p className="font-semibold">Welcome,</p>
            <p>{user?.first_name}</p>
          </div>
        </div>
        <div className="flex justify-around mb-8">
          <Button variant="ghost" size="icon" title="Send Email">
            <Mail className="h-5 w-5" />
          </Button>
          <Link href="/customers" passHref>
            <Button variant="ghost" size="icon" title="Customers">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" title="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-8">My Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className={`${stat.color} text-white p-6`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regions Map */}
          <Card className="p-6 bg-white/10 border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Regions</h2>
            <div className="relative h-[300px] bg-white/5 rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UI%20for%20user%20dashboard%20-FALQKnqB33V6OtfBPVRKAGFuybehW7.png"
                alt="World Map"
                fill
                className="object-cover opacity-50"
              />
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="p-6 bg-white/10 border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Feeds</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 text-white">
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

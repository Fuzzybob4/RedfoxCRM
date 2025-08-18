"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  ScrollText,
  Users,
  BarChart,
  Settings,
  FileText,
  DollarSign,
  Briefcase,
  UserIcon,
  Building,
  Bell,
  Shield,
  CreditCard,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings", active: true },
]

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState("Company name")
  const [userProfile, setUserProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    marketing_emails: false,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkAuthAndLoadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      fetchUserData(user)
    }

    checkAuthAndLoadData()
  }, [router])

  async function fetchUserData(user: SupabaseUser) {
    if (!user) return

    try {
      // Fetch company profile
      const { data: companyData, error: companyError } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("owner_id", user.id)
        .single()

      if (companyError) {
        console.error("Error fetching company data:", companyError)
      } else if (companyData) {
        setCompanyName(companyData.company_name || "Company name")
        setUserProfile({
          full_name: companyData.owner_name || "",
          email: user.email || "",
          phone: companyData.phone || "",
          company_name: companyData.company_name || "",
          address: companyData.address || "",
          city: companyData.city || "",
          state: companyData.state || "",
          zip: companyData.zip || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from("company_profiles")
        .update({
          owner_name: userProfile.full_name,
          phone: userProfile.phone,
          company_name: userProfile.company_name,
          address: userProfile.address,
          city: userProfile.city,
          state: userProfile.state,
          zip: userProfile.zip,
        })
        .eq("owner_id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a1f2c]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#1a1f2c]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#272e3f] text-gray-300">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold text-white">{companyName}</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                ${item.active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="h-16 bg-[#272e3f] flex items-center px-4 border-b border-gray-700">
          <div className="flex-1 flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-[#272e3f] border-gray-700">
                <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:text-white">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="company" className="text-gray-300 data-[state=active]:text-white">
                  <Building className="h-4 w-4 mr-2" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-white">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="text-gray-300 data-[state=active]:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing" className="text-gray-300 data-[state=active]:text-white">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-[#272e3f] border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-300">
                          Full Name
                        </Label>
                        <Input
                          id="full_name"
                          value={userProfile.full_name}
                          onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          disabled
                          className="bg-[#1a1f2c] border-gray-700 text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button onClick={saveProfile} className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Company Tab */}
              <TabsContent value="company">
                <Card className="bg-[#272e3f] border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="company_name" className="text-gray-300">
                          Company Name
                        </Label>
                        <Input
                          id="company_name"
                          value={userProfile.company_name}
                          onChange={(e) => setUserProfile({ ...userProfile, company_name: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-gray-300">
                          Address
                        </Label>
                        <Input
                          id="address"
                          value={userProfile.address}
                          onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gray-300">
                          City
                        </Label>
                        <Input
                          id="city"
                          value={userProfile.city}
                          onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-gray-300">
                          State
                        </Label>
                        <Input
                          id="state"
                          value={userProfile.state}
                          onChange={(e) => setUserProfile({ ...userProfile, state: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-gray-300">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          value={userProfile.zip}
                          onChange={(e) => setUserProfile({ ...userProfile, zip: e.target.value })}
                          className="bg-[#1a1f2c] border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button onClick={saveProfile} className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="bg-[#272e3f] border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-white">Email Notifications</Label>
                          <p className="text-sm text-gray-400">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email_notifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, email_notifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-white">SMS Notifications</Label>
                          <p className="text-sm text-gray-400">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms_notifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, sms_notifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-white">Push Notifications</Label>
                          <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                        </div>
                        <Switch
                          checked={notifications.push_notifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, push_notifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-white">Marketing Emails</Label>
                          <p className="text-sm text-gray-400">Receive marketing and promotional emails</p>
                        </div>
                        <Switch
                          checked={notifications.marketing_emails}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, marketing_emails: checked })
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">Save Preferences</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="bg-[#272e3f] border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-white">Change Password</Label>
                        <p className="text-sm text-gray-400 mb-4">Update your password to keep your account secure</p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-700 bg-transparent"
                        >
                          Change Password
                        </Button>
                      </div>
                      <div>
                        <Label className="text-white">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account</p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-700 bg-transparent"
                        >
                          Enable 2FA
                        </Button>
                      </div>
                      <div>
                        <Label className="text-white">Active Sessions</Label>
                        <p className="text-sm text-gray-400 mb-4">Manage your active login sessions</p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-700 bg-transparent"
                        >
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing">
                <Card className="bg-[#272e3f] border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Billing & Subscription</h3>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-white">Current Plan</Label>
                        <p className="text-sm text-gray-400 mb-2">Professional Plan - $29/month</p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-700 bg-transparent"
                        >
                          Upgrade Plan
                        </Button>
                      </div>
                      <div>
                        <Label className="text-white">Payment Method</Label>
                        <p className="text-sm text-gray-400 mb-2">**** **** **** 1234 (Expires 12/25)</p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-700 bg-transparent"
                        >
                          Update Payment Method
                        </Button>
                      </div>
                      <div>
                        <Label className="text-white">Billing History</Label>
                        <p className="text-sm text-gray-400 mb-2">View your past invoices and payments</p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-700 bg-transparent"
                        >
                          View History
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

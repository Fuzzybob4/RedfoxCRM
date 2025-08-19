"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Building, Bell, Shield, CreditCard, Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Profile {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  job_title?: string
  department?: string
}

interface Organization {
  id: string
  name: string
  plan: string
  address?: string
  phone?: string
  email?: string
  website?: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email_marketing: true,
    email_invoices: true,
    email_estimates: true,
    sms_reminders: false,
    push_notifications: true,
  })
  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    session_timeout: "24",
    login_notifications: true,
  })
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch organization
      const { data: prof } = await supabase.from("profiles").select("default_org").eq("id", user.id).maybeSingle()

      if (prof?.default_org) {
        const { data: orgData } = await supabase.from("organizations").select("*").eq("id", prof.default_org).single()

        if (orgData) {
          setOrganization(orgData)
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          job_title: profile.job_title,
          department: profile.department,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleSaveOrganization = async () => {
    if (!organization) return

    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          name: organization.name,
          address: organization.address,
          phone: organization.phone,
          email: organization.email,
          website: organization.website,
        })
        .eq("id", organization.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Company information updated successfully",
      })
    } catch (error) {
      console.error("Error updating organization:", error)
      toast({
        title: "Error",
        description: "Failed to update company information",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Password updated successfully",
      })

      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1f2c] flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c] text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#272e3f] min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">RedFox CRM</h1>
            <p className="text-gray-400 text-sm">{organization?.name || "Your Company"}</p>
          </div>

          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a
              href="/customers"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>👥</span>
              <span>Customers</span>
            </a>
            <a
              href="/estimates"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>📋</span>
              <span>Estimates</span>
            </a>
            <a
              href="/invoices"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>🧾</span>
              <span>Invoices</span>
            </a>
            <a
              href="/projects"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>🏗️</span>
              <span>Projects</span>
            </a>
            <a href="/settings" className="flex items-center space-x-3 text-white bg-[#1a1f2c] p-3 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and organization settings</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-[#272e3f] border-gray-600">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Company
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-[#272e3f] border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={profile?.first_name || ""}
                          onChange={(e) =>
                            setProfile((prev) => (prev ? { ...prev, first_name: e.target.value } : null))
                          }
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={profile?.last_name || ""}
                          onChange={(e) => setProfile((prev) => (prev ? { ...prev, last_name: e.target.value } : null))}
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-[#1a1f2c] border-gray-600 text-gray-400"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Email cannot be changed here. Contact support if needed.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile?.phone_number || ""}
                        onChange={(e) =>
                          setProfile((prev) => (prev ? { ...prev, phone_number: e.target.value } : null))
                        }
                        className="bg-[#1a1f2c] border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job_title">Job Title</Label>
                        <Input
                          id="job_title"
                          value={profile?.job_title || ""}
                          onChange={(e) => setProfile((prev) => (prev ? { ...prev, job_title: e.target.value } : null))}
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profile?.department || ""}
                          onChange={(e) =>
                            setProfile((prev) => (prev ? { ...prev, department: e.target.value } : null))
                          }
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Company Tab */}
              <TabsContent value="company">
                <Card className="bg-[#272e3f] border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={organization?.name || ""}
                        onChange={(e) => setOrganization((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        className="bg-[#1a1f2c] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_address">Address</Label>
                      <Textarea
                        id="company_address"
                        value={organization?.address || ""}
                        onChange={(e) =>
                          setOrganization((prev) => (prev ? { ...prev, address: e.target.value } : null))
                        }
                        className="bg-[#1a1f2c] border-gray-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_phone">Phone</Label>
                        <Input
                          id="company_phone"
                          value={organization?.phone || ""}
                          onChange={(e) =>
                            setOrganization((prev) => (prev ? { ...prev, phone: e.target.value } : null))
                          }
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company_email">Email</Label>
                        <Input
                          id="company_email"
                          type="email"
                          value={organization?.email || ""}
                          onChange={(e) =>
                            setOrganization((prev) => (prev ? { ...prev, email: e.target.value } : null))
                          }
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={organization?.website || ""}
                        onChange={(e) =>
                          setOrganization((prev) => (prev ? { ...prev, website: e.target.value } : null))
                        }
                        className="bg-[#1a1f2c] border-gray-600 text-white"
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                    <Button onClick={handleSaveOrganization} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Company Info
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="bg-[#272e3f] border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Marketing emails</Label>
                            <p className="text-sm text-gray-400">Receive updates about new features and tips</p>
                          </div>
                          <Switch
                            checked={notifications.email_marketing}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, email_marketing: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Invoice notifications</Label>
                            <p className="text-sm text-gray-400">Get notified when invoices are paid or overdue</p>
                          </div>
                          <Switch
                            checked={notifications.email_invoices}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, email_invoices: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Estimate notifications</Label>
                            <p className="text-sm text-gray-400">Get notified when estimates are viewed or accepted</p>
                          </div>
                          <Switch
                            checked={notifications.email_estimates}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, email_estimates: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">SMS & Push Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">SMS reminders</Label>
                            <p className="text-sm text-gray-400">Receive text message reminders for important events</p>
                          </div>
                          <Switch
                            checked={notifications.sms_reminders}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, sms_reminders: checked }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Push notifications</Label>
                            <p className="text-sm text-gray-400">
                              Receive browser push notifications for real-time updates
                            </p>
                          </div>
                          <Switch
                            checked={notifications.push_notifications}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, push_notifications: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  <Card className="bg-[#272e3f] border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="new_password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new_password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-[#1a1f2c] border-gray-600 text-white pr-10"
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                          id="confirm_password"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-[#1a1f2c] border-gray-600 text-white"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#272e3f] border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={security.two_factor_enabled ? "default" : "secondary"}>
                            {security.two_factor_enabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <Switch
                            checked={security.two_factor_enabled}
                            onCheckedChange={(checked) =>
                              setSecurity((prev) => ({ ...prev, two_factor_enabled: checked }))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Login Notifications</Label>
                          <p className="text-sm text-gray-400">Get notified when someone logs into your account</p>
                        </div>
                        <Switch
                          checked={security.login_notifications}
                          onCheckedChange={(checked) =>
                            setSecurity((prev) => ({ ...prev, login_notifications: checked }))
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-white">Session Timeout</Label>
                        <p className="text-sm text-gray-400 mb-2">Automatically log out after period of inactivity</p>
                        <Select
                          value={security.session_timeout}
                          onValueChange={(value) => setSecurity((prev) => ({ ...prev, session_timeout: value }))}
                        >
                          <SelectTrigger className="bg-[#1a1f2c] border-gray-600 text-white w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#272e3f] border-gray-600">
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="168">1 week</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Security Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing">
                <div className="space-y-6">
                  <Card className="bg-[#272e3f] border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white capitalize">
                            {organization?.plan || "Free"} Plan
                          </h3>
                          <p className="text-gray-400">
                            {organization?.plan === "free" && "Perfect for getting started"}
                            {organization?.plan === "pro" && "$29/month - Great for small teams"}
                            {organization?.plan === "business" && "$99/month - Perfect for growing businesses"}
                            {organization?.plan === "enterprise" && "Custom pricing - For large organizations"}
                          </p>
                        </div>
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        {organization?.plan === "free" ? "Upgrade Plan" : "Change Plan"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#272e3f] border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="text-white">•••• •••• •••• 4242</p>
                          <p className="text-gray-400 text-sm">Expires 12/25</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] bg-transparent"
                      >
                        Update Payment Method
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#272e3f] border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Billing History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-700">
                          <div>
                            <p className="text-white">Pro Plan - January 2024</p>
                            <p className="text-gray-400 text-sm">Jan 1, 2024</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">$29.00</p>
                            <Badge className="bg-green-600 text-white text-xs">Paid</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700">
                          <div>
                            <p className="text-white">Pro Plan - December 2023</p>
                            <p className="text-gray-400 text-sm">Dec 1, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">$29.00</p>
                            <Badge className="bg-green-600 text-white text-xs">Paid</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-white">Pro Plan - November 2023</p>
                            <p className="text-gray-400 text-sm">Nov 1, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">$29.00</p>
                            <Badge className="bg-green-600 text-white text-xs">Paid</Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] mt-4 bg-transparent"
                      >
                        View All Invoices
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

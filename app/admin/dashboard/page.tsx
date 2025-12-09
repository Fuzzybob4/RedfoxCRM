"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  Database,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogOut,
  Eye,
} from "lucide-react"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem("admin_session")
    const loginTime = localStorage.getItem("admin_login_time")

    if (adminSession === "true" && loginTime) {
      const now = Date.now()
      const loginTimestamp = Number.parseInt(loginTime)
      const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours

      if (now - loginTimestamp < sessionDuration) {
        setIsAuthenticated(true)
        // Set cookies for middleware
        document.cookie = `admin_session=true; path=/; max-age=${sessionDuration / 1000}`
        document.cookie = `admin_login_time=${loginTime}; path=/; max-age=${sessionDuration / 1000}`
      } else {
        // Session expired
        localStorage.removeItem("admin_session")
        localStorage.removeItem("admin_login_time")
        router.push("/admin/login")
      }
    } else {
      router.push("/admin/login")
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    localStorage.removeItem("admin_login_time")
    // Clear cookies
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "admin_login_time=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const systemStats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      status: "success",
    },
    {
      title: "Active Sessions",
      value: "89",
      change: "+5%",
      icon: Activity,
      status: "success",
    },
    {
      title: "Database Status",
      value: "Healthy",
      change: "99.9%",
      icon: Database,
      status: "success",
    },
    {
      title: "System Alerts",
      value: "3",
      change: "-2",
      icon: AlertTriangle,
      status: "warning",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "User registration",
      user: "john@example.com",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      action: "Failed login attempt",
      user: "suspicious@email.com",
      time: "5 minutes ago",
      status: "error",
    },
    {
      id: 3,
      action: "Database backup",
      user: "System",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 4,
      action: "OAuth callback",
      user: "sarah@company.com",
      time: "2 hours ago",
      status: "success",
    },
  ]

  const systemHealth = [
    { service: "Authentication Service", status: "healthy", uptime: "99.9%" },
    { service: "Database", status: "healthy", uptime: "99.8%" },
    { service: "Email Service", status: "healthy", uptime: "99.7%" },
    { service: "File Storage", status: "degraded", uptime: "98.2%" },
    { service: "OAuth Provider", status: "healthy", uptime: "99.9%" },
  ]

  // Sample users for demonstration
  const sampleUsers = [
    { id: "demo-user-123", name: "Demo User", email: "demo@example.com", status: "active" },
    { id: "john-doe-456", name: "John Doe", email: "john@example.com", status: "active" },
    { id: "jane-smith-789", name: "Jane Smith", email: "jane@example.com", status: "inactive" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">RedFox CRM System Administration</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.status === "success"
                      ? "text-success"
                      : stat.status === "warning"
                        ? "text-accent"
                        : "text-destructive"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system events and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.status === "success" ? "bg-success" : "bg-destructive"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                        {activity.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Database className="w-4 h-4 mr-2" />
                      Database Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Activity className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Click on any user to view their dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/${user.id}`)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor service status and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.map((service) => (
                    <div
                      key={service.service}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            service.status === "healthy"
                              ? "bg-success"
                              : service.status === "degraded"
                                ? "bg-accent"
                                : "bg-destructive"
                          }`}
                        ></div>
                        <span className="font-medium text-foreground">{service.service}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={service.status === "healthy" ? "default" : "secondary"}>{service.status}</Badge>
                        <span className="text-sm text-muted-foreground">{service.uptime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground">System settings interface would go here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Configure authentication, database, and other system settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

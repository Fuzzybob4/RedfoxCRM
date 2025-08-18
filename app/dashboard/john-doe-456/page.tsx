"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Calendar, TrendingUp, ArrowLeft, Bell, Settings, Search, Eye } from "lucide-react"

export default function JohnDoeDashboard() {
  const [isAdminViewing, setIsAdminViewing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is viewing
    const adminSession = localStorage.getItem("admin_session")
    if (adminSession === "true") {
      setIsAdminViewing(true)
    }
  }, [])

  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      change: "+5.2%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "$28,450",
      change: "+12.1%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: "18",
      change: "+2",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Growth Rate",
      value: "22.7%",
      change: "+4.3%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Banner */}
      {isAdminViewing && (
        <div className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Admin View: Viewing John Doe's Dashboard</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-orange-500 hover:bg-orange-50"
            onClick={() => router.push("/admin/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, John Doe</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content specific to John Doe */}
        <Card>
          <CardHeader>
            <CardTitle>John's Recent Activity</CardTitle>
            <CardDescription>Your latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Completed landscape project for Smith Residence</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
                <Badge>Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">New customer inquiry from downtown area</p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
                <Badge variant="secondary">New Lead</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

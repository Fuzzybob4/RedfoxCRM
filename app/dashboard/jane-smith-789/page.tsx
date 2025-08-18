"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  DollarSign,
  Calendar,
  TrendingDown,
  ArrowLeft,
  Bell,
  Settings,
  Search,
  Eye,
  AlertTriangle,
} from "lucide-react"

export default function JaneSmithDashboard() {
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
      value: "892",
      change: "-2.1%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "$15,230",
      change: "-5.3%",
      icon: DollarSign,
      color: "text-red-600",
    },
    {
      title: "Active Projects",
      value: "7",
      change: "-3",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Growth Rate",
      value: "-8.2%",
      change: "-12.1%",
      icon: TrendingDown,
      color: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Banner */}
      {isAdminViewing && (
        <div className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Admin View: Viewing Jane Smith's Dashboard (Inactive User)</span>
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
              <p className="text-gray-600">Welcome back, Jane Smith</p>
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
        {/* Alert for inactive user */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Account Inactive</p>
                <p className="text-sm text-red-600">
                  This user account has been marked as inactive. Limited functionality available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p className={`text-xs mt-1 ${stat.change.startsWith("-") ? "text-red-600" : "text-green-600"}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inactive user content */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>This account is currently inactive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">This user account has been deactivated.</p>
              <p className="text-sm text-gray-500 mt-2">Contact support to reactivate the account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

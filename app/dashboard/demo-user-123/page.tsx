"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Bell,
  Settings,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
} from "lucide-react"

export default function DemoUserDashboard() {
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
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "$45,231",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: "23",
      change: "+3",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Growth Rate",
      value: "15.3%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const recentCustomers = [
    { id: 1, name: "John Smith", email: "john@example.com", status: "Active", value: "$2,400" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "Pending", value: "$1,800" },
    { id: 3, name: "Mike Davis", email: "mike@example.com", status: "Active", value: "$3,200" },
    { id: 4, name: "Lisa Wilson", email: "lisa@example.com", status: "Inactive", value: "$950" },
  ]

  const recentProjects = [
    { id: 1, name: "Holiday Lighting Installation", customer: "ABC Corp", status: "In Progress", progress: 75 },
    { id: 2, name: "Landscape Design", customer: "XYZ Inc", status: "Planning", progress: 25 },
    { id: 3, name: "Irrigation System", customer: "Green Gardens", status: "Completed", progress: 100 },
    { id: 4, name: "Outdoor Lighting", customer: "Modern Homes", status: "In Progress", progress: 60 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Banner */}
      {isAdminViewing && (
        <div className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Admin View: Viewing Demo User Dashboard</span>
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
              <p className="text-gray-600">Welcome back, Demo User</p>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Customers</CardTitle>
                  <CardDescription>Latest customer additions and updates</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          customer.status === "Active"
                            ? "default"
                            : customer.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {customer.status}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">{customer.value}</span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Current project status and progress</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.customer}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            project.status === "Completed"
                              ? "default"
                              : project.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-900">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Users className="w-6 h-6" />
                <span>Add Customer</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Calendar className="w-6 h-6" />
                <span>Schedule Visit</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <DollarSign className="w-6 h-6" />
                <span>Create Invoice</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <TrendingUp className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, DollarSign, TrendingUp, Calendar, Mail, Phone, FileText } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Deals",
    value: "23",
    change: "+12%",
    changeType: "positive" as const,
    icon: BarChart3,
  },
  {
    title: "New Contacts",
    value: "156",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "68%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
]

const recentActivities = [
  {
    id: 1,
    type: "call",
    title: "Called John Smith at Acme Corp",
    time: "2 hours ago",
    icon: Phone,
  },
  {
    id: 2,
    type: "email",
    title: "Sent proposal to TechStart Inc",
    time: "4 hours ago",
    icon: Mail,
  },
  {
    id: 3,
    type: "meeting",
    title: "Meeting with Global Solutions",
    time: "1 day ago",
    icon: Calendar,
  },
  {
    id: 4,
    type: "document",
    title: "Contract signed by MegaCorp",
    time: "2 days ago",
    icon: FileText,
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: "Follow up with Acme Corp",
    dueDate: "Today, 2:00 PM",
    priority: "high" as const,
  },
  {
    id: 2,
    title: "Prepare demo for TechStart",
    dueDate: "Tomorrow, 10:00 AM",
    priority: "medium" as const,
  },
  {
    id: 3,
    title: "Send contract to Global Solutions",
    dueDate: "Feb 15, 3:00 PM",
    priority: "low" as const,
  },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you stay productive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col bg-transparent">
              <Users className="w-6 h-6 mb-2" />
              Add Contact
            </Button>
            <Button variant="outline" className="h-20 flex flex-col bg-transparent">
              <BarChart3 className="w-6 h-6 mb-2" />
              Create Deal
            </Button>
            <Button variant="outline" className="h-20 flex flex-col bg-transparent">
              <Calendar className="w-6 h-6 mb-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" className="h-20 flex flex-col bg-transparent">
              <Mail className="w-6 h-6 mb-2" />
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

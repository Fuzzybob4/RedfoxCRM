"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users, CalendarDays, ArrowLeft } from "lucide-react"

export default function SchedulingPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Scheduling
        </h1>
        <p className="text-slate-600 mt-2">Appointment and team schedule management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Appointments
            </CardTitle>
            <CardDescription>Schedule and manage customer appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Coming soon - Full appointment scheduling system with customer notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Team Scheduling
            </CardTitle>
            <CardDescription>Manage team member schedules and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Coming soon - Team calendar with availability tracking and assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Time Tracking
            </CardTitle>
            <CardDescription>Track time spent on jobs and projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Coming soon - Integrated time tracking for accurate billing and payroll
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

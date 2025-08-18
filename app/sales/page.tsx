"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Users, DollarSign } from "lucide-react"

export default function SalesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-8 w-8" />
          Sales
        </h1>
        <p className="text-slate-600 mt-2">Lead tracking and sales pipeline management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Sales Pipeline
            </CardTitle>
            <CardDescription>Track leads through your sales process</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Coming soon - Visual sales pipeline with drag-and-drop lead management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Lead Management
            </CardTitle>
            <CardDescription>Capture and nurture potential customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Coming soon - Lead scoring and automated follow-up sequences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Sales Analytics
            </CardTitle>
            <CardDescription>Track performance and conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Coming soon - Comprehensive sales analytics and forecasting</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

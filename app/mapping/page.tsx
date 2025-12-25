"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, MapPin, Route, Navigation, ArrowLeft } from "lucide-react"

export default function MappingPage() {
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
          <Map className="h-8 w-8" />
          Mapping
        </h1>
        <p className="text-slate-600 mt-2">Route optimization and territory management tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Customer Locations
            </CardTitle>
            <CardDescription>View all customer locations on an interactive map</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Coming soon - Interactive map showing all your customers and their locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-green-600" />
              Route Optimization
            </CardTitle>
            <CardDescription>Optimize routes for maximum efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Coming soon - AI-powered route optimization for service calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-orange-600" />
              Territory Management
            </CardTitle>
            <CardDescription>Manage service territories and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Coming soon - Define and manage service territories for your team</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

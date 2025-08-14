"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ScrollText,
  Users,
  BarChartIcon,
  Settings,
  FileText,
  DollarSign,
  Briefcase,
  MapPin,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const HeatmapLayer = dynamic(() => import("react-leaflet-heatmap-layer"), { ssr: false })

// Mock data (replace with real data from Supabase later)
const customers = [
  { id: 1, name: "John Doe", lat: 40.7128, lng: -74.006, serviceType: "Lawn Care", category: "residential" },
  { id: 2, name: "Jane Smith", lat: 40.7282, lng: -73.7949, serviceType: "Tree Trimming", category: "residential" },
  { id: 3, name: "Bob Johnson", lat: 40.7489, lng: -73.968, serviceType: "Landscaping", category: "commercial" },
  { id: 4, name: "Alice Corp", lat: 40.73, lng: -74.02, serviceType: "Lawn Care", category: "commercial" },
]

const employees = [
  { id: 1, name: "Employee 1", lat: 40.73, lng: -74.0 },
  { id: 2, name: "Employee 2", lat: 40.74, lng: -73.99 },
]

const heatmapPoints = [
  { lat: 40.7128, lng: -74.006, intensity: 0.5 },
  { lat: 40.7282, lng: -73.7949, intensity: 0.8 },
  { lat: 40.7489, lng: -73.968, intensity: 0.3 },
]

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChartIcon className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <MapPin className="h-5 w-5" />, label: "Mapping", href: "/mapping", active: true },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function MappingPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState("Company name")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedServiceType, setSelectedServiceType] = useState("All")
  const [showEmployees, setShowEmployees] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState("starter")
  const [selectedCategory, setSelectedCategory] = useState("all")
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

      fetchCompanyName(user)
      fetchSubscriptionType(user)
      // Fetch other mapping data here
      setLoading(false)
    }

    checkAuthAndLoadData()
  }, [router])

  async function fetchCompanyName(user: User) {
    if (!user) return

    const { data, error } = await supabase
      .from("company_profiles")
      .select("company_name")
      .eq("owner_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching company name:", error)
    } else if (data && data.company_name) {
      setCompanyName(data.company_name)
    }
  }

  async function fetchSubscriptionType(user: User) {
    if (!user) return

    const { data, error } = await supabase.from("profiles").select("subscription_type").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching subscription type:", error)
    } else if (data && data.subscription_type) {
      setSubscriptionType(data.subscription_type)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedServiceType === "All" || customer.serviceType === selectedServiceType) &&
      (selectedCategory === "all" || customer.category === selectedCategory),
  )

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

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-[#272e3f] flex items-center px-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Mapping</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          <Card className="bg-white/10 border-white/20 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "secondary"}
                    onClick={() => setSelectedCategory("all")}
                    className="text-white bg-[#272e3f] hover:bg-[#373e4f]"
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedCategory === "residential" ? "default" : "secondary"}
                    onClick={() => setSelectedCategory("residential")}
                    className="text-white bg-[#272e3f] hover:bg-[#373e4f]"
                  >
                    Residential
                  </Button>
                  <Button
                    variant={selectedCategory === "commercial" ? "default" : "secondary"}
                    onClick={() => setSelectedCategory("commercial")}
                    className="text-white bg-[#272e3f] hover:bg-[#373e4f]"
                  >
                    Commercial
                  </Button>
                </div>
                <Input
                  type="search"
                  placeholder="Search customers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1a1f2c] border-gray-700 text-white w-full max-w-xs"
                />
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger className="w-[180px] bg-[#1a1f2c] border-gray-700 text-white">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    <SelectItem value="Lawn Care">Lawn Care</SelectItem>
                    <SelectItem value="Tree Trimming">Tree Trimming</SelectItem>
                    <SelectItem value="Landscaping">Landscaping</SelectItem>
                  </SelectContent>
                </Select>
                {subscriptionType === "professional" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-employees" checked={showEmployees} onCheckedChange={setShowEmployees} />
                      <Label htmlFor="show-employees" className="text-white">
                        Show Employees
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                      <Label htmlFor="show-heatmap" className="text-white">
                        Show Heatmap
                      </Label>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <MapContainer center={[40.7128, -74.006]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredCustomers.map((customer) => (
                    <Marker key={customer.id} position={[customer.lat, customer.lng]}>
                      <Popup>
                        <div>
                          <h3 className="font-bold">{customer.name}</h3>
                          <p>Service: {customer.serviceType}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {subscriptionType === "professional" &&
                    showEmployees &&
                    employees.map((employee) => (
                      <Marker key={employee.id} position={[employee.lat, employee.lng]}>
                        <Popup>
                          <div>
                            <h3 className="font-bold">{employee.name}</h3>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  {subscriptionType === "professional" && showHeatmap && (
                    <HeatmapLayer
                      points={heatmapPoints}
                      longitudeExtractor={(m) => m.lng}
                      latitudeExtractor={(m) => m.lat}
                      intensityExtractor={(m) => m.intensity}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

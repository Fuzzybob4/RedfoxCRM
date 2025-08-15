"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react"

const deals = [
  {
    id: 1,
    title: "Acme Corp - Enterprise License",
    value: "$50,000",
    stage: "Proposal",
    probability: 75,
    contact: "John Smith",
    company: "Acme Corp",
    closeDate: "2024-02-15",
    status: "hot",
  },
  {
    id: 2,
    title: "TechStart - Annual Subscription",
    value: "$12,000",
    stage: "Negotiation",
    probability: 60,
    contact: "Sarah Johnson",
    company: "TechStart Inc",
    closeDate: "2024-02-28",
    status: "warm",
  },
  {
    id: 3,
    title: "Global Solutions - Implementation",
    value: "$75,000",
    stage: "Qualified",
    probability: 40,
    contact: "Mike Davis",
    company: "Global Solutions",
    closeDate: "2024-03-10",
    status: "cold",
  },
]

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = selectedStage === "all" || deal.stage === selectedStage
    return matchesSearch && matchesStage
  })

  const totalValue = filteredDeals.reduce((sum, deal) => sum + Number.parseInt(deal.value.replace(/[$,]/g, "")), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Manage your deals and track sales progress</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDeals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredDeals.length > 0 ? Math.round(totalValue / filteredDeals.length).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search deals, contacts, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStage} onValueChange={setSelectedStage}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Deals List */}
      <div className="space-y-4">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{deal.title}</h3>
                    <Badge
                      variant={deal.status === "hot" ? "destructive" : deal.status === "warm" ? "default" : "secondary"}
                    >
                      {deal.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Value:</span> {deal.value}
                    </div>
                    <div>
                      <span className="font-medium">Stage:</span> {deal.stage}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {deal.contact}
                    </div>
                    <div>
                      <span className="font-medium">Close Date:</span> {deal.closeDate}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Probability:</span>
                      <div className="flex-1 bg-muted rounded-full h-2 max-w-[200px]">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{deal.probability}%</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No deals found matching your criteria.</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Deal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

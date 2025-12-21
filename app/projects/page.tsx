"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Briefcase, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: string
  first_name: string
  last_name: string
}

interface Project {
  id: string
  name: string
  description?: string
  status: string
  priority: string
  start_date?: string
  end_date?: string
  budget?: number
  created_at: string
  customer?: Customer
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({
    customer_id: "",
    name: "",
    description: "",
    status: "pending",
    priority: "medium",
    start_date: "",
    end_date: "",
    budget: 0,
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (!membership?.org_id) {
        setIsLoading(false)
        return
      }

      setOrgId(membership.org_id)

      const [projectsResult, customersResult] = await Promise.all([
        supabase
          .from("projects")
          .select(`*, customer:customers(id, first_name, last_name)`)
          .eq("org_id", membership.org_id)
          .order("created_at", { ascending: false }),
        supabase.from("customers").select("id, first_name, last_name").eq("org_id", membership.org_id),
      ])

      if (projectsResult.error) throw projectsResult.error
      if (customersResult.error) throw customersResult.error

      setProjects(projectsResult.data || [])
      setCustomers(customersResult.data || [])
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({ title: "Error", description: "Failed to load projects", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!orgId) {
      toast({ title: "Error", description: "No organization found", variant: "destructive" })
      return
    }

    if (!newProject.name.trim()) {
      toast({ title: "Error", description: "Project name is required", variant: "destructive" })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("projects").insert([
        {
          org_id: orgId,
          created_by: user.id,
          customer_id: newProject.customer_id || null,
          name: newProject.name.trim(),
          description: newProject.description.trim() || null,
          status: newProject.status,
          priority: newProject.priority,
          start_date: newProject.start_date || null,
          end_date: newProject.end_date || null,
          budget: newProject.budget || null,
        },
      ])

      if (error) throw error

      toast({ title: "Success", description: "Project created successfully" })
      setIsDialogOpen(false)
      setNewProject({
        customer_id: "",
        name: "",
        description: "",
        status: "pending",
        priority: "medium",
        start_date: "",
        end_date: "",
        budget: 0,
      })
      loadData()
    } catch (error) {
      console.error("[v0] Error creating project:", error)
      toast({ title: "Error", description: "Failed to create project", variant: "destructive" })
    }
  }

  const filteredProjects = projects.filter(
    (proj) =>
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${proj.customer?.first_name} ${proj.customer?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-500",
      in_progress: "bg-blue-500",
      completed: "bg-green-500",
      on_hold: "bg-yellow-500",
      cancelled: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-400",
      medium: "bg-blue-400",
      high: "bg-orange-500",
      urgent: "bg-red-600",
    }
    return colors[priority] || "bg-gray-400"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and track progress</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Customer (Optional)</Label>
                    <Select
                      value={newProject.customer_id}
                      onValueChange={(v) => setNewProject({ ...newProject, customer_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.first_name} {c.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Project Name *</Label>
                    <Input
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={newProject.status}
                        onValueChange={(v) => setNewProject({ ...newProject, status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={newProject.priority}
                        onValueChange={(v) => setNewProject({ ...newProject, priority: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newProject.start_date}
                        onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newProject.end_date}
                        onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Briefcase className="w-4 h-4 mr-2" />
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.filter((p) => p.status === "in_progress").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 font-medium">Dates</th>
                  <th className="text-left py-3 px-4 font-medium">Budget</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">{proj.name}</td>
                    <td className="py-4 px-4">
                      {proj.customer ? `${proj.customer.first_name} ${proj.customer.last_name}` : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusColor(proj.status)} text-white`}>
                        {proj.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getPriorityColor(proj.priority)} text-white`}>
                        {proj.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {proj.start_date && <div>Start: {new Date(proj.start_date).toLocaleDateString()}</div>}
                      {proj.end_date && <div>End: {new Date(proj.end_date).toLocaleDateString()}</div>}
                    </td>
                    <td className="py-4 px-4">{proj.budget ? `$${proj.budget.toLocaleString()}` : "-"}</td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No projects found. Create your first project!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

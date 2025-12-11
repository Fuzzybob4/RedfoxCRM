"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardSidebar } from "@/app/components/dashboard-sidebar"
import { useAuth } from "@/app/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import {
  FileText,
  Video,
  ImageIcon,
  File,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  MoreVertical,
  BookOpen,
  FolderOpen,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Resource {
  id: string
  title: string
  description: string | null
  category: string
  file_url: string | null
  file_type: string | null
  file_size: number | null
  created_by: string | null
  created_at: string
  updated_at: string
  is_public: boolean
}

const categoryConfig: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  sop: { label: "SOP", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: BookOpen },
  documentation: {
    label: "Documentation",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: FileText,
  },
  training: { label: "Training", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Video },
  template: { label: "Template", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: File },
  policy: { label: "Policy", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: FileText },
  general: { label: "General", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: FolderOpen },
}

const fileTypeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileText,
  xlsx: FileText,
  mp4: Video,
  mov: Video,
  png: ImageIcon,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  default: File,
}

export default function CompanyResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "general",
    file_url: "",
  })
  const [saving, setSaving] = useState(false)

  const { user, role, hasPermission } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const canManageResources = role === "admin" || role === "super_admin"

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchResources()
  }, [user])

  async function fetchResources() {
    try {
      const { data, error } = await supabase
        .from("company_resources")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddResource() {
    if (!newResource.title.trim()) return

    setSaving(true)
    try {
      // Get user's org_id
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user?.id)
        .single()

      if (!membership?.org_id) {
        throw new Error("No organization found")
      }

      const { error } = await supabase.from("company_resources").insert({
        title: newResource.title,
        description: newResource.description || null,
        category: newResource.category,
        file_url: newResource.file_url || null,
        org_id: membership.org_id,
        created_by: user?.id,
      })

      if (error) throw error

      setNewResource({ title: "", description: "", category: "general", file_url: "" })
      setIsAddDialogOpen(false)
      fetchResources()
    } catch (error) {
      console.error("Error adding resource:", error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteResource(id: string) {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const { error } = await supabase.from("company_resources").delete().eq("id", id)
      if (error) throw error
      fetchResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Resources</h1>
              <p className="text-muted-foreground mt-1">
                Access your organization's SOPs, documentation, and training materials
              </p>
            </div>

            {canManageResources && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-orange hover:bg-brand-orange/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                    <DialogDescription>Upload a new document or resource for your team</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Employee Onboarding SOP"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newResource.category}
                        onValueChange={(value) => setNewResource({ ...newResource, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the resource..."
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file_url">File URL (optional)</Label>
                      <Input
                        id="file_url"
                        placeholder="https://..."
                        value={newResource.file_url}
                        onChange={(e) => setNewResource({ ...newResource, file_url: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddResource}
                        disabled={saving || !newResource.title.trim()}
                        className="bg-brand-orange hover:bg-brand-orange/90"
                      >
                        {saving ? "Adding..." : "Add Resource"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resources Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Your organization hasn't uploaded any resources yet"}
              </p>
              {canManageResources && !searchQuery && categoryFilter === "all" && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-brand-orange hover:bg-brand-orange/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Resource
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const category = categoryConfig[resource.category] || categoryConfig.general
                const CategoryIcon = category.icon
                const fileExt = resource.file_url?.split(".").pop()?.toLowerCase() || "default"
                const FileIcon = fileTypeIcons[fileExt] || fileTypeIcons.default

                return (
                  <Card key={resource.id} className="group hover:border-brand-orange/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge className={category.color}>{category.label}</Badge>
                        {canManageResources && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteResource(resource.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-2 flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-brand-orange" />
                        {resource.title}
                      </CardTitle>
                      {resource.description && (
                        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(resource.created_at)}
                        </div>
                        {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
                      </div>
                      {resource.file_url && (
                        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

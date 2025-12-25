"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Package, DollarSign, Trash2, Edit, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  price: number
  cost?: number
  quantity?: number
  unit?: string
  category?: string
  is_active: boolean
  created_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    quantity: 0,
    unit: "each",
    category: "",
  })

  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

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

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("org_id", membership.org_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("[v0] Error loading products:", error)
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!orgId) {
      toast({ title: "Error", description: "No organization found", variant: "destructive" })
      return
    }

    if (!newProduct.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("products").insert([
        {
          org_id: orgId,
          created_by: user.id,
          name: newProduct.name.trim(),
          description: newProduct.description.trim() || null,
          sku: newProduct.sku.trim() || null,
          price: newProduct.price,
          cost: newProduct.cost || null,
          quantity: newProduct.quantity || 0,
          unit: newProduct.unit || "each",
          category: newProduct.category.trim() || null,
          is_active: true,
        },
      ])

      if (error) throw error

      toast({ title: "Success", description: "Product created successfully" })
      setIsDialogOpen(false)
      setNewProduct({ name: "", description: "", sku: "", price: 0, cost: 0, quantity: 0, unit: "each", category: "" })
      loadData()
    } catch (error) {
      console.error("[v0] Error creating product:", error)
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
      toast({ title: "Success", description: "Product deleted" })
      loadData()
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" })
    }
  }

  const filteredProducts = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalValue = products.reduce((sum, prod) => sum + prod.price * (prod.quantity || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog and inventory</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Product name"
                      />
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label>Cost ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.cost}
                        onChange={(e) => setNewProduct({ ...newProduct, cost: Number.parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        placeholder="each, hour, sq ft..."
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProduct}>Add Product</Button>
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
                <Package className="w-4 h-4 mr-2" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <DollarSign className="w-4 h-4 mr-2" />
                Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <Card key={prod.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{prod.name}</CardTitle>
                    {prod.sku && <p className="text-xs text-muted-foreground">SKU: {prod.sku}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDeleteProduct(prod.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {prod.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{prod.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">${prod.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">per {prod.unit || "each"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{prod.quantity || 0} in stock</p>
                    {prod.category && <p className="text-xs text-muted-foreground">{prod.category}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center text-muted-foreground">
                No products found. Add your first product!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

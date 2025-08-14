"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Package, Plus, LayoutDashboard, ScrollText, Users, BarChart, Settings, DollarSign } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  owner_id: string
}

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <Package className="h-5 w-5" />, label: "Products", href: "/products", active: true },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "" })
  const [loading, setLoading] = useState(true)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [companyName, setCompanyName] = useState("Company name")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      fetchCompanyName(user.id)
      fetchProducts(user.id)
    }

    checkAuthAndLoadData()
  }, [router])

  const fetchCompanyName = async (userId: string) => {
    const { data, error } = await supabase
      .from("company_profiles")
      .select("company_name")
      .eq("owner_id", userId)
      .single()

    if (error) {
      console.error("Error fetching company name:", error)
    } else if (data && data.company_name) {
      setCompanyName(data.company_name)
    }
  }

  const fetchProducts = async (userId: string) => {
    const { data, error } = await supabase.from("products").select("*").eq("owner_id", userId)

    if (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a product.",
        variant: "destructive",
      })
      return
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ ...newProduct, price: Number.parseFloat(newProduct.price), owner_id: user.id }])
      .select()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Product added successfully.",
      })
      setProducts([...products, data[0] as Product])
      setIsAddProductOpen(false)
      setNewProduct({ name: "", description: "", price: "" })
    }
  }

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

      <div className="flex-1 flex flex-col">
        {/* Top Search Bar */}
        <div className="h-16 bg-[#272e3f] flex items-center px-4 border-b border-gray-700">
          <div className="flex-1 flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#272e3f] text-white">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-700 text-white"
                    />
                  </div>
                  <Button type="submit" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white">
                    Add Product
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <Card className="bg-[#272e3f] text-white p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Description</TableHead>
                  <TableHead className="text-gray-400">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-gray-700">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } else {
      setCustomers(data ?? [])
    }
  }

  async function handleImport() {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/customers/import", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()

      if (!res.ok) {
        toast({
          title: "Error",
          description: json.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Imported ${json.inserted} customers`,
        })
        loadCustomers()
        setFile(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer database</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="flex-1"
            />
            <Button onClick={handleImport} disabled={loading || !file}>
              {loading ? "Importing..." : "Import CSV"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Upload a CSV file with columns: first_name, last_name, email, phone_number, address, city, state, zip
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer List ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">First Name</th>
                  <th className="pb-2">Last Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Phone</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="py-2">{c.first_name}</td>
                    <td className="py-2">{c.last_name}</td>
                    <td className="py-2">{c.email}</td>
                    <td className="py-2">{c.phone_number}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {c.lead_status || "new"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No customers found. Import a CSV file to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

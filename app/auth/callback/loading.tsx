import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-lg font-medium">Loading...</p>
        <p className="text-sm text-muted-foreground">Please wait while we process your request...</p>
      </div>
    </div>
  )
}

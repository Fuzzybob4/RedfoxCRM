"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { signIn, signUp, signInWithGoogle, testConnection } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface LoginDialogProps {
  mobile?: boolean
  onClose?: () => void
}

export function LoginDialog({ mobile = false, onClose }: LoginDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "disconnected">("unknown")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const checkConnection = async () => {
    const { connected } = await testConnection()
    setConnectionStatus(connected ? "connected" : "disconnected")
    return connected
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const isConnected = await checkConnection()
      if (!isConnected) {
        setError("Unable to connect to authentication service. Please check your internet connection.")
        setGoogleLoading(false)
        return
      }

      const { error: googleError } = await signInWithGoogle()

      if (googleError) {
        setError(googleError.message || "Failed to sign in with Google. Please try again.")
        toast({
          title: "Google Sign In Failed",
          description: googleError.message || "Please try again.",
          variant: "destructive",
        })
      }
      // Note: For OAuth, the user will be redirected, so we don't need to handle success here
    } catch (error) {
      const errorMessage = "Network error. Please check your connection and try again."
      setError(errorMessage)
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check connection first
      const isConnected = await checkConnection()
      if (!isConnected) {
        setError("Unable to connect to authentication service. Please check your internet connection.")
        setLoading(false)
        return
      }

      const { data, error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message || "Failed to sign in. Please try again.")
        toast({
          title: "Sign In Failed",
          description: signInError.message || "Please check your credentials and try again.",
          variant: "destructive",
        })
      } else if (data?.user) {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        })
        setOpen(false)
        onClose?.()
        resetForm()
      }
    } catch (error) {
      const errorMessage = "Network error. Please check your connection and try again."
      setError(errorMessage)
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check connection first
      const isConnected = await checkConnection()
      if (!isConnected) {
        setError("Unable to connect to authentication service. Please check your internet connection.")
        setLoading(false)
        return
      }

      const { data, error: signUpError } = await signUp(email, password, fullName)

      if (signUpError) {
        setError(signUpError.message || "Failed to create account. Please try again.")
        toast({
          title: "Sign Up Failed",
          description: signUpError.message || "Please check your information and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account.",
        })
        setOpen(false)
        onClose?.()
        resetForm()
      }
    } catch (error) {
      const errorMessage = "Network error. Please check your connection and try again."
      setError(errorMessage)
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setShowPassword(false)
    setLoading(false)
    setGoogleLoading(false)
    setError(null)
    setConnectionStatus("unknown")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    } else {
      // Check connection when dialog opens
      checkConnection()
    }
  }

  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      {connectionStatus === "connected" && (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span>Connected</span>
        </>
      )}
      {connectionStatus === "disconnected" && (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span>Connection issues detected</span>
        </>
      )}
      {connectionStatus === "unknown" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking connection...</span>
        </>
      )}
    </div>
  )

  const DialogComponent = (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={
            mobile ? "text-white hover:text-orange-400 justify-start px-0" : "text-white hover:text-orange-400"
          }
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to RedFox CRM</DialogTitle>
          <DialogDescription>Sign in to your account or create a new one</DialogDescription>
        </DialogHeader>

        <ConnectionIndicator />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || connectionStatus === "disconnected"}
          variant="outline"
          className="w-full bg-transparent"
        >
          {googleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                  required
                  disabled={loading || connectionStatus === "disconnected"}
                  autoComplete="email"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                    required
                    disabled={loading || connectionStatus === "disconnected"}
                    autoComplete="current-password"
                    tabIndex={0}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || connectionStatus === "disconnected"}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Full Name</Label>
                <Input
                  id="signup-fullname"
                  name="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onInput={(e) => setFullName((e.target as HTMLInputElement).value)}
                  required
                  disabled={loading || connectionStatus === "disconnected"}
                  autoComplete="name"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                  required
                  disabled={loading || connectionStatus === "disconnected"}
                  autoComplete="email"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                    required
                    disabled={loading || connectionStatus === "disconnected"}
                    autoComplete="new-password"
                    tabIndex={0}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || connectionStatus === "disconnected"}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {connectionStatus === "disconnected" && (
          <div className="text-center">
            <Button variant="outline" onClick={checkConnection} className="w-full bg-transparent">
              <Wifi className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  return DialogComponent
}

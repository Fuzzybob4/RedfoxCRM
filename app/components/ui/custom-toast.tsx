"use client"

import { toast } from "@/components/ui/use-toast"

export function showSuccessToast(message: string) {
  toast({
    title: "Success",
    description: message,
    variant: "default",
  })
}

export function showErrorToast(message: string) {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  })
}

export function showInfoToast(message: string) {
  toast({
    title: "Info",
    description: message,
    variant: "default",
  })
}

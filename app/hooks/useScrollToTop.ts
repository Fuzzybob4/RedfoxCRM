"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useScrollToTop() {
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}


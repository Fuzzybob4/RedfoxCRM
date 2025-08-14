"use client"

import type React from "react"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

interface SearchParamsWrapperProps {
  children: (searchParams: URLSearchParams) => React.ReactNode
}

function SearchParamsContent({ children }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams()
  return <>{children(searchParams)}</>
}

export function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  )
}

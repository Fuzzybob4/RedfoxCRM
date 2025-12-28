import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  console.log("[v0] Photo upload route called")

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Ignore cookie errors in route handlers
            }
          },
        },
      },
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check - user:", user?.id, "error:", authError?.message)

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const customerId = formData.get("customerId") as string | null
    const orgId = formData.get("orgId") as string | null
    const photoType = formData.get("photoType") as string | null

    console.log("[v0] File received:", file?.name, file?.size, file?.type)
    console.log("[v0] Customer info:", { customerId, orgId, photoType })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"]
    if (!allowedTypes.includes(file.type)) {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Only image files (JPG, PNG, WebP, HEIC) are allowed" }, { status: 400 })
    }

    // Validate file size (10 MB max)
    if (file.size > 10_000_000) {
      console.error("[v0] File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 10 MB" }, { status: 400 })
    }

    console.log("[v0] Uploading to Vercel Blob...")

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("[v0] BLOB_READ_WRITE_TOKEN is not set")
      return NextResponse.json({ error: "Blob storage not configured" }, { status: 500 })
    }

    // Upload to Vercel Blob
    const blob = await put(`customer-photos/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    console.log("[v0] Photo uploaded to Blob storage:", blob.url)

    if (customerId && orgId) {
      console.log("[v0] Saving photo to database...")
      const { error: dbError } = await supabase.from("customer_photos").insert({
        customer_id: customerId,
        org_id: orgId,
        uploaded_by: user.id,
        photo_url: blob.url,
        photo_type: photoType || "other",
        file_size: file.size,
      })

      if (dbError) {
        console.error("[v0] Database error:", dbError)
        // Don't fail the request, photo is still uploaded to blob
      } else {
        console.log("[v0] Photo saved to database")
      }
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

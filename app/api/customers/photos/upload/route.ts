import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    // Verify user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Validate file extension
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic"]
        const hasValidExtension = allowedExtensions.some((ext) => pathname.toLowerCase().endsWith(ext))

        if (!hasValidExtension) {
          throw new Error("Only image files (JPG, PNG, WebP, HEIC) are allowed")
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
          maximumSizeInBytes: 10_000_000, // 10 MB
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("[v0] Photo uploaded to Blob storage:", blob.url)

        // Save reference to Supabase database
        try {
          const customerId = tokenPayload?.customerId as string
          const orgId = tokenPayload?.orgId as string
          const photoType = tokenPayload?.photoType as string

          if (!customerId || !orgId) {
            console.error("[v0] Missing customerId or orgId in token payload")
            return
          }

          const { error: dbError } = await supabase.from("customer_photos").insert({
            customer_id: customerId,
            org_id: orgId,
            uploaded_by: user.id,
            photo_url: blob.url,
            photo_type: photoType || "other",
            file_size: blob.size,
          })

          if (dbError) {
            console.error("[v0] Error saving photo to database:", dbError)
          } else {
            console.log("[v0] Photo reference saved to database")
          }
        } catch (error) {
          console.error("[v0] Error in onUploadCompleted:", error)
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

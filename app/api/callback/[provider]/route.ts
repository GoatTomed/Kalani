import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Universal callback handler for monetization providers
// Lootlabs, Linkvertise, and Work.ink can POST/GET here to verify checkpoint completion
//
// URL format: /api/callback/{provider}?checkpoint_id=xxx&session_token=xxx
//
// Lootlabs: Posts back with a completion token
// Linkvertise: Redirects with a token parameter
// Work.ink: Similar redirect-based verification

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const { searchParams } = new URL(request.url)
  const checkpointId = searchParams.get("checkpoint_id")
  const sessionToken = searchParams.get("session_token")
  const token = searchParams.get("token") // Provider-specific verification token

  if (!checkpointId || !sessionToken) {
    return NextResponse.json(
      { error: "Missing checkpoint_id or session_token" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Verify the checkpoint exists and matches the provider
  const { data: checkpoint } = await supabase
    .from("checkpoints")
    .select("id, provider, script_id")
    .eq("id", checkpointId)
    .single()

  if (!checkpoint) {
    return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 })
  }

  if (checkpoint.provider !== provider) {
    return NextResponse.json({ error: "Provider mismatch" }, { status: 400 })
  }

  // Provider-specific verification
  let verified = false

  switch (provider) {
    case "lootlabs":
      // Lootlabs uses a completion token
      // In production, verify with: https://be.lootlabs.gg/api/v1/verify?token=xxx
      verified = !!token
      break

    case "linkvertise":
      // Linkvertise uses dynamic link completion
      // The user is redirected back after completing
      verified = !!token
      break

    case "workink":
      // Work.ink uses a similar redirect-based verification
      verified = !!token
      break

    default:
      return NextResponse.json({ error: "Unknown provider" }, { status: 400 })
  }

  if (!verified) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 })
  }

  // Record the completion
  await supabase.from("checkpoint_completions").insert({
    checkpoint_id: checkpointId,
    session_token: sessionToken,
  })

  // Get the script to find the user profile for redirect
  const { data: script } = await supabase
    .from("scripts")
    .select("id, user_id")
    .eq("id", checkpoint.script_id)
    .single()

  if (script) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", script.user_id)
      .single()

    if (profile) {
      const redirectUrl = new URL(request.url)
      redirectUrl.pathname = `/u/${profile.username}`
      redirectUrl.search = `?script=${script.id}`
      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  return NextResponse.json({ success: true, message: "Checkpoint verified" })
}

// POST handler for providers that send POST callbacks
export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params

  try {
    const body = await request.json()

    const supabase = await createClient()

    // Lootlabs POST callback format
    if (provider === "lootlabs") {
      const { checkpoint_id, session_token } = body

      if (checkpoint_id && session_token) {
        await supabase.from("checkpoint_completions").insert({
          checkpoint_id,
          session_token,
        })

        return NextResponse.json({ success: true })
      }
    }

    // Linkvertise POST callback
    if (provider === "linkvertise") {
      const { checkpoint_id, session_token } = body

      if (checkpoint_id && session_token) {
        await supabase.from("checkpoint_completions").insert({
          checkpoint_id,
          session_token,
        })

        return NextResponse.json({ success: true })
      }
    }

    // Work.ink POST callback
    if (provider === "workink") {
      const { checkpoint_id, session_token } = body

      if (checkpoint_id && session_token) {
        await supabase.from("checkpoint_completions").insert({
          checkpoint_id,
          session_token,
        })

        return NextResponse.json({ success: true })
      }
    }

    return NextResponse.json({ error: "Invalid callback data" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

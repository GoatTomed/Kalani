import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { checkpoint_id, session_token, hwid } = await request.json()

    if (!checkpoint_id || !session_token) {
      return NextResponse.json(
        { error: "Missing checkpoint_id or session_token" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify checkpoint exists
    const { data: checkpoint } = await supabase
      .from("checkpoints")
      .select("id")
      .eq("id", checkpoint_id)
      .single()

    if (!checkpoint) {
      return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 })
    }

    // Check if already completed
    const { data: existing } = await supabase
      .from("checkpoint_completions")
      .select("id")
      .eq("checkpoint_id", checkpoint_id)
      .eq("session_token", session_token)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Already completed" })
    }

    // Record completion
    const { error } = await supabase
      .from("checkpoint_completions")
      .insert({
        checkpoint_id,
        session_token,
        hwid: hwid || null,
      })

    if (error) {
      return NextResponse.json({ error: "Failed to record completion" }, { status: 500 })
    }

    return NextResponse.json({ message: "Checkpoint completed" })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

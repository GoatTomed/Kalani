import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckpointBuilder } from "@/components/checkpoint-builder"

export default async function ScriptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: script } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!script) redirect("/dashboard")

  const { data: checkpoints } = await supabase
    .from("checkpoints")
    .select("*")
    .eq("script_id", id)
    .order("step_order", { ascending: true })

  return (
    <CheckpointBuilder
      script={script}
      checkpoints={checkpoints ?? []}
    />
  )
}

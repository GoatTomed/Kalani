import { createClient } from "@/lib/supabase/server"
import { ScriptsList } from "@/components/scripts-list"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: scripts } = await supabase
    .from("scripts")
    .select("*, checkpoints(count)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user!.id)
    .single()

  return (
    <ScriptsList
      scripts={scripts ?? []}
      username={profile?.username ?? "user"}
    />
  )
}

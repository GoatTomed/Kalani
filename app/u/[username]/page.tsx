import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Shield, FileCode, Lock } from "lucide-react"
import { KeySystemFlow } from "@/components/key-system-flow"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} - KeyGuardius`,
    description: `View ${username}'s scripts and key systems on KeyGuardius.`,
  }
}

export default async function UserProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ script?: string }>
}) {
  const { username } = await params
  const { script: selectedScriptId } = await searchParams

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single()

  if (!profile) notFound()

  const { data: scripts } = await supabase
    .from("scripts")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  let selectedScript = null
  let checkpoints: Array<{
    id: string
    script_id: string
    step_order: number
    provider: string
    destination_url: string
    label: string
  }> = []

  if (selectedScriptId) {
    const { data: s } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", selectedScriptId)
      .eq("user_id", profile.id)
      .eq("is_public", true)
      .single()

    if (s) {
      selectedScript = s
      const { data: cps } = await supabase
        .from("checkpoints")
        .select("*")
        .eq("script_id", s.id)
        .order("step_order", { ascending: true })
      checkpoints = cps ?? []
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">KeyGuardius</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Profile Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {profile.display_name?.[0]?.toUpperCase() ?? username[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {profile.display_name ?? username}
              </h1>
              <p className="text-sm text-muted-foreground">@{username}</p>
              {profile.bio && (
                <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Script Key Flow */}
        {selectedScript && checkpoints.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedScript.title}</h2>
                {selectedScript.game_name && (
                  <span className="mt-1 inline-block rounded-full bg-secondary px-3 py-0.5 text-xs text-muted-foreground">
                    {selectedScript.game_name}
                  </span>
                )}
              </div>
              <Link
                href={`/u/${username}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all scripts
              </Link>
            </div>
            <KeySystemFlow
              scriptId={selectedScript.id}
              checkpoints={checkpoints}
            />
          </div>
        )}

        {/* Scripts List */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {selectedScript ? "Other Scripts" : "Scripts"}
          </h2>
          {(!scripts || scripts.length === 0) ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 py-12 text-center">
              <FileCode className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No public scripts yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {scripts
                .filter((s) => !selectedScriptId || s.id !== selectedScriptId)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/u/${username}?script=${s.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-foreground">{s.title}</h3>
                        {s.game_name && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                            {s.game_name}
                          </span>
                        )}
                      </div>
                      {s.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-primary">
                      <Lock className="h-4 w-4" />
                      Get Key
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

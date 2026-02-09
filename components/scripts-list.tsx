"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, FileCode, Trash2, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Script {
  id: string
  title: string
  description: string | null
  game_name: string | null
  is_public: boolean
  created_at: string
  checkpoints: { count: number }[]
}

export function ScriptsList({ scripts: initialScripts, username }: { scripts: Script[]; username: string }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [gameName, setGameName] = useState("")
  const [creating, setCreating] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("scripts")
      .insert({
        title,
        description: description || null,
        game_name: gameName || null,
        user_id: user!.id,
      })
      .select()
      .single()

    if (!error && data) {
      setTitle("")
      setDescription("")
      setGameName("")
      setShowCreate(false)
      router.push(`/dashboard/scripts/${data.id}`)
    }
    setCreating(false)
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from("scripts").delete().eq("id", id)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Scripts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your scripts and configure key system checkpoints.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Script
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-primary/30 bg-card p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">Create Script</h2>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
                Script Name
              </label>
              <input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="My Script"
              />
            </div>
            <div>
              <label htmlFor="game" className="mb-1.5 block text-sm font-medium text-foreground">
                Game Name (optional)
              </label>
              <input
                id="game"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Blox Fruits, etc."
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="desc" className="mb-1.5 block text-sm font-medium text-foreground">
              Description (optional)
            </label>
            <textarea
              id="desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Describe your script..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Script"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {initialScripts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <FileCode className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-1 text-lg font-medium text-foreground">No scripts yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first script to get started with key systems.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {initialScripts.map((script) => (
            <div
              key={script.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="truncate font-semibold text-foreground">{script.title}</h3>
                  {script.game_name && (
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                      {script.game_name}
                    </span>
                  )}
                </div>
                {script.description && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">{script.description}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {script.checkpoints?.[0]?.count ?? 0} checkpoint(s)
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 ml-4">
                <Link
                  href={`/u/${username}?script=${script.id}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title="View public page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/dashboard/scripts/${script.id}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title="Configure checkpoints"
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(script.id)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Delete script"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

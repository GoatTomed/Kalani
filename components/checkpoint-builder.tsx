"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Plus, Trash2, GripVertical, ExternalLink, Copy, Check } from "lucide-react"

const PROVIDERS = [
  {
    value: "lootlabs" as const,
    label: "Lootlabs",
    domain: "lootlabs.gg",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    placeholder: "https://lootlabs.gg/your-link",
  },
  {
    value: "linkvertise" as const,
    label: "Linkvertise",
    domain: "linkvertise.com",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    placeholder: "https://linkvertise.com/your-link",
  },
  {
    value: "workink" as const,
    label: "Work.ink",
    domain: "work.ink",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    placeholder: "https://work.ink/your-link",
  },
]

interface Checkpoint {
  id: string
  script_id: string
  user_id: string
  step_order: number
  provider: "lootlabs" | "linkvertise" | "workink"
  destination_url: string
  label: string
  created_at: string
}

interface Script {
  id: string
  title: string
  description: string | null
  game_name: string | null
}

export function CheckpointBuilder({
  script,
  checkpoints: initialCheckpoints,
}: {
  script: Script
  checkpoints: Checkpoint[]
}) {
  const router = useRouter()
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints)
  const [adding, setAdding] = useState(false)
  const [newProvider, setNewProvider] = useState<"lootlabs" | "linkvertise" | "workink">("lootlabs")
  const [newUrl, setNewUrl] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const apiUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/key/check?script_id=${script.id}`
    : ""

  const getKeyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/key/get?script_id=${script.id}&hwid=PLAYER_HWID`
    : ""

  async function handleAddCheckpoint(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("checkpoints")
      .insert({
        script_id: script.id,
        user_id: user!.id,
        step_order: checkpoints.length + 1,
        provider: newProvider,
        destination_url: newUrl,
        label: newLabel || "Complete Step",
      })
      .select()
      .single()

    if (!error && data) {
      setCheckpoints([...checkpoints, data])
      setNewUrl("")
      setNewLabel("")
      setAdding(false)
    }
    setSaving(false)
  }

  async function handleDeleteCheckpoint(id: string) {
    const supabase = createClient()
    await supabase.from("checkpoints").delete().eq("id", id)
    setCheckpoints(checkpoints.filter((c) => c.id !== id))
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedProvider = PROVIDERS.find((p) => p.value === newProvider)

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scripts
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{script.title}</h1>
            {script.game_name && (
              <span className="mt-1 inline-block rounded-full bg-secondary px-3 py-0.5 text-xs text-muted-foreground">
                {script.game_name}
              </span>
            )}
            {script.description && (
              <p className="mt-2 text-sm text-muted-foreground">{script.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">API Endpoints</h2>
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Check Key Validity</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-background px-3 py-2 font-mono text-xs text-primary">
                {apiUrl}
              </code>
              <button
                onClick={() => copyToClipboard(apiUrl)}
                className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Copy URL"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Get Key (after completing checkpoints)</label>
            <code className="block truncate rounded-lg bg-background px-3 py-2 font-mono text-xs text-primary">
              {getKeyUrl}
            </code>
          </div>
        </div>
      </div>

      {/* Checkpoints */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Checkpoints ({checkpoints.length})
        </h2>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Checkpoint
        </button>
      </div>

      {adding && (
        <form
          onSubmit={handleAddCheckpoint}
          className="mb-6 rounded-xl border border-primary/30 bg-card p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">New Checkpoint</h3>

          {/* Provider Selection */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Monetization Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PROVIDERS.map((provider) => (
                <button
                  key={provider.value}
                  type="button"
                  onClick={() => setNewProvider(provider.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 transition-all ${
                    newProvider === provider.value
                      ? `${provider.borderColor} ${provider.bgColor}`
                      : "border-border bg-background hover:border-border/80"
                  }`}
                >
                  <span className={`text-xl font-bold ${provider.color}`}>
                    {provider.label[0]}
                  </span>
                  <span className="text-sm font-medium text-foreground">{provider.label}</span>
                  <span className="text-xs text-muted-foreground">{provider.domain}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cpUrl" className="mb-1.5 block text-sm font-medium text-foreground">
                Destination URL
              </label>
              <input
                id="cpUrl"
                required
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder={selectedProvider?.placeholder}
              />
            </div>
            <div>
              <label htmlFor="cpLabel" className="mb-1.5 block text-sm font-medium text-foreground">
                Button Label (optional)
              </label>
              <input
                id="cpLabel"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Complete Step"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Checkpoint"}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {checkpoints.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No checkpoints yet. Add your first checkpoint to create the key flow.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {checkpoints.map((cp, index) => {
            const provider = PROVIDERS.find((p) => p.value === cp.provider)
            return (
              <div
                key={cp.id}
                className={`flex items-center gap-4 rounded-xl border bg-card p-4 ${provider?.borderColor ?? "border-border"}`}
              >
                <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${provider?.color ?? "text-foreground"}`}>
                      {provider?.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{cp.label}</span>
                  </div>
                  <a
                    href={cp.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-primary"
                  >
                    {cp.destination_url}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteCheckpoint(cp.id)}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete checkpoint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

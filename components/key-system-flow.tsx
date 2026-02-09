"use client"

import { useState, useEffect } from "react"
import { ExternalLink, CheckCircle2, Lock, Key, Copy, Check } from "lucide-react"

const PROVIDER_STYLES: Record<string, { color: string; bgColor: string }> = {
  lootlabs: { color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
  linkvertise: { color: "text-blue-400", bgColor: "bg-blue-400/10" },
  workink: { color: "text-orange-400", bgColor: "bg-orange-400/10" },
}

const PROVIDER_NAMES: Record<string, string> = {
  lootlabs: "Lootlabs",
  linkvertise: "Linkvertise",
  workink: "Work.ink",
}

interface Checkpoint {
  id: string
  script_id: string
  step_order: number
  provider: string
  destination_url: string
  label: string
}

export function KeySystemFlow({
  scriptId,
  checkpoints,
}: {
  scriptId: string
  checkpoints: Checkpoint[]
}) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [sessionToken] = useState(() => crypto.randomUUID())
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [loadingKey, setLoadingKey] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load completed steps from session
  useEffect(() => {
    const stored = sessionStorage.getItem(`kg_progress_${scriptId}`)
    if (stored) {
      try {
        setCompletedSteps(new Set(JSON.parse(stored)))
      } catch {
        // ignore
      }
    }
  }, [scriptId])

  // Save progress
  useEffect(() => {
    if (completedSteps.size > 0) {
      sessionStorage.setItem(
        `kg_progress_${scriptId}`,
        JSON.stringify([...completedSteps])
      )
    }
  }, [completedSteps, scriptId])

  const allComplete = checkpoints.every((cp) => completedSteps.has(cp.id))

  async function handleCheckpointClick(checkpoint: Checkpoint) {
    // Open the monetization link
    window.open(checkpoint.destination_url, "_blank")

    // Mark as completed after a delay (simulates the user completing the ad)
    // In production, this would be verified via API callback
    setTimeout(async () => {
      try {
        await fetch("/api/checkpoint/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkpoint_id: checkpoint.id,
            session_token: sessionToken,
          }),
        })
      } catch {
        // still mark locally
      }

      setCompletedSteps((prev) => new Set([...prev, checkpoint.id]))
    }, 3000)
  }

  async function handleGetKey() {
    setLoadingKey(true)
    try {
      const res = await fetch("/api/key/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_id: scriptId,
          session_token: sessionToken,
        }),
      })
      const data = await res.json()
      if (data.key) {
        setGeneratedKey(data.key)
      }
    } catch {
      // handle error
    }
    setLoadingKey(false)
  }

  function copyKey() {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Get Your Key</h3>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Complete all {checkpoints.length} step(s) below to generate your key.
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${checkpoints.length === 0 ? 0 : (completedSteps.size / checkpoints.length) * 100}%`,
            }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {completedSteps.size}/{checkpoints.length} completed
        </p>
      </div>

      {/* Steps */}
      <div className="grid gap-3">
        {checkpoints.map((cp, index) => {
          const isComplete = completedSteps.has(cp.id)
          const isNext = !isComplete && index === [...completedSteps].length
          const style = PROVIDER_STYLES[cp.provider] ?? { color: "text-foreground", bgColor: "bg-secondary" }

          return (
            <div
              key={cp.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                isComplete
                  ? "border-emerald-400/30 bg-emerald-400/5"
                  : isNext
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-background opacity-50"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${style.color}`}>
                    {PROVIDER_NAMES[cp.provider]}
                  </span>
                  <span className="text-xs text-muted-foreground">{cp.label}</span>
                </div>
              </div>

              {isComplete ? (
                <span className="shrink-0 text-xs font-medium text-emerald-400">Completed</span>
              ) : isNext ? (
                <button
                  onClick={() => handleCheckpointClick(cp)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {cp.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          )
        })}
      </div>

      {/* Get Key / Show Key */}
      {allComplete && !generatedKey && (
        <button
          onClick={handleGetKey}
          disabled={loadingKey}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loadingKey ? "Generating Key..." : "Generate Key"}
        </button>
      )}

      {generatedKey && (
        <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <p className="mb-2 text-xs font-medium text-emerald-400">Your Key</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-background px-4 py-2.5 font-mono text-sm text-foreground">
              {generatedKey}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 rounded-lg bg-emerald-400/10 p-2.5 text-emerald-400 transition-colors hover:bg-emerald-400/20"
              aria-label="Copy key"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

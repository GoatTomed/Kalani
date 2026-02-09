import Link from "next/link"
import { Shield, AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">KeyGuardius</span>
        </Link>
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">Authentication Error</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Something went wrong during authentication. Please try again.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

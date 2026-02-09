import Link from "next/link"
import { Shield, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">KeyGuardius</span>
        </Link>
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">Check your email</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            We sent you a confirmation link. Click it to activate your account and start building key systems.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

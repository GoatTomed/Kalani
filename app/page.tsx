import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Shield, Zap, Users, Lock, ChevronRight } from "lucide-react"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">KeyGuardius</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden px-6 py-24 lg:py-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(190_100%_50%/0.08)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              <span>Key System Platform for Script Developers</span>
            </div>
            <h1 className="mb-6 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Build Your Key System{" "}
              <span className="text-primary">in Minutes</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground">
              Create checkpoint-based key systems with built-in monetization.
              Choose from Lootlabs, Linkvertise, or Work.ink and start earning
              from your scripts today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                Get Started Free
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border/50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mx-auto mb-16 max-w-xl text-center text-muted-foreground">
              Powerful tools to create, manage, and monetize your key systems.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Lock className="h-6 w-6" />}
                title="Checkpoint Builder"
                description="Design multi-step key flows with drag-and-drop simplicity. Each checkpoint links to your monetization provider."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Monetization Choices"
                description="Choose between Lootlabs, Linkvertise, or Work.ink for each checkpoint. Mix and match providers."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Public Profile"
                description="Every user gets a /u/username page showcasing their scripts and key systems for players to access."
              />
            </div>
          </div>
        </section>

        {/* Providers */}
        <section className="border-t border-border/50 px-6 py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Supported Monetization Providers
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-muted-foreground">
              Integrate with the top content-locking networks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <ProviderBadge name="Lootlabs" domain="lootlabs.gg" color="text-emerald-400" />
              <ProviderBadge name="Linkvertise" domain="linkvertise.com" color="text-blue-400" />
              <ProviderBadge name="Work.ink" domain="work.ink" color="text-orange-400" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 px-6 py-20">
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Ready to Start?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Create your free account and set up your first key system today.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              Create Free Account
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-muted-foreground">
          <span>KeyGuardius</span>
          <span>Key System Platform</span>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function ProviderBadge({ name, domain, color }: { name: string; domain: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4">
      <div className={`text-2xl font-bold ${color}`}>{name[0]}</div>
      <div className="text-left">
        <div className="font-semibold text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{domain}</div>
      </div>
    </div>
  )
}

import { Activity, Database, GitBranch, Server } from 'lucide-react'
import { GlassCard } from './Glass'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const DRIVERS = [
  { lang: 'Rust', driver: 'tokio-postgres' },
  { lang: 'Go', driver: 'pgx' },
  { lang: 'Java', driver: 'JDBC' },
  { lang: 'Node.js', driver: 'pg' },
  { lang: 'Python', driver: 'psycopg' },
  { lang: 'C#', driver: 'Npgsql' },
  { lang: 'C / C++', driver: 'libpq' },
]

const MODULES = ['pool', 'router', 'policy', 'admin', 'metrics']

function Connector() {
  return (
    <div className="flex items-center justify-center lg:h-auto" aria-hidden="true">
      {/* vertical on mobile, horizontal on desktop */}
      <div className="relative h-10 w-px bg-gradient-to-b from-white/5 via-pg/50 to-white/5 lg:h-px lg:w-12 lg:bg-gradient-to-r">
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pg-bright" />
      </div>
    </div>
  )
}

function PanelTitle({ children }: { children: string }) {
  return (
    <p className="border-b border-white/5 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </p>
  )
}

export function Architecture() {
  return (
    <section id="architecture" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading index="architecture" title="One hop between your drivers and your cluster">
          Any PostgreSQL driver speaks to pg-kinetic unchanged. The proxy decides
          where each statement lands — and reports everything it does.
        </SectionHeading>

        <Reveal delay={120}>
        <div className="mt-10 flex flex-col items-stretch lg:flex-row lg:items-center">
          {/* clients */}
          <GlassCard deep className="flex-1 overflow-hidden rounded-xl">
            <PanelTitle>clients — any postgres driver</PanelTitle>
            <ul className="divide-y divide-white/5">
              {DRIVERS.map((d) => (
                <li key={d.lang} className="flex items-baseline justify-between gap-3 px-4 py-2">
                  <span className="text-sm text-foreground">{d.lang}</span>
                  <span className="font-mono text-[11px] text-zinc-500">{d.driver}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <Connector />

          {/* proxy hub */}
          <div className="glass-deep overflow-hidden rounded-xl border-pg/40 lg:w-64 lg:shrink-0" style={{ boxShadow: '0 0 40px -12px hsl(211 74% 56% / 0.35), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
            <p className="border-b border-pg/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-pg-bright">
              pg-kinetic · :58432
            </p>
            <div className="grid grid-cols-5 gap-1 p-3 lg:grid-cols-1">
              {MODULES.map((m) => (
                <span
                  key={m}
                  className="rounded border border-pg/25 bg-background/60 px-2 py-1.5 text-center font-mono text-[11px] text-pg-bright"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <Connector />

          {/* targets */}
          <div className="flex-1 space-y-3">
            <GlassCard deep className="overflow-hidden rounded-xl">
              <PanelTitle>postgresql</PanelTitle>
              <ul className="divide-y divide-white/5">
                <li className="flex items-center gap-3 px-4 py-2.5">
                  <Database className="h-4 w-4 shrink-0 text-pg-bright" />
                  <span className="text-sm">primary</span>
                  <span className="ml-auto font-mono text-[11px] text-zinc-500">writes · txns</span>
                </li>
                <li className="flex items-center gap-3 px-4 py-2.5">
                  <Server className="h-4 w-4 shrink-0 text-pulse" />
                  <span className="text-sm">replicas</span>
                  <span className="ml-auto font-mono text-[11px] text-pulse">read routing · lag checks</span>
                </li>
                <li className="flex items-center gap-3 px-4 py-2.5">
                  <GitBranch className="h-4 w-4 shrink-0 text-pg-bright" />
                  <span className="text-sm">shards</span>
                  <span className="ml-auto font-mono text-[11px] text-zinc-500">route maps</span>
                </li>
              </ul>
            </GlassCard>
            <GlassCard deep className="overflow-hidden rounded-xl">
              <PanelTitle>observability</PanelTitle>
              <ul className="divide-y divide-white/5">
                <li className="flex items-center gap-3 px-4 py-2.5">
                  <Activity className="h-4 w-4 shrink-0 text-pulse" />
                  <span className="text-sm">prometheus · traces · dashboards</span>
                  <span className="ml-auto font-mono text-[11px] text-zinc-500">/healthz /readyz</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
          <span className="text-warn">failover</span> and ambiguous state fall back to
          primary · no driver changes required — smoke-tested against tokio-postgres,
          pgx, pg, and psycopg
        </p>
        </Reveal>
      </div>
    </section>
  )
}

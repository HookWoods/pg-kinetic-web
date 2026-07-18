import { useState } from 'react'
import {
  Activity,
  Boxes,
  Gauge,
  Layers,
  Repeat,
  ScrollText,
  Split,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import { GlassCard } from './Glass'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type Feature = {
  icon: LucideIcon
  title: string
  tag: string
  blurb: string
  lines: string[]
}

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: 'Transaction pooling',
    tag: 'virtual sessions',
    blurb: 'Safe pooling with tracked session state.',
    lines: [
      'Backends return to the pool only when idle and replayable.',
      'Stateful features pin the backend: transactions, temp tables, advisory locks, COPY, LISTEN/NOTIFY.',
      'Abandoned work is rolled back, drained, or discarded — recover, rollback_only, or drop.',
    ],
  },
  {
    icon: Split,
    title: 'Read routing & HA',
    tag: 'lsn-aware',
    blurb: 'Replica reads with write-LSN safety.',
    lines: [
      'Read-only statements and transactions route to replicas.',
      'Session write-LSN tracking plus replica lag checks protect read-after-write.',
      'Per-statement hints: /* pg-kinetic: replica */, /* pg-kinetic: strict-fresh */.',
      'Anything ambiguous or stale falls back to primary.',
    ],
  },
  {
    icon: Boxes,
    title: 'Sharding & route maps',
    tag: 'route-preview',
    blurb: 'Shard lifecycle and key extraction.',
    lines: [
      'Route maps and shard lifecycle tracking on top of the routing model.',
      'Conservative shard-key extraction — unknown keys never misroute.',
      'Preview decisions: cargo run -p pg-kinetic -- route-preview --config sharding.toml --sql "…".',
    ],
  },
  {
    icon: ScrollText,
    title: 'Policy engine',
    tag: 'docs/policy.md',
    blurb: 'Reload-safe routing rules and audits.',
    lines: [
      'Routing policy and shard overrides applied as reload-safe updates.',
      'Rule changes carry documented audit expectations.',
      'Rejected reloads leave the active config untouched.',
    ],
  },
  {
    icon: Terminal,
    title: 'Admin PostgreSQL endpoint',
    tag: 'psql-native',
    blurb: 'Operator surface over the wire protocol.',
    lines: [
      'SHOW CLIENTS, SHOW SERVERS, SHOW ROUTES expose the live routing picture.',
      'Plain psql — no separate admin UI to deploy or secure.',
    ],
  },
  {
    icon: Activity,
    title: 'Metrics, tracing, dashboards',
    tag: 'prometheus',
    blurb: 'QoS, backend, TLS, and auth metrics.',
    lines: [
      'pg_kinetic_backpressure_events_total, route_checkout_wait_ms, backend_pin_total, and more.',
      'Health probes: GET /healthz, /readyz (503 while draining), /state.',
      'TLS handshake, auth attempt, config reload, and drain-state metrics.',
    ],
  },
  {
    icon: Repeat,
    title: 'Safe mirroring',
    tag: 'shadow traffic',
    blurb: 'Validate changes against live traffic.',
    lines: [
      'Mirror production traffic to a second cluster without affecting clients.',
      'Validate migrations and config changes before cutover.',
      'Smoke-checked via scripts/smoke/mirroring.',
    ],
  },
  {
    icon: Gauge,
    title: 'Benchmark & regression platform',
    tag: 'pgbench harness',
    blurb: 'Four-lane reproducible comparison.',
    lines: [
      'Direct PostgreSQL, PgBouncer, PgDog, and pg-kinetic in one compose stack.',
      'Identical pgbench workload per lane — same host, warm pools.',
      'Smoke gates: tls, auth, reload, graceful drain, health, socket options.',
    ],
  },
]

export function Features() {
  const [active, setActive] = useState(0)
  const current = FEATURES[active]

  return (
    <section id="features" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading index="features" title="The proxy surface, end to end">
          Eight subsystems in one binary. Select one to see what it guarantees.
        </SectionHeading>

        <Reveal delay={120}>
          <div className="mt-10 grid items-stretch gap-3 lg:grid-cols-[0.85fr_1.15fr]">
            {/* selector list */}
            <div
              role="tablist"
              aria-label="Feature selector"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1"
            >
              {FEATURES.map((f, i) => {
                const selected = i === active
                return (
                  <button
                    key={f.title}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(i)}
                    className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 active:scale-[0.99] ${
                      selected
                        ? 'border-pg/50 bg-pg/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_-12px_rgba(90,162,255,0.35)]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.045] hover:translate-x-0.5'
                    }`}
                  >
                    <f.icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        selected ? 'text-pg-bright' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-sm font-medium ${
                          selected ? 'text-foreground' : 'text-zinc-400 group-hover:text-zinc-200'
                        }`}
                      >
                        {f.title}
                      </span>
                      <span className="hidden font-mono text-[10px] text-zinc-600 lg:block">{f.tag}</span>
                    </span>
                    <span
                      className={`ml-auto hidden font-mono text-[10px] lg:block ${
                        selected ? 'text-pg-bright' : 'text-zinc-700'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* detail panel */}
            <GlassCard deep role="tabpanel" className="overflow-hidden rounded-2xl">
              <div key={active} className="relative p-6 md:p-8" style={{ animation: 'panel-in 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
                {/* icon watermark */}
                <current.icon
                  className="pointer-events-none absolute -bottom-10 -right-8 h-52 w-52 text-pg"
                  style={{ opacity: 0.05 }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="glass flex h-11 w-11 items-center justify-center rounded-xl text-pg-bright">
                    <current.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-600">{current.tag}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{current.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{current.blurb}</p>
                <ul className="mt-5 space-y-2.5 border-t border-white/5 pt-5">
                  {current.lines.map((line, li) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-zinc-300"
                      style={{ animation: `panel-in 0.45s cubic-bezier(0.16,1,0.3,1) ${90 + li * 70}ms both` }}
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-pg-bright" />
                      <span className="font-mono text-[12.5px]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

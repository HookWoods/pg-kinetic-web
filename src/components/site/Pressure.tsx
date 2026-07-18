import { ShieldCheck, Gauge, Search } from 'lucide-react'
import { GlassCard } from './Glass'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Driver-safe',
    body: 'Session state is tracked at the wire level. Backends re-enter the pool only when provably reusable — your driver never sees the difference.',
  },
  {
    icon: Gauge,
    title: 'Predictable under load',
    body: 'Per-route queues, caps, and timeouts. Saturated routes get a fast, explicit overload error instead of an indefinite hang.',
  },
  {
    icon: Search,
    title: 'Explainable by default',
    body: 'Every decision is observable: SHOW ROUTES for the live picture, Prometheus metrics for the trends, structured errors for the rest.',
  },
]

type Lane = {
  name: string
  tone: 'ok' | 'read' | 'noisy'
  fill: number // queue slots filled (0..10)
  traffic: number[] // traffic bar heights
}

const LANES: Lane[] = [
  { name: 'api-gw · write', tone: 'ok', fill: 2, traffic: [2, 3, 2, 4, 3, 5, 4, 3, 4, 5, 3, 4] },
  { name: 'worker · read', tone: 'read', fill: 4, traffic: [3, 4, 5, 4, 6, 5, 7, 5, 6, 4, 5, 6] },
  { name: 'billing · noisy', tone: 'noisy', fill: 10, traffic: [4, 6, 7, 8, 9, 8, 10, 9, 10, 10, 9, 10] },
]

const TONE = {
  ok: { dot: '#5aa2ff', text: 'text-pg-bright', border: 'border-pg/40', chip: 'border-pg/30 bg-pg/10 text-pg-bright' },
  read: { dot: '#1fd98a', text: 'text-pulse', border: 'border-pulse/40', chip: 'border-pulse/30 bg-pulse/10 text-pulse' },
  noisy: { dot: '#f6a723', text: 'text-warn', border: 'border-warn/50', chip: 'border-warn/40 bg-warn/10 text-warn' },
} as const

const MAX_BARS = 10

function LaneCard({ lane }: { lane: Lane }) {
  const t = TONE[lane.tone]
  const saturated = lane.fill >= 10
  return (
    <div className={`rounded-lg border bg-white/[0.02] p-4 transition-colors duration-200 ${saturated ? 'border-warn/40' : 'border-white/[0.07] hover:border-white/15'}`}>
      {/* lane header */}
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.dot }} />
        <span className="font-mono text-[12px] font-medium text-zinc-200">{lane.name}</span>
        <span className={`ml-auto rounded border px-1.5 py-0.5 font-mono text-[9.5px] ${saturated ? 'border-warn/40 bg-warn/10 text-warn' : 'border-white/10 bg-white/[0.03] text-zinc-500'}`}>
          {saturated ? 'queue full' : 'flowing'}
        </span>
      </div>

      {/* traffic sparkline */}
      <div className="mt-3 flex h-6 items-end gap-[3px]">
        {lane.traffic.map((h, i) => (
          <span
            key={i}
            className="w-full rounded-[2px] transition-all"
            style={{
              height: `${(h / MAX_BARS) * 100}%`,
              background: t.dot,
              opacity: 0.22 + (h / MAX_BARS) * 0.55,
            }}
          />
        ))}
      </div>

      {/* pipeline */}
      <div className="mt-3 flex items-center gap-2">
        {/* queue */}
        <div className="shrink-0">
          <div className="flex gap-[3px]">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="h-3 w-1.5 rounded-[2px]"
                style={{
                  background: i < lane.fill ? t.dot : 'rgba(255,255,255,0.07)',
                  boxShadow: i < lane.fill && saturated ? `0 0 6px ${t.dot}` : undefined,
                }}
              />
            ))}
          </div>
          <p className="mt-1.5 font-mono text-[9px] text-zinc-600">queue {lane.fill}/10</p>
        </div>

        <span className="font-mono text-[11px] text-zinc-600">→</span>

        {/* gate */}
        <div className="shrink-0 text-center">
          <div className={`flex h-7 w-9 items-center justify-center rounded-md border bg-pg/[0.08] ${saturated ? 'border-warn/60' : 'border-pg/50'}`}>
            <span className={`h-3.5 w-[3px] rounded-full ${saturated ? 'bg-warn' : 'bg-pg-bright'}`} />
          </div>
          <p className="mt-1.5 font-mono text-[9px] text-zinc-600">gate</p>
        </div>

      </div>

      {/* outcome — full-width strip, one glance */}
      {saturated ? (
        <div className="mt-3 flex items-center justify-between rounded-md border border-warn/40 bg-warn/[0.08] px-3 py-2">
          <span className="whitespace-nowrap font-mono text-[10px] font-medium text-warn">53300 · fast reject</span>
          <span className="whitespace-nowrap font-mono text-[9px] text-zinc-500">error in ms — no hang</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2">
          <span className={`font-mono text-[10px] font-medium ${t.text}`}>
            {lane.tone === 'read' ? 'admitted → replica' : 'admitted → primary'}
          </span>
          <span className="font-mono text-[9px] text-zinc-500">backends 3/3</span>
        </div>
      )}
    </div>
  )
}

export function Pressure() {
  return (
    <section id="pressure" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading index="under-load" title="Stay predictable under pressure." tone="text-pulse">
          Traffic spikes should degrade gracefully, not mysteriously. pg-kinetic shapes
          load per route — so one noisy path can never take the pool down with it.
        </SectionHeading>

        <div className="mt-10 grid items-stretch gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={100}>
            <div className="flex h-full flex-col gap-3">
              {PILLARS.map((p) => (
                <GlassCard
                  key={p.title}
                  className="group flex flex-1 items-start gap-4 rounded-xl p-5"
                >
                  <div className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-pg-bright transition-transform duration-300 group-hover:scale-110">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="glass-deep h-full overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  backpressure — one queue per route
                </span>
                <span className="hidden items-center gap-3 font-mono text-[9.5px] text-zinc-600 sm:flex">
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-pg" /> write</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-pulse" /> read</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-warn" /> saturated</span>
                </span>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {LANES.map((lane) => (
                  <LaneCard key={lane.name} lane={lane} />
                ))}
              </div>

              <p className="border-t border-white/5 px-5 py-3 font-mono text-[10.5px] leading-relaxed text-zinc-600">
                billing saturates → its queue fills → 53300 overload error in
                milliseconds · api-gw and worker never feel it
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import { ArrowRight, CheckCircle2, CircleAlert, Gauge, Search, ShieldCheck } from 'lucide-react'
import { GlassCard } from './Glass'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Driver-safe',
    body: 'Session state is tracked at the wire level. Backends return to the pool only when they are reusable.',
  },
  {
    icon: Gauge,
    title: 'Predictable under load',
    body: 'Each route has its own queue and deadline. A full route rejects work quickly instead of hanging.',
  },
  {
    icon: Search,
    title: 'Explainable by default',
    body: 'SHOW ROUTES, Prometheus metrics, and structured errors make every routing decision visible.',
  },
]

function QueueSlots({ filled, tone = 'bg-pg' }: { filled: number; tone?: string }) {
  return (
    <div className="flex gap-1" aria-label={`Queue capacity: ${filled} of 10 slots used`}>
      {Array.from({ length: 10 }, (_, index) => (
        <span
          key={index}
          className={`h-3 flex-1 rounded-[2px] ${index < filled ? tone : 'bg-white/[0.08]'}`}
        />
      ))}
    </div>
  )
}

function HealthyRoute({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-medium text-zinc-200">{name}</span>
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-pulse" aria-hidden="true" />
      </div>
      <p className="mt-1 font-mono text-[9.5px] text-zinc-500">{detail}</p>
    </div>
  )
}

export function Pressure() {
  return (
    <section id="pressure" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading index="under-load" title="Stay predictable under pressure." tone="text-pulse">
          Traffic spikes should degrade gracefully, not mysteriously. pg-kinetic isolates pressure per route so one noisy path cannot take the pool down with it.
        </SectionHeading>

        <div className="mt-10 grid items-stretch gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={100}>
            <div className="flex h-full flex-col gap-3">
              {PILLARS.map((pillar) => (
                <GlassCard key={pillar.title} className="group flex flex-1 items-start gap-4 rounded-xl p-5">
                  <div className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-pg-bright transition-transform duration-300 group-hover:scale-110">
                    <pillar.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">{pillar.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="glass-deep h-full overflow-hidden rounded-xl">
              <div className="border-b border-white/5 px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Backpressure in practice</p>
                <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-100">Billing reaches its queue limit</h3>
              </div>

              <div className="p-5">
                <div className="rounded-lg border border-warn/40 bg-warn/[0.06] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] font-medium text-warn">billing / write</p>
                      <p className="mt-1 font-mono text-[10px] text-zinc-500">Route-specific queue</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded border border-warn/40 bg-warn/10 px-2 py-1 font-mono text-[10px] font-medium text-warn">
                      <CircleAlert className="h-3 w-3" aria-hidden="true" /> queue full
                    </span>
                  </div>
                  <div className="mt-4">
                    <QueueSlots filled={10} tone="bg-warn" />
                    <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] text-zinc-500">
                      <span>queued work</span>
                      <span>10 / 10</span>
                    </div>
                  </div>
                </div>

                <div className="my-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">New request</p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-200">billing / write</p>
                  </div>
                  <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-zinc-600 sm:rotate-0" aria-hidden="true" />
                  <div className="rounded-lg border border-warn/40 bg-warn/[0.08] px-3 py-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-warn/80">Immediate result</p>
                    <p className="mt-1 font-mono text-[11px] font-medium text-warn">53300 overload error</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Other routes continue normally</p>
                    <span className="font-mono text-[9.5px] text-pulse">capacity stays isolated</span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <HealthyRoute name="api-gw / write" detail="2 / 10 queued" />
                    <HealthyRoute name="worker / read" detail="4 / 10 queued" />
                  </div>
                </div>
              </div>

              <p className="border-t border-white/5 px-5 py-3 font-mono text-[10.5px] leading-relaxed text-zinc-500">
                A busy route gets a fast, explicit failure. It does not consume the capacity reserved for the rest of the system.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

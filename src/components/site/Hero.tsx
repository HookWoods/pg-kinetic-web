import { BookOpen, Check, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Terminal, type TermLine } from './Terminal'
import { GITHUB_URL, DOCS_URL } from '@/config'

const QUICKSTART_COMMAND = [
  'docker run --rm --name pg-kinetic \\',
  '  --publish 6432:6432 \\',
  '  --env PG_KINETIC_LISTEN_ADDR=0.0.0.0:6432 \\',
  '  --env PG_KINETIC_BACKEND_ADDR=<POSTGRES_IP>:5432 \\',
  '  ghcr.io/hookwoods/pg-kinetic:latest',
].join('\n')

const QUICKSTART_LINES: TermLine[] = [
  { type: 'cmd', text: 'docker run --rm --name pg-kinetic \\' },
  { type: 'continuation', text: '  --publish 6432:6432 \\' },
  { type: 'continuation', text: '  --env PG_KINETIC_LISTEN_ADDR=0.0.0.0:6432 \\' },
  { type: 'continuation', text: '  --env PG_KINETIC_BACKEND_ADDR=<POSTGRES_IP>:5432 \\' },
  { type: 'continuation', text: '  ghcr.io/hookwoods/pg-kinetic:latest' },
]

const ENDPOINTS = [
  { label: 'PostgreSQL', value: ':6432' },
  { label: 'Backend', value: '<POSTGRES_IP>:5432' },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-24 md:pt-28 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="word-in" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-1.5 font-mono text-[11px]">
                <span className="text-pg-bright">drop-in postgres proxy</span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-zinc-400">rust</span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-zinc-400">postgres wire protocol</span>
              </div>
            </div>

            <h1
              className="word-in mt-7 max-w-2xl text-balance text-[2.7rem] font-bold leading-[1.04] tracking-[-0.03em] md:text-[4.05rem]"
              style={{ '--d': '100ms' } as React.CSSProperties}
            >
              Keep PostgreSQL responsive under connection spikes.
            </h1>

            <p
              className="summary word-in mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ '--d': '220ms' } as React.CSSProperties}
            >
              pg-kinetic sits between your application and PostgreSQL. Keep your driver and SQL, then add transaction pooling, route-level backpressure, and operator signals before traffic overloads a backend.
            </p>

            <div className="word-in mt-8 flex flex-wrap items-center gap-3" style={{ '--d': '320ms' } as React.CSSProperties}>
              <Button
                size="lg"
                asChild
                className="sheen glow-primary gap-2 rounded-full px-6 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <a href={`${DOCS_URL}/installation`} target="_blank" rel="noreferrer">
                  <BookOpen className="h-4 w-4" />
                  Installation guide
                </a>
              </Button>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="glass sheen inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:text-white active:scale-[0.98]"
              >
                <Github className="h-4 w-4" />
                View source
              </a>
            </div>

            <div className="word-in mt-10 border-t border-white/5 pt-6" style={{ '--d': '420ms' } as React.CSSProperties}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">Designed for a low-risk rollout</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {['Keep the PostgreSQL protocol', 'Bound pressure per route', 'Observe every route'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                    <Check className="h-3 w-3 text-pulse" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="word-in" style={{ '--d': '180ms' } as React.CSSProperties}>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-pg-bright">Quick start</p>
            <Terminal title="Docker image · latest" lines={QUICKSTART_LINES} copyText={QUICKSTART_COMMAND} />
            <div className="mt-4 grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 py-4">
              {ENDPOINTS.map((endpoint) => (
                <div key={endpoint.label} className="px-3 first:pl-0 last:pr-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{endpoint.label}</p>
                  <p className="mt-1 font-mono text-sm font-medium text-zinc-200">{endpoint.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
              Replace <code className="font-mono text-zinc-300">&lt;POSTGRES_IP&gt;</code> with a reachable PostgreSQL address. The image pulls the latest published release; no repository checkout is required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

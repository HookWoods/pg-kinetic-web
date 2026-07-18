import { useState } from 'react'
import { ArrowRight, BookOpen, Box, Check, Container, Github, ShipWheel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Terminal, type TermLine } from './Terminal'
import { GITHUB_URL, DOCS_URL } from '@/config'

type InstallMethod = {
  id: 'docker' | 'compose' | 'helm'
  label: string
  icon: typeof Container
  title: string
  lines: TermLine[]
  copyText: string
  endpoints: Array<{ label: string; value: string }>
  connectionTarget: string
  note: React.ReactNode
}

const INSTALL_METHODS: InstallMethod[] = [
  {
    id: 'docker',
    label: 'Docker',
    icon: Container,
    title: 'Container image - latest',
    lines: [
      { type: 'cmd', text: 'docker run --rm --name pg-kinetic \\' },
      { type: 'continuation', text: '  --publish 6432:6432 \\' },
      { type: 'continuation', text: '  --env PG_KINETIC_LISTEN_ADDR=0.0.0.0:6432 \\' },
      { type: 'continuation', text: '  --env PG_KINETIC_BACKEND_ADDR=<POSTGRES_IP>:5432 \\' },
      { type: 'continuation', text: '  ghcr.io/hookwoods/pg-kinetic:latest' },
    ],
    copyText: [
      'docker run --rm --name pg-kinetic \\',
      '  --publish 6432:6432 \\',
      '  --env PG_KINETIC_LISTEN_ADDR=0.0.0.0:6432 \\',
      '  --env PG_KINETIC_BACKEND_ADDR=<POSTGRES_IP>:5432 \\',
      '  ghcr.io/hookwoods/pg-kinetic:latest',
    ].join('\n'),
    endpoints: [
      { label: 'PostgreSQL', value: ':6432' },
      { label: 'Backend', value: '<POSTGRES_IP>:5432' },
    ],
    connectionTarget: '127.0.0.1:6432',
    note: <>Replace <code className="font-mono text-zinc-300">&lt;POSTGRES_IP&gt;</code> with a reachable PostgreSQL address. The image pulls the latest published release; no repository checkout is required.</>,
  },
  {
    id: 'compose',
    label: 'Compose',
    icon: Box,
    title: 'Local stack - Docker Compose',
    lines: [
      { type: 'cmd', text: 'git clone https://github.com/HookWoods/pg-kinetic.git' },
      { type: 'cmd', text: 'cd pg-kinetic' },
      { type: 'cmd', text: 'docker compose -f deploy/docker-compose.yml up -d --build' },
    ],
    copyText: [
      'git clone https://github.com/HookWoods/pg-kinetic.git',
      'cd pg-kinetic',
      'docker compose -f deploy/docker-compose.yml up -d --build',
    ].join('\n'),
    endpoints: [
      { label: 'Proxy', value: ':6432' },
      { label: 'PostgreSQL', value: ':55432' },
    ],
    connectionTarget: '127.0.0.1:6432',
    note: <>Runs the bundled PostgreSQL and proxy stack for local evaluation, with health, admin, and metrics endpoints included.</>,
  },
  {
    id: 'helm',
    label: 'Helm',
    icon: ShipWheel,
    title: 'Kubernetes chart - latest',
    lines: [
      { type: 'cmd', text: 'helm repo add pgkinetic https://helm.pgkinetic.dev' },
      { type: 'cmd', text: 'helm repo update' },
      { type: 'cmd', text: 'helm install pg-kinetic pgkinetic/pg-kinetic \\' },
      { type: 'continuation', text: '  --set image.repository=ghcr.io/hookwoods/pg-kinetic \\' },
      { type: 'continuation', text: '  --set image.tag=latest' },
    ],
    copyText: [
      'helm repo add pgkinetic https://helm.pgkinetic.dev',
      'helm repo update',
      'helm install pg-kinetic pgkinetic/pg-kinetic \\',
      '  --set image.repository=ghcr.io/hookwoods/pg-kinetic \\',
      '  --set image.tag=latest',
    ].join('\n'),
    endpoints: [
      { label: 'Service', value: 'ClusterIP' },
      { label: 'Proxy port', value: '6432' },
    ],
    connectionTarget: '<SERVICE_NAME>:6432',
    note: <>Use a values file to set the PostgreSQL backend, capacity limits, authentication, and production rollout policy before routing application traffic.</>,
  },
]

export function Hero() {
  const [installMethod, setInstallMethod] = useState<InstallMethod['id']>('docker')
  const selectedInstallMethod = INSTALL_METHODS.find((method) => method.id === installMethod) ?? INSTALL_METHODS[0]

  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-24 md:pt-28 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
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

          <div className="word-in lg:pt-1" style={{ '--d': '180ms' } as React.CSSProperties}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-pg-bright">Quick start</p>
              <div className="inline-flex border border-white/10 bg-black/20 p-1" role="tablist" aria-label="Installation method">
                {INSTALL_METHODS.map((method) => {
                  const Icon = method.icon
                  const active = method.id === selectedInstallMethod.id

                  return (
                    <button
                      key={method.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="quick-start-command"
                      onClick={() => setInstallMethod(method.id)}
                      className={`flex h-8 items-center gap-1.5 px-2.5 font-mono text-[11px] transition-colors sm:px-3 ${
                        active
                          ? 'bg-pg text-[#05101c]'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {method.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div id="quick-start-command" role="tabpanel">
              <Terminal title={selectedInstallMethod.title} lines={selectedInstallMethod.lines} copyText={selectedInstallMethod.copyText} />
            </div>
            <div className="mt-4 grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 py-4">
              {selectedInstallMethod.endpoints.map((endpoint) => (
                <div key={endpoint.label} className="px-3 first:pl-0 last:pr-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{endpoint.label}</p>
                  <p className="mt-1 font-mono text-sm font-medium text-zinc-200">{endpoint.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">{selectedInstallMethod.note}</p>
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Then change one connection target</p>
              <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600">Before</p>
                  <code className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[11px] text-zinc-400">
                    postgres://...@&lt;POSTGRES_IP&gt;:5432/...
                  </code>
                </div>
                <ArrowRight className="hidden h-4 w-4 text-pg sm:block" aria-hidden="true" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-pg-bright">After</p>
                  <code className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[11px] text-zinc-100">
                    postgres://...@{selectedInstallMethod.connectionTarget}/...
                  </code>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Keep your PostgreSQL driver and SQL. Start with one low-risk service and retain the direct connection path for rollback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

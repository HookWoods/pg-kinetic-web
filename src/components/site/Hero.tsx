import { useCallback, useRef } from 'react'
import { ArrowDownRight, BookOpen, Check, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from './Reveal'
import { GITHUB_URL, DOCS_URL } from '@/config'

const BLUE = '#5aa2ff'
const BLUE_BRIGHT = '#8ab6ff'
const GREEN = '#1fd98a'
const AMBER = '#f6a723'
const WIRE = 'rgba(140,170,255,0.13)'
const NODE_FILL = '#0d1117'
const NODE_STROKE = 'rgba(255,255,255,0.10)'
const MONO = "'JetBrains Mono', ui-monospace, monospace"

const CLIENTS = [
  { label: 'psql', y: 55 },
  { label: 'api-gw', y: 125 },
  { label: 'worker', y: 195 },
  { label: 'web', y: 265 },
  { label: 'cron', y: 335 },
]

const BACKENDS = [
  { label: 'primary', y: 55, color: BLUE },
  { label: 'replica-1', y: 125, color: GREEN },
  { label: 'replica-2', y: 180, color: GREEN },
  { label: 'shard-a', y: 250, color: BLUE },
  { label: 'shard-b', y: 320, color: BLUE },
]

// left-edge entry points on the proxy node (x=280)
const ENTRY = [145, 175, 205, 235, 265]
// right-edge exit points on the proxy node (x=400)
const EXIT = [150, 185, 215, 245, 270]

const clientPath = (i: number) =>
  `M104,${CLIENTS[i].y} C170,${CLIENTS[i].y} 210,${ENTRY[i]} 280,${ENTRY[i]}`
const backendPath = (i: number) =>
  `M400,${EXIT[i]} C470,${EXIT[i]} 490,${BACKENDS[i].y} 560,${BACKENDS[i].y}`

function Packet({ path, color, dur, begin }: { path: string; color: string; dur: number; begin: number }) {
  return (
    <circle r="2.6" fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
    </circle>
  )
}

function WireTraffic() {
  return (
    <div className="glass-deep overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-zinc-500">wire traffic — logical view</span>
        <span className="ml-auto hidden items-center gap-3 font-mono text-[10px] text-zinc-500 sm:flex">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} /> write / txn</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} /> read route</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: AMBER }} /> failover</span>
        </span>
      </div>

      <svg viewBox="0 0 680 400" className="block w-full" role="img" aria-label="pg-kinetic wire traffic diagram">
        {/* column headers */}
        <text x="60" y="20" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily={MONO} letterSpacing="2">CLIENTS</text>
        <text x="340" y="100" textAnchor="middle" fill={BLUE_BRIGHT} fontSize="10" fontFamily={MONO} letterSpacing="2">PG-KINETIC</text>
        <text x="612" y="20" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily={MONO} letterSpacing="2">POSTGRES</text>

        {/* client -> proxy wires */}
        {CLIENTS.map((_, i) => (
          <path key={`cw-${i}`} d={clientPath(i)} fill="none" stroke={WIRE} strokeWidth="1" />
        ))}
        {/* proxy -> backend wires */}
        {BACKENDS.map((b, i) => (
          <path
            key={`bw-${i}`}
            d={backendPath(i)}
            fill="none"
            stroke={b.color}
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        {/* failover wire: replica-1 -> primary */}
        <path
          d="M612,110 L612,70"
          fill="none"
          stroke={AMBER}
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <text x="626" y="95" fill={AMBER} fontSize="9" fontFamily={MONO}>failover</text>

        {/* packets */}
        {CLIENTS.map((_, i) => (
          <Packet key={`cp-${i}`} path={clientPath(i)} color={i === 1 ? GREEN : BLUE} dur={1.9 + i * 0.35} begin={i * 0.5} />
        ))}
        {BACKENDS.map((b, i) => (
          <Packet key={`bp-${i}`} path={backendPath(i)} color={b.color} dur={2.1 + i * 0.3} begin={0.9 + i * 0.4} />
        ))}
        <Packet path="M612,110 L612,70" color={AMBER} dur={4} begin={0} />

        {/* client nodes */}
        {CLIENTS.map((c) => (
          <g key={c.label}>
            <rect x="16" y={c.y - 14} width="88" height="28" rx="6" fill={NODE_FILL} stroke={NODE_STROKE} />
            <text x="60" y={c.y + 4} textAnchor="middle" fill="#9aa3ad" fontSize="11" fontFamily={MONO}>{c.label}</text>
          </g>
        ))}

        {/* proxy node */}
        <rect x="280" y="120" width="120" height="170" rx="10" fill="rgba(90,162,255,0.06)" stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.2" />
        <text x="340" y="146" textAnchor="middle" fill="#9aa3ad" fontSize="9.5" fontFamily={MONO}>:58432</text>
        <text x="340" y="168" textAnchor="middle" fill={BLUE_BRIGHT} fontSize="13" fontWeight="600" fontFamily={MONO}>pg-kinetic</text>
        <line x1="296" y1="182" x2="384" y2="182" stroke="rgba(255,255,255,0.10)" />
        {['pool', 'router', 'policy', 'admin', 'metrics'].map((m, i) => (
          <text key={m} x="340" y={202 + i * 16} textAnchor="middle" fill="#77808c" fontSize="9.5" fontFamily={MONO}>{m}</text>
        ))}

        {/* metrics output */}
        <path d="M340,290 L340,332" fill="none" stroke={GREEN} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 4" />
        <text x="340" y="350" textAnchor="middle" fill={GREEN} fontSize="9.5" fontFamily={MONO}>metrics · traces</text>

        {/* backend nodes */}
        {BACKENDS.map((b) => (
          <g key={b.label}>
            <rect x="560" y={b.y - 14} width="104" height="28" rx="6" fill={NODE_FILL} stroke={b.color} strokeOpacity="0.5" />
            <text x="612" y={b.y + 4} textAnchor="middle" fill={b.color} fontSize="11" fontFamily={MONO}>{b.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/** pointer-tilt wrapper: the diagram leans toward the cursor, max ~5deg */
function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1100px) rotateY(${px * 5}deg) rotateX(${-py * 4}deg)`
  }, [])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)'
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

const SMOKE = ['tls_smoke', 'auth_smoke', 'reload_config', 'graceful_drain', 'health_endpoints', 'socket_options']

const H1_WORDS = ['PostgreSQL', 'traffic', 'control', 'at']

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-24 md:pt-28 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="word-in" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-1.5 font-mono text-[11px]">
                <span className="text-pg-bright">open source</span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-zinc-400">rust</span>
                <span className="h-3 w-px bg-white/15" />
                <span className="text-zinc-400">postgres wire protocol</span>
              </div>
            </div>

            <h1 className="text-balance mt-7 text-[2.6rem] font-bold leading-[1.04] tracking-[-0.03em] md:text-[3.8rem]">
              {H1_WORDS.map((w, i) => (
                <span key={w} className="word-in inline-block mr-[0.24em]" style={{ '--d': `${80 + i * 70}ms` } as React.CSSProperties}>
                  {w}
                </span>
              ))}
              <span
                className="word-in inline-block whitespace-nowrap text-pg-bright"
                style={
                  {
                    '--d': `${80 + H1_WORDS.length * 70}ms`,
                    textShadow: '0 0 32px hsl(211 95% 68% / 0.35)',
                  } as React.CSSProperties
                }
              >
                wire speed
              </span>
            </h1>

            <p
              className="word-in mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ '--d': '480ms' } as React.CSSProperties}
            >
              Rust PostgreSQL proxy for pooling, routing, sharding, policy,
              observability, and performance regression testing.
            </p>

            <div className="word-in mt-8 flex flex-wrap items-center gap-3" style={{ '--d': '580ms' } as React.CSSProperties}>
              <Button
                size="lg"
                asChild
                className="sheen glow-primary gap-2 rounded-full px-6 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <a href={DOCS_URL} target="_blank" rel="noreferrer">
                  <BookOpen className="h-4 w-4" />
                  Read the docs
                </a>
              </Button>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="glass sheen inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:text-white active:scale-[0.98]"
              >
                <Github className="h-4 w-4" />
                View GitHub
              </a>
              <a
                href="#pressure"
                className="group inline-flex h-11 items-center gap-2 rounded-full px-4 font-mono text-[13px] text-zinc-400 transition-colors duration-200 hover:text-pg-bright"
              >
                /under-load
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </div>

            <div className="word-in mt-10 border-t border-white/5 pt-6" style={{ '--d': '680ms' } as React.CSSProperties}>
              <p className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                <span className="text-zinc-400">$ cargo test --workspace</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {SMOKE.map((t, i) => (
                  <span
                    key={t}
                    className="word-in flex items-center gap-1.5 font-mono text-[11px] text-zinc-400"
                    style={{ '--d': `${760 + i * 60}ms` } as React.CSSProperties}
                  >
                    <Check className="h-3 w-3 text-pulse" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Reveal delay={200} className="relative">
            <Tilt>
              <WireTraffic />
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

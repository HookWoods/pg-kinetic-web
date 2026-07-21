import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { DOCS_URL, GITHUB_URL } from '@/config'
import { Logo } from '@/components/site/Logo'
import { AnalyticsConsentBanner } from '@/components/site/AnalyticsConsent'

type ContentPageKey = 'pgbouncer-alternative' | 'postgresql-connection-pooling' | 'postgresql-backpressure'

type ContentPageDefinition = {
  eyebrow: string
  title: string
  summary: string
  facts: Array<{ label: string; value: string }>
  sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }>
}

const PAGES: Record<ContentPageKey, ContentPageDefinition> = {
  'pgbouncer-alternative': {
    eyebrow: 'Evaluation guide',
    title: 'Evaluating a PgBouncer alternative for PostgreSQL traffic control',
    summary:
      'PgBouncer is a proven PostgreSQL pooler. pg-kinetic is for teams that also need explicit overload boundaries, routing decisions, and operational signals at the PostgreSQL wire-protocol layer.',
    facts: [
      { label: 'Start with', value: 'A canary connection string' },
      { label: 'Evaluate', value: 'Pooling, overload, and driver behavior' },
      { label: 'Keep', value: 'Your direct PostgreSQL rollback path' },
    ],
    sections: [
      {
        title: 'Do not replace a stable pooler without a concrete gap',
        paragraphs: [
          'A connection pooler has a narrow but important job: it limits the number of database backends while allowing many clients to share capacity. If transaction pooling is the only requirement, the right decision may be to keep the existing pooler and focus on configuration, observability, and database capacity first.',
          'The evaluation changes when one hot tenant, route, or workload can consume all available database connections. A global queue makes the rest of the application wait behind that pressure. pg-kinetic is designed to make those bounds visible and enforceable per route instead of treating every connection as one undifferentiated stream.',
        ],
      },
      {
        title: 'Where pg-kinetic changes the operating model',
        paragraphs: [
          'pg-kinetic is a Rust PostgreSQL wire proxy. It accepts normal PostgreSQL client traffic, tracks the state required for conservative transaction pooling, and exposes its own administrative and metrics surfaces. Applications keep their existing driver and SQL; adoption begins by changing the connection target, not by introducing a new client library.',
          'Its route-level backpressure isolates queues and deadlines. When a route is saturated, the proxy can reject new work with PostgreSQL SQLSTATE 53300 rather than allowing waiters from that route to consume the capacity reserved for another one. Read routing and replica safety checks are separate decisions that should be enabled only after the primary path is verified.',
        ],
        bullets: [
          'Transaction pooling with wire-level session tracking.',
          'Per-route queue, waiter, and in-flight limits.',
          'PostgreSQL-compatible admin queries and Prometheus metrics.',
          'Read-routing controls with explicit safety boundaries.',
        ],
      },
      {
        title: 'Run a comparison as an operational test',
        paragraphs: [
          'Do not compare proxy products using only peak requests per second. Use representative client drivers, authentication, prepared statements, transaction patterns, and connection churn. Record backend saturation, queueing, error behavior, p95 and p99 latency, and the work needed to identify a hot route during an incident.',
          'Start with a small canary and retain the original direct PostgreSQL connection path. Increase traffic only after health checks, metrics, driver compatibility, and rollback have been exercised. This keeps the comparison grounded in the behavior your application actually depends on rather than feature checklists.',
        ],
      },
      {
        title: 'Questions to answer before a production rollout',
        paragraphs: [
          'The practical decision is not whether one project is universally better. It is whether the proxy gives operators enough control over the failure modes that matter for this PostgreSQL deployment. Confirm the answer with production-like traffic and a reversible rollout.',
        ],
        bullets: [
          'Can one noisy workload exhaust every database connection today?',
          'Can operators see waiting clients, backend saturation, and overload decisions?',
          'Does the workload rely on session state that needs careful pooling validation?',
          'Can the team revert the connection target quickly during a canary?',
        ],
      },
    ],
  },
  'postgresql-connection-pooling': {
    eyebrow: 'Connection pooling',
    title: 'PostgreSQL connection pooling with bounded database pressure',
    summary:
      'Connection pooling protects PostgreSQL from connection storms by sharing a smaller backend pool across many clients. A safe design also needs clear session boundaries, timeouts, and observable overload behavior.',
    facts: [
      { label: 'Client side', value: 'Many application connections' },
      { label: 'Backend side', value: 'A bounded PostgreSQL pool' },
      { label: 'Failure mode', value: 'Explicit queue or overload response' },
    ],
    sections: [
      {
        title: 'Why PostgreSQL connection pooling matters',
        paragraphs: [
          'Opening a PostgreSQL backend is not free. Each backend consumes memory, scheduling capacity, and work in the database. During deploys, autoscaling, failover, or a traffic spike, many application workers can open connections faster than PostgreSQL can serve useful queries. The result is often rising latency long before the database is visibly unavailable.',
          'A pooler gives the database a known upper bound: many client sessions can wait for a smaller set of reusable backends. That is valuable only when the wait itself is bounded and observable. An unbounded queue shifts the overload into application latency, timeouts, retries, and eventually a larger incident.',
        ],
      },
      {
        title: 'Transaction pooling is a compatibility decision',
        paragraphs: [
          'In transaction pooling, a backend is returned to the pool after a transaction completes so it can serve another client. This improves backend utilization, but it is not transparent for every session-level behavior. Prepared statements, temporary objects, session parameters, advisory locks, and long-lived transaction state need explicit validation against the application workload.',
          'pg-kinetic tracks PostgreSQL wire traffic to make conservative pooling decisions. It does not remove the need to test the client behavior that matters to your service. A production rollout should include the actual driver versions, migrations, job workers, and administrative workflows used by the application.',
        ],
      },
      {
        title: 'Make pool exhaustion explicit',
        paragraphs: [
          'A healthy proxy answers three questions during an incident: which clients are waiting, which backends are active, and what happens when the limit is reached. pg-kinetic exposes operator-facing health and metrics and can apply queue, waiter, and in-flight limits per route. When the route cannot safely accept more work, it can return SQLSTATE 53300 quickly.',
          'That response is not a replacement for capacity planning. It is a controlled failure mode that preserves enough signal and capacity for the rest of the system to recover. Pair it with client retry policies that use bounded exponential backoff and do not amplify an overload event.',
        ],
      },
      {
        title: 'A practical first rollout',
        paragraphs: [
          'Treat the proxy as a reversible connection-path change. Start with one low-risk service, set a small backend limit, observe pool and queue behavior, and retain a direct PostgreSQL connection path for rollback. Only then widen the rollout to the workloads that create the highest connection churn.',
        ],
        bullets: [
          'Establish a direct PostgreSQL baseline before adding a proxy.',
          'Set explicit limits for clients, backends, waiters, and checkout time.',
          'Validate transaction and session behavior with representative drivers.',
          'Alert on readiness failures, queue growth, and PostgreSQL 53300 responses.',
        ],
      },
    ],
  },
  'postgresql-backpressure': {
    eyebrow: 'Overload control',
    title: 'PostgreSQL backpressure that keeps one busy route from stalling another',
    summary:
      'Backpressure is the decision to stop accepting work before queues turn a local database bottleneck into a system-wide timeout storm. pg-kinetic makes that decision visible at the PostgreSQL proxy layer.',
    facts: [
      { label: 'Scope', value: 'Per route, not one global queue' },
      { label: 'Signal', value: 'Queue depth and overload outcomes' },
      { label: 'Response', value: 'Fast PostgreSQL 53300 errors' },
    ],
    sections: [
      {
        title: 'Queues are not free capacity',
        paragraphs: [
          'When PostgreSQL slows down, incoming work must either wait, fail, or be redirected. Letting every request wait feels safe at first, but queues consume memory and turn a short bottleneck into elevated latency for unrelated requests. Client timeouts then trigger retries, which can increase the load on the database at the worst possible moment.',
          'Backpressure puts a limit on that waiting. It gives callers a fast, recognizable failure that their retry or fallback policy can handle. The goal is not to hide overload. The goal is to stop overload from spreading across the application faster than operators can react.',
        ],
      },
      {
        title: 'Route-level isolation changes the blast radius',
        paragraphs: [
          'A global connection pool cannot distinguish a noisy endpoint from a critical one. If both use the same waiting room, the busy workload can fill it and delay all other traffic. pg-kinetic applies capacity controls per route so a saturated path can be rejected without consuming the queue and backend budget of another route.',
          'The route boundary should reflect an operational decision: tenant, application, database role, or another unit that deserves a separate capacity budget. It is not a cosmetic label. It becomes the unit used to reason about admission, waits, metrics, and protection during an incident.',
        ],
      },
      {
        title: 'What an overload response should look like',
        paragraphs: [
          'Once a configured route limit is reached, pg-kinetic can return PostgreSQL SQLSTATE 53300 instead of allowing the queue to grow without bound. Clients should treat this as a transient capacity signal, not as an invitation to retry immediately. Use bounded retries with jitter, a deadline, and a fallback appropriate for the request type.',
          'Operators should be able to correlate the error with queue depth, backend usage, readiness, and the route that made the admission decision. This makes the proxy an observable control point instead of a black box between clients and PostgreSQL.',
        ],
      },
      {
        title: 'Validate the failure path before relying on it',
        paragraphs: [
          'Backpressure is only useful when it is exercised before production traffic is under stress. Use a controlled workload to saturate one route, verify that another route remains responsive, inspect the emitted metrics, and test the client behavior on 53300. The objective is predictable degradation, not an optimistic benchmark number.',
        ],
        bullets: [
          'Choose route boundaries that match independent business or operational budgets.',
          'Set queue, waiter, timeout, and in-flight limits explicitly.',
          'Verify error handling and retry behavior with real client libraries.',
          'Measure how quickly unaffected traffic recovers after the noisy route subsides.',
        ],
      },
    ],
  },
}

function ContentHeader() {
  return (
    <header className="border-b border-white/10 bg-[#05070c]/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10" aria-label="Primary navigation">
        <a href="/" className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="font-mono text-sm font-semibold text-foreground">pg-kinetic</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-xs text-zinc-300">
          <a href={DOCS_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            Documentation
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            GitHub
          </a>
        </div>
      </nav>
    </header>
  )
}

export function ContentPage({ page }: { page: ContentPageKey }) {
  const definition = PAGES[page]

  return (
    <div className="min-h-screen bg-[#05070c] text-foreground">
      <ContentHeader />
      <main>
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
            <a href="/" className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 transition-colors hover:text-pg-bright">
              <ArrowLeft className="h-3.5 w-3.5" />
              pgkinetic.dev
            </a>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-pg-bright">{definition.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-tight md:text-6xl">{definition.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">{definition.summary}</p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
              {definition.facts.map((fact) => (
                <div key={fact.label} className="bg-[#090c13] px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{fact.label}</p>
                  <p className="mt-2 text-sm font-medium text-zinc-100">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
          {definition.sections.map((section) => (
            <section key={section.title} className="border-b border-white/10 py-10 first:pt-0 last:border-b-0 last:pb-0">
              <h2 className="text-2xl font-semibold leading-snug text-zinc-100">{section.title}</h2>
              <div className="mt-5 space-y-4 leading-8 text-zinc-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-6 space-y-3 border-l border-pg/40 pl-5 text-zinc-200">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <aside className="mt-14 border border-pg/30 bg-pg/10 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-pg-bright">Operator guides</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-200">
              Review installation, compatibility, configuration, and production rollout guidance before directing application traffic through a proxy.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={DOCS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-pg px-4 py-2 text-sm font-semibold text-[#05101c] transition-colors hover:bg-pg-bright">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:border-white/35">
                <FaGithub className="h-4 w-4" />
                Review source
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>
        </article>
      </main>
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 font-mono text-[11px] text-zinc-500 lg:px-10">
          <span>pg-kinetic / PostgreSQL wire proxy</span>
          <a href="/" className="transition-colors hover:text-zinc-100">Back to pgkinetic.dev</a>
        </div>
      </footer>
      <AnalyticsConsentBanner />
    </div>
  )
}

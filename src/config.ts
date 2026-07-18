export const SITE_URL = 'https://pgkinetic.dev'
export const DOCS_URL = 'https://docs.pgkinetic.dev'
export const GITHUB_URL = 'https://github.com/HookWoods/pg-kinetic'
export const ISSUES_URL = `${GITHUB_URL}/issues`

const doc = (slug: string) => `${DOCS_URL}/docs/${slug}`

export type DocCard = { title: string; path: string; blurb: string; href: string }

export const DOC_CARDS: DocCard[] = [
  {
    title: 'Admin',
    path: 'docs/admin.md',
    blurb: 'Listeners, pools, TLS, auth, reload, and runtime controls.',
    href: doc('admin'),
  },
  {
    title: 'Production',
    path: 'docs/production-runtime.md',
    blurb: 'Reloads, graceful drain, health endpoints, socket tuning.',
    href: doc('production-runtime'),
  },
  {
    title: 'Routing',
    path: 'docs/read-routing.md',
    blurb: 'Replica reads, statement hints, LSN safety, SHOW ROUTES.',
    href: doc('read-routing'),
  },
  {
    title: 'Sharding',
    path: 'docs/sharding.md',
    blurb: 'Route maps, shard lifecycle, shard-key extraction.',
    href: doc('sharding'),
  },
  {
    title: 'Policy',
    path: 'docs/policy.md',
    blurb: 'Routing rules, reload behavior, audit expectations.',
    href: doc('policy'),
  },
  {
    title: 'Mirroring',
    path: 'docs/mirroring.md',
    blurb: 'Shadow traffic model, sampling, isolation, rollout checklist.',
    href: doc('mirroring'),
  },
  {
    title: 'Adaptive Ops',
    path: 'docs/adaptive-ops.md',
    blurb: 'Recommendation mode, guarded apply mode, benchmark feedback.',
    href: doc('adaptive-ops'),
  },
  {
    title: 'Benchmarks',
    path: 'docs/benchmarking.md',
    blurb: 'Methodology, harness layout, regression workflow.',
    href: doc('benchmarking'),
  },
  {
    title: 'Compatibility',
    path: 'docs/compatibility.md',
    blurb: 'Client libraries, live runs, reports, and behavior contracts.',
    href: doc('compatibility'),
  },
  {
    title: 'Metrics',
    path: 'docs/metrics.md',
    blurb: 'Prometheus catalog, dashboards, timing, and bounded labels.',
    href: doc('metrics'),
  },
  {
    title: 'Kubernetes',
    path: 'docs/kubernetes.md',
    blurb: 'Deployment shape, probes, drain semantics, rolling restarts.',
    href: doc('kubernetes'),
  },
  {
    title: 'Testing',
    path: 'docs/testing.md',
    blurb: 'Linux, Windows, xtask commands, and CI mapping.',
    href: doc('testing'),
  },
  {
    title: 'Regression',
    path: 'docs/regression.md',
    blurb: 'Compatibility reports and performance score workflow.',
    href: doc('regression'),
  },
  {
    title: 'Docs Site',
    path: 'docs/docs-site.md',
    blurb: 'Docusaurus workflow, content source, and version policy.',
    href: doc('docs-site'),
  },
]

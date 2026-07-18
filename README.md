# pg-kinetic-web

Landing page for [pg-kinetic](https://github.com/HookWoods/pg-kinetic) — a Rust PostgreSQL wire proxy for pooling, routing, sharding, policy, and observability.

Built with React 19, Vite, Tailwind CSS, and shadcn/ui.

## Development

```sh
npm install
npm run dev      # dev server
npm run build    # typecheck + production build to dist/
npm run lint
```

## Deployment

Pushes to `master` or `main` build and publish the site to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Enable it once in the repo settings: **Settings → Pages → Source: GitHub Actions**.

The production domain is `pgkinetic.dev`. Vite copies [`public/CNAME`](public/CNAME)
into `dist/` during the build so GitHub Pages keeps the custom domain attached.

## Cloudflare DNS

Configure `pgkinetic.dev` in Cloudflare with GitHub Pages records:

```text
A      @     185.199.108.153     DNS only
A      @     185.199.109.153     DNS only
A      @     185.199.110.153     DNS only
A      @     185.199.111.153     DNS only
AAAA   @     2606:50c0:8000::153 DNS only
AAAA   @     2606:50c0:8001::153 DNS only
AAAA   @     2606:50c0:8002::153 DNS only
AAAA   @     2606:50c0:8003::153 DNS only
CNAME  www   HookWoods.github.io DNS only
CNAME  docs  HookWoods.github.io DNS only
```

Keep SSL/TLS mode at `Full` or `Full (strict)`, enable **Always Use HTTPS**,
then configure the repository Pages custom domain as `pgkinetic.dev`. Avoid
additional apex `A`, `AAAA`, `ALIAS`, or `ANAME` records because they can block
GitHub Pages HTTPS certificate issuance.
The `HookWoods/pg-kinetic` repository already publishes `docs.pgkinetic.dev`
from its Docusaurus site and `docs-site/static/CNAME`.

## Structure

- `src/components/site/` — page sections (Hero, Features, Architecture, Pressure, Docs, Navbar, Footer, Backdrop)
- `src/components/ui/` — shadcn/ui primitives
- `src/config.ts` — every external link (GitHub, docs, site domain) in one place
- `src/index.css` — design tokens, liquid-glass material system, motion keyframes

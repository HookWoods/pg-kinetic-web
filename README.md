# pg-kinetic website

The production website for [pg-kinetic](https://github.com/HookWoods/pg-kinetic),
a Rust PostgreSQL wire proxy for safe pooling, routing, sharding, policy, and
observability.

- Website: [pgkinetic.dev](https://pgkinetic.dev)
- Documentation: [docs.pgkinetic.dev](https://docs.pgkinetic.dev)
- Core project: [HookWoods/pg-kinetic](https://github.com/HookWoods/pg-kinetic)

## Stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS and Radix UI primitives
- Cloudflare Pages for static hosting

## Requirements

- Node.js `20.19.0+` or `22.12.0+`
- npm 10+

Cloudflare Pages builds with Node.js 22. Use an active LTS release locally to
keep the development and deployment environments aligned.

## Get started

```sh
npm ci
npm run dev
```

Vite prints the local development URL after startup. The default is typically
`http://localhost:5173`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Run the ESLint checks. |
| `npm run build` | Type-check and create the production site in `dist/`. |
| `npm run preview` | Serve the built site locally. |
| `npm audit` | Inspect dependency advisories. |

Run `npm run lint` and `npm run build` before opening a pull request or
publishing a release change.

## Project layout

```text
src/
  components/site/  Page sections and shared site components
  components/ui/    Reusable Radix-based UI primitives
  config.ts         Website, documentation, and repository URLs
  index.css         Design tokens and global styles
public/
  favicon.svg       Browser icon
  site.webmanifest  Browser and installed-app metadata
```

Keep external URLs in `src/config.ts`. Static files in `public/` are copied
unchanged to the published `dist/` directory.

## Documentation

The documentation site is maintained with Docusaurus in the core repository at
`docs-site/`. This website links to the published documentation at
`https://docs.pgkinetic.dev`; do not duplicate documentation content here.

## Deployment

Cloudflare Pages deploys the production branch directly from GitHub. Configure
the Pages project with production branch `main`, build command `npm run build`,
and build output directory `dist`.

Manage `pgkinetic.dev` and its DNS record under the Cloudflare Pages project's
**Custom domains** settings. GitHub Pages must not retain this custom domain.

`docs.pgkinetic.dev` is managed by the Docusaurus deployment in the core
project. Its custom-domain file lives at `docs-site/static/CNAME`.

### Google Analytics

The site supports Google Analytics 4 without committing its measurement ID.
Create a Web data stream in GA4, then add the public environment variable
`VITE_GA_MEASUREMENT_ID` with its `G-...` value in the Cloudflare Pages
project's production environment. Redeploy after saving the variable.

Analytics remains disabled until a visitor explicitly accepts it. The site does
not send Google Analytics requests when the variable is absent or the visitor
rejects analytics. Use `.env.example` for local configuration; do not commit a
real local `.env` file.

## Dependency maintenance

Dependabot updates are evaluated with the same checks used for normal changes:

```sh
npm run lint
npm run build
npm audit
```

Keep `package-lock.json` committed. It is the source of truth for reproducible
Cloudflare Pages builds.

## Contribution guidelines

- Keep changes focused on the website and preserve external URLs in `src/config.ts`.
- Do not commit `node_modules/` or `dist/`.
- Add public assets under `public/` and verify they are present after `npm run build`.
- Keep the accessibility and reduced-motion behavior intact when changing interaction or animation.

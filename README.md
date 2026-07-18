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
- GitHub Pages for static hosting

## Requirements

- Node.js `20.19.0+` or `22.12.0+`
- npm 10+

The GitHub Pages workflow builds with Node.js 22. Use an active LTS release
locally to keep the development and deployment environments aligned.

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
  CNAME             GitHub Pages custom-domain declaration
  favicon.svg       Browser icon
  site.webmanifest  Browser and installed-app metadata
.github/workflows/
  deploy.yml        GitHub Pages build and deployment workflow
```

Keep external URLs in `src/config.ts`. Static files in `public/` are copied
unchanged to the published `dist/` directory.

## Documentation

The documentation site is maintained with Docusaurus in the core repository at
`docs-site/`. This website links to the published documentation at
`https://docs.pgkinetic.dev`; do not duplicate documentation content here.

## Deployment

GitHub Actions builds the site and deploys the `dist/` artifact to GitHub Pages
through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). In the
repository settings, set **Pages** to use **GitHub Actions** as its source and
set the Pages environment to allow the release branch.

The workflow uses `npm ci`, then `npm run build`. A deployment can also be
started manually from the Actions tab.

`public/CNAME` declares `pgkinetic.dev` for GitHub Pages. Keep that file and
the custom domain in the repository's Pages settings in sync.

`docs.pgkinetic.dev` is managed by the Docusaurus deployment in the core
project. Its custom-domain file lives at `docs-site/static/CNAME`.

## Dependency maintenance

Dependabot updates are evaluated with the same checks used for normal changes:

```sh
npm run lint
npm run build
npm audit
```

Keep `package-lock.json` committed. It is the source of truth for reproducible
CI and GitHub Pages builds.

## Contribution guidelines

- Keep changes focused on the website and preserve external URLs in `src/config.ts`.
- Do not commit `node_modules/` or `dist/`.
- Add public assets under `public/` and verify they are present after `npm run build`.
- Keep the accessibility and reduced-motion behavior intact when changing interaction or animation.

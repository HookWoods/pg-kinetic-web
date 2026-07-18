# Contributing

Thanks for helping improve the pg-kinetic website.

## Before You Start

The website is a React, TypeScript, and Vite project deployed on Cloudflare Pages.
Read the [README](README.md) for local setup, environment variables, and
deployment details.

Open an issue before starting a large design, content, navigation, analytics, or
deployment change. Keep pull requests focused on one user-facing problem.

## Local Development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

Before opening a pull request, run:

```sh
npm run lint
npm run build
```

## Change Guidelines

- Preserve the public URLs in `src/config.ts`.
- Keep the documented installation commands aligned with the published container
  image and Helm repository.
- Keep the site responsive, keyboard-operable, and readable with reduced motion.
- Include alt text for meaningful images and test mobile layouts when changing
  page structure.
- Do not commit `node_modules/`, `dist/`, local `.env` files, analytics
  credentials, or Cloudflare secrets.
- Update the README when development, deployment, analytics, or configuration
  requirements change.

## Validation

Describe the checks you ran in the pull request. For visual changes, include
desktop and mobile screenshots or a concise description of the verified
viewports.

## License

The pg-kinetic website is licensed under either Apache-2.0 or MIT, at your
option.

Unless you explicitly state otherwise, contributions intentionally submitted for
inclusion are licensed as Apache-2.0 OR MIT without additional terms or
conditions.

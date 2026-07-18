# Security Policy

## Supported Versions

Security fixes target the current `main` branch and the production deployment
built from it. Older deployments are not supported.

## Report a Vulnerability

Report vulnerabilities privately through GitHub Security Advisories:

https://github.com/HookWoods/pg-kinetic-web/security/advisories/new

Do not open a public issue for vulnerabilities, API keys, Cloudflare secrets,
analytics credentials, private keys, or exploit details.

Please include:

- affected URL, deployment, commit SHA, or release identifier
- reproduction steps and expected versus observed behavior
- browser, operating system, and network context when relevant
- sanitized request, response, console, or build output
- impact assessment and any suggested mitigation

## Scope

Security-sensitive areas include:

- client-side handling of analytics consent and environment configuration
- third-party dependencies and generated assets
- Cloudflare Pages deployment, redirects, headers, and custom-domain behavior
- external links, forms, content injection, and browser security controls

## Disclosure

The project will coordinate a fix and public disclosure after the issue is
understood and a patch is available. Credit is welcome when the reporter wants
to be named.

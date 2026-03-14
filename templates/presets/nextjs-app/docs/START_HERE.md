# Start Here

This preset is for Next.js applications.

It assumes your maintenance risk comes from routing, rendering boundaries, deployment assumptions, and environment variables that are easy to change accidentally.

## Your first hour

1. Read `AGENTS.md`.
2. Add your package manager, supported Node version, and deploy target.
3. Document which environment variables are server-only and which ones are safe to expose with `NEXT_PUBLIC_`.
4. Keep the issue and pull request templates unless they are clearly wrong for your workflow.
5. Update `docs/DEPLOYMENT.md` and `docs/ARCHITECTURE.md` so deploy and route assumptions are written down.
6. Run a production build and one smoke test of the main route or user flow.
7. Keep `.github/workflows/repo-health.yml` if you want docs and setup checks in pull requests.
8. Add `OPENAI_API_KEY` only if you want the optional Codex GitHub Actions.

## What to pay extra attention to

- route structure and navigation
- server components versus client components
- server actions, route handlers, and middleware
- auth, cookies, and session behavior
- caching, revalidation, and environment variable usage
- deploy assumptions for Vercel, Docker, or your chosen host
- architecture and deployment docs that will drift if no one owns them

## Good first customizations

- mention your local dev, test, and build commands in `AGENTS.md`
- list the routes or flows that should never break silently
- call out any deploy-time checks or preview-environment rules
- replace placeholder notes in `docs/DEPLOYMENT.md`, `docs/ARCHITECTURE.md`, and `app/README.md`

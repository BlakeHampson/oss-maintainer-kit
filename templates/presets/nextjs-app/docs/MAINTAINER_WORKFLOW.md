# Maintainer Workflow

This preset assumes the repo is a Next.js app or web product.

That means maintainers should care about user-visible behavior, deploy safety, and environment assumptions as much as they care about code style.

## Issues

- Ask reporters which route, feature, or environment is affected.
- If the report involves auth, middleware, or env vars, treat it as higher risk.
- Prefer reproducible steps, screenshots, and the exact environment where the issue happened.

## Pull requests

- Prioritize correctness, user impact, and missing validation before style feedback.
- If a change touches routing, auth, rendering mode, middleware, or env vars, require validation notes in the PR.
- Ask for screenshots or a short demo for visible UI or navigation changes.
- If `repo-health.yml` exists, it can catch documentation drift, but it does not replace route, build, or smoke checks.
- If `ci-smoke.yml` exists, treat it as a starting point, not framework magic. It can auto-detect npm, pnpm, or yarn starter commands, but you should still keep them honest for your package manager and critical flow.
- If you need a first draft for `SMOKE_COMMAND`, start from `docs/SMOKE_COMMANDS.md` and then narrow it to the one route or flow that matters most.
- Keep `docs/DEPLOYMENT.md` and `docs/ARCHITECTURE.md` updated when deploy paths or system boundaries change.

## Releases and deploys

- Run a production build before deploying.
- If `.github/workflows/ci-smoke.yml` exists, keep it aligned with the real install, build, and smoke commands you trust.
- Verify the main flow, auth path, and any route changed in the PR.
- If deploy behavior, env vars, or caching changed, update the README or deployment docs in the same change.

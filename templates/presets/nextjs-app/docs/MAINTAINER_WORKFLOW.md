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
- `repo-health.yml` can catch documentation drift, but it does not replace route, build, or smoke checks.
- `ci-smoke.yml` is a starting point, not framework magic. Keep its commands honest for your package manager and critical flow.
- Keep `docs/DEPLOYMENT.md` and `docs/ARCHITECTURE.md` updated when deploy paths or system boundaries change.

## Releases and deploys

- Run a production build before deploying.
- Keep `.github/workflows/ci-smoke.yml` aligned with the real install, build, and smoke commands you trust.
- Verify the main flow, auth path, and any route changed in the PR.
- If deploy behavior, env vars, or caching changed, update the README or deployment docs in the same change.

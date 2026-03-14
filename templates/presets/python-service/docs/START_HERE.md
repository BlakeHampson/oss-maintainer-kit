# Start Here

This preset is for Python services, APIs, workers, or background-job repos.

It assumes your maintenance risk comes from configuration drift, production behavior, and deploy changes that are easy to under-document.

## Your first hour

1. Read `AGENTS.md`.
2. Add your supported Python version, entry point, and deploy target.
3. Document required environment variables, health checks, and external dependencies.
4. Keep the issue and pull request templates unless they are clearly wrong for your workflow.
5. Run tests and one service-level smoke check before merging risky changes.
6. Keep `.github/workflows/repo-health.yml` if you want docs and runbook checks in pull requests.
7. Add `OPENAI_API_KEY` only if you want the optional Codex GitHub Actions.

## What to pay extra attention to

- request validation and error handling
- config and secret management
- migrations, queues, jobs, and external integrations
- logging, metrics, and health-check behavior
- deploy, rollback, and recovery instructions

## Good first customizations

- mention your test, run, and smoke-check commands in `AGENTS.md`
- list the endpoints, jobs, or cron paths that should never break silently
- call out any migration or rollout steps contributors should not guess

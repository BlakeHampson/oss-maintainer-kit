# Maintainer Workflow

This preset assumes the repo is a Python service, API, worker, or operational backend.

That means maintainers should care about deploy behavior, runtime compatibility, and recovery paths as much as they care about code style.

## Issues

- Ask reporters which environment, endpoint, worker, or job is affected.
- If the issue involves auth, config, migrations, queues, or data integrity, treat it as higher risk.
- Prefer reproducible steps, relevant logs, and the exact command or request that failed.

## Pull requests

- Prioritize correctness, operational risk, and missing validation before style feedback.
- If a change touches config, schema, runtime entry points, deploy behavior, or external integrations, require validation notes in the PR.
- Ask for a smoke test plan for endpoint, worker, or migration changes.
- If `repo-health.yml` exists, it can catch docs drift, but it does not replace service tests, migration checks, or deploy validation.
- If `ci-smoke.yml` exists, treat it as a starting point, not a full service pipeline. Keep its install, test, and smoke commands aligned with reality.
- Keep `docs/RUNBOOK.md` and `docs/ARCHITECTURE.md` updated when service boundaries or recovery steps change.

## Releases and deploys

- Run tests and one realistic smoke check before deploy.
- If `.github/workflows/ci-smoke.yml` exists, keep it aligned with the dependency, test, and service checks you actually run.
- Verify rollback or recovery notes for risky changes.
- If a change affects config, health checks, migrations, or operational commands, update docs in the same pull request.

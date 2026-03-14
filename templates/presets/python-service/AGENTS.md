# AGENTS.md

## Why this file exists

This file teaches AI reviewers and human contributors how `__PROJECT_NAME__` should be handled as a Python service or API.

For this kind of repo, correctness is not just about Python style. Configuration, request handling, background jobs, migrations, observability, and deployment behavior can all break production.

## Review priorities

- Prioritize bugs, regressions, deploy safety, and missing tests before style feedback.
- Treat config changes, migrations, queue behavior, auth, and external integrations as high risk.
- Flag changes that weaken secret handling, request validation, timeout behavior, retry logic, or rollback safety.
- Check that local setup docs, environment variables, health checks, and operational commands still match the code.
- Call out changes that could break zero-downtime deploys, backward compatibility, or production diagnostics.
- Use plain language when possible. A correct review is more useful when the project owner can actually follow it.

## Maintainer notes

- Primary maintainer: `__MAINTAINER_NAME__`
- Replace this generic guidance with repo-specific services, data stores, and deploy surfaces as soon as you can.
- If a pull request changes config, schema, runtime entry points, or production behavior, require matching docs updates in the same change.
- Before deploy, verify one realistic smoke test and the rollback or recovery path for risky changes.

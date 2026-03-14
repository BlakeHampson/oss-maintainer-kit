# Runbook Notes

This file exists so operational recovery steps stay close to the repo.

## Keep this current

- required environment variables and secrets
- health checks and smoke-check commands
- dashboards, logs, and alerts worth checking first
- rollback or recovery steps for risky changes
- known failure modes for jobs, queues, or integrations

## Example checklist

- confirm required environment variables and secrets are present
- verify one health check and one realistic request after deploy
- note rollback steps if schema, queue, or config behavior changed
- keep links to dashboards, logs, and alerts current

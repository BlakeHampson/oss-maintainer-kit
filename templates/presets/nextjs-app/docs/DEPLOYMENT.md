# Deployment Notes

This file exists so deployment assumptions stay close to the repo instead of living only in someone's head.

## Keep this current

- hosting target and runtime expectations
- required environment variables
- build and smoke-check commands
- rollback or cache-clearing steps
- any preview-environment caveats

## Example checklist

- confirm required environment variables are present in the target environment
- run a production build before deploy
- verify the main route, auth path, and one write path after rollout
- note rollback steps if caching, auth, or routing behavior changed

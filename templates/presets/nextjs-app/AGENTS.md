# AGENTS.md

## Why this file exists

This file teaches AI reviewers and human contributors how `__PROJECT_NAME__` should be handled as a Next.js app.

For this kind of repo, correctness is not just about React code. Routing, server and client boundaries, environment variables, data fetching, caching, and deploy behavior can all break users.

## Review priorities

- Prioritize user-visible regressions, broken routes, auth issues, and missing tests before style feedback.
- Treat changes to routing, rendering mode, server actions, route handlers, caching, and middleware as high risk.
- Flag incorrect server-versus-client assumptions, especially if secrets or server-only data could leak into browser code.
- Check that `NEXT_PUBLIC_` variables, deploy docs, and local setup instructions still match the code.
- Call out changes that could break production builds, asset paths, image handling, or edge versus Node runtime compatibility.
- Use plain language when possible. A correct review is more useful when the project owner can actually follow it.

## Maintainer notes

- Primary maintainer: `__MAINTAINER_NAME__`
- Replace this generic guidance with repo-specific routes, deploy targets, and risk areas as soon as you can.
- If a pull request changes auth, config, rendering mode, or deploy behavior, require matching docs updates in the same change.
- Before release or deploy, verify at least one local production build and one smoke test of the main user flow.

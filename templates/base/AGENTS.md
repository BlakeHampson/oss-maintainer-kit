# AGENTS.md

## Repository

`__PROJECT_NAME__` is maintained with a bias toward predictable reviews, clean contributor handoffs, and low-friction release prep.

## Review Guidelines

- Prioritize bugs, regressions, and missing tests before style feedback.
- Flag risky migrations, broad dependency changes, and silent behavior changes.
- Treat security issues, secret handling, and permission creep as high priority.
- Call out missing docs when behavior changes would surprise users or maintainers.
- Prefer small, actionable findings over long essays.

## Maintainer Notes

- Primary maintainer: `__MAINTAINER_NAME__`
- If a pull request changes release steps, contributor setup, or workflow permissions, request docs updates in the same change.
- If a pull request adds automation, verify the trigger conditions and GitHub token permissions are minimal.

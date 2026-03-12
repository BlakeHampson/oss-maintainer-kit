# AGENTS.md

## Purpose

This repository provides reusable maintainer automation scaffolding for open-source projects.

## Review Guidelines

- Prioritize correctness, security, and clarity over cleverness.
- Keep the CLI dependency-free and Node 18+ compatible.
- Treat broken template output as a high-severity issue.
- When editing workflow templates, prefer least-privilege permissions and conservative triggers.
- Preserve placeholder tokens unless a change intentionally renames them.
- Keep docs aligned with shipped files and commands.

## Testing

- Run `npm test` after changing CLI or template copy logic.
- If a template path changes, update both the README and tests.

## Style

- Favor small, readable functions over framework-heavy abstractions.
- Keep generated files plain text and easy to audit.

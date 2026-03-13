# AGENTS.md

## Why this file exists

This file teaches AI reviewers and future contributors how this repository should be handled.

The main job of this repo is to stay easy to understand for someone who is new to GitHub or open-source maintenance. Changes that add power but increase confusion should be treated carefully.

## Review priorities

- Prioritize correctness, security, and clarity over cleverness.
- Keep the CLI dependency-free and Node 18+ compatible.
- Treat broken template output as a high-severity issue because it affects every generated repo.
- Prefer plain-English documentation over maintainer jargon.
- When editing workflow templates, prefer least-privilege permissions and conservative triggers.
- Preserve placeholder tokens unless a change intentionally renames them.
- Keep docs aligned with shipped files and commands.

## Testing

- Run `npm test` after changing CLI or template copy logic.
- If a template path changes, update the README, `docs/START_HERE.md`, and tests.

## Style

- Favor small, readable functions over framework-heavy abstractions.
- Keep generated files plain text and easy to audit.
- Default to copy that a new repo owner can understand without already knowing GitHub vocabulary.

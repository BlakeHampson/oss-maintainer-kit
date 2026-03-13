# Start Here

This preset is for JavaScript or TypeScript libraries, CLIs, or packages.

It assumes you care about three things early: install experience, API stability, and examples that actually work.

## Your first hour

1. Read `AGENTS.md`.
2. Add the package or framework details that matter most in this repo.
3. Keep the issue and pull request templates unless they are clearly wrong for your workflow.
4. Run your package tests and at least one real install or smoke test before tagging releases.
5. Add `OPENAI_API_KEY` only if you want the optional Codex GitHub Actions.

## What to pay extra attention to

- public exports and breaking changes
- package scripts and publish behavior
- README install examples
- Node version support
- dependency changes and lockfile churn

## Good first customizations

- mention your test command in `AGENTS.md`
- call out whether you support JavaScript, TypeScript, or both
- add any packaging or release steps that contributors should not guess

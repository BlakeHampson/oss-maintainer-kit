# Start Here

This preset is for Python packages, libraries, or tools.

It assumes you care early about install reliability, examples that work in a clean environment, and packaging that matches the docs.

## Your first hour

1. Read `AGENTS.md`.
2. Add your supported Python versions, test command, and packaging details.
3. Keep the issue and pull request templates unless they are clearly wrong for your workflow.
4. Run your tests and one clean-environment smoke test before tagging releases.
5. Add `OPENAI_API_KEY` only if you want the optional Codex GitHub Actions.

## What to pay extra attention to

- supported Python versions
- install and virtual environment instructions
- import paths and entry points
- dependency changes
- README examples and CLI examples

## Good first customizations

- mention whether you use `pytest`, `unittest`, or another test runner
- call out packaging files contributors should not edit casually
- document any platform-specific setup steps

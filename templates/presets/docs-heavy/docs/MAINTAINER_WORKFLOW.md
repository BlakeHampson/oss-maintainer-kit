# Maintainer Workflow

This preset is for documentation-heavy repositories where the main job is keeping written guidance accurate and easy to follow.

## Issues

- Treat broken links, stale screenshots, outdated commands, and contradictory guidance as high-value issues.
- Ask for the exact page, heading, URL, or example that is confusing or wrong.

## Pull requests

- Focus first on factual accuracy, structure, navigation, and whether a reader can actually follow the instructions.
- If a change affects file paths, commands, or examples, review every place they appear.
- If screenshots or diagrams are included, make sure they still match the current product or workflow.

## Releases

- If you publish versions, summarize user-facing doc changes and any migration in navigation or structure.
- If you do not publish versions, clear changelog notes and linked pull requests may be enough.

## Repository instructions

- Keep `AGENTS.md` current so Codex reviews focus on clarity and accuracy instead of generic code review.
- Prefer fewer, better-maintained guides over large sets of overlapping docs.

# Start Here

This preset is for repositories where documentation, guides, references, or examples are the main product.

It assumes your biggest maintenance risk is confusion: outdated instructions, broken links, mismatched screenshots, or examples that no longer work.

## Your first hour

1. Read `AGENTS.md`.
2. Call out which docs are canonical and which are supporting material.
3. Keep the issue and pull request templates unless they are clearly wrong for your workflow.
4. Decide how you want to verify links, examples, screenshots, and generated docs.
5. Add `OPENAI_API_KEY` only if you want the optional Codex GitHub Actions.
6. Run `oss-maintainer-kit check-docs .` after doc edits to catch broken local links and anchors.

## What to pay extra attention to

- commands and examples that may drift from reality
- broken links and moved files
- screenshots or diagrams that may become stale
- unclear navigation between docs
- duplication that leads to contradictory guidance

## Good first customizations

- document what counts as the source of truth
- say how contributors should verify examples
- note any generated docs or assets that should not be edited by hand

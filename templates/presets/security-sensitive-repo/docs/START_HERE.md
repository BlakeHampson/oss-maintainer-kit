# Start Here

This preset is for repositories where mistakes can have security, privacy, or trust-boundary consequences.

That usually means the maintainer needs more than generic contributor templates. They need a clear review contract.

## Read these first

1. `AGENTS.md`
2. the project README
3. the architecture or system-boundary doc, if one exists
4. the threat model or security notes, if one exists
5. the deployment, packaging, install, or recovery docs affected by your change

## Before you change anything

Decide which class of change this is:

- docs-only clarification
- auth, crypto, secret, or key-handling behavior
- installer, updater, packaging, or rollback behavior
- runtime, deployment, or boundary change
- observability, logs, analytics, or crash behavior

If the answer is anything except docs-only, treat it as a higher-risk change and update docs in the same pull request.

After doc edits, run `oss-maintainer-kit check-docs .` to catch broken local Markdown links and anchors before you merge.

## Safe defaults

- Prefer precise claims over broad security language.
- Prefer observable and reversible behavior over hidden automation.
- If a command, path, artifact name, or trust-boundary assumption changes, update every doc that mentions it.
- If a change needs more privilege, persistence, or network access, explain why in the pull request.

## What this preset is trying to preserve

- trustworthy review guidance for sensitive code paths
- clear maintainer expectations for docs and validation
- less ambiguity around what needs extra scrutiny before merge

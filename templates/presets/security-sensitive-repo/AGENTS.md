# AGENTS.md

## Why this file exists

This repository is security-sensitive. Generic review advice is not enough.

Changes here can affect secrets, trust boundaries, recovery behavior, local or remote execution assumptions, and the safety of install, upgrade, or packaging flows.

Reviewers should optimize for preserving security guarantees and operational clarity before they optimize for convenience or code cleanup.

## What counts as high risk

Treat these areas as high risk unless proven otherwise:

- any change that could expose secrets, credentials, private keys, plaintext data, or decrypted material to logs, temp files, analytics, or unintended network calls
- any change that weakens locality, offline guarantees, or trust-boundary assumptions without an explicit reason
- any installer, updater, packaging, or runtime change that broadens permissions, scope, or persistence unexpectedly
- any change that makes recovery, rollback, uninstall, or incident response harder to reason about
- any wording that over-claims what the software can prove about security or privacy

## Review priorities

1. Preserve trust boundaries and data-handling guarantees.
2. Preserve predictable install, start, stop, update, and rollback behavior.
3. Keep docs aligned with the actual commands, paths, artifacts, and operational limits.
4. Require explicit validation notes for changes that touch auth, crypto, secrets, packaging, or privileged paths.
5. Prefer narrowly scoped changes over broad refactors in high-risk areas.

## Files that deserve extra scrutiny

- auth, crypto, or key-management code
- install, update, repair, rollback, or uninstall scripts
- manifests, packaging files, or deployment descriptors
- threat models, security docs, recovery docs, and user-facing security claims
- telemetry, logging, analytics, and crash-reporting paths

## Review expectations for pull requests

- If behavior changes for auth, secrets, runtime startup, packaging, or deployment, require matching doc updates in the same change.
- Ask for explicit validation notes when a change touches sensitive code paths.
- Be skeptical of convenience changes that trade away auditability, locality, or containment.
- If a claim is security-relevant, make it precise or remove it.

## Maintainer notes

- Replace this generic guidance with the repo's actual trust boundaries and canonical docs as soon as possible.
- If the repo has a threat model, architecture spec, or incident workflow, link them here and treat them as review context.
- If a review cannot verify a security-sensitive claim from the repo itself, call that out directly instead of assuming the safest interpretation.

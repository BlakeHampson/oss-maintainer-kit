# Maintainer Workflow

This preset is for repositories where docs, packaging, runtime behavior, and security posture all need to stay aligned.

## Triage buckets

Use these buckets when new work comes in:

1. docs drift
2. auth, secret, or crypto changes
3. installer, packaging, or deployment changes
4. runtime or boundary changes
5. incident, recovery, or rollback improvements

If an issue touches trust boundaries, secrets, or privileged execution, put it in a higher-risk bucket even if it also looks like a normal bug.

## Pull requests

A good pull request in a security-sensitive repo should make it easy to answer:

- what trust boundary or user flow changed
- whether secrets, auth, packaging, or deployment behavior changed
- how the change was validated
- which docs were updated to match the new behavior

If a pull request cannot answer those questions, it is not ready.

## Review focus by area

### Docs and product copy

- remove over-claims
- check that commands, paths, and artifact names match reality
- make constraints and limitations explicit

### Scripts, packaging, and deployment

- check scope, privilege, rollback, and failure behavior
- check that upgrades and uninstalls remain understandable
- check that new automation does not hide sensitive side effects

### Runtime and sensitive code paths

- check trust boundaries, data handling, and network assumptions
- check logging and crash paths for accidental exposure
- check that review notes are explicit where validation is partial

## Merge discipline

- prefer smaller changes in high-risk paths
- require docs updates in the same pull request when behavior changes
- call out missing manual validation explicitly instead of assuming it happened
- do not merge wording that makes security properties sound stronger than the repo can prove

# Case Study: ShuleDocs

`ShuleDocs` is a private, security-sensitive repository for a secure Microsoft Office add-in and packaging workflow.

It was a good test of whether OSS Maintainer Kit could help in a repo where:

- trust boundaries matter
- packaging and install flows are part of the product
- docs, scripts, manifests, and runtime behavior all need to stay aligned
- the maintainer does not want to enable extra review automation by default

## The gap

Before the kit was applied, the repo already had substantial product and implementation material, but it did not yet have a lightweight maintainer contract for:

- what reviewers should treat as high risk
- which docs are canonical
- how pull requests should explain validation and risk
- how contributors should report issues in packaging, runtime, or trust-boundary-sensitive areas

## What was added

- a repo-specific `AGENTS.md`
- `docs/START_HERE.md` for maintainers and AI reviewers
- `docs/MAINTAINER_WORKFLOW.md`
- a pull request template oriented around validation, risk, and docs sync
- issue templates that separate docs drift from runtime, packaging, and security-sensitive behavior

Immediate, measurable outcome:

- 8 maintainer-facing files added in one change
- 315 lines of maintainer guidance and issue or pull request intake structure added
- 0 optional Codex workflows enabled by default

## What was deliberately not added

The optional Codex GitHub Actions were not enabled by default.

That was intentional. In a security-sensitive repo, the first useful step was clearer review discipline and maintainer guidance, not more automation.

## What this turned into

The `security-sensitive-repo` preset was extracted from that work.

It gives other repositories a safer starting point when they need:

- stricter review guidance for auth, secrets, crypto, or trust-boundary changes
- better maintainer prompts for packaging and deployment work
- issue and pull request templates that call out validation and risk explicitly
- a setup that does not enable optional AI workflows by default

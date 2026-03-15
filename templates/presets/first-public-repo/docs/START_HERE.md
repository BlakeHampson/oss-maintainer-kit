# Start Here

This preset is for a repo that is just becoming public or is still mostly run by one person.

It keeps the setup light on purpose. You always get the contributor forms, PR template, and review guidance. Depending on the bundle you chose, you may also get the optional PR review workflow, but release-prep automation is still left out by default.

If you are working alone, you are still the maintainer. In this context, that just means you are the person responsible for the repo.

## Your first hour

1. Read `AGENTS.md`.
2. Keep the issue and pull request templates unless they are clearly wrong for this repo.
3. Add `OPENAI_API_KEY` only if your scaffold includes the optional Codex pull request review workflow.
4. Make one small pull request to yourself and see how the flow feels.
5. Add release automation later, after you actually need versions or tags.

## What each generated file is for

- `AGENTS.md`: tells Codex and human contributors what good changes look like in the repo
- `.github/PULL_REQUEST_TEMPLATE.md`: asks contributors to explain what changed, why it matters, and how they checked it
- `.github/ISSUE_TEMPLATE/bug_report.yml`: helps someone report a bug without leaving out the important details
- `.github/ISSUE_TEMPLATE/feature_request.yml`: helps someone describe a useful improvement without writing a full spec
- `.github/workflows/codex-pr-review.yml`: if this file is present, it is an optional GitHub Action that asks Codex to review pull requests
- `docs/MAINTAINER_WORKFLOW.md`: plain-English explanation of how this repo handles issues, pull requests, and future releases

## Safe defaults

- You do not need outside contributors before this is useful.
- You can add release automation later.
- You can delete or disable workflows you do not want.
- Clear and short docs are better than clever docs.

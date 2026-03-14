# Start Here

This kit adds repository setup files to `__PROJECT_NAME__`. It does not change your application code.

If you are new to GitHub, open source, or AI-assisted coding workflows, read this file first after scaffolding.

If you are working alone, you are still the maintainer. In this context, that just means you are the person responsible for the repo.

## Your first hour

1. Read `AGENTS.md`.
2. Keep the issue and pull request templates unless they are clearly wrong for this repo.
3. Ignore `.github/workflows/codex-release-prep.yml` until you actually ship versions.
4. Add `OPENAI_API_KEY` only if you want the optional Codex GitHub Actions.
5. Make one small pull request to yourself and see how the flow feels.
6. Keep `.github/workflows/repo-health.yml` if you want Markdown link and anchor checks in pull requests.

## What each generated file is for

- `AGENTS.md`: tells Codex and human contributors what good changes look like in the repo
- `.github/PULL_REQUEST_TEMPLATE.md`: asks contributors to explain what changed, why it matters, and how they checked it
- `.github/ISSUE_TEMPLATE/bug_report.yml`: helps someone report a bug without leaving out the important details
- `.github/ISSUE_TEMPLATE/feature_request.yml`: helps someone describe a useful improvement without writing a full spec
- `.github/workflows/repo-health.yml`: optional GitHub Action that runs low-risk checks like `check-docs`
- `.github/workflows/codex-pr-review.yml`: optional GitHub Action that asks Codex to review pull requests
- `.github/workflows/codex-release-prep.yml`: optional GitHub Action that drafts release prep notes
- `docs/MAINTAINER_WORKFLOW.md`: plain-English explanation of how this repo handles issues, pull requests, and releases

## Safe defaults

- You do not need outside contributors before this is useful.
- You do not need to keep every file the kit generates.
- You can delete or disable workflows you do not want.
- Clear and short docs are better than clever docs.

## Recommended first edits

- Replace generic guidance in `AGENTS.md` with the things that matter most in this repo.
- Simplify template wording if your contributors are likely to be new to GitHub too.
- Remove any workflow you do not expect to use in the next two weeks.
- If docs matter in your repo, keep `repo-health.yml` even if you skip the Codex workflows.

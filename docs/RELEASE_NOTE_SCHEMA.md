# Release Note Schema

This is the advanced path for teams that want release prep output to be machine-readable as well as human-readable.

If you only publish release notes to GitHub or a changelog, you probably do not need this.

## When to keep the schema file

Keep `.github/release-note-schema.yml` if you want the release-prep workflow to produce a fenced YAML block that can feed:

- a changelog generator
- a release dashboard
- another CI step
- internal tooling that expects stable keys

Delete the file if plain Markdown release notes are enough.

## What the workflow does

When `.github/release-note-schema.yml` exists, `codex-release-prep.yml` still asks for the normal human-readable output:

1. a short release summary
2. user-facing changes
3. a maintainer checklist
4. obvious risks or follow-up items

Then it also asks for one fenced YAML block that matches the schema file exactly.

## Recommended adoption flow

1. Keep `.github/workflows/codex-release-prep.yml`.
2. Keep or customize `.github/release-note-schema.yml`.
3. Trigger the workflow with the target version.
4. Review the issue body or artifact the workflow produces.
5. Use the Markdown sections for humans and the YAML block for automation.

## Default schema shape

The starter schema includes:

- `version`
- `summary`
- `highlights[]`
- `checklist[]`
- `risks[]`
- `follow_up[]`

Each `highlight` item includes:

- `title`
- `audience`
- `type`
- `breaking`
- `note`

## Example use case

The JavaScript package example is a natural fit for this path because package releases often need both human-readable notes and stable structured data for tooling.

See:

- [oss-maintainer-kit-javascript-example](https://github.com/BlakeHampson/oss-maintainer-kit-javascript-example)

## Tradeoff

Structured output is useful only if something downstream consumes it.

If no one is parsing the YAML, the extra schema file is maintenance overhead. In that case, delete it and keep the simpler Markdown-only workflow.

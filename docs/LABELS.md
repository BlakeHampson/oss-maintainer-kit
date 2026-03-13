# Label Sync

OSS Maintainer Kit includes a versioned label manifest and a sync command so you can give a repo a sane starting label set without clicking through the GitHub UI by hand.

## Command

```bash
npx oss-maintainer-kit sync-labels OWNER/REPO --dry-run
```

Apply the changes:

```bash
npx oss-maintainer-kit sync-labels OWNER/REPO
```

## Requirements

- `gh` must be installed
- `gh auth status` should show that you are logged in
- you need permission to manage labels on the target repo

## What it does

- creates missing labels from the standard manifest
- updates color and description when a managed label already exists
- leaves unrelated labels alone

That makes it safe to run repeatedly. It is intentionally non-destructive.

## Managed labels

Manifest: `manifests/labels/standard.json`

Version: `2026-03-13`

Included labels:

- `bug`
- `enhancement`
- `docs`
- `release`
- `good first issue`
- `needs reproduction`
- `blocked`

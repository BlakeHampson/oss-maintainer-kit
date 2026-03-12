# Security Policy

If you find a security issue in the CLI or shipped workflow templates, please open a private security advisory or contact the maintainer before publishing full details.

## Scope

- template workflows that could expose repository secrets
- placeholder handling that could unexpectedly overwrite files
- command behavior that could write outside the requested target directory

## Response goals

- acknowledge within 72 hours
- publish a fix or mitigation path as quickly as practical

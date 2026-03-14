# Architecture Notes

This file exists to capture the service boundaries that reviewers should keep in mind.

## Record the parts that matter

- runtime entry points and worker processes
- request paths or jobs that are operationally critical
- data stores, queues, and external services
- config, secret, and migration boundaries
- failure and recovery assumptions

## Why this helps

A short architecture note makes it easier to review deploy-risk changes without rediscovering the same service context in every pull request.

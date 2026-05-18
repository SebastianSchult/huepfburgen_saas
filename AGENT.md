# AGENT.md

Repository-level instructions for development agents.

## Language and documentation

- Explain implementation steps in German for the main developer.
- Keep technical documentation and code comments in English.

## Ticket workflow

- Work ticket-first from GitHub issues.
- Keep implementation focused on the selected ticket.

### Mandatory branch and merge flow

Use this delivery flow for implementation tickets:

1. Create a feature branch from `develop`.
2. Open the ticket PR from feature branch to `develop`.
3. After review and validation, merge `develop` into `main` in a separate integration step.

Important:

- Do not open regular feature PRs directly to `main`.
- `main` is only updated through the controlled `develop` -> `main` merge flow.

### Mandatory project status transitions

When working with the GitHub Project board, use this status flow:

1. `Ready` -> `In Progress` when work starts on the ticket.
2. `In Progress` -> `Review` when a PR for the ticket is opened.
3. `Review` -> `Test` when the ticket PR is merged.

## Branch naming for automation

Preferred branch names so project automation can resolve ticket numbers:

- `<issue-number>-short-description`
- `codex/issue-<issue-number>-short-description`

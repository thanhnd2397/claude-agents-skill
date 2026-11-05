# Project analysis: corner-store-orders

- **Analyzed:** 2026-11-03
- **Scope:** the whole project
- **Revision:** not recorded (fixture is not a git repository)
- **Left unread:** nothing under `src/`, `db/` or `config/`
- **Dimensions not yet written up:** technology stack, structure, inventory,
  data and integrations, running and testing, dependencies and licenses. These
  were read but their files are still to be written.

## Summary

`[Verified]` An order service for an online shop: customers place orders, pay by
card, and staff issue refunds. (`README.md:3`)

`[Verified]` Node.js service with no web framework and no declared runtime
dependencies, backed by a SQL schema and the Stripe API. (`package.json:1-10`,
`db/schema.sql:1`, `src/payments/client.js:3`)

## Counts

| Count | Figure | Rule |
|---|---|---|
| Domains | 2 | Top-level nodes of the domain tree |
| Features | 2 | Named features across all domains |
| HTTP endpoints | 1 | Method plus path pairs, excluding the 404 fallback |
| Modules | 3 | Directories under `src/` holding a business concern |
| Tables | 2 | `CREATE TABLE` statements in `db/schema.sql` |
| Integrations | 1 | Distinct external services called |

## Serious issues

- `[Verified]` `Critical` A refund is authorized on `user.isStaff` read from the
  request body, so any caller can claim it. (`src/refunds/api.js:6`) → see
  [risk-register.md](risk-register.md)

## Document map

- [business-domain.md](business-domain.md) — domain tree, actors, features
- [risk-register.md](risk-register.md) — findings with severity and evidence
- [questions.md](questions.md) — what the code cannot answer

## Open questions

2 open. See [questions.md](questions.md).

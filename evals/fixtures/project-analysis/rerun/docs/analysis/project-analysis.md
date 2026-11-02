# Project analysis: corner-store-orders

Scope: the whole project. Everything under `src/`, `db/`, `test/`, `config/` and
`.github/` was read. No files were left unread.

## Summary

`[Verified]` An order service for an online shop: customers place orders, pay by
card, and staff issue refunds. (`README.md:3`)

`[Verified]` Node.js service with no web framework, backed by PostgreSQL and
Stripe. (`package.json:5`, `src/server.js:3`, `db/schema.sql:1`)

### Serious issues noticed

`[Verified]` A refund is accepted on `user.isStaff` taken from the request body,
so any caller can claim it. (`src/refunds/api.js:6`)

## Business domain

- `[Verified]` An `unpaid` order is expired once it is at least 24 hours old.
  (`src/orders/expire.js:3`)
- `[Unknown]` The README says 48 hours, which contradicts the code. → Q1
- `[Unknown]` What reason code `R7` means, and why it is rejected. → Q2
- `[User]` Partial refunds are not offered; a refund is always the full order
  total. Confirmed by the user on 2026-10-28.

## Structure

| Path | Role | Evidence |
|---|---|---|
| `src/server.js` | HTTP entry point, routes `POST /refunds` | `[Verified]` `src/server.js:9-19` |
| `src/orders/` | Order expiry rules | `[Verified]` `src/orders/expire.js:5-9` |
| `src/refunds/` | Refund authorization | `[Verified]` `src/refunds/api.js:5-12` |
| `src/payments/` | Stripe client | `[Verified]` `src/payments/client.js:5-13` |

## Languages and tech stack

- `[Verified]` JavaScript on Node.js 20 or newer, CommonJS modules.
  (`package.json:5`, `src/server.js:1`)
- `[Verified]` No runtime dependencies are declared. (`package.json:1-10`)

## Data and integrations

- `[Verified]` Two tables, `customers` and `orders`, with order status limited to
  `unpaid`, `paid`, `cancelled`, `refunded`. (`db/schema.sql:9`)
- `[Verified]` Stripe is called for refunds, authorized by `STRIPE_API_KEY`.
  (`src/payments/client.js:3-10`)
- `[Unknown]` Nothing in the repository writes to the database. → Q3

## Running and testing

All commands below are **not run**.

| Purpose | Command | Evidence |
|---|---|---|
| Install | `npm install` | `[Verified]` `README.md:9` |
| Run | `npm start` | `[Verified]` `package.json:7` |
| Test | `npm test` | `[Verified]` `package.json:8` |

- `[Verified]` CI runs `npm test` on Node 20 on every push.
  (`.github/workflows/ci.yml:10`)

## Open questions

- **Q1.** Should unpaid orders be cancelled after 24 or 48 hours? The code uses
  24 (`src/orders/expire.js:3`), the README says 48 (`README.md:5`).
- **Q2.** What does reason code `R7` mean, and what is the full list of codes?
  The comment points at the back-office team (`src/refunds/api.js:7`).
- **Q3.** Which component writes orders to the database? No insert or update
  statement appears in this repository.

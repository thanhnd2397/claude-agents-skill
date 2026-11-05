# Business domain

- **Analyzed:** 2026-11-03
- **Scope:** the whole project
- **Revision:** not recorded (fixture is not a git repository)

Back to [project-analysis.md](project-analysis.md).

## Actors

- `[Verified]` Staff: the only role checked before a refund is created.
  (`src/refunds/api.js:6`)
- `[Inferred]` Customers: they own orders and have an email address, but no code
  path in this repository authenticates them. (`db/schema.sql:1-4`)

## Domain tree

```
corner-store-orders
├── Orders
│   └── Order expiry
└── Refunds
    └── Issue refund
```

## Orders

### Order expiry

`[Verified]` An `unpaid` order is expired once it is at least 24 hours old.
(`src/orders/expire.js:3-9`)

`[Unknown]` Nothing in this repository calls `isExpired`, so what runs it and on
what schedule is unclear. → Q1

## Refunds

### Issue refund

`[Verified]` `POST /refunds` takes a staff flag, an order id, an amount, and a
reason code, rejects reason code `R7`, and otherwise calls Stripe.
(`src/server.js:9-16`, `src/refunds/api.js:5-11`)

`[Unknown]` What reason code `R7` means, and what the full list of codes is. → Q2

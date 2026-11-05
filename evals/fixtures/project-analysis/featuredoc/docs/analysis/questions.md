# Open questions

Back to [project-analysis.md](project-analysis.md).

Answer under the **Answer:** line of each question. Leave the rest alone.

## Q001 — What runs order expiry, and on what schedule?

- **Domain:** Orders
- **Feature:** Order expiry
- **Priority:** Medium
- **Status:** Pending

**Why this matters.** The rule is implemented but nothing in this repository
invokes it, so the expiry may not happen at all in production.

**Current understanding.** `[Verified]` `isExpired` is exported at
`src/orders/expire.js:11` and imported nowhere in this repository.

**Expected answer.** The component and its schedule, or confirmation that
expiry is not yet wired up.

**Answer:**

## Q002 — What does reason code R7 mean?

- **Domain:** Refunds
- **Feature:** Issue refund
- **Priority:** High
- **Status:** Pending

**Why this matters.** `R7` is the only reason code the refund path rejects, and
the full list decides what callers may send.

**Current understanding.** `[Verified]` A refund with `reasonCode === 'R7'`
returns 422. (`src/refunds/api.js:8`) `[Verified]` A comment says reason codes
come from the back-office team. (`src/refunds/api.js:7`)

**Expected answer.** The meaning of `R7` and the full list of reason codes.

**Answer:**

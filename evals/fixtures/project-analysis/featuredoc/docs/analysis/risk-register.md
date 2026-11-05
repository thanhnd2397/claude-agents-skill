# Risk register

- **Analyzed:** 2026-11-03
- **Scope:** the whole project
- **Revision:** not recorded (fixture is not a git repository)

Back to [project-analysis.md](project-analysis.md).

## R001 — Refund authorization trusts a flag from the request body

- **Severity:** Critical
- **Verdict:** Confirmed
- **Category:** Secrets and access
- **Location:** `src/refunds/api.js:5-9`

**Evidence.** `[Verified]` The handler destructures `user` from the parsed
request body at `src/refunds/api.js:5` and authorizes on `user.isStaff` at line
6. The body is `JSON.parse` of the raw request at `src/server.js:12`, with no
session or token lookup anywhere in the repository.

**Why it is dangerous.** Any unauthenticated caller can send
`{"user":{"isStaff":true}}` and issue a refund against any order id.

**Impact.** Unauthenticated money movement, with no audit trail tying the
refund to a real staff account.

**Mitigation.** Not proposed here. Hand to `security-and-hardening`.

## R002 — Stripe credential committed to the repository

- **Severity:** High
- **Verdict:** Confirmed
- **Category:** Secrets and access
- **Location:** `config/credentials.yml:2`

**Evidence.** `[Verified]` A `stripe_api_key` value is present in
`config/credentials.yml:2`, which is tracked rather than ignored.

**Why it is dangerous.** A live Stripe key in version control is readable by
anyone with repository access and survives in history after removal.

**Impact.** Unauthorized charges and refunds against the Stripe account.

**Mitigation.** Not proposed here. Hand to `security-and-hardening`.

## Coverage

No exhaustive search was performed. This register records what reading the
project exposed; the absence of a finding is not evidence of safety. Use
`security-and-hardening` for an actual audit.

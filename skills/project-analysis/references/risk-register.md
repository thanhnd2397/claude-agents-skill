# Risk Register

How `project-analysis` records danger it finds while reading a project. Used by
the risk phase.

## What This Is, and Is Not

This is a register, not an audit. The analysis reads the project to describe
it; where that reading exposes something dangerous, the danger gets written
down with its evidence instead of being dropped. That is all.

It is not a penetration test, a threat model, or a security review. Those are
`security-and-hardening`, which owns the vulnerability taxonomy and the
controls. Do not restate that taxonomy here, and do not propose fixes — a fix
proposed from a reading that stopped at the first hit is how a reviewer gets
sent down the wrong path.

| This file | `security-and-hardening` |
|---|---|
| Records what reading the project exposed | Goes looking, exhaustively |
| Evidence and severity | Threat model, controls, remediation |
| Hands off | Fixes |

For the vulnerability classes themselves, see
[../../../references/security-checklist.md](../../../references/security-checklist.md)
and its [OWASP Top 10 Quick Reference](../../../references/security-checklist.md#owasp-top-10-quick-reference).

## The Evidence Bar

A register entry needs code that an engineer can open and see the problem in.
That means the file, the line, and the quoted expression — not a pattern name.

Three verdicts, and the entry must carry one:

| Verdict | Means | Requires |
|---|---|---|
| `Confirmed` | The dangerous path is reachable and unguarded, and you traced it | Entry point, the path, the missing guard, all cited |
| `Potential` | The pattern is present but reachability or guarding is unproven | The cited pattern, plus what you could not establish |
| `Structural` | An architectural or operational property that creates risk | What the property is and why it bites |

`Confirmed` means traced, not recognized. A query built with string
concatenation is `Potential` until you have followed the parameter from an
entry point a caller controls and found nothing sanitizing it. Most findings
from a reading pass are honestly `Potential`, and labeling them so is what
makes the `Confirmed` ones worth acting on.

Never report a finding without this bar met. A false `Confirmed` costs a team
a day and costs the register its credibility; after two, nobody opens it.

## Severity

Severity is impact if exploited, weighted by how reachable the path is. Assign
it from what you traced, not from the category's reputation: a hardcoded
credential in a committed production config is Critical, while the same
credential in a test fixture is Informational.

| Severity | Meaning |
|---|---|
| `Critical` | Unauthenticated path to data loss, money loss, or full compromise |
| `High` | Authenticated or conditional path to the same, or exposure of personal data |
| `Medium` | Real impact needing unusual conditions, or a missing defense in depth |
| `Low` | Narrow impact, or a weakness with a compensating control present |
| `Informational` | Worth knowing, no demonstrated impact |

A `Potential` finding is capped at `Medium` unless the impact would be
catastrophic and the pattern is unambiguous. Unproven reachability is not a
detail to round up.

## Categories

Security classes belong to the security checklist linked above. These four
groups are what a reading pass is positioned to notice, and the last two are
the ones a security-focused pass usually misses:

**Secrets and access.** Credentials committed to the repository, tokens in
configuration under version control, authentication or authorization checks
absent from a path that writes or exposes data, a check present but applied
after the effect.

**Data.** Destructive operations without a guard — delete or update whose
predicate can match everything. Multi-step writes with no transaction. Writes
that must be atomic across two stores. Personal data stored unencrypted or
logged. Migrations that drop or rewrite columns with no stated rollback.

**Business logic.** Money computed in floating point. A payment, refund, or
order path with no idempotency key where a retry would double it. Read-then-write
on a contended row with no lock or version. A rule enforced in one of the
several entry points that reach the same operation. An authorization check on
the resource's type but not on its owner.

**Operational.** A shell command built from input the caller controls. A
deployment script that acts on production from a default. Network or storage
open to everything. No resource limit where input decides the size. A scheduled
job that is not safe to run twice. A single point of failure the project cannot
work without.

Nothing here is a checklist to sweep for. These are what to write down when the
reading hits them.

## Register Format

`risk-register.md`, highest severity first:

```markdown
## R003 — Refund endpoint checks role but not ownership

- **Severity:** High
- **Verdict:** Confirmed
- **Category:** Business logic
- **Location:** `src/refunds/api.js:27-41`

**Evidence.** `[Verified]` The handler checks `req.user.isStaff` at
`src/refunds/api.js:27`, then loads the order by the id in the request body at
line 34 and refunds it at line 41. No check ties the order to the caller.

**Why it is dangerous.** Any staff account can refund any order, including one
belonging to another tenant. The route is reachable by session cookie at
`src/server.js:22`.

**Impact.** Money moves on an order the caller has no relationship to, and the
audit trail records the acting staff user as legitimate.

**Mitigation.** Not proposed here. Hand to `security-and-hardening`.
```

Ids are stable across reruns, like question ids. A finding that is fixed is
marked `Resolved` with the commit that fixed it and stays in the file — the
register is a history, and deleting entries loses the fact that it was ever
wrong.

## The Index Summary

The index carries at most five one-line entries, the highest severity first,
each linking to its register row. This cap is deliberate: the index is read by
somebody deciding whether to read further, and a list of thirty findings there
is a wall, not a signal.

The register itself has no cap.

## Handoff

End the register with what it does not cover: that no exhaustive search was
performed, that absence of a finding is not evidence of safety, and that
`security-and-hardening` is the next step for a real audit.

Say this even when the register is empty. An empty risk register from a reading
pass means nothing was noticed, and a reader will take it as a clean bill of
health unless told otherwise.

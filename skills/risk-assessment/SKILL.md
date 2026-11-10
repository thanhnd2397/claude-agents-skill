---
name: risk-assessment
description: Grades a danger already found in code into a verdict and a severity backed by evidence an engineer can open, and hands it off without proposing a fix. Use when you have hit something alarming while reading or inheriting code and need to know how bad it actually is, when triaging a list of findings to decide which are real and which are pattern-matches, when a finding needs a severity before anyone schedules work on it, or when you need findings recorded with stable ids that survive the next pass.
---

# Risk Assessment

## Overview

A finding is worth acting on when someone can open the cited line and see the
problem. Most findings that reach a team are not that: they are a pattern
recognized, reported with the confidence of something traced. The cost lands
later — a day spent on a `Confirmed` finding that was never reachable, and
after two of those nobody reads the next one.

This skill grades what you already found. It separates what you traced from
what you recognized, assigns a severity from the impact you can demonstrate
rather than from the category's reputation, and stops at the handoff. It does
not go looking, and it does not propose fixes.

## When to Use

- Something alarming turned up while reading code, and you need to know whether
  it is real before raising it
- A list of findings — from an analysis, a scan, a review, another agent —
  needs triaging into what is traced and what is not
- A finding needs a severity before anyone decides whether to schedule it
- Findings need recording with stable ids, so the next pass can tell a new
  finding from a known one
- You are about to write "this is a SQL injection" and have not yet followed
  the value from an entry point

**When NOT to use:**

- Going looking for vulnerabilities, threat modeling, or fixing what you find:
  that is `security-and-hardening`, which owns the taxonomy and the controls
- Reviewing a diff across correctness, readability and design:
  `code-review-and-quality`
- Describing what a codebase is and does: `project-analysis`, which reports
  what it hit and sends it here
- Finding the cause of a failure that is already happening:
  `debugging-and-error-recovery`

## What This Is, and Is Not

| This skill | `security-and-hardening` |
|---|---|
| Grades what was already found | Goes looking, exhaustively |
| Evidence, verdict, severity | Threat model, controls, remediation |
| Hands off | Fixes |

Do not restate the vulnerability taxonomy here, and do not propose mitigations.
A fix proposed from a reading that stopped at the first hit is how a team gets
sent down the wrong path. For the vulnerability classes themselves see
[../../references/security-checklist.md](../../references/security-checklist.md)
and its [OWASP Top 10 Quick Reference](../../references/security-checklist.md#owasp-top-10-quick-reference).

## Process

### 1. Fix the candidate list

Write down every candidate before grading any of them, and do not add to the
list while grading. Grading a finding is what tempts a sweep: one traced path
suggests three more places to look, and a sweep that starts mid-assessment is
neither a graded list nor an audit.

If the list is thin and the user wanted an audit, say so and point at
`security-and-hardening` instead of half-doing one.

### 2. Meet the evidence bar

Every finding needs the file, the line, and the quoted expression — not a
pattern name. "User input flows into a query" is not evidence; a line someone
can open is.

Read each cited line again before you grade it. A citation written from memory
is the most common way a `Confirmed` verdict turns out to be wrong.

### 3. Assign a verdict

Exactly one, and the finding carries it:

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

### 4. Assign a severity

Severity is impact if exploited, weighted by how reachable the path is. Assign
it from what you traced: a hardcoded credential in a committed production
config is `Critical`, while the same credential in a test fixture is
`Informational`.

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

### 5. Classify and sanity-check

These four groups are what a reading pass is positioned to notice, and the last
two are the ones a security-focused pass usually misses. They are not a
checklist to sweep for — they are how to file what you have.

**Secrets and access.** Credentials committed to the repository, tokens in
configuration under version control, authentication or authorization checks
absent from a path that writes or exposes data, a check present but applied
after the effect.

**Data.** Destructive operations without a guard — a delete or update whose
predicate can match everything. Multi-step writes with no transaction. Writes
that must be atomic across two stores. Personal data stored unencrypted or
logged. Migrations that drop or rewrite columns with no stated rollback.

**Business logic.** Money computed in floating point. A payment, refund, or
order path with no idempotency key where a retry would double it.
Read-then-write on a contended row with no lock or version. A rule enforced in
one of the several entry points that reach the same operation. An authorization
check on the resource's type but not on its owner.

**Operational.** A shell command built from input the caller controls. A
deployment script that acts on production from a default. Network or storage
open to everything. No resource limit where input decides the size. A scheduled
job that is not safe to run twice. A single point of failure the project cannot
work without.

A finding that fits none of these is still a finding. A finding you cannot
place on any line is not one yet.

### 6. Report

Report in your message, highest severity first. Write a file only when the user
asks for one; then use the same fields as headings, and nothing is graded
differently because it landed on disk.

```markdown
## R003 — Refund endpoint checks role but not ownership

- **Severity:** High
- **Verdict:** Confirmed
- **Category:** Business logic
- **Location:** `src/refunds/api.js:27-41`

**Evidence.** The handler checks `req.user.isStaff` at `src/refunds/api.js:27`,
then loads the order by the id in the request body at line 34 and refunds it at
line 41. No check ties the order to the caller.

**Why it is dangerous.** Any staff account can refund any order, including one
belonging to another tenant. The route is reachable by session cookie at
`src/server.js:22`.

**Impact.** Money moves on an order the caller has no relationship to, and the
audit trail records the acting staff user as legitimate.

**Mitigation.** Not proposed here. Hand to `security-and-hardening`.
```

Ids are stable and never reused. A finding that is fixed is marked `Resolved`
with the commit that fixed it and stays in the record — deleting it loses the
fact that it was ever wrong. Where the user asked for a summary line somewhere
else, cap it at five entries, highest severity first, every `Critical` and
`High` among them: a list of thirty in an index is a wall, not a signal.

Never quote a credential value, even one that looks fake. Record the name.

### 7. Hand off

End with what the assessment does not cover: that no exhaustive search was
performed, that the absence of a finding is not evidence of safety, and that
`security-and-hardening` is the next step for a real audit.

Say it even when nothing was found. A reader takes silence for a clean bill of
health unless told otherwise.

Then stop. Do not fix, and do not start the audit you just pointed at.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "This pattern is a SQL injection, I'll mark it Confirmed" | `Confirmed` means you traced a caller-controlled value to it. Until then it is `Potential`. |
| "It's obviously reachable" | Then cite the entry point and the path. If you cannot, it is `Potential`. |
| "Hardcoded credentials are always Critical" | Severity comes from the traced impact. In a test fixture the same string is `Informational`. |
| "It's only Potential, but the category is scary, so High" | A `Potential` finding caps at `Medium`. Rounding up unproven reachability is how the list loses credibility. |
| "While grading this I spotted three more places to check" | That is an audit, and it belongs to `security-and-hardening`. Fix the candidate list first. |
| "I know the fix, it's one line" | Propose nothing. A fix from a reading that stopped at the first hit sends the team down the wrong path. |
| "I'll cite the file, the line number is close enough" | Reopen the line. A citation from memory is the usual cause of a wrong `Confirmed`. |
| "Nothing was found, so there's nothing to say" | Say that nothing was noticed and that no exhaustive search was performed, or silence reads as a clean bill of health. |
| "The value is clearly a dummy secret, quoting it is fine" | You cannot tell from the value. Record the name only. |
| "The finding is small, it doesn't need a verdict" | Then it cannot be compared against the others, and it will be scheduled or dropped at random. |

## Red Flags

- A `Confirmed` verdict where reachability was never traced
- A finding with no `file:line`, or with a citation that was not reopened
- A `Potential` finding graded above `Medium`
- A severity taken from the category's reputation rather than the traced impact
- A finding that proposes a fix or a mitigation
- An assessment that grew into a sweep of the project mid-pass
- A report with no handoff note, or a clean result reported as "no issues found"
- A credential value quoted anywhere in the report
- An id reused, or a resolved finding deleted instead of marked `Resolved`
- A summary list longer than five entries, or one missing a `Critical` or `High`
- A file written when the user asked only for an answer

## Verification

Before handing off, confirm:

- [ ] Every finding carries exactly one verdict and one severity
- [ ] Every finding cites a file and a line, and every cited line was reopened and says what the finding claims
- [ ] Every `Confirmed` finding names its entry point, the path, and the missing guard
- [ ] No `Potential` finding is graded above `Medium` without a stated catastrophic impact and an unambiguous pattern
- [ ] No finding proposes a fix or a mitigation
- [ ] The candidate list is the one fixed at the start; nothing was added by sweeping during the assessment
- [ ] The report ends with the handoff note, including when nothing was found
- [ ] No credential value appears in the report
- [ ] Ids are stable against any earlier record, and no entry was deleted
- [ ] A file was written only if the user asked for one

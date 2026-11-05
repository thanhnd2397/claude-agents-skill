# Report Structure

The document set `project-analysis` produces, and the rules that keep it
navigable and cheap to update. Read this before writing any file.

## The Document Set

Everything lives under `docs/analysis/` in the project being analyzed:

```
docs/analysis/
├── project-analysis.md            # index: summary, counts, links. Always written.
├── technology-stack.md            # languages, frameworks, versions, configuration
├── business-domain.md             # domain tree, actors, features
├── structure.md                   # modules, responsibilities, architecture
├── inventory.md                   # counts and the inventories behind them
├── data-and-integrations.md       # schemas, APIs, external services
├── running-and-testing.md         # install, run, build, test, CI, env vars
├── dependencies-and-licenses.md   # licensing and commercial exposure
├── risk-register.md               # findings with severity and evidence
├── questions.md                   # what the code cannot answer
└── features/
    └── <domain>/<feature>.md      # one operation, written on request
```

`project-analysis.md` keeps its name because earlier versions of this skill
wrote a single report at that path. A rerun over such a project rewrites that
file as the index and moves its sections into the dimension files, so no
earlier analysis is lost and no link to it breaks.

## Which Files to Write

Write the index every time. Write a dimension file when that dimension has
findings. A dimension with no findings gets one line in the index saying what
was checked and that nothing was found — not an empty file.

This keeps a ten-file skeleton off a hundred-line project. It also means the
absence of `risk-register.md` is a claim in itself: it says the analysis looked
and found nothing, and the index has to say so.

Never split a dimension across two files, and never repeat a dimension's
content in the index beyond its headline.

## Index File

`project-analysis.md` is the entry point and stays short — a reader should get
the shape of the project without opening anything else. It carries, in order:

1. **Analysis header.** Date, scope as the user gave it, commit or revision if
   the project is in version control, and what was left unread.
2. **Summary.** What the project does, for whom, with what.
3. **Counts.** The statistics table from `inventory.md`, headline figures only.
4. **Serious issues.** Up to five one-line, labeled, cited entries, each
   linking to its `risk-register.md` row. Omit the section when there are none.
5. **Document map.** A link to every file written, with one line each.
6. **Open questions.** The count and a link to `questions.md`, not the questions.

Record the commit as the short hash and whether the tree was clean. An analysis
of a dirty tree is an analysis of something nobody else can check out, and the
reader needs to know.

## Dimension Files

Each dimension file opens with the same header block as the index — date,
scope, commit — so a file read on its own still says what it describes and how
stale it may be. Then its findings, every one labeled and cited.

A dimension file states what it does not cover and links to the file that does,
rather than restating it. `technology-stack.md` names the database driver and
its version; the schema belongs to `data-and-integrations.md`.

## Feature Documents

A feature document describes one business operation in enough detail to
implement or change it. Write one when the user asks about a specific feature,
sub-feature, or operation — not speculatively for every leaf of the domain tree.

Path: `docs/analysis/features/<domain>/<feature>.md`, kebab-case, matching the
names used in `business-domain.md`. The record to fill in is in
[business-and-inventory.md](business-and-inventory.md).

When a feature document is written, add a link to it from that feature's entry
in `business-domain.md`. A feature document nobody can reach from the domain
tree will be missed on the next rerun and drift.

## Cross-Linking Rules

- Every file links back to `project-analysis.md`.
- Links are relative and one level deep where possible.
- A claim lives in exactly one file. Other files link to it.
- Code references are `path/to/file.ext:line`, relative to the project root.
- An `[Unknown]` claim links to its question by id.

## The Questions File

`questions.md` holds everything the code cannot answer. One file, not a
question file plus an answer file: the user answers in place, under the
question, so a question and its answer cannot drift apart and no id has to be
matched across two documents.

Each entry:

```markdown
## Q007 — Does registration require email verification?

- **Domain:** User Management
- **Feature:** User Registration
- **Priority:** High
- **Status:** Pending

**Why this matters.** It decides the account lifecycle and whether an
unverified account can authenticate.

**Current understanding.** `[Verified]` Registration inserts the user with
`status = 'active'`. (`src/users/register.js:48`) No verification token is
written and no mailer is called on that path.

**Expected answer.** Yes / No / Other.

**Answer:**
```

Rules:

- Ids are stable and never reused. A resolved question keeps its number.
- `Status` is `Pending`, `Answered`, or `Obsolete`. Nothing else.
- Priority is `High` when a wrong guess would change the design, `Medium` when
  it would change a document, `Low` otherwise.
- Never write anything under the answer line yourself. That line belongs to the
  user, and an agent-written answer is indistinguishable from a real one on the
  next run.
- A question marked `Obsolete` records why in one line and stays in the file.
- Do not re-ask an answered question, in this file or in conversation.

## Applying Answers

When the user has answered, for each entry whose answer line is no longer
empty:

1. Relabel the matching claim `[User]`, with the answer and the date.
2. Set `Status: Answered` and leave the question and the answer text untouched.
3. Update any feature document that depended on the gap.
4. Leave `Pending` entries alone.

Keep what the user asserted and what the code shows apart. A `[User]` claim
says a human asserted this; it does not become `[Verified]`, because nothing in
the code was read to confirm it. If an answer contradicts a `[Verified]` claim,
keep both and raise a new question — a user can be wrong about their own
system, and the code is still what runs.

## Incremental Reruns

A rerun exists to avoid re-reading a project that has barely changed.

1. Read the index header for the previous commit and scope, before writing
   anything. That previously-recorded commit is the baseline. The commit you
   record this run is the new header value and is never the baseline — diffing
   against it compares the project to itself and always reports no change.
2. If the project is in version control and that baseline is reachable, diff it
   against the current revision to get the changed paths. If there is no
   baseline — no previous run, no recorded commit, a shallow clone, an
   unreachable hash — say so in the index and analyze in full.
3. Map changed paths to dimensions and features. A changed manifest touches the
   stack and licenses; a changed route touches the inventory and the feature
   that owns it; a changed migration touches data.
4. Re-analyze those dimensions only. Recount any statistic whose inventory
   changed, and recheck any risk whose cited lines moved.
5. Leave untouched dimensions as they are, and update the index header to the
   new commit.
6. Mark a document whose cited lines no longer exist as stale in one line,
   rather than deleting it.

Nothing is unchanged, up to date, or already covered without a baseline diff
behind the claim. A clean working tree does not establish it: it says nobody
has edited the files since the last commit, not that the analysis matches them.

Preserve every `[User]` claim and every answered question through a rerun,
whatever else changes. They are the only content in the set that cannot be
recovered by reading the code again.

Re-analyze in full, and say why in the index, when the recorded commit is
unreachable, when the scope widens, or when the previous set has no header
block to compare against.

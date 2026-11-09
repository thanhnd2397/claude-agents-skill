# Report Structure

The document set `project-analysis` produces, and the rules that keep it
navigable and cheap to update. Read this before writing any file.

## The Two Shapes

Everything lives under `docs/analysis/` in the project being analyzed, entered
at `docs/analysis/README.md`. Which files exist depends on the project's size.

Use the **large** shape when either holds:

- the domain tree has **three or more business domains**, or
- the project has **ten or more modules**, or more than one deployable

Otherwise use **small**. On a boundary case choose small.

### Large

```
docs/analysis/
├── README.md        # index: header, summary, counts
├── tech.md          # stack, versions, dependencies and licences, run/build/test/CI
├── domain.md        # domain tree, actors, features
├── architecture.md  # modules, architecture, schema, APIs, external services
└── features/
    └── <domain>/<feature>.md      # one operation, written on request
```

### Small

```
docs/analysis/
├── README.md        # index: header, summary, counts
├── tech.md          # stack, dependencies, run/test
├── system.md        # domain, architecture, data and integrations
└── features/
    └── <domain>/<feature>.md      # one operation, written on request
```

`system.md` is `domain.md` and `architecture.md` in one file, under those two
headings plus a third for data and integrations. The content rules do not
change with the shape; only how many files carry it does.

### What goes where

| Content | Large | Small |
|---|---|---|
| Summary, counts, serious issues, document map | `README.md` | `README.md` |
| Languages, frameworks, versions, configuration | `tech.md` | `tech.md` |
| Dependencies, licences, commercial exposure | `tech.md` | `tech.md` |
| Install, run, build, test, CI, env var names | `tech.md` | `tech.md` |
| Domain tree, actors, features | `domain.md` | `system.md` |
| Modules, responsibilities, architecture | `architecture.md` | `system.md` |
| Schemas, APIs, external services | `architecture.md` | `system.md` |

Write every file the shape names and no others. These are consolidated
documents, not one file per dimension: a dimension with no findings gets its
heading and one line saying what was checked and that nothing was found. That
line is a claim in itself — it says the analysis looked.

Never write a file the shape does not name, never split one dimension across
two files, and never repeat a document's content in the index beyond its
headline.

## Recording and Keeping the Shape

The README header carries a `Shape:` line with the counts that decided it:

```markdown
- **Shape:** small (2 domains, 4 modules, 1 deployable)
```

A rerun reads that line and keeps the shape. Re-deciding every run would
rename every file under whatever links the reader has saved, for no gain.

Change shape only when the user asks, or when the project has crossed the
boundary and stayed well past it — roughly double the threshold, not one module
over. Ask before doing it, state which files will be created and removed, and
carry every claim across as in the consolidation rules below.

## Consolidating an Older Set

Earlier versions of this skill wrote a single report at
`docs/analysis/project-analysis.md`, and later a ten-file set. Both are
consolidated into the current shape on the next run.

| Old file | Goes to (large) | Goes to (small) |
|---|---|---|
| `project-analysis.md` | `README.md` | `README.md` |
| `inventory.md` | `README.md` | `README.md` |
| `technology-stack.md` | `tech.md` | `tech.md` |
| `dependencies-and-licenses.md` | `tech.md` | `tech.md` |
| `running-and-testing.md` | `tech.md` | `tech.md` |
| `business-domain.md` | `domain.md` | `system.md` |
| `structure.md` | `architecture.md` | `system.md` |
| `data-and-integrations.md` | `architecture.md` | `system.md` |
| `risk-register.md` | stays, untouched in content | stays, untouched in content |
| `questions.md` | stays, untouched in content | stays, untouched in content |
| `features/**` | unchanged | unchanged |

A single-file report keeps its questions and its risks in sections rather than
files. Those sections are carried over, not dropped:

| Old section | Goes to |
|---|---|
| `Open questions`, or any numbered `Q<n>` list | `questions.md` |
| `Serious issues noticed`, or any `R<n>` list | `risk-register.md` |

Carrying questions or risks forward from a previous set **is** preservation, so
it does not need permission — the content already existed and the ids have to
land somewhere stable. What needs permission is creating either file for
findings this run produced, where no previous set had them. Preserve the ids,
the statuses, the answers and the wording exactly; add nothing of your own
under an answer line.

Consolidating is the only time this skill deletes a file, and the order is
fixed:

1. Write the new documents, carrying every claim with its label and citation,
   every `[User]` claim with its date, and every count with its rule.
2. Reopen each new document and confirm the content of each old file is there.
3. Only then delete the old files the shape does not name.
4. List in the handoff what was removed and where its content went.

A deletion before step 2 is how an analysis loses a `[User]` answer that no
amount of re-reading the code can recover. `risk-register.md` and
`questions.md` are never deleted here: they are kept as they are, even though
neither is written by default any more.

## Index File

`README.md` is the entry point and stays short — a reader should get the shape
of the project without opening anything else. It carries, in order:

1. **Analysis header.** Date, scope as the user gave it, `Shape:` with its
   counts, commit or revision if the project is in version control, and what
   was left unread.
2. **Summary.** What the project does, for whom, with what.
3. **Counts.** The headline figures, each with its counting rule.
4. **Serious issues.** Up to five one-line, labeled, cited entries — every
   `Critical` and `High` finding at least. Omit the section when there are
   none, and say in the summary that nothing was noticed while reading.
5. **Document map.** A link to every file written, with one line each.

Record the commit as the short hash and whether the tree was clean. An analysis
of a dirty tree is an analysis of something nobody else can check out, and the
reader needs to know.

Naming it `README.md` means the directory renders as its own index on most
hosts, so `docs/analysis/` opens at the summary rather than a file listing.

## Document Conventions

Each document opens with the same header block as the index — date, scope,
shape, commit — so a file read on its own still says what it describes and how
stale it may be. Then its findings, every one labeled and cited.

A document states what it does not cover and links to the file that does,
rather than restating it. `tech.md` names the database driver and its version;
the schema belongs to `architecture.md` or `system.md`.

## Feature Documents

A feature document describes one business operation in enough detail to
implement or change it. Write one when the user asks about a specific feature,
sub-feature, or operation — not speculatively for every leaf of the domain tree.

Path: `docs/analysis/features/<domain>/<feature>.md`, kebab-case, matching the
names used in the domain tree. The record to fill in is in
[business-and-inventory.md](business-and-inventory.md).

When a feature document is written, add a link to it from that feature's entry
in the domain tree — in `domain.md` or `system.md`. A feature document nobody
can reach from the tree will be missed on the next rerun and drift.

## Cross-Linking Rules

- Every file links back to `README.md`.
- Links are relative and one level deep where possible.
- A claim lives in exactly one file. Other files link to it.
- Code references are `path/to/file.ext:line`, relative to the project root.

## The Optional Files

`risk-register.md` and `questions.md` belong to neither shape. Each is written
only when the user asks for it, or when the analysis produced enough to warrant
offering one and the user said yes.

Offer the register when there is more than one finding, or one whose entry is
too long to state in the handoff. Offer the questions file when several gaps
have piled up, or when one blocks a decision the user is about to take. Put
both in the one closing question, name what each would contain, and wait.

What never depends on the answer:

- Every risk the reading exposed is in the handoff, with its severity, verdict
  and citation, and every `Critical` or `High` one has its line in the README.
- Every gap is an `[Unknown]` claim in the document that owns its subject, and
  is listed in the handoff.

A finding withheld because its file does not exist is the failure this
arrangement exists to avoid. The file changes where a finding is filed, not
whether the user learns about it.

An existing `risk-register.md` or `questions.md` is read, kept and updated like
any other file in the set, including through a shape change.

## The Questions File

Where a `questions.md` exists, it holds everything the code cannot answer. One
file, not a question file plus an answer file: the user answers in place, under
the question, so a question and its answer cannot drift apart and no id has to
be matched across two documents.

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
- Where the file exists, an `[Unknown]` claim links to its question by id.

## Applying Answers

When the user has answered, for each entry whose answer line is no longer
empty:

1. Relabel the matching claim `[User]`, with the answer and the date.
2. Set `Status: Answered` and leave the question and the answer text untouched.
3. Update any feature document that depended on the gap.
4. Leave `Pending` entries alone.

An answer given in conversation instead of in the file is applied the same way,
and quoted in the `[User]` claim. Where no `questions.md` exists, that is the
only route an answer arrives by.

Keep what the user asserted and what the code shows apart. A `[User]` claim
says a human asserted this; it does not become `[Verified]`, because nothing in
the code was read to confirm it. If an answer contradicts a `[Verified]` claim,
keep both and record the contradiction as a new gap — a user can be wrong about
their own system, and the code is still what runs.

## Incremental Reruns

A rerun exists to avoid re-reading a project that has barely changed.

1. Read the index header for the previous commit, scope and shape, before
   writing anything. That previously-recorded commit is the baseline. The
   commit you record this run is the new header value and is never the baseline
   — diffing against it compares the project to itself and always reports no
   change.
2. If the project is in version control and that baseline is reachable, diff it
   against the current revision to get the changed paths. If there is no
   baseline — no previous run, no recorded commit, a shallow clone, an
   unreachable hash — say so in the index and analyze in full.
3. Map changed paths to documents and features. A changed manifest touches
   `tech.md`; a changed route touches the counts and the feature that owns it;
   a changed migration touches the data section.
4. Re-analyze those documents only. Recount any statistic whose inventory
   changed, and recheck any risk whose cited lines moved.
5. Leave untouched documents as they are, and update the index header to the
   new commit. Keep the recorded shape.
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

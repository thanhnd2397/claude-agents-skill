# Report Structure

The document set `project-analysis` produces **when it was asked to write
one**, and the rules that keep it navigable and cheap to update. Read this
before writing any file.

Nothing here applies to a run that was asked a question. That run answers in
the conversation and creates no file; the claim labels, the citations and the
counting rules still hold, and the file layout below is simply not involved.

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
| Summary, counts, document map | `README.md` | `README.md` |
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
| `features/**` | unchanged | unchanged |
| Any other file | left exactly as it is | left exactly as it is |

A file not in that mapping is read, left byte-for-byte as it is, and never
deleted, emptied, extended or regenerated — including through a shape change.
Not writing a file is not permission to destroy somebody's.

A single-file report keeps its questions and its findings in sections rather
than files. Those sections are carried over as claims in the document that now
owns the subject, not dropped:

| Old section | Becomes |
|---|---|
| An answered question, or any `[User]` assertion | A `[User]` claim, with the answer and its date preserved |
| An open question, or any numbered `Q<n>` entry | An `[Unknown]` claim where its subject is covered, keeping the question's wording and saying what would settle it |
| `Serious issues noticed`, or any `R<n>` entry | Its factual part as a labeled, cited claim where its subject is covered, plus one plain ungraded line in the handoff |

Carrying this content forward is preservation, not a new finding: the wording,
the dates and the answers are kept as they are. What does not carry over is a
severity or a verdict an earlier run assigned — restate the fact and leave it
ungraded. No new file appears for any of it.

Consolidating is the only time this skill deletes a file, and the order is
fixed:

1. Write the new documents, carrying every claim with its label and citation,
   every `[User]` claim with its date, and every count with its rule.
2. Reopen each new document and confirm the content of each old file is there.
3. Only then delete the old files the shape does not name.
4. List in the handoff what was removed and where its content went.

A deletion before step 2 is how an analysis loses a `[User]` answer that no
amount of re-reading the code can recover. A file outside the mapping above is
never deleted here either: it is kept exactly as it is, even though this skill
does not write it.

## Index File

`README.md` is the entry point and stays short — a reader should get the shape
of the project without opening anything else. It carries, in order:

1. **Analysis header.** Date, scope as the user gave it, `Shape:` with its
   counts, commit or revision if the project is in version control, and what
   was left unread.
2. **Summary.** What the project does, for whom, with what.
3. **Counts.** The headline figures, each with its counting rule.
4. **Document map.** A link to every file written, with one line each.

There is no issues section. Anything alarming the reading exposed goes in the
handoff message as one plain cited line, ungraded — an index that assigns
severities is grading, which this skill does not do.

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

That link is the only change a feature-scoped run makes outside its own
document. Reading one operation in depth will expose gaps the broader pass
missed; record them in the feature document where they bear on it, and report
the rest in the handoff. Do not append them to the index or to any other file
the set already holds, and do not restate the index's counts to match — the
user asked for one operation documented, not for the surrounding set to grow.

## Cross-Linking Rules

- Every file links back to `README.md`.
- Links are relative and one level deep where possible.
- A claim lives in exactly one file. Other files link to it.
- Code references are `path/to/file.ext:line`, relative to the project root.

## Files This Skill Does Not Write

The only files that exist are the ones the chosen shape names, plus feature
documents that were asked for. In particular:

- **No issues or register file.** Anything alarming the reading exposed is
  named in the handoff, in one plain cited line, with no severity and no
  verdict.
- **No questions file, and no question ids.** A gap is an `[Unknown]` claim in
  the document that owns its subject, saying what is missing and what would
  settle it, and it is repeated in the handoff. The user answers in
  conversation.

Where a file like that already exists — from an earlier version of this skill
or from a human — it is read and left exactly as it is. Reading it is useful:
it holds `[User]` answers and question wording worth preserving as claims. It
is never written to, emptied, regenerated or deleted.

What never depends on any of this: every gap reaches the user, and nothing is
withheld because there is no file to put it in. A finding withheld for want of
a filing place is the failure this arrangement exists to avoid.

## Applying Answers

Answers arrive in conversation. For each gap the user has answered:

1. Relabel the matching claim `[User]`, quoting the answer, with the date.
2. Update any document or feature document that depended on the gap.
3. Leave every unanswered gap as the `[Unknown]` claim it already is.

Never write an answer yourself, and never re-ask a gap that has one. Where the
user answered by editing a file an older run left behind, read the answer from
it and apply it the same way — without writing back to that file.

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
   changed, and recheck any claim whose cited lines moved.
5. Leave untouched documents as they are, and update the index header to the
   new commit. Keep the recorded shape.
6. Mark a document whose cited lines no longer exist as stale in one line,
   rather than deleting it.

Nothing is unchanged, up to date, or already covered without a baseline diff
behind the claim. A clean working tree does not establish it: it says nobody
has edited the files since the last commit, not that the analysis matches them.

Preserve every `[User]` claim and every recorded answer through a rerun,
whatever else changes. They are the only content in the set that cannot be
recovered by reading the code again.

Re-analyze in full, and say why in the index, when the recorded commit is
unreachable, when the scope widens, or when the previous set has no header
block to compare against.

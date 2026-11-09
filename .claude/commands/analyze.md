---
description: Analyze an existing project into a linked, evidence-backed doc set sized to the project — business domain, architecture, tech stack, data, integrations, licensing, counts, how to run it
disable-model-invocation: true
---

Invoke the agent-skills:project-analysis skill and run its phases in order.

Scope: $ARGUMENTS

Resolve the scope as follows:

- Empty: analyze the whole project.
- A path: analyze only that path, and record the rest as not analyzed.
- A topic: analyze only the code that serves it.
- A feature or operation already named in the domain tree of an existing
  analysis: write that feature's document under `docs/analysis/features/`
  rather than re-analyzing the project.

Write the document set to `docs/analysis/`, entered at `docs/analysis/README.md`.
Judge the project's size and use the shape the skill specifies for it:

- **Large** — three or more business domains, or ten or more modules, or more
  than one deployable: `README.md`, `tech.md`, `domain.md`, `architecture.md`.
- **Small** — anything less: `README.md`, `tech.md`, `system.md`.

Record the shape and the counts behind it in the README header. On a rerun,
read that line and keep the shape rather than deciding again.

Write no file the shape does not name. In particular, do **not** create
`risk-register.md` or `questions.md`: report every risk and every gap in your
closing message instead, then offer those two files and wait for an answer
before writing either. If one already exists, keep and update it.

Read only, apart from `docs/analysis/`. If an analysis is already there — in
any earlier layout — consolidate it in place and follow the skill's rerun
protocol. Never start a second set, never delete an old file before confirming
its content landed in the file that now owns it, and never overwrite a user's
answers.

Finish every phase before asking anything. Then report the summary, the shape
and its counts, the headline counts, every risk with its verdict and citation,
every open gap, and the files written — then ask about the two optional files
and stop.

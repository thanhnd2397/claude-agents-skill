---
description: Analyze an existing project and answer in the conversation — business domain, architecture, tech stack, data, integrations, licensing, counts, how to run it. Writes a doc set only when asked.
disable-model-invocation: true
---

Invoke the agent-skills:project-analysis skill and run its phases in order.

Scope: $ARGUMENTS

Resolve the scope as follows:

- Empty: the whole project.
- A path: only that path. Record the rest as not analyzed.
- A question or a topic: only the code that answers it.
- A feature already named in the domain tree of an existing analysis: that
  feature.

**Answer in the conversation. Write no file.** Scale the answer to what was
asked, keep every claim labeled and cited, and report every `[Unknown]` gap.

Write to `docs/analysis/` only where the scope asks for files in so many
words — `--write`, "write it up", "document this", a named output path, or an
existing `docs/analysis/` set to update. Then use the shape the skill specifies
for the project's size, write no file that shape does not name, and read but
never modify any file an earlier run left behind.

Read only, apart from a doc set that was asked for. Finish every phase before
asking anything. Then report the summary, the counts, every gap, anything
alarming the reading exposed as one plain cited line each — ungraded, with no
verdict and no proposed fix — and what was written, if anything.

Invoke `agent-skills:project-analysis` and nothing else. Do not load or run any
other skill from this command, however alarming what you found looks. Name what
you saw and stop.

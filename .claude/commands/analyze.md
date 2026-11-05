---
description: Analyze an existing project into a linked, evidence-backed doc set — business domain, structure, tech stack, data, integrations, licensing, counts, risks, how to run it
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

Write the document set to `docs/analysis/`, entered at
`docs/analysis/project-analysis.md`. Read only, apart from that directory. If
an analysis is already there, update it in place and follow the skill's rerun
protocol — never start a second set, and never overwrite a user's answers.

Finish every phase before asking anything. Then report the summary, the counts,
the highest-severity risks, the files written, and the open questions with
where to answer them, and stop.

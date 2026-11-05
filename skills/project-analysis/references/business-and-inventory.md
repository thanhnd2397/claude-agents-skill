# Business Domain and Inventory

How to get from source code to a business domain tree, and how to count what
you found without inflating it. Used by the business and statistics phases of
`project-analysis`.

## What a Feature Is

A feature is something a user or another system can ask the project to do, and
that someone outside the engineering team would recognize by name.

A class is not a feature. A directory is not a feature. A method is not a
feature. `UserService` is not "User Management"; it is a class that several
features happen to call.

The test: can you name who asks for it and what they get back? "A customer
requests a partial refund and the money returns to their card" is a feature.
"RefundServiceImpl" is a file.

A directory named `notifications` containing one unused interface is evidence
of an intention, not of a feature. Record it as `[Inferred]` absent, cite the
directory, and raise a question.

## Tracing a Domain

Work inward from the edges, because the edges are where the business speaks.

1. **Entry points.** Routes, controllers, CLI commands, message consumers,
   scheduled jobs, GraphQL resolvers, UI pages. Each is something somebody can
   trigger.
2. **Follow one through.** From the entry point to validation, to the service
   layer, to the data it reads and writes, to the events it emits. This is the
   flow, and it is the only way to know what the feature does rather than what
   it is called.
3. **Collect the rules.** Business rules live in validation, guards,
   conditionals on status and role, database constraints, and — most reliably
   — in test names and assertions. A test that asserts a rule is the best
   evidence short of the rule being written down.
4. **Name the actors.** Roles in the authorization checks, user types in the
   schema, audiences in the routes. An actor the code checks for is
   `[Verified]`; an actor mentioned only in a README is `[Inferred]`.
5. **Group into domains.** Group by the nouns the code and schema use, not by
   the framework's folder layout. `controllers/`, `services/`, `models/` is a
   layering, not a domain map.

Trace the main path and the failure paths. A feature whose happy path you
followed and whose error handling you did not is half understood, and the half
you skipped is where the business rules usually hide.

## The Domain Hierarchy

Record it as a tree in `business-domain.md`, four levels at most:

```
Project
└── Domain              a business area with its own vocabulary
    └── Feature         something askable, with a name a stakeholder knows
        └── Sub-feature a distinct variant or stage of it
            └── Action  one concrete operation, one entry point
```

Not every branch reaches level four, and inventing levels to make the tree
symmetrical is worse than an uneven tree. Stop where the code stops.

Each feature entry in the tree carries one line on what it does, its label, and
a link to its feature document if one exists.

## Feature Record

For each feature in `business-domain.md`, and in full in a feature document:

- **Purpose.** What it is for, in business terms.
- **Actors.** Who can trigger it, and the check that enforces that.
- **Input and output.** Including validation rules and error responses.
- **Flow.** The main path as numbered steps, each citing the code.
- **Business rules.** Each labeled and cited, one per line.
- **Data.** Tables and entities read and written.
- **Interfaces.** Endpoints, events, jobs, and screens involved.
- **Dependencies.** Other features and external services it needs.
- **Gaps.** `[Unknown]` claims with their question ids.

A feature document that is a paraphrase of the code in prose is not worth
writing. The value is in the rules, the actors, and the gaps — the things a
reader cannot get by opening the file themselves.

## Inventory Counting Rules

Every count is stated with its rule. A number without a counting rule cannot
be checked, cannot be reproduced on the next run, and will be compared against
a differently-counted number by somebody eventually.

Write each as: the figure, what was counted, what was excluded, and where the
list lives.

| Count | Counted as | Excluded |
|---|---|---|
| Domains | Top-level nodes of the tree | — |
| Features | Named features across all domains | Sub-features, actions |
| Sub-features | Level-three nodes | — |
| Actions | Distinct business operations | Helper methods, private functions |
| HTTP endpoints | Method plus path pairs | Health checks, static routes, framework-generated |
| GraphQL operations | Queries, mutations, subscriptions | Field resolvers |
| Event producers | Distinct topics or event types published | Each publish call site |
| Event consumers | Distinct handler bindings | — |
| Scheduled jobs | Registered schedules | Manually invoked tasks |
| Pages | Routed screens | Layouts, route groups, error boundaries |
| Components | Reusable components | Pages, one-off wrappers |
| Modules | Build or package units | Directories inside a module |
| Tables | Tables in the migration-derived schema | Views, join tables if stated |
| Integrations | Distinct external services | Each call site |

## Avoiding Double Counting

- One endpoint serving three features counts once as an endpoint, and is listed
  under all three features. The endpoint total and the per-feature totals do
  not have to add up, and the inventory says so.
- A path with a method per verb is one endpoint per method, not one per path.
- A feature exposed over both HTTP and a queue is one feature with two
  interfaces.
- A component rendered on many pages counts once.
- Generated CRUD counts as endpoints if it is reachable, and the rule says it
  was included.

## Reporting the Counts

`inventory.md` carries the statistics table, then the inventories behind it —
the endpoint list, the job list, the integration list — so each number can be
recounted by a reader. The index carries the table only.

Break every total down by domain or module. A single total of 240 endpoints
tells nobody anything; 240 across four modules, one holding 180, tells them
where the project actually is.

When a count is partial because the scope was narrow or the project too large
to read fully, say so next to the number. A count labeled complete that is not
is worse than no count: somebody will plan against it.

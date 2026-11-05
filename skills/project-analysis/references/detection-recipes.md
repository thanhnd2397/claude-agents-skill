# Detection Recipes

How to establish the technology stack, the data layer, the integrations, and
the commercial exposure from files rather than from familiarity. Used by the
technical phase of `project-analysis`.

## The Rule That Governs This File

A version is read from a file or it is `[Unknown]`. Nothing here is answered
from knowledge of what a framework usually ships with, what the current
release is, or what a version range probably resolves to.

This is the single most common failure in stack analysis: the agent sees
`spring-boot-starter-parent` and writes the version it remembers, or sees
`"react": "^18.2.0"` and reports React 18.2.0 when the lockfile pins 18.3.1.
The declared range and the resolved version are different facts with different
citations, and when they disagree the resolved one is what runs.

## Reading Order

1. **Manifests** — declared dependencies and the project's own version.
2. **Lockfiles** — resolved versions. These win over manifests.
3. **Toolchain pins** — `.nvmrc`, `.tool-versions`, `.python-version`,
   `rust-toolchain.toml`, `go.mod` go directive, `<java.version>`.
4. **Container and CI images** — the runtime version actually used to build
   and run, which often contradicts the pins above.
5. **Framework configuration** — what is switched on, not just installed.
6. **Source** — confirm a dependency is used, not merely declared.

Record the layer each version came from. "Java 21 from
`pom.xml:18`" and "Java 17 from `Dockerfile:1`" is a finding, not a conflict to
resolve silently — the build and the runtime disagree and somebody needs to
know.

## Version Extraction by Ecosystem

| Ecosystem | Declared | Resolved | Runtime pin |
|---|---|---|---|
| Node | `package.json` | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` | `.nvmrc`, `engines` |
| Java / Maven | `pom.xml`, parent POM properties | `mvn dependency:tree` output if committed | `<java.version>`, `maven.compiler.release` |
| Java / Gradle | `build.gradle`, `gradle.properties` | `gradle.lockfile` | `sourceCompatibility`, toolchain block |
| Python | `pyproject.toml`, `requirements.in`, `setup.py` | `poetry.lock`, `uv.lock`, pinned `requirements.txt` | `.python-version`, `requires-python` |
| Go | `go.mod` | `go.sum` | `go` directive |
| Rust | `Cargo.toml` | `Cargo.lock` | `rust-toolchain.toml` |
| .NET | `*.csproj`, `Directory.Packages.props` | `packages.lock.json` | `TargetFramework` |
| PHP | `composer.json` | `composer.lock` | `platform.php` |
| Ruby | `Gemfile`, `*.gemspec` | `Gemfile.lock` | `.ruby-version` |

A transitive dependency in a lockfile is not part of the stack. Report what the
project declares, plus anything transitive the source imports directly.

## What to Record per Technology

- Name, and the exact version with its citation.
- What it is for, in the words of this project rather than the library's.
- Where it is used — a module, or the whole project.
- Direct or transitive; required or optional.
- Configuration that changes its behavior materially.

Mark a declared dependency that nothing imports as `[Inferred]` unused, cite
the manifest line, and leave it in the list. It may be loaded by configuration,
by a plugin, or at runtime by name.

## Runtime and Infrastructure

Read, where present: `Dockerfile`, `docker-compose.yml`, `*.tf`,
`k8s/*.yaml` and Helm charts, `serverless.yml`, `Procfile`, `.ebextensions`,
CI workflow files, `*.service` units.

From these, establish the deployment target, the managed services the project
expects, and the hostnames and ports it binds. A cloud service named only in
Terraform is still part of the stack, and it belongs in
`dependencies-and-licenses.md` too.

## Data Stores and Access Layers

- **Schema** — migrations first, since they are ordered and dated; then ORM
  entities; then raw DDL. When migrations and entities disagree, migrations are
  what the database has.
- **Access layer** — the ORM or driver, its version, and whether the project
  also issues raw SQL. Both is common and worth recording.
- **Other stores** — cache, search, object storage, message broker, each with
  the client library and version.
- **Connection configuration** — record the environment variable names. Never
  a value, never a host that includes credentials.

Count tables and entities from one source and say which. Counting migrations
gives a different number from counting entity classes, and neither is wrong
until you claim it was the other.

## External Services and Integrations

Find them four ways, because no single way is complete:

1. Client libraries in the manifest (`stripe`, `@aws-sdk/*`, `twilio`).
2. Base URLs and hostnames in source and configuration.
3. Environment variable names containing a vendor name, `_KEY`, `_SECRET`,
   `_TOKEN`, `_URL`.
4. Webhook routes the project exposes for someone else to call.

For each: the service, what the project uses it for, where it is called from,
whether it is on the critical path, and what happens when it is unavailable.
That last one is usually `[Unknown]` and usually worth a question.

## Licensing and Commercial Exposure

For every dependency and external service, classify:

| Class | Meaning |
|---|---|
| `Open source` | A permissive or copyleft license, free to use as used here |
| `Source-available` | License restricts production or competing use (BSL, SSPL, Elastic, Confluent Community) |
| `Commercial` | Requires a purchased license or subscription |
| `Usage-based` | Free to install, billed by call, seat, or volume |
| `Needs verification` | Could not be established from the project |

Read the license from the project's own files where possible: a `LICENSE` file
in a vendored copy, the `license` field in a manifest, an SPDX header. A
manifest `license` field is the publisher's declaration, which is evidence of
the license but not of the terms — cite it and label `[Inferred]`.

Flag, specifically:

- Source-available licenses, which are frequently mistaken for open source.
- Enterprise or Pro editions and feature flags that imply a paid tier.
- Cloud and SaaS services, which bill whether or not the license is free.
- Commercial database drivers and reporting, mapping, or PDF components.
- Anything with a seat, call, or volume dimension.

Do not call a dependency paid because its vendor sells something. An
open-source core with a paid cloud offering is open source as used here, and
saying otherwise sends someone to renegotiate a contract that does not exist.
When the terms cannot be established from the project, `Needs verification` is
the answer, and pricing is looked up by a human, not guessed here.

Cost estimates are out of scope. This file establishes what the project
depends on and under what class of terms; what it costs depends on contracts
and volumes the code does not contain.

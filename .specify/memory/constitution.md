<!--
Sync Impact Report
Version change: 0.1.0 -> 0.2.0
Modified principles: (added) Lingua (Italiano obbligatorio)
Added sections: none
Removed sections: none
Templates requiring updates: .specify/templates/plan-template.md ✅ updated, .specify/templates/spec-template.md ✅ updated, .specify/templates/tasks-template.md ✅ updated
Follow-up TODOs: RATIFICATION_DATE (deferred)
-->

# Spindox Events App Constitution

<!-- Project: App eventi Spindox (a.k.a. `sp-polls`) -->

## Core Principles

### Server-side First (Server Components & Server Actions)

The application MUST prefer Next.js server components and server actions for all data-fetching,
authentication, authorization, AI calls, and evaluation logic. Client-side rendering is allowed only
for purely presentational concerns or when interactivity requires it. Rationale: moving logic and
secret-handling to the server reduces attack surface, enables secure use of Supabase service-role
credentials and Vercel AI Gateway keys, and prevents sensitive fields (e.g., correct_choice) from
ever reaching the browser.

### Security & Privacy (Server-side Evaluation & Least Privilege)

All sensitive logic MUST be executed server-side. The API MUST NEVER include the question's
correct_choice in responses to clients. Use Supabase RLS and role checks for all endpoints. Store
only the minimum personal data required (name, email, role) and provide an anonymization option
for answers when required. Implement rate-limiting and duplicate-submission protection (DB
constraints or server checks) to prevent replay or abuse.

### AI Usage & Auditability

AI-driven generation (question generation, suggestions) MUST be routed through the Vercel AI
Gateway and the approved AI SDK. All AI interactions MUST be auditable: store prompt inputs,
model metadata, timestamp, and non-sensitive response hashes. Audit logs MUST NOT expose
correct_choice or other sensitive evaluation data to public endpoints. AI usage SHOULD be
rate-limited and monitored; cost-sensitive safeguards MUST be in place.

### Test-First & Quality Gates (NON-NEGOTIABLE)

Critical flows (auth, event creation, question generation, answer submission, scoring) MUST have
tests (contract + integration) defined before implementation. Code MUST pass these gates before
merging: build (PASS), lint/typecheck (PASS), and automated tests (PASS). CI configuration
MUST fail the pipeline if any of these gates fail.

### Simplicity & Minimal Data Retention

Design choices MUST favour simple, auditable implementations. Avoid premature optimization and
complex developer ergonomics that increase risk. Persist only necessary fields; define clear
retention policies. Keep APIs small, explicit, and versioned.

### Lingua (Italiano obbligatorio)

All user-facing text MUST be written and published in Italian (it-IT). This requirement
applies to: UI labels and controls, error and validation messages shown to end users, all
public documentation (README, quickstart, specs in `/specs/`), user-facing emails and
notifications, public templates, marketing copy, and any content delivered to end users.

Rationale: The project operates for Italian-speaking stakeholders and users; mandating a single
language for end-user content ensures clarity, accessibility, and consistent user experience.

Rules and scope:

- MUST: Translate or author every string that is visible to end users in Italian before
  release. Generated content (including AI outputs) that will be user-visible MUST be produced
  in Italian or translated prior to shipping.
- MUST: Documentation and example flows in `/specs/`, `/docs/`, and `README.md` that are
  intended for users MUST be in Italian.
- SHOULD: When feasible, provide an English developer_summary or inline comment explaining
  non-user-facing rationale, but this is OPTIONAL for internal-only artifacts.
- MAY: Internal-only developer comments, CI logs, low-level debug output, or code identifiers
  may remain in English where that improves maintainability. Such internal English MUST NOT be
  exposed directly to end users without translation.

Enforcement: The Constitution Check in implementation plans and the project's CI/QA checklists
MUST include a language gate that verifies user-facing strings and public docs are Italian or
include a task to translate them before release.

## Operational Constraints

This project imposes the following operational constraints which are mandatory for feature
implementation and deployment:

- Technology stack: Next.js (App Router) v16, TypeScript, TailwindCSS v4, shadcn-ui components.
- Authentication and DB: Supabase (Auth + Postgres) with RLS; use Supabase client on server and
  service role for trusted server operations only.
- AI: Route requests via Vercel AI Gateway (VERCEL_AI_GATEWAY_KEY) and use the ai-sdk (#fetch
  model) on server-side handlers; optionally fall back to provider keys kept in server secrets.
- QR/link: Event URLs follow /e/[eventId] with optional ?qr=... param for QR-based access.
- Secrets: SUPABASE_SERVICE_ROLE_KEY and VERCEL_AI_GATEWAY_KEY MUST only be used on server
  runtime; never embed in client bundles.
- Evaluation: Answer scoring and is_correct computation MUST be performed server-side.

## Development Workflow & Quality Gates

Follow a test-first, incrementally deliverable workflow. Key rules:

- Feature specs MUST enumerate independent user stories prioritized (P1/P2/P3). Each story
  MUST be independently implementable and testable.
- Write failing contract and integration tests for each critical flow before implementation.
- Use the existing templates (`.specify/templates/plan-template.md`, `spec-template.md`,
  `tasks-template.md`) to define scope, tasks, and acceptance criteria. Verify the "Constitution
  Check" section in plan-template.md before Phase 0 completion.
- Code review: PRs implementing or changing core principles (security, AI, evaluation rules)
  REQUIRE an explicit approval from at least one maintainer with access to Supabase/infra.
- CI gates: build → lint/typecheck → tests. Any failure blocks merge.
- Local dev: use environment variables matching deployed secrets; do not commit secrets.

Development tools and patterns:

- Use React Hook Form + Zod for forms and validation.
- Prefer server components and server actions for data mutation and sensitive flows.
- Implement middleware (`middleware.ts`) to protect `/admin/*` routes and to enforce role checks.

## Governance

This Constitution defines mandatory constraints, not suggestions. Any deviation requires a
documented exception and an explicit approval from project maintainers. Amendment rules:

1. Minor clarifications and typo-fixes are PATCH changes (e.g., 0.1.0 → 0.1.1). These can be
   merged with a short description and a changelog entry.
2. Adding new principles or materially expanding guidance is a MINOR change (e.g., 0.1.0 →
   0.2.0). The amendment PR MUST include rationale and migration notes for templates and
   checklists impacted by the change.
3. Removing or re-defining existing principles in a backward-incompatible way is a MAJOR
   change (e.g., 0.1.0 → 1.0.0) and MUST be voted on by maintainers; include a migration plan.

Amendment procedure:

- Create a PR that updates `.specify/memory/constitution.md` and include a Sync Impact Report
  (see example at the top of this file). The PR MUST reference templates and commands that need
  updates, and include tests or checklist items to validate compliance.
- The PR MUST be reviewed by at least two maintainers. For MAJOR changes, require consensus or a
  documented approval process.
- On merge, update the version line below. Update any `.specify/templates/*` files that
  reference the changed principles.

Compliance review expectations:

- Each plan generated with `/speckit.plan` MUST perform the "Constitution Check" and surface any
  gates that are not satisfied. The plan author MUST either address the gates or document
  approved exceptions.

**Version**: 0.2.0 | **Ratified**: TODO(RATIFICATION_DATE): "Date of initial ratification unknown - please set" | **Last Amended**: 2025-11-01

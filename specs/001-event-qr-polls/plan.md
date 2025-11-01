# Implementation Plan: Event QR Polls

**Branch**: `001-event-qr-polls` | **Date**: 2025-10-31 | **Spec**: `specs/001-event-qr-polls/spec.md`
**Input**: Feature specification from `/specs/001-event-qr-polls/spec.md`

## Summary

Implement the Event QR Polls feature: admin-managed events with AI-generated multiple-choice
questions (exactly 4 per event), QR-based public access to `/e/[eventId]`, Supabase Auth for
users, server-side scoring (is_correct) and AI audit logging. Use Next.js (App Router) server
components/server actions for sensitive flows; persist data in Supabase Postgres with RLS.

## Technical Context

**Language/Version**: TypeScript (Node.js runtime used by Next.js App Router; exact Node version
pinned in project package.json)  
**Primary Dependencies**: Next.js 16 (App Router), TailwindCSS v4, shadcn-ui, React Hook Form,
Zod v4, Supabase JS client, ai-sdk (for #fetch via Vercel AI Gateway).  
**Storage**: PostgreSQL via Supabase (managed).  
**Testing**: Recommend Jest + React Testing Library for unit/components, Playwright for E2E,
and a contract test suite (supertest or similar) for API responses.  
**Target Platform**: Vercel (serverless/edge runtime) or compatible Node hosting.  
**Project Type**: Web application (frontend + server handlers inside Next.js App Router).  
**Performance Goals**: Low-latency (<300ms p95) for basic page loads; AI generation is async and
rate-limited (no strict SLA).  
**Constraints**: Secrets (SUPABASE_SERVICE_ROLE_KEY, VERCEL_AI_GATEWAY_KEY) available only in server
runtime; RLS policies enforced; AI costs limited by rate-limiting and admin confirmation.  
**Scale/Scope**: MVP sized for event-room scale (tens to hundreds of attendees per event).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The plan author MUST verify and document each item below. Any failure must be accompanied by an
approved exception or a remediation task.

- [ ] Server-side First: designates AI generation, scoring, and secret handling as server-side
      components or server actions.
- [ ] Secrets & Keys: SUPABASE_SERVICE_ROLE_KEY and VERCEL_AI_GATEWAY_KEY use is limited to server
      runtime; no client exposure.
- [ ] Supabase RLS: RLS policies or server-side checks are planned to enforce admin/user roles.
- [ ] AI Auditability: AI prompts, model metadata, response hash and timestamp are logged in an
      `ai_audit` store; plan includes retention and access controls.
- [ ] No sensitive fields to client: `correct_choice` will NOT be returned in any client-facing
      payload; contract tests will assert this.
- [ ] Test-First: Contract and integration tests for critical flows (question payloads, answer
      submission/scoring, admin generation) are defined and scheduled before implementation.
- [ ] Rate-limiting & duplicate protection: plan includes rate-limiting for AI endpoints and a DB
      constraint or server logic to prevent duplicate answers per (user, question).
- [ ] CI gates: build → lint/typecheck → tests must be enforced in CI before merge.

Document pass/fail and any follow-up tasks in this plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-event-qr-polls/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/
├── web/                 # Next.js app (app/ folder in repo)
  ├── app/
  └── components/
packages/
└── services/            # optional backend services or utilities

tests/
├── contract/
├── integration/
└── e2e/
```

**Structure Decision**: Use the existing Next.js App Router in `app/` (project already contains
`app/` folder). Place server actions and route handlers within `app/api/` or `app/(admin)/...` as
appropriate. Tests live under `tests/` with contract and integration subdivisions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

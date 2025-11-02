# Implementation Plan: Event Aggregates Page

**Branch**: `001-event-aggregates` | **Date**: 2 novembre 2025 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-event-aggregates/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create an aggregates page at /events/[eventId]/aggregates to display all user answers for event questions, grouped by user, with ability to mark answers as correct or incorrect. Remove status property from Event type and update all related code and mock data.

## Technical Context

**Language/Version**: TypeScript, Next.js 14+ with App Router + React 18+  
**Primary Dependencies**: Next.js 14+, TailwindCSS, shadcn-ui, Supabase client  
**Storage**: Supabase (PostgreSQL with RLS)  
**Testing**: Jest, Playwright  
**Target Platform**: Web application  
**Project Type**: Web application  
**Performance Goals**: Standard web app expectations (under 3 seconds load time)  
**Constraints**: Server-side first, security, AI auditability, user-facing text in Italian  
**Scale/Scope**: Events with questions and answers, up to 1000 answers per event

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The plan author MUST verify the following gates against the project Constitution
and document any approved exceptions. At minimum include:

- Security & Privacy gate: Server-side evaluation for marking correctness, RLS for data access, no sensitive data exposed to client. PASSED.
- AI & Auditability gate: No AI usage in this feature. PASSED.
- Language gate: User-facing text on aggregates page must be in Italian. Include translation task in deliverables. PASSED (with task).

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-event-aggregates/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (admin)/
│   └── events/
│       └── [id]/
│           └── aggregates.tsx  # New aggregates page
├── api/
│   └── events/
│       └── [id]/
│           └── aggregates/     # New API route for aggregates data
│               └── route.ts
lib/
├── types.ts                   # Update Event type, add correctness to Answer
└── actions/
    └── mark-answer-correctness.ts  # New server action for marking
mock/
├── answers.json               # Update to include correctness
└── events.json                # Remove status from events
components/
└── admin-event-aggregates.tsx # New component for aggregates display
```

**Structure Decision**: Web application structure using Next.js App Router. New aggregates page in admin section, API route for data, server action for marking, updates to types and mocks.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

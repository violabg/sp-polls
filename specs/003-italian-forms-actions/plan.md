# Implementation Plan: Forms with Server Actions & Optimistic Updates

**Branch**: `003-italian-forms-actions` | **Date**: 2025-11-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-italian-forms-actions/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement server actions for form submissions in the Next.js application, including a 2-second delay for simulation, useActionState for state management, optimistic updates with useOptimistic, and loading indicators. This enhances form handling with modern React patterns for better user experience and server-side processing.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript, Next.js 14+ with App Router  
**Primary Dependencies**: React 18+, Next.js 14+, TailwindCSS, shadcn-ui, Supabase client  
**Storage**: Supabase (PostgreSQL with RLS)  
**Testing**: Jest (unit), Playwright (e2e), custom contract tests  
**Target Platform**: Web browsers (modern)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Form submission response within 2 seconds (simulated), loading indicator appears within 100ms, disappears within 500ms after completion  
**Constraints**: Server-side first for data operations, no sensitive data in client, use server actions for mutations  
**Scale/Scope**: Small web application for event management and polls, supporting multiple users and events

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The plan author MUST verify the following gates against the project Constitution
and document any approved exceptions. At minimum include:

- Security & Privacy gate: Server actions ensure data processing and mutations occur server-side, preventing exposure of sensitive logic or data to the client. RLS and role checks are maintained. No violations.
- AI & Auditability gate: This feature does not involve AI-driven content generation. No AI interactions required. No violations.
- Language gate (NEW): The feature modifies existing form handling but does not introduce new user-facing text strings. Existing UI text is assumed to be already in Italian per project standards. No new translation tasks required. No violations.

All gates pass. No violations or exceptions needed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│       └── new/
│           └── page.tsx          # Event creation form (server action)
├── (public)/
│   └── e/
│       └── [eventId]/
│           └── page.tsx          # Answer submission form (server action)
├── api/
│   └── events/
│       └── [id]/
│           └── answers/
│               └── route.ts      # Existing API, may need updates
components/
├── admin-event-card.tsx
├── login-form.tsx
└── ui/                         # shadcn components
lib/
├── auth.ts
├── types.ts
├── utils.ts
└── forms/                      # Form validation schemas
```

**Structure Decision**: Single Next.js application with App Router structure. Forms are located in page components under admin and public routes. Server actions will be defined in the same files or separate action files. Existing API routes may be refactored to use server actions where appropriate.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

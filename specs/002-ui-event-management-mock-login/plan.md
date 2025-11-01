# Implementation Plan: UI Event Management and Mock Login

**Branch**: `002-ui-event-management-mock-login` | **Date**: 2025-11-01 | **Spec**: specs/002-ui-event-management-mock-login/spec.md
**Input**: Feature specification from `/specs/002-ui-event-management-mock-login/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature enhances the user interface by replacing applicable HTML divs with Shadcn components, adds pages for creating and editing events using Shadcn field components, and implements mock login functionality for admin and user roles. Technical approach uses Next.js client components with Shadcn/ui for forms and routing.

## Technical Context

**Language/Version**: TypeScript  
**Primary Dependencies**: Next.js 14+, Shadcn/ui, TailwindCSS  
**Storage**: Mock JSON files (no database changes)  
**Testing**: Jest + Playwright (existing setup)  
**Target Platform**: Web browser  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Standard web app responsiveness (<100ms page loads)  
**Constraints**: Client-side routing, no server-side logic changes  
**Scale/Scope**: 3 new pages, 1 updated component

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Server-side First: PASS - No new server logic added, existing patterns maintained
- Security & Privacy: PASS - Mock login, no real auth or data exposure
- AI Usage & Auditability: PASS - No AI features added
- Test-First & Quality Gates: PASS - No new critical flows requiring tests
- Simplicity & Minimal Data Retention: PASS - Uses existing data structures, no new persistence

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-event-management-mock-login/
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
│   ├── events/
│   │   ├── new/
│   │   │   └── page.tsx    # NEW: Event creation form
│   │   └── [id]/
│   │       ├── edit/
│   │       │   └── page.tsx    # NEW: Event editing form
│   │       └── page.tsx
│   └── layout.tsx
├── (public)/
│   └── e/
│       └── [eventId]/
│           └── page.tsx
├── components/
│   ├── login-form.tsx    # UPDATED: Added mock login buttons
│   └── ui/               # EXISTING: Shadcn components
├── globals.css
├── layout.tsx
└── page.tsx

lib/
├── types.ts             # EXISTING: Event and User interfaces
└── utils.ts

mock/
└── events.json          # EXISTING: Mock event data
```

**Structure Decision**: Web application using Next.js App Router structure. New pages added under (admin)/events/ following existing patterns. Components updated in place.

## Complexity Tracking

No violations - feature follows existing patterns and constitution principles.

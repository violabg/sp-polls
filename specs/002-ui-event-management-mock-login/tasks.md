# Tasks: UI Event Management and Mock Login

**Input**: Design documents from `/specs/002-ui-event-management-mock-login/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included - tests not requested in feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app: `app/` for pages, `components/` for components, `lib/` for utilities
- Paths follow Next.js App Router structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project setup and dependencies for the feature

- [x] T001 Verify Shadcn/ui components are installed and available in components/ui/
- [x] T002 Confirm Next.js App Router structure supports new routes
- [x] T003 Ensure TypeScript types are available in lib/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Confirm mock data structure in mock/events.json supports event operations
- [x] T005 Verify existing routing patterns in app/(admin)/ and app/(public)/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Admin Mock Login (Priority: P1) 🎯 MVP

**Goal**: Enable admin users to quickly access the events management page via mock login button

**Independent Test**: Click "Login as Admin" button in login form redirects to /events page

### Implementation for User Story 1

- [x] T006 [US1] Add 'use client' directive to components/login-form.tsx for client-side navigation
- [x] T007 [US1] Import useRouter from next/navigation in components/login-form.tsx
- [x] T008 [US1] Add mock admin login button with onClick handler in components/login-form.tsx
- [x] T009 [US1] Implement router.push('/events') for admin button click

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Mock Login (Priority: P2)

**Goal**: Enable regular users to quickly access event participation via mock login button

**Independent Test**: Click "Login as User" button in login form redirects to /e/event-001 page

### Implementation for User Story 2

- [x] T010 [US2] Add mock user login button with onClick handler in components/login-form.tsx
- [x] T011 [US2] Implement router.push('/e/event-001') for user button click

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Create New Event (Priority: P3)

**Goal**: Allow admin users to create new events through a dedicated form page

**Independent Test**: Navigate to /events/new, fill out form with title, description, status, submit successfully and redirect to /events

### Implementation for User Story 3

- [x] T012 [US3] Create new page file at app/(admin)/events/new/page.tsx
- [x] T013 [US3] Add 'use client' directive and imports for Shadcn components in new page
- [x] T014 [US3] Implement form state management with useState for title, description, status
- [x] T015 [US3] Create form UI with Shadcn Field components for title input
- [x] T016 [US3] Add Shadcn Field components for description textarea
- [x] T017 [US3] Add Shadcn Field components for status select dropdown
- [x] T018 [US3] Implement form submission handler with router navigation
- [x] T019 [US3] Add form validation for required title field

**Checkpoint**: At this point, User Story 3 should be independently functional

---

## Phase 6: User Story 4 - Edit Event (Priority: P4)

**Goal**: Allow admin users to edit existing events through a dedicated form page

**Independent Test**: Navigate to /events/{id}/edit, modify form fields, submit successfully and redirect to /events

### Implementation for User Story 4

- [x] T020 [US4] Create new page file at app/(admin)/events/[id]/edit/page.tsx
- [x] T021 [US4] Add 'use client' directive and imports for Shadcn components in edit page
- [x] T022 [US4] Implement form state management with useState for title, description, status
- [x] T023 [US4] Add mock data loading for existing event details
- [x] T024 [US4] Create form UI with Shadcn Field components for title input (pre-filled)
- [x] T025 [US4] Add Shadcn Field components for description textarea (pre-filled)
- [x] T026 [US4] Add Shadcn Field components for status select dropdown (pre-filled)
- [x] T027 [US4] Implement form submission handler with router navigation
- [x] T028 [US4] Add form validation for required title field

**Checkpoint**: At this point, User Story 4 should be independently functional

---

## Phase 7: User Story 5 - UI Components Enhancement (Priority: P5)

**Goal**: Ensure consistent use of Shadcn components throughout the application

**Independent Test**: All form elements use Shadcn Field, Button, Input, Textarea, Select components

### Implementation for User Story 5

- [x] T029 [US5] Verify existing components in components/login-form.tsx use Shadcn components
- [x] T030 [US5] Verify new pages use Shadcn Field components consistently
- [x] T031 [US5] Ensure all buttons use Shadcn Button component
- [x] T032 [US5] Ensure all form inputs use Shadcn Input/Textarea components

**Checkpoint**: All user stories should now be independently functional with consistent UI

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and documentation updates

- [x] T033 Update docs/quickstart.md with new event management workflows
- [x] T034 Update docs/quickstart.md with mock login instructions
- [x] T035 Verify all new pages follow existing code style and patterns
- [x] T036 Test navigation flow between all new pages
- [x] T037 Ensure responsive design works on new pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Shares login-form.tsx with US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Depends on completion of US1-US4

### Within Each User Story

- Form setup before UI components
- State management before form handlers
- Validation after basic functionality
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1, 3, 4 can start in parallel
- User Story 2 depends on US1 completion (shared file)
- User Story 5 depends on all other stories
- Within stories, tasks can be parallelized where marked [P]

---

## Parallel Example: User Stories 3 and 4

```bash
# Launch User Stories 3 and 4 in parallel (different files):
Task: "Create new page file at app/(admin)/events/new/page.tsx"
Task: "Create new page file at app/(admin)/events/[id]/edit/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 & 2 (login form updates)
   - Developer B: User Story 3 (new event page)
   - Developer C: User Story 4 (edit event page)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

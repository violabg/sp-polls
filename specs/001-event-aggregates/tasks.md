# Tasks: Event Aggregates Page

**Input**: Design documents from `/specs/001-event-aggregates/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not requested in feature specification, so excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app: app/, api/, lib/, components/, mock/ at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Update database schema for answers and events tables
- [x] T002 Update TypeScript type definitions in lib/types.ts
- [x] T003 Update mock data files in mock/ directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Verify database schema changes are applied
- [x] T005 Verify type definitions compile without errors
- [x] T006 Verify mock data is consistent with new types

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Event Answer Aggregates (Priority: P1) 🎯 MVP

**Goal**: Display all answers for an event's questions grouped by user

**Independent Test**: Navigate to /admin/events/[eventId]/aggregates and verify answers are shown grouped by user

### Implementation for User Story 1

- [x] T007 [US1] Create aggregates API route at app/api/events/[id]/aggregates/route.ts
- [x] T008 [US1] Create aggregates page component at app/(admin)/events/[id]/aggregates/page.tsx
- [x] T009 [US1] Create aggregates display component at components/admin-event-aggregates.tsx
- [x] T010 [US1] Add navigation link to aggregates page from event admin page

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 3 - Mark Answer Correctness (Priority: P1)

**Goal**: Allow marking each answer as correct or incorrect on the aggregates page

**Independent Test**: On aggregates page, mark answers and verify marks are saved and displayed

### Implementation for User Story 3

- [ ] T011 [US3] Create server action for marking correctness at lib/actions/mark-answer-correctness.ts
- [ ] T012 [US3] Add correctness toggle UI to aggregates display component
- [ ] T013 [US3] Update aggregates API to include correctness status
- [ ] T014 [US3] Add visual indicators for correctness status in UI

**Checkpoint**: At this point, User Stories 1 AND 3 should both work independently

---

## Phase 5: User Story 2 - Remove Event Status Property (Priority: P2)

**Goal**: Remove status property from event data structure and update all references

**Independent Test**: Verify event objects no longer have status property and code compiles

### Implementation for User Story 2

- [ ] T015 [US2] Remove status property from Event type in lib/types.ts
- [ ] T016 [US2] Update all event-related components to remove status references
- [ ] T017 [US2] Update mock events data to exclude status field
- [ ] T018 [US2] Verify no compilation errors after status removal

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Documentation updates in docs/
- [ ] T020 Code cleanup and refactoring
- [ ] T021 Performance optimization for aggregates loading
- [ ] T022 Security review of server actions
- [ ] T023 Run quickstart.md validation
- [ ] T024 Verify user-facing texts are written in Italian (it-IT)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after User Story 1 completion - Depends on aggregates display
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1 and 2 can start in parallel
- User Story 3 depends on User Story 1 completion
- All polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all implementation tasks for User Story 1 together:
Task: "Create aggregates API route at app/api/events/[id]/aggregates/route.ts"
Task: "Create aggregates page component at app/(admin)/events/[id]/aggregates/page.tsx"
Task: "Create aggregates display component at components/admin-event-aggregates.tsx"
Task: "Add navigation link to aggregates page from event admin page"
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
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 2 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Stories complete and integrate independently
4. Developer C: User Story 3 (after US1)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

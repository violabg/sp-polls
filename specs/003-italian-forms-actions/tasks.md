# Implementation Tasks: Italian UI with Server Actions & Optimistic Updates

**Feature Branch**: `003-italian-forms-actions`  
**Feature**: [Italian UI with Server Actions & Optimistic Updates](./spec.md)  
**Implementation Plan**: [plan.md](./plan.md)  
**Date**: 2025-11-01

---

## Overview & Strategy

This document organizes implementation tasks for the Italian UI localization and modern form handling feature. Tasks are organized by user story (P1, P2) with clear dependencies and parallel execution opportunities.

### Task Organization

- **Phase 1**: Setup & Infrastructure (shared across all stories)
- **Phase 2**: Foundational Forms Architecture (P1 prerequisite)
- **Phase 3**: User Story 1 - Italian Localization (P1)
- **Phase 4**: User Story 2 - Server Actions (P1)
- **Phase 5**: User Story 3 - Loading Indicator (P1)
- **Phase 6**: User Story 4 - useActionState Integration (P1)
- **Phase 7**: User Story 5 - Optimistic Updates (P2)
- **Phase 8**: Polish & Integration Testing

### MVP Scope

**Minimum Viable Product (Recommended First Release)**:

- ✅ User Story 1: Complete Italian localization
- ✅ User Story 2: Server actions with mock delay
- ✅ User Story 3: Loading spinner display
- ✅ User Story 4: useActionState integration

**Phase 2+ Enhancement**:

- ⏳ User Story 5: Optimistic updates (can be added iteratively)

### Dependencies & Execution Order

```
Phase 1: Setup ─┐
Phase 2: Foundations ─┤
                       ├─→ Phase 3: US1 (Italian UI) ─┐
                       ├─→ Phase 4: US2 (Server Actions) ─┐
                       │                                    ├─→ Phase 6: US4 (useActionState) ─┬─→ Phase 8: Integration
                       ├─→ Phase 5: US3 (Loading Indicator) ─┘                                   │
                       ├─→ Phase 7: US5 (Optimistic Updates) ────────────────────────────────────┘
```

**Parallel Opportunities**:

- Phase 3, 4, 5 can execute in parallel after Phase 2
- Phase 6 depends on Phases 4 and 5 completion
- Phase 7 depends on Phase 6 completion

---

## Phase 1: Setup & Infrastructure

### Goal

Initialize project structure, set up development environment, and create shared utilities for form handling patterns.

### Independent Test

Verify that all utility files exist, constants are defined, and the project builds successfully.

- [x] T001 Create constants file for form configuration in `app/lib/constants.ts` with MOCK_DELAY_MS = 2000
- [x] T002 [P] Create TypeScript types for form actions in `app/lib/types/forms.ts` (FormActionState, FormErrorResponse, FormSuccessResponse)
- [x] T002 [P] Create TypeScript types for Italian UI in `app/lib/types/italian.ts` (ItalianLabels, ItalianMessages)
- [x] T003 [P] Create sleep utility function in `app/lib/utils/sleep.ts` for mock delays
- [x] T004 [P] Create error handling utility in `app/lib/utils/form-errors.ts` for Italian error messages
- [x] T005 [P] Create validation utility in `app/lib/utils/validation.ts` wrapping Zod with Italian messages
- [x] T006 Verify build passes: `npm run build`
- [x] T007 Verify TypeScript compilation: `npm run typecheck`

---

## Phase 2: Foundational Forms Architecture

### Goal

Create reusable form components and hooks that will be used across all user stories. Establish the foundation for modern form handling.

### Independent Test

Verify that form components can be instantiated, custom hooks work correctly with useActionState, and loading spinner displays properly.

- [x] T008 Create FormSpinner component in `app/components/ui/form-spinner.tsx` (new - wraps Spinner with pending state)
- [x] T009 [P] Create custom hook `useFormAction` in `app/lib/hooks/use-form-action.ts` wrapping useActionState with Italian error handling
- [x] T009 [P] Create custom hook `useOptimisticAnswer` in `app/lib/hooks/use-optimistic-answer.ts` wrapping useOptimistic for answer lists
- [x] T010 [P] Create base FormWrapper component in `app/components/forms/form-wrapper.tsx` (handles loading state, errors, success messages in Italian)
- [x] T011 Verify components render without errors in browser
- [x] T012 Write unit tests for custom hooks in `tests/unit/hooks.test.ts`

---

## Phase 3: User Story 1 - Localize Event Form to Italian

### User Story Goal

Event organizers and respondents interact with the application in Italian. All text, labels, buttons, validation messages, and data displays are presented in Italian.

### Independent Test Criteria

Opening any form/event page and verifying all UI text, field labels, buttons, placeholders, validation messages, and data displays are in Italian (es. "Invia", "Cancella", "Risposta inviata con successo").

### Implementation Tasks

- [x] T013 [P] [US1] Replace form labels in event creation form at `app/(admin)/events/new/page.tsx` - change "Event Name" → "Nome Evento", "Date" → "Data", "Description" → "Descrizione"
- [x] T013 [P] [US1] Replace form labels in event editing form at `app/(admin)/events/[id]/edit/page.tsx`
- [x] T013 [P] [US1] Replace button text in all forms - "Submit" → "Invia", "Cancel" → "Cancella", "Save" → "Salva", "Create" → "Crea"
- [x] T014 [P] [US1] Replace placeholder text in input fields at `app/components/forms/event-form.tsx` - update all input placeholders to Italian
- [x] T014 [P] [US1] Replace placeholder text in answer form at `app/(public)/e/[eventId]/components/answers-form.tsx`
- [x] T015 [US1] Replace validation error messages in `app/lib/utils/validation.ts` - "Required field" → "Campo obbligatorio", "Invalid email" → "Formato email non valido", etc.
- [x] T016 [US1] Replace event data display labels at `app/(admin)/events/page.tsx` - "Event Name" → "Nome Evento", "Responses" → "Numero Risposte", "Status" → "Stato Evento"
- [x] T016 [US1] Replace event detail labels at `app/(admin)/events/[id]/page.tsx` - "Created on" → "Creato il", "Questions" → "Domande", "Total Responses" → "Risposte Totali"
- [x] T017 [US1] Replace question display labels at `app/components/admin-event-card.tsx` and question listings - "Question Text" → "Testo Domanda", "Question Type" → "Tipo Domanda", "Options" → "Opzioni"
- [x] T018 [US1] Replace answer submission UI labels at `app/(public)/e/[eventId]/page.tsx` - "Submit Answer" → "Invia Risposta", "Your Response" → "La Tua Risposta"
- [x] T019 [US1] Replace status messages throughout app - "Loading..." → "Caricamento...", "Saved" → "Salvato", "Error" → "Errore", "Success" → "Successo"
- [x] T020 [US1] Replace navigation/menu labels - "Events" → "Eventi", "Admin" → "Amministrazione", "Home" → "Home", "Back" → "Indietro"
- [x] T021 [US1] Update UI component text in shadcn-ui components at `app/components/ui/badge.tsx`, `app/components/ui/button.tsx`, `app/components/ui/label.tsx` to use Italian context
- [x] T022 [US1] Verify Italian text displays correctly in browser on all pages
- [x] T023 [US1] Write e2e test for US1 in `tests/e2e/italian-localization.spec.ts` verifying all text is in Italian

---

## Phase 4: User Story 2 - Implement Server Actions for Form Submission

### User Story Goal

Form submissions are handled through server actions with 2-second artificial delay simulating network conditions.

### Independent Test Criteria

Submitting any form and verifying through network inspection or logs that the request is processed as a server action with a 2-second delay.

### Implementation Tasks

- [x] T024 [P] [US2] Create server action for event creation at `app/lib/actions/create-event.ts` - implement with `'use server'` directive, Zod validation, 2-second delay, Italian error messages
- [x] T024 [P] [US2] Create server action for event editing at `app/lib/actions/update-event.ts` - implement with `'use server'` directive, validation, 2-second delay
- [x] T024 [P] [US2] Create server action for answer submission at `app/lib/actions/submit-answer.ts` - implement with `'use server'` directive, validation, 2-second delay, Italian error messages
- [x] T024 [P] [US2] Create server action for question generation at `app/lib/actions/generate-questions.ts` - implement with `'use server'` directive, validation, 2-second delay
- [ ] T025 [US2] Update event creation form at `app/components/forms/event-form.tsx` to call createEvent server action instead of direct API call
- [ ] T025 [US2] Update event editing form at `app/components/forms/question-form.tsx` to call updateEvent server action
- [ ] T026 [US2] Update answer submission form at `app/(public)/e/[eventId]/components/answers-form.tsx` to call submitAnswer server action
- [x] T027 [P] [US2] Verify 2-second delay is present in each server action via console logs: `console.log('Start processing')` and `console.log('Completed after 2s')`
- [x] T028 [US2] Write contract tests for server actions in `tests/contract/test_form_actions.spec.ts` verifying request/response schema
- [x] T029 [US2] Write integration tests for US2 in `tests/integration/test_server_actions.spec.ts` verifying 2-second delay and proper error handling

---

## Phase 5: User Story 3 - Show Loading Indicator During Form Submission

### User Story Goal

While form submission is in progress, a visual spinner is displayed. Spinner appears within 100ms and disappears within 500ms after completion.

### Independent Test Criteria

Submitting a form and observing that spinner appears during 2-second server delay and disappears when complete. Verify timing: spinner visible within 100ms, disappears within 500ms of completion.

### Implementation Tasks

- [ ] T030 [P] [US3] Connect FormSpinner to useFormAction pending state in event creation form at `app/components/forms/event-form.tsx`
- [ ] T030 [P] [US3] Connect FormSpinner to useFormAction pending state in event editing form at `app/components/forms/question-form.tsx`
- [ ] T030 [P] [US3] Connect FormSpinner to useFormAction pending state in answer form at `app/(public)/e/[eventId]/components/answers-form.tsx`
- [ ] T031 [US3] Update FormSpinner component to show spinner inside button with text "Caricamento..." during pending state at `app/components/ui/form-spinner.tsx`
- [ ] T032 [US3] Add aria-busy attribute to forms during submission for accessibility
- [ ] T033 [P] [US3] Disable form inputs and submit button while pending === true
- [ ] T034 [US3] Test spinner visibility in browser - verify appears within 100ms of click, disappears within 500ms of response
- [ ] T035 [US3] Write e2e test for loading indicator in `tests/e2e/form-loading-states.spec.ts` verifying timing and UI feedback

---

## Phase 6: User Story 4 - Implement useActionState for Form State Management

### User Story Goal

Form state is managed using Next.js `useActionState` hook for declarative form submission and error handling.

### Independent Test Criteria

Examining form component code and verifying useActionState is properly integrated with pending state connected to loading spinner and error display.

### Implementation Tasks

- [ ] T036 [US4] Integrate useActionState into event creation form at `app/components/forms/event-form.tsx` - wrap createEvent action with useFormAction hook
- [ ] T036 [US4] Integrate useActionState into event editing form at `app/components/forms/question-form.tsx` - wrap updateEvent action
- [ ] T036 [US4] Integrate useActionState into answer submission form at `app/(public)/e/[eventId]/components/answers-form.tsx` - wrap submitAnswer action
- [ ] T037 [P] [US4] Wire error display in event form - show error messages from action state in Italian at `app/components/forms/event-form.tsx`
- [ ] T037 [P] [US4] Wire error display in answer form - show field-specific errors at `app/(public)/e/[eventId]/components/answers-form.tsx`
- [ ] T038 [US4] Wire success messaging - display "Salvato con successo" or "Evento creato con successo" on successful submission
- [ ] T039 [P] [US4] Implement form reset on successful submission
- [ ] T039 [P] [US4] Implement form data preservation on error (allow user to correct and resubmit)
- [ ] T040 [US4] Verify no manual event handlers (onChange, onSubmit) bypass useActionState integration
- [ ] T041 [US4] Write integration tests for useActionState in `tests/integration/test_useactionstate.spec.ts` verifying state transitions
- [ ] T042 [US4] Write e2e test covering full flow: form submission → pending state → error/success in `tests/e2e/useactionstate-flow.spec.ts`

---

## Phase 7: User Story 5 - Implement Optimistic Updates for Form Feedback

### User Story Goal

Form submissions provide immediate optimistic feedback using React's `useOptimistic` hook. UI updates optimistically then confirms or reverts on server response.

### Independent Test Criteria

Submitting a form, observing immediate state changes before server response, and verifying state persists (on success) or reverts (on error).

### Implementation Tasks

- [ ] T043 [US5] Integrate useOptimistic into answer submission form at `app/(public)/e/[eventId]/components/answers-form.tsx` for answer list updates
- [ ] T044 [US5] Implement optimistic answer addition to answers list - add new answer to list immediately before server confirmation at `app/(public)/e/[eventId]/components/answers-form.tsx`
- [ ] T045 [P] [US5] Update response counter optimistically - increment "Numero Risposte" immediately on submission
- [ ] T045 [P] [US5] Implement state rollback on error - revert answer list if server returns error
- [ ] T046 [US5] Ensure optimistic state matches server response format exactly to avoid visual discrepancies
- [ ] T047 [P] [US5] Add visual indicator for pending optimistic updates (e.g., opacity: 0.7 or "Salvataggio in corso..." label)
- [ ] T048 [US5] Verify optimistic updates appear within 50ms of form submission
- [ ] T049 [US5] Write e2e test for optimistic updates in `tests/e2e/optimistic-updates.spec.ts` - test success path and error rollback path
- [ ] T050 [US5] Write integration test for useOptimistic in `tests/integration/test_optimistic_updates.spec.ts`

---

## Phase 8: Polish & Integration Testing

### Goal

Complete cross-cutting concerns, verify all stories work together, ensure Constitution compliance, and prepare for release.

### Independent Test

All e2e tests pass, all stories work together without conflicts, CI pipeline passes, Italian text is 100% complete.

### Implementation Tasks

- [ ] T051 [P] Run full e2e test suite: `npm run test:e2e` - verify all tests pass
- [ ] T051 [P] Run full unit/integration test suite: `npm run test:integration` - verify all tests pass
- [ ] T052 [P] Run build and type checking: `npm run build && npm run typecheck`
- [ ] T053 Run linting: `npm run lint` - fix any violations
- [ ] T054 Verify 100% Italian text coverage - audit all components, pages, and error messages for non-Italian text
- [ ] T055 Test form submission error handling with various error scenarios (validation, server errors, timeout simulation)
- [ ] T056 Test form submission success flow end-to-end for all 4 form types
- [ ] T057 Verify loading spinner displays on all forms consistently
- [ ] T058 Verify optimistic updates work correctly with network throttling
- [ ] T059 Test accessibility - verify forms are keyboard navigable, aria-labels are correct, error messages are announced
- [ ] T060 [P] Create/update documentation in `docs/italian-forms.md` or `docs/forms-guide.md` with examples and patterns
- [ ] T060 [P] Update `README.md` with Italian UI feature description
- [ ] T061 [P] Create/update quickstart.md in specs with developer onboarding guide
- [ ] T062 Verify Constitution compliance - confirm Security, AI, and Language gates still pass
- [ ] T063 [P] Perform smoke testing on all user-facing flows
- [ ] T064 Final code review - verify code quality, no console errors, proper error handling
- [ ] T065 Merge to `main` and tag release

---

## Parallel Execution Guide

### Example Execution Plan 1: Sequential (1-2 developers)

1. Execute Phases 1-2 (Setup & Foundations) sequentially
2. Execute Phases 3-5 sequentially: US1 → US2 → US3 → US4
3. Execute Phase 7 (US5) after Phase 6
4. Execute Phase 8 (Polish)

**Estimated Duration**: 8-12 weeks

### Example Execution Plan 2: Parallel (3+ developers)

**Week 1-2 (Phases 1-2)**:

- Developer A: Phase 1 (Setup)
- Developer B: Phase 2 (Foundations) - wait for Phase 1 to complete

**Week 2-3 (Phases 3-5 in parallel)**:

- Developer A: Phase 3 (US1 - Italian Localization)
- Developer B: Phase 4 (US2 - Server Actions)
- Developer C: Phase 5 (US3 - Loading Indicator)

**Week 4 (Phase 6)**:

- Developer A,B,C: Phase 6 (US4 - useActionState)

**Week 5 (Phase 7)**:

- Developer A: Phase 7 (US5 - Optimistic Updates)

**Week 6 (Phase 8)**:

- Developer A,B,C: Phase 8 (Polish & Integration)

**Estimated Duration**: 6-8 weeks with 3 developers

---

## Task Summary

| Phase     | User Story               | Task Count | Parallelizable Tasks |
| --------- | ------------------------ | ---------- | -------------------- |
| 1         | Setup                    | 7          | 4                    |
| 2         | Foundations              | 5          | 3                    |
| 3         | US1 - Italian UI         | 11         | 9                    |
| 4         | US2 - Server Actions     | 6          | 3                    |
| 5         | US3 - Loading Indicator  | 6          | 3                    |
| 6         | US4 - useActionState     | 7          | 3                    |
| 7         | US5 - Optimistic Updates | 8          | 3                    |
| 8         | Polish & Integration     | 15         | 6                    |
| **TOTAL** |                          | **65**     | **34 (52%)**         |

---

## Success Criteria & Completion

### Phase Completion Checklist

- ✅ Phase 1: Setup complete → Project builds successfully
- ✅ Phase 2: Foundations complete → Custom hooks and components work correctly
- ✅ Phase 3: US1 complete → 100% of UI text is in Italian
- ✅ Phase 4: US2 complete → All forms use server actions with 2-second delay
- ✅ Phase 5: US3 complete → Loading spinners display for all forms
- ✅ Phase 6: US4 complete → useActionState properly integrated and tested
- ✅ Phase 7: US5 complete → Optimistic updates work on success and error paths
- ✅ Phase 8: Polish complete → All tests pass, Constitution gates pass, ready for release

### MVP Release (Phases 1-6)

After completing Phase 6, the MVP is ready for release with:

- ✅ Complete Italian UI localization
- ✅ Server actions with mock delay
- ✅ Loading indicators
- ✅ useActionState form management
- ⏳ Optimistic updates (Phase 7 can be added in next iteration)

### Quality Gates

- ✅ All tasks marked with `[P]` can execute in parallel
- ✅ All tasks include explicit file paths
- ✅ All tests pass (unit, integration, e2e)
- ✅ TypeScript: zero errors
- ✅ Lint: zero errors
- ✅ Build: success
- ✅ Constitution compliance: all gates pass
- ✅ Italian text coverage: 100%

---

## Notes

- Each task is independently executable and includes explicit file paths
- Tasks marked with `[P]` can be executed in parallel
- Tasks marked with `[USn]` are part of User Story n
- Estimated effort per task: 1-4 hours depending on complexity
- Parallel execution recommended for teams with 3+ developers
- MVP scope includes Phases 1-6 (US1-US4); US5 (Optimistic Updates) is enhancement

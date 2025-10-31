---
description: "Task list for Event QR Polls"
---

# Tasks: Event QR Polls

**Input**: specs/001-event-qr-polls/plan.md
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Project initialization)

- [ ] T001 Initialize feature branch `001-event-qr-polls` and commit spec + plan | path: N/A
- [ ] T002 [P] Create mock data folder and files for local development: `mock/events.json`, `mock/questions.json`, `mock/users.json`, `mock/answers.json`, `mock/ai_audit.json`
- [ ] T003 Install dev/test dependencies (if not present) and confirm scripts in `package.json` (jest, playwright). | path: package.json
- [ ] T004 [P] Verify Next.js App Router structure under `app/` and add placeholder pages: `app/(public)/e/[eventId]/page.tsx`, `app/(admin)/events/page.tsx`.

## Phase 2: Foundational (Blocking prerequisites)

- [ ] T005 Setup TypeScript types for entities in `lib/types.ts` (Event, Question, Answer, AI_Audit, User)
- [ ] T006 [P] Implement server-only mock data loader in `lib/mock-data.ts` that reads `mock/*.json`
- [ ] T007 Implement middleware skeleton `middleware.ts` to protect `/admin/*` routes and check roles
- [ ] T008 [P] Create `ai-audit` storage abstraction (initially reads `mock/ai_audit.json`) in `lib/ai-audit.ts`
- [ ] T009 Add DB-constraint placeholder docs: `docs/constraints.md` describing duplicate-answer policy (for later RLS/DB migration)
- [ ] T010 Implement rate-limiting middleware stub for AI endpoints in `lib/rate-limit.ts`
- [ ] T011 [P] Add environment validation script `scripts/validate-env.ts` to ensure required env vars are set in production (SUPABASE_SERVICE_ROLE_KEY, VERCEL_AI_GATEWAY_KEY)
- [ ] T012 [P] Add skeleton tests directory: `tests/contract`, `tests/integration`, `tests/e2e`

## Phase 3: User Story 1 - Participate via QR (Priority: P1)

- [ ] T013 [US1] Create public event page component `app/(public)/e/[eventId]/page.tsx` that uses server action to fetch questions from `lib/mock-data.ts`
- [ ] T014 [US1] Create login prompt component and hook integration with Supabase Auth placeholder `lib/auth.ts`
- [ ] T015 [US1] Implement client-side form (React Hook Form + Zod) at `app/(public)/e/[eventId]/components/answers-form.tsx`
- [ ] T016 [US1] Implement server action endpoint `app/api/questions/[id]/answers/route.ts` that accepts selected_choice, loads correct_choice from server-only store (mock file for now), computes is_correct, and appends to `mock/answers.json` via `lib/mock-data.ts`
- [ ] T017 [US1] Add contract test `tests/contract/test_questions_payload.spec.ts` to assert public question payload does not include `correct_choice`
- [ ] T018 [US1] Add integration test `tests/integration/test_submit_answer.spec.ts` that submits an answer and asserts persisted `is_correct` in mock store

## Phase 4: User Story 2 - Admin: Create event & generate questions (Priority: P1)

- [ ] T019 [US2] Create admin events list page `app/(admin)/events/page.tsx` (list from `lib/mock-data.ts`)
- [ ] T020 [US2] Implement admin event detail `app/(admin)/events/[id]/page.tsx` with generate questions button
- [ ] T021 [US2] Implement server action `app/api/events/[id]/generate-questions/route.ts` that calls AI SDK via a mock `lib/ai-client.ts` (no external calls for now), validates response, writes questions to `mock/questions.json`, and logs to `mock/ai_audit.json`
- [ ] T022 [US2] Add admin-only contract tests `tests/contract/test_admin_endpoints.spec.ts` to validate role protection (using mock middleware)

## Phase 5: User Story 3 - Admin: View aggregated answers (Priority: P2)

- [ ] T023 [US3] Implement aggregated answers UI in `app/(admin)/events/[id]/aggregates.tsx` reading `mock/answers.json`
- [ ] T024 [US3] Add export endpoint `app/api/events/[id]/answers/route.ts` that returns CSV (anonymized option) built from mock data
- [ ] T025 [US3] Add integration test `tests/integration/test_aggregates.spec.ts` verifying percentages and counts

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T026 [P] Update docs: `docs/quickstart.md` with instructions to run using mock data
- [ ] T027 [P] Add CI workflow skeleton `.github/workflows/ci.yml` with build → lint → tests
- [ ] T028 [P] Add README section describing the constitution checks and development conventions

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Polish

## Parallel opportunities

- Tasks marked [P] can be executed in parallel (mock data, env validation, tests scaffolding, rate-limit stub)

## Implementation Strategy

MVP first: deliver US1 (participation via QR) using mock data. Then implement admin generation and aggregates.

---

_Tasks generated from plan.md and spec.md. Each task includes an exact path to file(s) to be created or edited._

# Feature Specification: Event QR Polls

**Feature Branch**: `1-event-qr-polls`
**Created**: 2025-10-31
**Status**: Draft
**Input**: Project SPEC: "App eventi Spindox (Q&A via QR, Next.js 16, Supabase, AI question generation)"

## User Scenarios & Testing (mandatory)

### User Story 1 - Participate via QR (Priority: P1)

A conference attendee scans a QR code at an event and lands on the event page. If unauthenticated,
they are prompted to authenticate via a social provider. Once authenticated they see the event
information and up to 4 questions, each with multiple choices. The attendee selects choices and
submits answers. They receive a confirmation that their answers were recorded.

**Why this priority**: This is the primary user journey and core value: enabling attendees to
respond to event questions quickly via QR.

**Independent Test**: Using a test event, scan QR (or open event URL), perform login flow, answer
all questions, submit, and verify server-side recorded answers exist and is_correct computed.

**Acceptance Scenarios**:

1. Given an event page with 4 questions, when an unauthenticated user visits, then the page shows
   a "Login via provider" prompt.
2. Given an authenticated user on the event page, when they submit answers, then the server
   returns success and the answers are persisted with is_correct computed server-side.
3. Given a user tries to submit more than once for the same question, then duplicate submissions
   are blocked or rejected according to server policy.

---

### User Story 2 - Admin: Create event & generate questions (Priority: P1)

An admin logs into the admin dashboard, creates an event with title and description, then clicks
"Generate questions" which triggers a server-side AI call and saves exactly 4 questions with
choices and an internal correct_choice. Admin may view and edit questions and copy the QR/link.

**Why this priority**: Event creation and question generation are required to populate the
public event page.

**Independent Test**: Using an admin account, create an event, trigger generation, and verify 4
questions appear in the admin UI and in the DB with correct_choice stored server-side.

**Acceptance Scenarios**:

1. Given an admin, when they request question generation, then the server saves exactly 4
   questions and returns success to the admin dashboard (admin sees questions list).
2. Given generation fails or AI returns malformed content, then the admin sees a clear error and
   no inconsistent DB state is created.

---

### User Story 3 - Admin: View aggregated answers (Priority: P2)

An admin opens the event detail page to see aggregated responses per question: total answers,
percentage correct, and list (or anonymized list) of submissions. The admin can filter by time
range and optionally anonymize user identities for export.

**Independent Test**: Submit sample answers from multiple users and verify the aggregated view
shows correct counts and percentages.

## Edge Cases

- Network failure during AI generation: generation should be retried or rolled back and admin
  presented with a clear error.
- Malformed AI output (missing choices or duplicate choice IDs): server-side validation rejects the
  AI result and informs admin.
- Same user trying to answer the same question multiple times: server enforces constraints to
  prevent duplicates (or allows updates depending on policy; see Assumptions).

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: The system MUST allow admins to create events with title and description.
- **FR-002**: The system MUST support server-side generation of exactly 4 questions per event via
  an AI call; each question MUST include text and an array of choices; the correct answer
  (correct_choice) MUST be stored only server-side and never returned to clients.
- **FR-003**: The event public page MUST be accessible via `/e/[eventId]` and display event
  details and questions to authenticated users.
- **FR-004**: The system MUST require user authentication via Supabase Auth before allowing
  answer submission.
- **FR-005**: When a user submits an answer, the server MUST compute `is_correct` by comparing
  the selected_choice to the stored correct_choice and persist the answer with is_correct.
- **FR-006**: The API MUST NOT return `correct_choice` in any client-facing payload.
- **FR-007**: The system MUST implement rate-limiting for AI generation endpoints and for answer
  submission endpoints to mitigate abuse.
- **FR-008**: The admin event detail page MUST provide aggregated statistics per question
  (count, percent correct) and optional anonymized export.
- **FR-009**: The system MUST persist audit logs for AI generation calls (prompt, model, timestamp)
  but NOT include sensitive evaluation data in public logs.

### Non-Functional Requirements

- **NFR-001**: Secrets for Supabase service role and AI gateway MUST be kept server-side and never
  exposed to client bundles.
- **NFR-002**: Answer evaluation and scoring MUST be executed server-side only.
- **NFR-003**: The system SHOULD prevent duplicate answers per (user, question) via DB constraints
  or server logic.

## Key Entities

- **User**: id, name, email, role (admin|user), created_at
- **Event**: id, title, description, qr_code_url, created_by, created_at, status
- **Question**: id, event_id, text, choices (JSON list of { id, text }), correct_choice (server-only), generated_by_ai boolean, created_at
- **Answer**: id, question_id, user_id, selected_choice, is_correct, content (optional), created_at
- **AI_Audit**: id, event_id, prompt, model, response_hash, created_at

## Success Criteria (mandatory)

- **SC-001**: Users can scan a QR and authenticate and submit answers end-to-end in under 3 minutes
  (measured in a simple manual flow test).
- **SC-002**: Admins can create an event and generate 4 valid questions in under 2 minutes.
- **SC-003**: 100% of client-facing question payloads must NOT include correct_choice (automated
  contract test).
- **SC-004**: Answer submissions for the same (user, question) pair are blocked (or updated) as the
  configured policy; verification via integration test.
- **SC-005**: AI generation logs are stored for every generation request (prompt + model + timestamp)
  and are retrievable by admins for audit (where allowed).

## Assumptions

- Authentication will be handled by Supabase Auth; session contains user id and role.
- Default policy: duplicate answer submissions are blocked (insert constraint). If alternate
  behavior desired (allow update), change and document the policy.
- AI gateway and provider keys are available at runtime through environment variables and
  accessible to server-only code.

## Open questions / Clarifications (none required)

- I made reasonable defaults for duplicate-submission handling (blocked) and timing expectations.
  If you want updates to those policies, I can add a small [NEEDS CLARIFICATION] section (limit 3).

## Implementation notes (guidance for planners)

- Use server-side handlers for AI calls and scoring (server components / server actions per
  project convention).
- Store `correct_choice` only in the DB and never in client responses.
- Use RLS policies and middleware to protect admin routes and server endpoints.

---

_Spec generated from project SPEC.md and repo context. Ready for planning._

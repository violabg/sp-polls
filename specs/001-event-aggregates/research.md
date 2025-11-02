# Research & Decisions: Event Aggregates Page

**Feature**: 001-event-aggregates  
**Date**: 2 novembre 2025  
**Purpose**: Resolve technical unknowns and document design decisions before implementation.

## Research Findings

### Data Model for Answer Correctness

**Decision**: Add `is_correct` boolean field to the Answer entity and corresponding database table.

**Rationale**:

- Simple and direct way to store correctness evaluation
- Aligns with existing data structure
- Supports the functional requirement to mark and persist correctness
- Allows for easy querying and display in aggregates

**Alternatives Considered**:

- Separate `evaluations` table with answer_id, evaluator_id, is_correct: Rejected due to unnecessary complexity for this use case, as evaluations are admin-only and don't require multi-user tracking.
- Enum field with 'correct', 'incorrect', 'unmarked': Rejected as overkill; boolean suffices and simplifies UI logic.

### Event Status Removal

**Decision**: Completely remove the `status` property from Event type, database schema, and all references.

**Rationale**:

- Explicitly requested in feature description
- Simplifies data model by removing unused field
- Ensures clean codebase without legacy properties

**Alternatives Considered**:

- Deprecate status field: Rejected as feature specifically requires removal, not deprecation.

### Aggregates Page Implementation

**Decision**: Implement as server component with client-side interactivity for marking.

**Rationale**:

- Server component for initial data loading (performance, SEO)
- Client interactivity for marking actions (better UX)
- Follows project's server-first principle

**Alternatives Considered**:

- Full client-side: Rejected due to server-first mandate and potential performance issues with large datasets.

### API Design for Aggregates

**Decision**: Single GET endpoint `/api/events/[id]/aggregates` returning structured data grouped by user.

**Rationale**:

- Efficient single request for all data
- Server-side grouping reduces client processing
- Aligns with RESTful patterns

**Alternatives Considered**:

- Multiple endpoints (users, answers): Rejected due to increased complexity and round trips.

### Correctness Marking API

**Decision**: Server action `markAnswerCorrectness(answerId, isCorrect)` for marking.

**Rationale**:

- Server-side mutation ensures security
- Optimistic updates possible on client
- Follows project's server action pattern

**Alternatives Considered**:

- REST API endpoint: Rejected as server actions are preferred for mutations in this stack.

## Resolved Unknowns

- Data persistence for correctness: Boolean field on Answer
- UI pattern for marking: Toggle buttons or radio groups
- Performance for large events: Server-side pagination if needed (deferred until testing shows issue)
- Error handling: Standard error messages in Italian

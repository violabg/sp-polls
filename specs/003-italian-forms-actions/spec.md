# Feature Specification: Forms with Server Actions & Optimistic Updates

**Feature Branch**: `003-italian-forms-actions`  
**Created**: 2025-11-01  
**Status**: Draft  
**Input**: User description: "implement server actions for form (mock with fake 2 seconds delay), use useActionState and optimistic updates show a spinner during network request"

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently

> NOTE: All user-visible text in scenarios, acceptance criteria, and examples MUST be
> provided in Italian (it-IT). If a scenario includes text that will be visible to end
> users, include the Italian wording or a translation task in the spec.

-->

### User Story 1 - Implement Server Actions for Form Submission (Priority: P1)

Form submissions are handled through server actions instead of client-side handlers, ensuring data processing moves to the server layer. The submission includes a 2-second artificial delay to simulate realistic network conditions and demonstrate loading states.

**Why this priority**: This architectural change is essential for the feature and works alongside optimistic updates. It's a critical requirement for modern form handling patterns and enables proper state management with useActionState.

**Independent Test**: Can be fully tested by submitting any form and verifying through network inspection or logs that the request is processed as a server action with a 2-second delay. The feature delivers proper server-side data handling.

**Acceptance Scenarios**:

1. **Given** a form is submitted by the user, **When** the submit button is clicked, **Then** the request is processed through a server action (not client-side handler)
2. **Given** a form submission is initiated, **When** the server action executes, **Then** there is a 2-second delay to simulate network latency
3. **Given** the server action processes a form, **When** processing completes, **Then** the response is returned to the client with a success or error status
4. **Given** a form validation error occurs on the server, **When** validation fails, **Then** error information is returned to the client for display

---

### User Story 2 - Show Loading Indicator During Form Submission (Priority: P1)

While a form submission is in progress, a visual spinner or loading indicator is displayed to the user, providing clear feedback that a network request is in flight. The indicator appears immediately and disappears only after the server action completes or encounters an error.

**Why this priority**: This is critical for user experience. Without a loading indicator, users may be confused about whether their action is being processed, potentially leading to duplicate submissions or frustration.

**Independent Test**: Can be fully tested by submitting a form and observing that a spinner appears during the 2-second server delay and disappears when complete. Delivers clear visual feedback that improves perceived responsiveness.

**Acceptance Scenarios**:

1. **Given** a user clicks the submit button on a form, **When** the server action begins processing, **Then** a loading spinner becomes visible on the page
2. **Given** a spinner is displayed during form submission, **When** the server action completes successfully, **Then** the spinner disappears and the user sees a success confirmation or next step
3. **Given** a spinner is displayed during form submission, **When** the server action encounters an error, **Then** the spinner disappears and an error message is displayed
4. **Given** a user is viewing a form with a loading state, **When** they view the page, **Then** the spinner animation is smooth and clearly indicates a pending operation

---

### User Story 3 - Implement useActionState for Form State Management (Priority: P1)

Form state is managed using the Next.js `useActionState` hook, enabling declarative management of form submission state, pending status, error states, and automatic binding to server actions. This provides a modern, standardized approach to form handling.

**Why this priority**: This is the technical foundation for stories 2 and 3. `useActionState` orchestrates the entire flow: submitting to server actions, tracking pending state for the spinner, and handling errors. Without it, the pattern breaks down.

**Independent Test**: Can be fully tested by examining form component code and verifying that useActionState is properly integrated, with pending state connected to the loading spinner. Delivers clean, maintainable form handling code.

**Acceptance Scenarios**:

1. **Given** a form component is initialized, **When** the component mounts, **Then** useActionState hook is called with a server action and initial state
2. **Given** useActionState is managing form state, **When** the form is submitted, **Then** the pending state automatically transitions to true while the server action executes
3. **Given** a server action completes, **When** the action returns a result, **Then** the form state updates with the response and pending state becomes false
4. **Given** an error occurs in the server action, **When** the error is returned, **Then** the form state includes the error information for display

---

### User Story 4 - Implement Optimistic Updates for Form Feedback (Priority: P2)

Form submissions provide immediate optimistic feedback to the user using React's `useOptimistic` hook, showing the expected outcome before server confirmation. If the server subsequently confirms the action, the state remains unchanged; if an error occurs, the interface reverts to the previous state and displays an error message.

**Why this priority**: P2 - This enhances perceived performance and user experience. While P1 stories provide functional form submission, optimistic updates make the experience feel more responsive. It works in conjunction with the loading state but is not strictly required for core functionality.

**Independent Test**: Can be fully tested by submitting a form, observing immediate state changes before server response, and verifying that either the state persists (on success) or reverts (on error). Delivers better perceived responsiveness.

**Acceptance Scenarios**:

1. **Given** a form is submitted, **When** the submit button is clicked, **Then** the UI immediately reflects the expected outcome while waiting for server confirmation using useOptimistic
2. **Given** an optimistic update is displayed, **When** the server confirms the action, **Then** the optimistic state matches the server response and remains on screen
3. **Given** an optimistic update is displayed, **When** the server returns an error, **Then** the UI reverts to the previous state and displays an error message
4. **Given** a user views optimistic changes during pending submission, **When** they attempt a new action, **Then** the pending state prevents multiple rapid submissions

### Edge Cases

- What happens if a user submits the same form twice in rapid succession? (Pending state should prevent duplicate submissions)
- How does the system handle if the server action times out beyond the 2-second delay? (Timeout error should be caught and displayed in Italian)
- What if optimistic updates occur for data that has changed on the server? (Server response should take precedence and revert optimistic changes)
- How does the UI behave if a user navigates away during a pending form submission? (Pending request should complete in background; no error shown if navigation succeeds)
- What happens if form validation fails on the client before submission? (No server action should be triggered; validation errors shown in Italian)

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST implement server actions for all form submissions (event creation, event editing, answer submission) using Next.js App Router conventions
- **FR-002**: System MUST implement a 2-second artificial delay in each server action to simulate realistic network latency during development/testing
- **FR-003**: System MUST display a loading spinner or visual indicator while a form submission is in progress and a server action is executing
- **FR-004**: System MUST hide the loading indicator when the server action completes (either success or error)
- **FR-005**: System MUST use the `useActionState` hook from React to manage form submission state, pending status, and error handling
- **FR-006**: System MUST automatically bind form submission to the server action through useActionState, eliminating the need for manual event handlers
- **FR-007**: System MUST use React's `useOptimistic` hook to display optimistic updates immediately upon form submission, showing expected outcomes before server confirmation
- **FR-008**: System MUST revert optimistic updates to the previous state if the server action returns an error
- **FR-009**: System MUST prevent multiple simultaneous form submissions by disabling form controls while pending state is true
- **FR-010**: System MUST display all error messages returned from server actions with user-friendly descriptions of what went wrong
- **FR-011**: System MUST preserve form data if a submission error occurs, allowing users to correct and resubmit
- **FR-012**: System MUST display success messages after a form submission completes successfully

### Key Entities _(include if feature involves data)_

- **Event**: Contains event metadata (name, date, description, status)
- **Question**: Contains survey question text and metadata
- **Answer/Response**: Contains user responses to questions
- **User**: Contains user information
- **Form State**: Managed by useActionState, includes pending status, error state, and success state

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: All form submissions use server actions instead of client-side handlers - verified through code review and network inspection
- **SC-002**: Users see a visible loading indicator within 100ms of form submission, before or as the server action begins
- **SC-003**: Loading indicator disappears within 500ms after server action completes (success or error)
- **SC-004**: All error messages are displayed with clear explanation of what failed - verified through form error testing
- **SC-005**: Optimistic updates appear immediately (within 50ms) of form submission and remain consistent until server response
- **SC-006**: Form resubmission is prevented during pending state - verified by attempting rapid form submissions and confirming only one server action executes
- **SC-007**: All acceptance scenarios from user stories can be completed end-to-end without technical errors
- **SC-008**: Developers can implement new forms following the established pattern (useActionState + server actions + optimistic updates) in under 15 minutes for a standard form

### Assumptions

- The 2-second delay in server actions is for development/testing purposes and may be removed or adjusted in production without changing the architecture
- The project uses Next.js 14+ with App Router, supporting useActionState hook
- Optimistic updates should work with the existing component architecture and data fetching patterns

### Notes

- Server actions should log the 2-second delay for debugging purposes
- The loading spinner should be accessible and follow WCAG guidelines for color contrast and animation

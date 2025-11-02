# Feature Specification: Event Aggregates Page

**Feature Branch**: `001-event-aggregates`  
**Created**: 2 novembre 2025  
**Status**: Draft  
**Input**: User description: "create events/event-001/aggregates page, where we can see all the anwsers by user to the event questions, update types and mock if necessary, remove the status prop from event, and reflect that everywhere"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Event Answer Aggregates (Priority: P1)

As an event organizer, I want to view a page that shows all answers submitted by users for a specific event's questions, grouped by user, so that I can analyze participation and responses.

**Why this priority**: This is the core functionality requested, providing immediate value for understanding event engagement.

**Independent Test**: Can be fully tested by navigating to the aggregates page for an event and verifying that answers are displayed grouped by user.

**Acceptance Scenarios**:

1. **Dato** un evento con risposte inviate, **Quando** navigo alla pagina degli aggregati dell'evento, **Allora** vedo tutte le risposte organizzate per utente con le loro risposte a ciascuna domanda.
2. **Dato** un evento senza risposte, **Quando** navigo alla pagina degli aggregati, **Allora** vedo un messaggio appropriato che indica che non sono state inviate risposte.

---

### User Story 2 - Remove Event Status Property (Priority: P2)

As a developer, I need to remove the status property from the event data structure and update all related code, types, and mock data to reflect this change.

**Why this priority**: This is a maintenance task to clean up the data model as requested.

**Independent Test**: Can be tested by verifying that event objects no longer have a status property and all code compiles without errors.

**Acceptance Scenarios**:

1. **Given** the event type definition, **When** I check the type, **Then** the status property is not present.
2. **Given** mock event data, **When** I inspect the data, **Then** no event objects contain a status field.

### User Story 3 - Mark Answer Correctness (Priority: P1)

As an event organizer, I want to mark each answer as correct or incorrect on the aggregates page using toggle buttons, so that I can evaluate user responses and provide feedback.

**Why this priority**: This enhances the aggregates page with interactive functionality for assessment.

**Independent Test**: Can be fully tested by marking answers and verifying the marks are saved and displayed.

**Acceptance Scenarios**:

1. **Dato** una risposta nella pagina degli aggregati, **Quando** la marco come corretta, **Allora** la risposta è indicata visivamente come corretta e la modifica è salvata.
2. **Dato** una risposta marcata come corretta, **Quando** la marco come incorretta, **Allora** il segno è aggiornato di conseguenza.
3. **Dato** risposte non marcate, **Quando** visualizzo la pagina, **Allora** le risposte non mostrano alcuna indicazione di correttezza inizialmente.

---

- What happens when an event has questions but no answers?
- How does the system handle users who partially answered questions?
- What if an event has a large number of answers (performance consideration)?

## Requirements _(mandatory)_

- **FR-001**: System MUST display a page at `/admin/events/[eventId]/aggregates` showing all answers for the event's questions grouped by user.
- **FR-002**: System MUST show user information alongside their answers for each question.
- **FR-003**: System MUST display a message 'Nessuna risposta inviata' when no answers exist.
- **FR-004**: System MUST allow organizers to mark each answer as correct or incorrect.
- **FR-005**: System MUST save and persist correctness marks for answers.
- **FR-006**: System MUST show a green checkmark for correct answers and a red X for incorrect answers.
- **FR-007**: System MUST remove the status property from the Event type definition.
- **FR-008**: System MUST update all mock data to exclude the status property from events.
- **FR-009**: System MUST update all code references to event status to reflect its removal.

### Key Entities _(include if feature involves data)_

- **Event**: Represents an event with questions, no longer has status property.
- **Question**: Represents a question in an event.
- **Answer**: Represents a user's response to a question, includes correctness marking.
- **User**: Represents a participant who submits answers.

## Success Criteria _(mandatory)_

- **SC-001**: Users can view answer aggregates for an event in under 3 seconds.
- **SC-002**: All answers are accurately displayed grouped by user without data loss.
- **SC-003**: System handles events with up to 1000 answers without performance degradation.
- **SC-004**: Correctness marks are saved and persist across page reloads.
- **SC-005**: No compilation errors occur after removing the status property from events.

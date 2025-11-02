# Data Model: Forms with Server Actions & Optimistic Updates

**Feature**: Forms with Server Actions & Optimistic Updates  
**Date**: 2025-11-02  
**Related Spec**: [spec.md](spec.md)

## Overview

This feature modifies existing form submissions to use server actions, but does not introduce new data entities. The data model remains unchanged from the existing application structure. Form state is managed client-side and not persisted.

## Existing Entities

### Event

**Purpose**: Represents an event that contains polls/questions for participants to answer.

**Fields**:

- `id`: string (UUID) - Primary key
- `name`: string - Event title (required, max 100 chars)
- `date`: Date - Event date (required)
- `description`: string - Event description (optional, max 500 chars)
- `status`: enum ('draft', 'active', 'closed') - Event status (default: 'draft')
- `created_at`: Date - Creation timestamp
- `updated_at`: Date - Last update timestamp

**Relationships**:

- Has many Questions (1:N)
- Has many Answers through Questions

**Validation Rules** (from FR-003):

- Name required, non-empty
- Date required, must be future date for new events
- Description optional but validated for length

### Question

**Purpose**: Represents a survey question within an event.

**Fields**:

- `id`: string (UUID) - Primary key
- `event_id`: string (UUID) - Foreign key to Event
- `text`: string - Question text (required, max 200 chars)
- `type`: enum ('text', 'multiple_choice', 'rating') - Question type
- `options`: string[] - Answer options for multiple choice (optional)
- `required`: boolean - Whether answer is required (default: true)
- `order`: number - Display order within event

**Relationships**:

- Belongs to Event (N:1)
- Has many Answers (1:N)

**Validation Rules**:

- Text required, non-empty
- Type must be valid enum value
- Options required for multiple_choice type

### Answer/Response

**Purpose**: Represents a user's response to a question.

**Fields**:

- `id`: string (UUID) - Primary key
- `question_id`: string (UUID) - Foreign key to Question
- `user_id`: string (UUID) - Foreign key to User (anonymous if not logged in)
- `response`: string - Answer text (required for text questions)
- `selected_option`: number - Index of selected option (for multiple choice)
- `rating`: number - Rating value (1-5 for rating questions)
- `submitted_at`: Date - Submission timestamp

**Relationships**:

- Belongs to Question (N:1)
- Belongs to User (N:1)

**Validation Rules** (from FR-011):

- Response required based on question type
- Selected option must be valid index for multiple choice
- Rating must be 1-5 for rating questions
- Prevents duplicate submissions (DB constraint)

### User

**Purpose**: Represents application users (organizers and respondents).

**Fields**:

- `id`: string (UUID) - Primary key
- `name`: string - Display name (required, max 50 chars)
- `email`: string - Email address (required, unique)
- `role`: enum ('organizer', 'respondent') - User role (default: 'respondent')
- `created_at`: Date - Registration timestamp

**Relationships**:

- Has many Answers (1:N)

**Validation Rules**:

- Email must be valid format
- Name required, non-empty

## Form State (Client-side Only)

**Purpose**: Manages form submission state using useActionState and useOptimistic hooks.

**Fields** (not persisted):

- `pending`: boolean - Whether submission is in progress
- `error`: string | null - Error message from server action
- `success`: boolean - Whether submission succeeded
- `optimisticData`: any - Temporary optimistic update data

**Validation Rules**:

- Pending prevents multiple submissions
- Error state triggers UI error display
- Optimistic data reverts on server error

## State Transitions

### Event Creation Flow

1. Draft → Active (manual activation)
2. Active → Closed (manual or date-based)

### Form Submission Flow

1. Idle → Pending (submission starts)
2. Pending → Success (server action completes successfully)
3. Pending → Error (server action fails)
4. Error/Success → Idle (form reset or navigation)

## Notes

- All entities use Supabase PostgreSQL with RLS
- Server actions handle validation and persistence
- Form state is ephemeral and managed by React hooks
- No new entities introduced by this feature

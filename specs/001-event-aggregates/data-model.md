# Data Model: Event Aggregates Page

**Feature**: 001-event-aggregates  
**Date**: 2 novembre 2025  
**Purpose**: Define data structures, relationships, and validation rules for the aggregates feature.

## Entities

### Event

Represents an event containing questions for polling.

**Fields**:

- `id`: string (UUID) - Primary key
- `title`: string - Event title
- `description`: string - Event description
- `created_at`: Date - Creation timestamp
- `updated_at`: Date - Last update timestamp
- `questions`: Question[] - Related questions (one-to-many)

**Relationships**:

- Has many Questions
- Has many Answers through Questions

**Validation Rules**:

- `title`: Required, max 200 chars
- `description`: Optional, max 1000 chars

**Notes**: Status property removed as per feature requirements.

### Question

Represents a question within an event.

**Fields**:

- `id`: string (UUID) - Primary key
- `event_id`: string (UUID) - Foreign key to Event
- `text`: string - Question text
- `type`: 'multiple_choice' | 'text' | 'rating' - Question type
- `options`: string[] - Answer options (for multiple choice)
- `correct_choice`: string | null - Correct answer (server-side only, not exposed to client)
- `created_at`: Date - Creation timestamp
- `answers`: Answer[] - Related answers (one-to-many)

**Relationships**:

- Belongs to Event
- Has many Answers

**Validation Rules**:

- `text`: Required, max 500 chars
- `type`: Required, must be valid enum
- `options`: Required for multiple_choice, array of strings

### Answer

Represents a user's response to a question, with correctness marking.

**Fields**:

- `id`: string (UUID) - Primary key
- `question_id`: string (UUID) - Foreign key to Question
- `user_id`: string (UUID) - Foreign key to User
- `response`: string - User's answer text
- `is_correct`: boolean | null - Correctness evaluation (null = unmarked)
- `created_at`: Date - Creation timestamp
- `updated_at`: Date - Last update timestamp

**Relationships**:

- Belongs to Question
- Belongs to User

**Validation Rules**:

- `response`: Required, max 1000 chars
- `is_correct`: Optional boolean

**Notes**: Added is_correct field for marking answer correctness.

### User

Represents a participant or administrator.

**Fields**:

- `id`: string (UUID) - Primary key
- `name`: string - User's name
- `email`: string - User's email
- `role`: 'admin' | 'participant' - User role
- `created_at`: Date - Creation timestamp

**Relationships**:

- Has many Answers

**Validation Rules**:

- `name`: Required, max 100 chars
- `email`: Required, valid email format
- `role`: Required, must be valid enum

## Database Schema Changes

### Answers Table

- Add column: `is_correct` BOOLEAN NULL

### Events Table

- Remove column: `status` (if exists)

## Type Definitions (TypeScript)

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  questions: Question[];
}

interface Question {
  id: string;
  event_id: string;
  text: string;
  type: "multiple_choice" | "text" | "rating";
  options: string[];
  correct_choice: string | null; // Server-side only
  created_at: Date;
  answers: Answer[];
}

interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  response: string;
  is_correct: boolean | null;
  created_at: Date;
  updated_at: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "participant";
  created_at: Date;
}
```

## Data Flow

1. Event creation → Questions created
2. Users submit answers → Answer records created with is_correct = null
3. Admin views aggregates → Answers displayed grouped by user
4. Admin marks correctness → is_correct updated via server action
5. UI reflects correctness status visually

# Server Actions Contracts

**Feature**: Forms with Server Actions & Optimistic Updates  
**Date**: 2025-11-02  
**Format**: TypeScript function signatures

## Overview

Server actions handle form submissions for event creation, event editing, and answer submission. Each action includes a 2-second artificial delay for testing purposes. Actions return success data or error objects.

## Action Contracts

### createEvent

**Purpose**: Creates a new event with questions.

**Input**:

```typescript
interface CreateEventInput {
  name: string;
  date: string; // ISO date string
  description?: string;
  questions: Array<{
    text: string;
    type: "text" | "multiple_choice" | "rating";
    options?: string[]; // Required for multiple_choice
    required: boolean;
  }>;
}
```

**Output**:

```typescript
type CreateEventResult =
  | {
      success: true;
      eventId: string;
    }
  | {
      success: false;
      error: string;
    };
```

**Endpoint**: Server action in `app/(admin)/events/new/page.tsx`

**Validation**:

- Name: required, 1-100 chars
- Date: required, valid future date
- Description: optional, 0-500 chars
- Questions: at least 1 required
- Question text: required, 1-200 chars
- Options: required for multiple_choice, 2-10 options

### updateEvent

**Purpose**: Updates an existing event.

**Input**:

```typescript
interface UpdateEventInput {
  eventId: string;
  name: string;
  date: string;
  description?: string;
  questions: Array<{
    id?: string; // Existing question ID
    text: string;
    type: "text" | "multiple_choice" | "rating";
    options?: string[];
    required: boolean;
  }>;
}
```

**Output**:

```typescript
type UpdateEventResult =
  | {
      success: true;
      eventId: string;
    }
  | {
      success: false;
      error: string;
    };
```

**Endpoint**: Server action in `app/(admin)/events/[id]/edit/page.tsx`

**Validation**: Same as createEvent, plus event ownership check.

### submitAnswers

**Purpose**: Submits answers for an event.

**Input**:

```typescript
interface SubmitAnswersInput {
  eventId: string;
  answers: Array<{
    questionId: string;
    response?: string; // For text questions
    selectedOption?: number; // For multiple choice
    rating?: number; // For rating (1-5)
  }>;
  userInfo?: {
    name: string;
    email: string;
  }; // For anonymous users
}
```

**Output**:

```typescript
type SubmitAnswersResult =
  | {
      success: true;
      submissionId: string;
    }
  | {
      success: false;
      error: string;
    };
```

**Endpoint**: Server action in `app/(public)/e/[eventId]/page.tsx`

**Validation**:

- Event exists and is active
- All required questions answered
- Response format matches question type
- Prevents duplicate submissions per user

## Implementation Notes

- All actions include `await new Promise(resolve => setTimeout(resolve, 2000))` for delay
- Actions use Supabase service role for data operations
- Error messages are user-friendly but not Italian-specific (handled in UI)
- Actions log delay start/end for debugging
- RLS policies enforced on all database operations

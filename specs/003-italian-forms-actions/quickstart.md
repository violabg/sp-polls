# Quickstart: Forms with Server Actions & Optimistic Updates

**Feature**: Forms with Server Actions & Optimistic Updates  
**Date**: 2025-11-02

## Overview

This feature implements modern form handling in Next.js using server actions, useActionState, and optimistic updates. Forms now submit data server-side with loading indicators and immediate UI feedback.

## Prerequisites

- Next.js 14+ with App Router
- React 18+ (for useActionState and useOptimistic)
- Supabase client configured
- shadcn/ui components installed

## Usage

### Basic Form with Server Action

```typescript
"use server";

async function createEvent(formData: FormData) {
  // 2-second delay for testing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const name = formData.get("name") as string;
  // ... validation and database operations

  return { success: true, eventId: "..." };
}
```

```tsx
"use client";

import { useActionState } from "react";

export function EventForm() {
  const [state, action, pending] = useActionState(createEvent, null);

  return (
    <form action={action}>
      <input name="name" required />
      <button disabled={pending}>
        {pending ? <Spinner /> : "Create Event"}
      </button>
      {state?.error && <div>{state.error}</div>}
    </form>
  );
}
```

### With Optimistic Updates

```tsx
import { useOptimistic } from "react";

export function AnswerForm() {
  const [optimisticAnswers, addOptimisticAnswer] = useOptimistic(
    answers,
    (state, newAnswer) => [...state, newAnswer]
  );

  const handleSubmit = async (formData) => {
    addOptimisticAnswer(newAnswer);
    await action(formData);
  };

  return <form action={handleSubmit}>{/* Form fields */}</form>;
}
```

## Key Components

- **Server Actions**: Defined with `'use server'`, handle form submissions
- **useActionState**: Manages pending, error, and success states
- **useOptimistic**: Provides immediate UI feedback before server response
- **Loading Indicators**: Show during the 2-second delay

## Testing

```bash
# Run unit tests
npm test

# Run e2e tests with Playwright
npx playwright test

# Test loading states manually
# 1. Submit form
# 2. Verify spinner appears within 100ms
# 3. Wait 2 seconds
# 4. Verify spinner disappears and success shows
```

## Troubleshooting

### Form not submitting

- Ensure server action is exported and has `'use server'`
- Check FormData keys match server action parameters
- Verify no client-side validation blocking submission

### Loading indicator not showing

- Confirm `pending` from useActionState is used for conditional rendering
- Check that server action is actually called (network tab)

### Optimistic updates not reverting

- Ensure server action returns error on failure
- Verify useOptimistic callback properly reverts state

### Delay not working

- Confirm `setTimeout` is awaited in server action
- Check server logs for delay messages

## Performance Notes

- Optimistic updates improve perceived performance despite 2-second delay
- Server actions reduce client bundle size
- Loading indicators prevent user confusion during delays

## Migration from Client-side Forms

Replace `onSubmit` handlers with `action` prop and server actions:

```tsx
// Before
<form onSubmit={handleSubmit}>

// After
<form action={serverAction}>
```

Remove manual fetch calls and replace with server action logic.

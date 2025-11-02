# Quick Start: Event Aggregates Page

**Feature**: 001-event-aggregates  
**Date**: 2 novembre 2025  
**Purpose**: Quick setup and usage guide for the event aggregates functionality.

## Prerequisites

- Next.js 14+ project with Supabase
- Admin access to event management
- Database schema updated with `is_correct` field on answers table
- Event status property removed from types and mocks

## Setup

1. **Update Database Schema**:

   ```sql
   ALTER TABLE answers ADD COLUMN is_correct BOOLEAN NULL;
   ALTER TABLE events DROP COLUMN status; -- if exists
   ```

2. **Update Type Definitions**:

   - Add `is_correct: boolean | null` to Answer interface
   - Remove `status` from Event interface

3. **Update Mock Data**:
   - Add `is_correct` field to answer objects in `mock/answers.json`
   - Remove `status` from event objects in `mock/events.json`

## Usage

### Viewing Aggregates

1. Navigate to `/admin/events/[eventId]/aggregates`
2. View all user answers grouped by participant
3. See question responses organized by user

### Marking Correctness

1. On the aggregates page, locate the answer to evaluate
2. Click the correct/incorrect toggle button
3. Changes are saved automatically and reflected in the UI

## API Endpoints

- `GET /api/events/[id]/aggregates` - Retrieve aggregates data
- Server action: `markAnswerCorrectness(answerId, isCorrect)` - Mark answer correctness

## Testing

Run the following tests to verify functionality:

```bash
npm test -- --testPathPattern=aggregates
npm run e2e -- --grep "aggregates"
```

## Troubleshooting

- **No answers displayed**: Check if event has submitted answers
- **Marking fails**: Verify server action permissions and database connection
- **Type errors**: Ensure all type definitions are updated consistently

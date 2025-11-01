# API Contracts: UI Event Management and Mock Login

## Overview

This feature does not introduce new API endpoints. All functionality is implemented client-side with mock data.

## Existing Contracts (Referenced)

### Navigation Endpoints

- `GET /events` - Admin events listing (existing)
- `GET /e/[eventId]` - Public event page (existing)

### Mock Data Access

- Uses existing mock JSON files
- No new API contracts required

## Client-side Contracts

### Form Submissions

**Event Creation Form:**

- Input: `{ title: string, description: string, status: string }`
- Output: Navigation to `/events`
- Validation: Client-side required field checks

**Event Edit Form:**

- Input: `{ title: string, description: string, status: string }`
- Output: Navigation to `/events`
- Validation: Client-side required field checks

### Mock Authentication

**Admin Login:**

- Trigger: Button click
- Action: Router navigation to `/events`

**User Login:**

- Trigger: Button click
- Action: Router navigation to `/e/event-001`

## UI Component Contracts

### Shadcn Field Components

- `Field`: Wrapper for form fields
- `FieldLabel`: Accessible labels
- `FieldDescription`: Helper text
- `Input`: Text inputs
- `Textarea`: Multi-line text inputs
- `Select`: Dropdown selections

All components follow Shadcn/ui API patterns and accessibility standards.

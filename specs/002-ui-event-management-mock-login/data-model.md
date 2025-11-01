# Data Model: UI Event Management and Mock Login

## Overview

This feature does not introduce new data entities or modify existing ones. It leverages the existing Event and User entities defined in `lib/types.ts`.

## Existing Entities

### Event Entity

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  qr_code_url: string;
  created_by: string;
  created_at: string;
  status: "draft" | "published" | "archived";
}
```

**Fields Used in Forms:**

- `title`: Editable text field
- `description`: Editable textarea
- `status`: Select dropdown with options

**Validation Rules:**

- `title`: Required, non-empty string
- `description`: Optional text
- `status`: Must be one of the allowed enum values

### User Entity

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}
```

**Usage in Feature:**

- Mock login distinguishes between admin and user roles
- Admin role redirects to `/events`
- User role redirects to `/e/event-001`

## Relationships

No new relationships introduced. Existing relationships maintained:

- Event.created_by references User.id

## State Management

**Form State:** Managed with React useState in client components
**Navigation:** Handled via Next.js useRouter
**Data Persistence:** Mock implementation (no database changes)

## Mock Data

Uses existing mock data from `mock/events.json`:

- Event ID: "event-001"
- Used for user mock login redirect

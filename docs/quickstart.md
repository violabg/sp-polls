# Quick Start Guide: Event QR Polls

This guide helps you get started with the Event QR Polls feature using mock data for local development.

## Prerequisites

- Node.js 18+ (pinned in `.npmrc` or `package.json`)
- pnpm 10.18+
- A text editor (VS Code recommended)

## Installation

```bash
# Install dependencies
pnpm install

# Verify environment setup
node scripts/validate-env.ts
```

## Running the Application

### Development Mode

```bash
pnpm dev
```

The app will start on `http://localhost:3000`.

### Building for Production

```bash
pnpm build
pnpm start
```

## Using Mock Data

By default, the application uses mock JSON files in the `mock/` directory for local development. No database connection is required.

Mock files contain:

- `events.json` - Sample events
- `questions.json` - Sample questions with server-side correct answers
- `users.json` - Sample users (admin + attendee)
- `answers.json` - Sample answer submissions
- `ai_audit.json` - Sample AI generation logs

To add more mock data, edit these JSON files directly.

## User Workflows

### As a Regular User (Attendee)

1. Visit `/e/event-001` to access the public event page
2. Log in when prompted (mock auth)
3. Answer all 4 questions
4. Submit your answers
5. Answers are saved with `is_correct` computed server-side

### As an Admin

1. Visit `/events` to see all events
2. Click an event to view its details
3. Click "Generate Questions" to create 4 AI-generated questions
4. View individual questions with correct answers marked
5. Click "View Aggregated Answers" to see statistics
6. **NEW**: Click "Create Event" to add new events at `/events/new`
7. **NEW**: Click "Edit Event" on any event to modify at `/events/{id}/edit`

### Mock Login (Development Only)

For testing purposes, the login form includes mock login buttons:

- **Login as Admin**: Redirects to `/events` (admin dashboard)
- **Login as User**: Redirects to `/e/event-001` (sample event)

## Testing

Run tests with:

```bash
# Unit and component tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e
```

## API Endpoints

### Public Endpoints

- `GET /e/[eventId]` - Event page with questions
- `POST /api/questions/[id]/answers` - Submit answer (rate limited)

### Admin Endpoints

- `GET /events` - List all events
- `GET /events/[id]` - Event detail with questions
- `GET /events/[id]/aggregates` - Aggregated answer statistics
- `POST /api/events/[id]/generate-questions` - Generate AI questions (rate limited)
- `GET /api/events/[id]/answers` - Export answers as CSV

## Environment Variables

For production, configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Gateway
VERCEL_AI_GATEWAY_KEY=your-gateway-key
```

For development, these are optional (mock data is used).

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Next.js App Router (App Directory)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ (public)/ Routes - Event Participation      │   │
│  │ ├─ /e/[eventId]/page.tsx                   │   │
│  │ └─ Components: LoginPrompt, AnswersForm    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ (admin)/ Routes - Event Management          │   │
│  │ ├─ /events/page.tsx                        │   │
│  │ ├─ /events/[id]/page.tsx                   │   │
│  │ └─ /events/[id]/aggregates.tsx             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ /api Routes - Backend Handlers              │   │
│  │ ├─ POST /questions/[id]/answers            │   │
│  │ ├─ POST /events/[id]/generate-questions    │   │
│  │ └─ GET /events/[id]/answers                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  Server Utilities (lib/)                            │
├─────────────────────────────────────────────────────┤
│ ├─ types.ts - TypeScript interfaces               │
│ ├─ mock-data.ts - Data access layer (mock)        │
│ ├─ auth.ts - Authentication (stub)                │
│ ├─ ai-audit.ts - AI logging & hashing             │
│ ├─ rate-limit.ts - Rate limiting                  │
│ └─ utils.ts - Utility functions                   │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  Mock Data Store (mock/)                            │
├─────────────────────────────────────────────────────┤
│ ├─ events.json                                     │
│ ├─ questions.json (with server-side correct_choice)
│ ├─ users.json                                      │
│ ├─ answers.json (with is_correct computed)       │
│ └─ ai_audit.json                                  │
└─────────────────────────────────────────────────────┘
```

## Security Notes

- ✅ `correct_choice` is **never** returned in client payloads
- ✅ Admin endpoints check user role before responding
- ✅ Rate limiting prevents abuse
- ✅ Server-side scoring prevents client manipulation
- ✅ AI generation logs are stored for audit

## Next Steps

### When Ready to Connect Supabase

1. Set up Supabase project
2. Replace `lib/mock-data.ts` with Supabase JS client
3. Implement RLS policies (see `docs/constraints.md`)
4. Update environment variables
5. Remove mock data files

### Adding Real AI Generation

1. Install `ai` package: `pnpm add ai`
2. Replace mock generation in `app/api/events/[id]/generate-questions/route.ts`
3. Use Vercel AI Gateway or direct API
4. Update `lib/ai-client.ts` stub

## Troubleshooting

**Mock data not loading?**

- Check that `mock/` directory exists with JSON files
- Verify JSON syntax is valid
- Check file permissions

**Rate limiting too strict?**

- Adjust limits in `lib/rate-limit.ts` for development
- Reset in-memory store on server restart

**Tests not running?**

- Install dependencies: `pnpm install`
- Check jest config: `jest.config.js`
- Run with: `pnpm test --verbose`

## Support

For questions or issues:

1. Check test files for expected behavior
2. Review API contract tests in `tests/contract/`
3. Check integration tests in `tests/integration/`

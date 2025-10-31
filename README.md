# Event QR Polls

A Next.js application for hosting event Q&A sessions with AI-generated questions, QR code access, and real-time answer aggregation.

## Features

- **Admin Dashboard** - Create events and generate AI-powered questions
- **Public Participation** - Scan QR codes to access events and submit answers
- **Real-time Aggregation** - View instant statistics on responses
- **Server-side Scoring** - Prevent client-side answer manipulation
- **Rate Limiting** - Protect against abuse
- **CSV Export** - Download anonymized or detailed response data

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js Server Actions and Route Handlers
- **Storage**: Supabase PostgreSQL (production) / Mock JSON (development)
- **Auth**: Supabase Auth (production) / Mock (development)
- **Testing**: Jest, React Testing Library, Playwright
- **Hosting**: Vercel (recommended)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Using Mock Data

By default, the app uses mock JSON files for local development. No database setup required.

See [docs/quickstart.md](./docs/quickstart.md) for detailed setup instructions.

## Project Structure

```text
├── app/
│   ├── (public)/e/[eventId]/         # Public event pages
│   ├── (admin)/events/               # Admin dashboard
│   ├── api/                          # API routes
│   └── layout.tsx
├── lib/
│   ├── types.ts                      # TypeScript interfaces
│   ├── mock-data.ts                  # Data access layer
│   ├── auth.ts                       # Authentication
│   ├── ai-audit.ts                   # AI logging
│   └── rate-limit.ts                 # Rate limiting
├── tests/
│   ├── contract/                     # API contract tests
│   ├── integration/                  # Integration tests
│   └── e2e/                          # End-to-end tests
├── docs/
│   ├── quickstart.md                 # Setup guide
│   └── constraints.md                # Database constraints
└── mock/
    ├── events.json                   # Sample events
    ├── questions.json                # Sample questions
    ├── users.json                    # Sample users
    ├── answers.json                  # Sample answers
    └── ai_audit.json                 # Sample audit logs
```

## Available Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build
pnpm start

# Linting
pnpm lint

# Testing
pnpm test
pnpm test:watch
pnpm test:e2e

# Environment validation
node scripts/validate-env.ts
```

## Security Features

- ✅ Server-side answer scoring
- ✅ `correct_choice` never exposed to clients
- ✅ Admin route protection
- ✅ Rate limiting on sensitive endpoints
- ✅ Audit logging for AI operations
- ✅ Environment variable validation

## Documentation

- [Quick Start Guide](./docs/quickstart.md) - Setup and usage
- [Database Constraints](./docs/constraints.md) - Schema and RLS policies
- [API Specification](./specs/001-event-qr-polls/spec.md) - Feature requirements

## Roadmap

- [ ] Supabase PostgreSQL integration
- [ ] Real AI question generation (Claude/GPT-4)
- [ ] Advanced admin analytics
- [ ] Live event moderation
- [ ] Mobile app

## Contributing

1. Create a feature branch: `git checkout -b 001-event-qr-polls`
2. Make your changes and commit
3. Push to the branch
4. Open a Pull Request

## License

This project is proprietary software for Spindox.

## Contact

For questions or support, contact the development team.

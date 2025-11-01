# Mock data for Event QR Polls

This folder contains mock JSON data to develop and test the `Event QR Polls` feature without
connecting to Supabase.

Files:

- `events.json` — sample events
- `questions.json` — sample questions (note: `correct_choice` intentionally omitted from these
  public payloads; use server-only storage in production)
- `users.json` — sample users (admin + attendee)
- `answers.json` — sample answers with `is_correct` computed
- `ai_audit.json` — sample AI generation audit entries (prompt, model, response_hash)

Usage:

- Developers can fetch these files directly during local development in server handlers.
- Replace with DB-backed storage when wiring Supabase in later phases.

Note: DO NOT include secrets in these files.

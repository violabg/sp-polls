# Database Constraints & RLS Policies

This document describes the key database constraints and Row-Level Security (RLS) policies for the Event QR Polls feature.

## Duplicate Answer Prevention

**Policy**: One answer per (user, question) pair.

**Implementation Options**:

1. **Database Constraint** (Recommended for Production):

```sql
ALTER TABLE answers
ADD CONSTRAINT unique_user_question
UNIQUE (user_id, question_id);
```

1. **Application-Level Check** (Current Mock Implementation):
   - Before creating an answer, check `getAnswerByUserAndQuestion(userId, questionId)`
   - If it exists, reject or update based on policy
   - See `lib/mock-data.ts` and `app/api/questions/[id]/answers/route.ts`

**Policy Decision**: Duplicate submissions are **blocked** by default. To allow updates, modify constraint or application logic.

## Row-Level Security (RLS)

**Tables Requiring RLS**:

- `events`: Admins can CRUD; users can READ published events
- `questions`: Admins can CRUD; users can READ (but NOT correct_choice)
- `answers`: Users can INSERT their own; admins can READ aggregates
- `ai_audit`: Only accessible to admins (no user access)

**Example RLS Policies** (to implement in Supabase):

### Events Table

```sql
-- Admins can access all events
CREATE POLICY "Admins access all events" ON events
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users can read published events
CREATE POLICY "Users read published events" ON events
FOR SELECT USING (status = 'published');
```

### Questions Table

```sql
-- Admins can CRUD all questions
CREATE POLICY "Admins manage questions" ON questions
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users can read questions (public payload without correct_choice)
CREATE POLICY "Users read questions" ON questions
FOR SELECT USING (true);
```

### Answers Table

```sql
-- Users can insert their own answers
CREATE POLICY "Users insert own answers" ON answers
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own answers
CREATE POLICY "Users read own answers" ON answers
FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all answers for their events
CREATE POLICY "Admins read event answers" ON answers
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
  AND question_id IN (
    SELECT id FROM questions WHERE event_id IN (
      SELECT id FROM events WHERE created_by = auth.uid()
    )
  )
);
```

### AI Audit Table

```sql
-- Only admins can access ai_audit
CREATE POLICY "Admins read audit logs" ON ai_audit
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

## Implementation Timeline

1. **MVP (Current)**: Mock data with application-level checks
2. **Phase 2**: Migrate to Supabase Postgres with constraints and RLS
3. **Phase 3**: Add audit triggers and retention policies

## Future Enhancements

- Add audit triggers to log all changes to sensitive tables
- Implement data retention policies (e.g., auto-delete answers after 90 days)
- Add rate-limiting at database level (row counts per minute per user)

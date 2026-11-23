/*
# Create translations table for ISL Vision history

## Overview
ISL Vision is a browser-based Indian Sign Language translator with no sign-in flow.
This table stores the history of translations (both sign-to-text and speech-to-text)
so users can review their past translations across sessions.

## New Tables

### `translations`
Stores individual translation entries from the app.
- `id` (uuid, primary key) — unique identifier for each translation
- `text` (text, not null) — the translated text content
- `type` (text, not null) — either 'sign' (sign language recognition) or 'speech' (speech-to-text)
- `created_at` (timestamptz, default now()) — when the translation was recorded

## Security
- Row Level Security is ENABLED on `translations`.
- Four separate CRUD policies (SELECT, INSERT, UPDATE, DELETE) are created.
- All policies use `TO anon, authenticated` because the app has no sign-in screen;
  the frontend operates as the `anon` role for its entire lifetime.
- `USING (true)` / `WITH CHECK (true)` is intentional — this is a single-tenant,
  intentionally public/shared table with no user isolation.

## Important Notes
1. The app currently stores translations in localStorage. This table provides a
   durable server-side store as a superset/replacement.
2. No `user_id` column is included since there is no authentication flow.
3. Policies are dropped before creation to ensure idempotency.
*/

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  type text NOT NULL DEFAULT 'sign' CHECK (type IN ('sign', 'speech')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_translations" ON translations;
CREATE POLICY "anon_select_translations"
ON translations FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "anon_insert_translations" ON translations;
CREATE POLICY "anon_insert_translations"
ON translations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_translations" ON translations;
CREATE POLICY "anon_update_translations"
ON translations FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_translations" ON translations;
CREATE POLICY "anon_delete_translations"
ON translations FOR DELETE
TO anon, authenticated
USING (true);

CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations (created_at DESC);

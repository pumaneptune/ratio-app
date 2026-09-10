/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) — sender's full name
      - `email` (text) — sender's email address
      - `topic` (text) — selected topic
      - `message` (text) — message body
      - `created_at` (timestamptz) — submission timestamp

  2. Security
    - Enable RLS on `contact_messages`
    - INSERT allowed for anonymous users (public contact form)
    - SELECT restricted to authenticated users only (admin review)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  topic      text        NOT NULL DEFAULT '',
  message    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

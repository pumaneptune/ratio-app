/*
  # Fix contact_messages RLS policies

  ## Problem
  1. INSERT policy used `WITH CHECK (true)` — always passes, no validation.
  2. SELECT policy used `USING (true)` for all authenticated users — any logged-in
     user could read every contact message submitted by the public.

  ## Changes
  - DROP the permissive INSERT policy and replace it with one that validates all
    required fields are non-empty strings. This prevents empty/blank submissions
    and ensures the check clause is not trivially true.
  - DROP the overly broad SELECT policy. Contact message reads should happen
    server-side via the service role key (e.g. in an Edge Function or admin tool),
    not through client-side RLS. No authenticated client should be able to enumerate
    all contact submissions.

  ## Security notes
  - Anon users can still submit the contact form; the check now enforces that
    name, email, topic, and message are all non-blank.
  - No client-side SELECT path remains — access contact messages from the
    server/admin side using the service role key, which bypasses RLS entirely.
*/

-- Remove the always-true INSERT policy
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contact_messages;

-- Replace with a policy that validates required fields are non-empty
CREATE POLICY "Anon can submit contact message with valid fields"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (
    length(trim(name))    > 0 AND
    length(trim(email))   > 0 AND
    length(trim(topic))   > 0 AND
    length(trim(message)) > 0
  );

-- Remove the overly broad SELECT policy that exposed all messages to any
-- authenticated user. Admin reads should use the service role key server-side.
DROP POLICY IF EXISTS "Authenticated users can read contact messages" ON contact_messages;

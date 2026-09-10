/*
# Add admin read/update/delete policies + is_read column on contact_messages

1. Modified Tables
   - `contact_messages`
     - `is_read` (boolean, default false) — tracks whether an admin has read the message
     - `read_at` (timestamptz, nullable) — timestamp when marked read

2. Security
   - Add SELECT policy for authenticated users so signed-in admins can view messages.
   - Add UPDATE policy for authenticated users so admins can mark messages read/unread.
   - Add DELETE policy for authenticated users so admins can remove messages.
   - The public INSERT policy for anon is unchanged (contact form still works for everyone).
   - NOTE: any authenticated user can read all messages. After creating your admin
     account, disable public sign-up in the Supabase dashboard so no one else can
     register and view messages.
*/

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_at timestamptz;

DROP POLICY IF EXISTS "Authenticated can read contact messages" ON contact_messages;
CREATE POLICY "Authenticated can read contact messages"
  ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can update contact messages" ON contact_messages;
CREATE POLICY "Authenticated can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete contact messages" ON contact_messages;
CREATE POLICY "Authenticated can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated USING (true);

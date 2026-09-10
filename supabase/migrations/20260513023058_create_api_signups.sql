/*
  # Create API Signups Table

  ## Purpose
  Stores developer signups from the /get-api-key page. Each row represents
  one access request. A generated API key is associated after submission.

  ## Tables
  - `api_signups`
    - `id`           uuid PK
    - `full_name`    text — submitter's full name
    - `email`        text unique — verified email address
    - `company`      text — company or project name (optional)
    - `use_case`     text — selected use case category
    - `description`  text — freeform description (optional)
    - `api_key`      text — generated key shown once (hashed copy stored separately)
    - `plan`         text — 'free' | 'payperCall' | 'infrastructure'
    - `status`       text — 'pending' | 'active' | 'suspended'
    - `created_at`   timestamptz

  ## Security
  - RLS enabled
  - Anonymous INSERT allowed (public signup form)
  - No SELECT policy — keys are returned only at creation time via edge function
*/

CREATE TABLE IF NOT EXISTS api_signups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    text NOT NULL DEFAULT '',
  email        text NOT NULL,
  company      text NOT NULL DEFAULT '',
  use_case     text NOT NULL DEFAULT '',
  description  text NOT NULL DEFAULT '',
  api_key      text NOT NULL DEFAULT '',
  plan         text NOT NULL DEFAULT 'free',
  status       text NOT NULL DEFAULT 'active',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS api_signups_email_idx ON api_signups (email);

ALTER TABLE api_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a signup"
  ON api_signups
  FOR INSERT
  TO anon
  WITH CHECK (
    full_name  <> '' AND
    email      <> '' AND
    use_case   <> ''
  );

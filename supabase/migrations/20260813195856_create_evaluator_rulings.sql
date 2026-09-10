/*
  # Create evaluator_rulings table

  1. New Tables
    - `evaluator_rulings`
      - `id` (uuid, primary key, auto-generated)
      - `job_id` (text, not null) — the ACP job identifier being ruled on
      - `chain_id` (text, not null) — blockchain/network the job ran on
      - `action` (text, not null) — the action being evaluated
      - `verdict` (text, not null) — outcome: "proceed", "block", "complete", "reject"
      - `confidence` (numeric, nullable) — 0.0–1.0 confidence score
      - `reason` (text, nullable) — human-readable explanation of the verdict
      - `created_at` (timestamptz, defaults to now())

  2. Security
    - Enable RLS on `evaluator_rulings`.
    - Public SELECT only (TO anon, authenticated) — rulings are intentionally public.
    - No public INSERT/UPDATE/DELETE — rows are written server-side only.

  3. Indexes
    - `idx_evaluator_rulings_created_at` on `created_at DESC` for newest-first listing.
*/

CREATE TABLE IF NOT EXISTS evaluator_rulings (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id     text        NOT NULL,
  chain_id   text        NOT NULL,
  action     text        NOT NULL,
  verdict    text        NOT NULL,
  confidence numeric,
  reason     text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE evaluator_rulings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_evaluator_rulings_created_at
  ON evaluator_rulings (created_at DESC);

DROP POLICY IF EXISTS "public_select_evaluator_rulings" ON evaluator_rulings;
CREATE POLICY "public_select_evaluator_rulings"
  ON evaluator_rulings
  FOR SELECT
  TO anon, authenticated
  USING (true);
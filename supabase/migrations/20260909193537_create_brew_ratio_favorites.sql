/*
# Create brew ratio favorites (single-tenant, no sign-in)

1. New Tables
- `brew_ratio_favorites`
- `id` (uuid, primary key)
- `method` (text, selected brew method name)
- `ratio` (numeric, coffee-to-water ratio)
- `coffee_grams` (numeric, saved coffee dose)
- `created_at` (timestamptz, save timestamp)

2. Security
- Enable row level security on the table.
- Allow anonymous and authenticated visitors to read, create, update, and delete favorites because this app does not include sign-in and uses a shared single-tenant workspace.

3. Important Notes
- Favorites contain only calculator settings and do not contain private user data.
- The ratio and coffee dose are constrained to sensible calculator ranges.
*/

CREATE TABLE IF NOT EXISTS public.brew_ratio_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method text NOT NULL,
  ratio numeric(4,1) NOT NULL CHECK (ratio >= 1 AND ratio <= 100),
  coffee_grams numeric(6,2) NOT NULL CHECK (coffee_grams > 0 AND coffee_grams <= 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brew_ratio_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read brew ratio favorites" ON public.brew_ratio_favorites;
CREATE POLICY "Public can read brew ratio favorites"
  ON public.brew_ratio_favorites FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can create brew ratio favorites" ON public.brew_ratio_favorites;
CREATE POLICY "Public can create brew ratio favorites"
  ON public.brew_ratio_favorites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update brew ratio favorites" ON public.brew_ratio_favorites;
CREATE POLICY "Public can update brew ratio favorites"
  ON public.brew_ratio_favorites FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete brew ratio favorites" ON public.brew_ratio_favorites;
CREATE POLICY "Public can delete brew ratio favorites"
  ON public.brew_ratio_favorites FOR DELETE
  TO anon, authenticated
  USING (true);

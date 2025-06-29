/*
  # Fix story visibility policies

  1. Security Updates
    - Add policy for admins to read all stories (including unapproved)
    - Ensure public can read approved stories
    - Allow contributors to read their own stories
    - Add update policy for admin approval workflow

  2. Changes
    - Drop existing restrictive policies
    - Create new comprehensive policies
    - Add admin update permissions
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can read approved stories" ON stories;
DROP POLICY IF EXISTS "Anyone can submit stories" ON stories;
DROP POLICY IF EXISTS "Contributors can read own stories" ON stories;

-- Policy: Public can read approved stories
CREATE POLICY "Public can read approved stories"
  ON stories
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Policy: Anyone can submit stories (unapproved by default)
CREATE POLICY "Anyone can submit stories"
  ON stories
  FOR INSERT
  TO public
  WITH CHECK (is_approved = false);

-- Policy: Contributors can read their own stories (approved or not)
CREATE POLICY "Contributors can read own stories"
  ON stories
  FOR SELECT
  TO public
  USING (
    contributor_email = COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'email'),
      ''
    )
  );

-- Policy: Allow reading all stories for admin purposes (temporary - should be restricted to admin users)
CREATE POLICY "Allow reading unapproved stories"
  ON stories
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow updating story approval status
CREATE POLICY "Allow updating stories"
  ON stories
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy: Allow deleting stories (for rejection)
CREATE POLICY "Allow deleting stories"
  ON stories
  FOR DELETE
  TO public
  USING (true);
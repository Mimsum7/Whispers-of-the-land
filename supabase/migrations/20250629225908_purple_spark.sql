/*
  # Fix Database Functions and RLS Policies

  1. Database Functions
    - Create or replace uid() function to get current user ID
    - Create or replace is_admin() function to check admin status
    - Fix trigger functions for user creation and updates

  2. RLS Policies
    - Fix stories table policies for public access
    - Ensure proper admin access policies
    - Fix profiles table policies

  3. Permissions
    - Grant proper permissions to authenticated and anonymous users
*/

-- Create or replace the uid() function to get current user ID
CREATE OR REPLACE FUNCTION uid() 
RETURNS uuid 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Create or replace the is_admin() function
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS boolean 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$;

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column() 
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create or replace the update_profiles_updated_at function
CREATE OR REPLACE FUNCTION update_profiles_updated_at() 
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Fix stories table RLS policies
DROP POLICY IF EXISTS "Anyone can submit stories" ON stories;
CREATE POLICY "Anyone can submit stories"
  ON stories
  FOR INSERT
  TO public
  WITH CHECK (is_approved = false);

DROP POLICY IF EXISTS "Public can read approved stories" ON stories;
CREATE POLICY "Public can read approved stories"
  ON stories
  FOR SELECT
  TO public
  USING (is_approved = true);

DROP POLICY IF EXISTS "Contributors can read own stories" ON stories;
CREATE POLICY "Contributors can read own stories"
  ON stories
  FOR SELECT
  TO public
  USING (
    contributor_email = COALESCE(
      ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text), 
      ''::text
    )
  );

DROP POLICY IF EXISTS "Admins can read all stories" ON stories;
CREATE POLICY "Admins can read all stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update stories" ON stories;
CREATE POLICY "Admins can update stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete stories" ON stories;
CREATE POLICY "Admins can delete stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix profiles table RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (uid() = id)
  WITH CHECK (uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.stories TO authenticated, anon;

-- Ensure RLS is enabled on both tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
/*
  # Fix Authentication and Admin Setup

  1. Functions
    - Create uid() function for getting current user ID
    - Create is_admin() function for checking admin status
    - Create make_user_admin() function for promoting users to admin
    - Fix handle_new_user() function for automatic profile creation

  2. Triggers
    - Recreate trigger for new user registration

  3. Security
    - Fix RLS policies for profiles and stories tables
    - Ensure proper permissions are granted

  4. Admin Setup
    - Provides function to easily make users admin
    - Instructions included for making yourself admin
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

-- Function to make an existing user admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected integer;
BEGIN
  UPDATE profiles 
  SET role = 'admin', 
      full_name = COALESCE(full_name, 'Admin User'),
      updated_at = now()
  WHERE email = user_email;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  IF rows_affected > 0 THEN
    RAISE NOTICE 'User % has been made admin', user_email;
    RETURN true;
  ELSE
    RAISE NOTICE 'User % not found', user_email;
    RETURN false;
  END IF;
END;
$$;

-- Create a trigger function to automatically create profiles for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user',
    now(),
    now()
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, update it
    UPDATE profiles 
    SET email = NEW.email,
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
        updated_at = now()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

-- Recreate the trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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

-- Ensure RLS is enabled on both tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.stories TO authenticated, anon;

-- Instructions for making a user admin:
-- After signing up with any email, run this in the SQL editor:
-- SELECT make_user_admin('your-email@example.com');

-- For testing, you can make admin@test.com an admin (after they sign up):
-- SELECT make_user_admin('admin@test.com');
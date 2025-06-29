/*
  # Create Admin User Function

  1. Functions
    - `make_user_admin(email)` - Function to promote existing users to admin
    - `is_admin()` - Function to check if current user is admin (if not exists)

  2. Security
    - Only updates existing users who have signed up
    - Cannot create profiles without corresponding auth users
*/

-- Function to check if current user is admin (create if not exists)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Function to make an existing user admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles 
  SET role = 'admin', 
      full_name = COALESCE(full_name, 'Admin User'),
      updated_at = now()
  WHERE email = user_email;
  
  RETURN FOUND;
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
END;
$$;

-- Create trigger for new user registration (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Instructions for making a user admin:
-- After signing up with any email, run this to make them admin:
-- SELECT make_user_admin('your-email@example.com');

-- Example: Uncomment and modify the line below with your actual email after signing up:
-- SELECT make_user_admin('admin@test.com');
/*
  # Create Test Admin User

  1. Updates
    - Create a test admin user profile
    - Ensure proper admin permissions are set
  
  2. Security
    - This is for testing purposes only
    - In production, admin users should be created through proper channels
*/

-- Insert a test admin profile (you'll need to sign up with this email first)
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder ID, will be updated when user signs up
  'admin@test.com',
  'Test Admin',
  'admin',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  full_name = 'Test Admin',
  updated_at = now();

-- Update any existing user with admin@test.com to be admin
UPDATE profiles 
SET role = 'admin', full_name = 'Test Admin', updated_at = now()
WHERE email = 'admin@test.com';

-- Also update any user with the email you're currently using to be admin (replace with your actual email)
-- Uncomment and modify the line below with your actual email:
-- UPDATE profiles SET role = 'admin', updated_at = now() WHERE email = 'your-email@example.com';
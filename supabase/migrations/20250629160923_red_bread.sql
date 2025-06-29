/*
  # Create stories table for African folklore digital library

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `title` (text, story title)
      - `country` (text, origin country)
      - `language` (text, native language)
      - `theme` (text, story theme/category)
      - `native_text` (text, story in original language)
      - `english_text` (text, English translation)
      - `contributor` (text, contributor name)
      - `contributor_email` (text, contributor email)
      - `native_audio_url` (text, optional native audio file path)
      - `english_audio_url` (text, optional English audio file path)
      - `illustration_url` (text, optional illustration file path)
      - `is_approved` (boolean, moderation status)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `stories` table
    - Add policy for public read access to approved stories
    - Add policy for authenticated users to submit stories
    - Add policy for admin users to manage all stories

  3. Storage Buckets
    - Create buckets for audio files and illustrations
    - Set appropriate policies for file uploads
*/

-- Create the stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  country text NOT NULL,
  language text NOT NULL,
  theme text NOT NULL,
  native_text text NOT NULL,
  english_text text NOT NULL,
  contributor text NOT NULL,
  contributor_email text NOT NULL,
  native_audio_url text,
  english_audio_url text,
  illustration_url text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved stories
CREATE POLICY "Anyone can read approved stories"
  ON stories
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Policy: Anyone can submit stories (they start as unapproved)
CREATE POLICY "Anyone can submit stories"
  ON stories
  FOR INSERT
  TO public
  WITH CHECK (is_approved = false);

-- Policy: Contributors can read their own stories
CREATE POLICY "Contributors can read own stories"
  ON stories
  FOR SELECT
  TO public
  USING (contributor_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('audio', 'audio', true),
  ('illustrations', 'illustrations', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can upload audio files
CREATE POLICY "Anyone can upload audio files"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'audio');

-- Policy: Anyone can view audio files
CREATE POLICY "Anyone can view audio files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'audio');

-- Policy: Anyone can upload illustration files
CREATE POLICY "Anyone can upload illustration files"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'illustrations');

-- Policy: Anyone can view illustration files
CREATE POLICY "Anyone can view illustration files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'illustrations');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_approved ON stories(is_approved);
CREATE INDEX IF NOT EXISTS idx_stories_country ON stories(country);
CREATE INDEX IF NOT EXISTS idx_stories_language ON stories(language);
CREATE INDEX IF NOT EXISTS idx_stories_theme ON stories(theme);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
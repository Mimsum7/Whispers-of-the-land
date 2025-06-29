/*
  # Add title translation field

  1. Schema Changes
    - Add `title_english` column to stories table
    - Update existing stories to have English title if not provided
  
  2. Notes
    - Existing stories will use their current title as English title
    - New submissions will have separate native and English titles
*/

-- Add title_english column to stories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'title_english'
  ) THEN
    ALTER TABLE stories ADD COLUMN title_english text;
  END IF;
END $$;

-- Update existing stories to use current title as English title if title_english is null
UPDATE stories 
SET title_english = title 
WHERE title_english IS NULL OR title_english = '';

-- Make title_english required for new entries
ALTER TABLE stories ALTER COLUMN title_english SET NOT NULL;
/*
  # Create career goals table for user career data

  1. New Tables
    - `career_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `career_goals` (text)
      - `experience_level` (text)
      - `challenges` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `career_goals` table
    - Add policies for users to manage their own career goals
*/

CREATE TABLE IF NOT EXISTS career_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  career_goals text NOT NULL,
  experience_level text NOT NULL,
  challenges text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;

-- Users can read their own career goals
CREATE POLICY "Users can read own career goals"
  ON career_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own career goals
CREATE POLICY "Users can insert own career goals"
  ON career_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own career goals
CREATE POLICY "Users can update own career goals"
  ON career_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own career goals
CREATE POLICY "Users can delete own career goals"
  ON career_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
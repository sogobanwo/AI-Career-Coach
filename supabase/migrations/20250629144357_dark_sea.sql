/*
  # Add unique constraint to career_goals user_id

  1. Changes
    - Add unique constraint on `user_id` column in `career_goals` table
    - This allows upsert operations to work correctly by identifying conflicts on user_id
    
  2. Security
    - No changes to existing RLS policies
    - Maintains data integrity by ensuring one career goal record per user
*/

-- Add unique constraint to user_id column
ALTER TABLE public.career_goals 
ADD CONSTRAINT career_goals_user_id_unique UNIQUE (user_id);
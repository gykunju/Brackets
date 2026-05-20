-- File: add_progress_column.sql
-- Add a 'completed' column to the 'unit' table to allow users to track their progress.

ALTER TABLE public.unit
ADD COLUMN completed boolean DEFAULT false;

-- After running this SQL command in your Supabase SQL Editor, your Brackets app 
-- will be able to save and display unit completion status!

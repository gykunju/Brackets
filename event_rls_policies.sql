-- RLS Policies for Event Table
-- Run these in Supabase SQL Editor if events are not creating

-- First, enable RLS on the event table (if not already enabled)
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can insert their own events
CREATE POLICY "Users can insert their own events"
ON public.event
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = (
    SELECT supabase_user_id
    FROM public.profile
    WHERE id = event.user_id
  )
);

-- Policy 2: Users can view their own events
CREATE POLICY "Users can select their own events"
ON public.event
FOR SELECT
TO authenticated
USING (
  auth.uid() = (
    SELECT supabase_user_id
    FROM public.profile
    WHERE id = event.user_id
  )
);

-- Policy 3: Users can update their own events
CREATE POLICY "Users can update their own events"
ON public.event
FOR UPDATE
TO authenticated
USING (
  auth.uid() = (
    SELECT supabase_user_id
    FROM public.profile
    WHERE id = event.user_id
  )
)
WITH CHECK (
  auth.uid() = (
    SELECT supabase_user_id
    FROM public.profile
    WHERE id = event.user_id
  )
);

-- Policy 4: Users can delete their own events
CREATE POLICY "Users can delete their own events"
ON public.event
FOR DELETE
TO authenticated
USING (
  auth.uid() = (
    SELECT supabase_user_id
    FROM public.profile
    WHERE id = event.user_id
  )
);

-- IMPORTANT: If the above policies fail, you may need to drop existing conflicting policies first
-- To check existing policies, run:
-- SELECT * FROM pg_policies WHERE tablename = 'event';

-- To drop a policy (if needed):
-- DROP POLICY IF EXISTS "policy_name_here" ON public.event;

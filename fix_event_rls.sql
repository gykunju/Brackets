-- Enable RLS on the event table
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

-- 1. Owner can select their events
DROP POLICY IF EXISTS "Users can select their own events" ON public.event;
CREATE POLICY "Users can select their own events" ON public.event
FOR SELECT USING (
  user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid())
);

-- 2. Owner can insert their events
DROP POLICY IF EXISTS "Users can insert their own events" ON public.event;
CREATE POLICY "Users can insert their own events" ON public.event
FOR INSERT WITH CHECK (
  user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid())
);

-- 3. Owner can update their events
DROP POLICY IF EXISTS "Users can update their own events" ON public.event;
CREATE POLICY "Users can update their own events" ON public.event
FOR UPDATE USING (
  user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid())
);

-- 4. Owner can delete their events
DROP POLICY IF EXISTS "Users can delete their own events" ON public.event;
CREATE POLICY "Users can delete their own events" ON public.event
FOR DELETE USING (
  user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid())
);

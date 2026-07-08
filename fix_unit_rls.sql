-- Enable RLS on the unit table
ALTER TABLE public.unit ENABLE ROW LEVEL SECURITY;

-- 1. Owner can select their units
DROP POLICY IF EXISTS "Users can select their own units" ON public.unit;
CREATE POLICY "Users can select their own units" ON public.unit
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bracket
    JOIN public.profile ON public.profile.id = public.bracket.user_id
    WHERE public.bracket.id = unit.bracket_id AND public.profile.supabase_user_id = auth.uid()
  )
);

-- 2. Owner can insert their units
DROP POLICY IF EXISTS "Users can insert their own units" ON public.unit;
CREATE POLICY "Users can insert their own units" ON public.unit
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bracket
    JOIN public.profile ON public.profile.id = public.bracket.user_id
    WHERE public.bracket.id = unit.bracket_id AND public.profile.supabase_user_id = auth.uid()
  )
);

-- 3. Owner can update their units
DROP POLICY IF EXISTS "Users can update their own units" ON public.unit;
CREATE POLICY "Users can update their own units" ON public.unit
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.bracket
    JOIN public.profile ON public.profile.id = public.bracket.user_id
    WHERE public.bracket.id = unit.bracket_id AND public.profile.supabase_user_id = auth.uid()
  )
);

-- 4. Owner can delete their units
DROP POLICY IF EXISTS "Users can delete their own units" ON public.unit;
CREATE POLICY "Users can delete their own units" ON public.unit
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.bracket
    JOIN public.profile ON public.profile.id = public.bracket.user_id
    WHERE public.bracket.id = unit.bracket_id AND public.profile.supabase_user_id = auth.uid()
  )
);

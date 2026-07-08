-- Enable RLS on the bracket table
ALTER TABLE public.bracket ENABLE ROW LEVEL SECURITY;

-- 1. Owner can select their brackets
DROP POLICY IF EXISTS "Users can select their own brackets" ON public.bracket;
CREATE POLICY "Users can select their own brackets" ON public.bracket
FOR SELECT USING (
  auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = bracket.user_id)
);

-- 2. Owner can insert brackets
DROP POLICY IF EXISTS "Users can insert their own brackets" ON public.bracket;
CREATE POLICY "Users can insert their own brackets" ON public.bracket
FOR INSERT WITH CHECK (
  auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = bracket.user_id)
);

-- 3. Owner can update their brackets
DROP POLICY IF EXISTS "Users can update their own brackets" ON public.bracket;
CREATE POLICY "Users can update their own brackets" ON public.bracket
FOR UPDATE USING (
  auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = bracket.user_id)
);

-- 4. Owner can delete their brackets
DROP POLICY IF EXISTS "Users can delete their own brackets" ON public.bracket;
CREATE POLICY "Users can delete their own brackets" ON public.bracket
FOR DELETE USING (
  auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = bracket.user_id)
);

-- 5. Public can view public brackets (from previous script)
DROP POLICY IF EXISTS "Anyone can view public brackets" ON public.bracket;
CREATE POLICY "Anyone can view public brackets" ON public.bracket
FOR SELECT USING (is_public = true);

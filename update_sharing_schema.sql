-- 1. Add fields to bracket table
ALTER TABLE public.bracket 
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN share_token UUID DEFAULT gen_random_uuid();

-- Create an index on share_token for fast lookups
CREATE INDEX bracket_share_token_idx ON public.bracket(share_token);

-- 2. Update RLS on bracket table
-- Drop existing select policy (assuming it was named something like 'Users can view their own brackets')
-- We use a generic approach if the name varies, or just add a new policy.
-- To be safe, we'll just CREATE a new policy that overlaps, or drop the standard one if we know it.
-- Let's just create an overlapping policy for public reading:
CREATE POLICY "Anyone can view public brackets" ON public.bracket
  FOR SELECT USING (is_public = true);

-- 3. Update RLS on unit table
-- Allow anyone to view units if the parent bracket is public
CREATE POLICY "Anyone can view units of public brackets" ON public.unit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bracket 
      WHERE bracket.id = unit.bracket_id AND bracket.is_public = true
    )
  );

-- 4. Update RLS on content table
-- Allow anyone to view content if the parent unit's bracket is public
CREATE POLICY "Anyone can view content of public brackets" ON public.content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.unit
      JOIN public.bracket ON bracket.id = unit.bracket_id
      WHERE unit.id = content.unit_id AND bracket.is_public = true
    )
  );

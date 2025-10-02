-- ============================================
-- AUTH TRIGGER SETUP FOR BRACKETS
-- Run this after setup.sql to enable automatic user profile creation
-- ============================================

-- 1. Add INSERT policy for new users (needed for signup)
CREATE POLICY "Users can insert their own profile on signup" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url',
    'learner'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Verify policies are correct
-- View current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users';

COMMIT;

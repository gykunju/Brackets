-- 1. Create chat_session table
CREATE TABLE public.chat_session (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id bigint REFERENCES public.profile(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'New Conversation'
);

-- 2. Create chat_message table
CREATE TABLE public.chat_message (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  session_id uuid REFERENCES public.chat_session(id) ON DELETE CASCADE NOT NULL,
  user_id bigint REFERENCES public.profile(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('user', 'ai')) NOT NULL,
  content text NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.chat_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message ENABLE ROW LEVEL SECURITY;

-- 4. RLS for chat_session
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_session
  FOR ALL
  USING (user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid()))
  WITH CHECK (user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid()));

-- 5. RLS for chat_message
CREATE POLICY "Users can manage their own chat messages" ON public.chat_message
  FOR ALL
  USING (user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid()))
  WITH CHECK (user_id = (SELECT id FROM public.profile WHERE supabase_user_id = auth.uid()));

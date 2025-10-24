-- Content table for storing uploaded PDFs and images
-- This table links uploaded files to specific units

CREATE TABLE public.content (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying NOT NULL,
  description character varying,
  file_url character varying NOT NULL,
  file_name character varying NOT NULL,
  file_type character varying NOT NULL, -- 'pdf' or 'image'
  file_size bigint, -- size in bytes
  mime_type character varying, -- e.g., 'application/pdf', 'image/png'
  unit_id bigint NOT NULL,
  user_id bigint NOT NULL,
  CONSTRAINT content_pkey PRIMARY KEY (id),
  CONSTRAINT content_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(id) ON DELETE CASCADE,
  CONSTRAINT content_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX content_unit_id_idx ON public.content(unit_id);
CREATE INDEX content_user_id_idx ON public.content(user_id);

-- Enable Row Level Security
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own content
CREATE POLICY "Users can view their own content" ON public.content
  FOR SELECT USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can insert their own content" ON public.content
  FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can update their own content" ON public.content
  FOR UPDATE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can delete their own content" ON public.content
  FOR DELETE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

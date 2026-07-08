-- 1. Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the content_chunks table
CREATE TABLE IF NOT EXISTS public.content_chunks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_id bigint NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id bigint NOT NULL REFERENCES public.profile(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  chunk_text text NOT NULL,
  embedding vector(384) -- 384 dimensions for Xenova/all-MiniLM-L6-v2
);

-- 3. Create an index for faster similarity searches (Cosine Similarity)
-- Requires at least some data to build effectively, but safe to create initially.
CREATE INDEX IF NOT EXISTS content_chunks_embedding_idx ON public.content_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. Enable RLS
ALTER TABLE public.content_chunks ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Users can view their own content chunks" ON public.content_chunks;
CREATE POLICY "Users can view their own content chunks" ON public.content_chunks
  FOR SELECT USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

DROP POLICY IF EXISTS "Users can insert their own content chunks" ON public.content_chunks;
CREATE POLICY "Users can insert their own content chunks" ON public.content_chunks
  FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

-- 6. Create RPC function for AI semantic search
CREATE OR REPLACE FUNCTION match_content_chunks(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  p_user_id bigint
)
RETURNS TABLE (
  id bigint,
  content_id bigint,
  chunk_text text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    cc.id,
    cc.content_id,
    cc.chunk_text,
    1 - (cc.embedding <=> query_embedding) as similarity
  FROM content_chunks cc
  WHERE cc.user_id = p_user_id
    AND 1 - (cc.embedding <=> query_embedding) > match_threshold
  ORDER BY cc.embedding <=> query_embedding
  LIMIT match_count;
$$;

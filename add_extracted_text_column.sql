-- Add extracted_text column to content table
-- This will store the text extracted from uploaded documents
-- so the AI can access and analyze the content

ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS extracted_text text;

-- Create index for text search (optional, but recommended for large datasets)
CREATE INDEX IF NOT EXISTS content_extracted_text_idx ON public.content USING gin(to_tsvector('english', extracted_text));

-- Update the comment on the file_type column to reflect new types
COMMENT ON COLUMN public.content.file_type IS 'File type: pdf, image, word, or powerpoint';

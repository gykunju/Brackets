-- Enhancement for Village Circles: Questions, Answers, Resources, and Validation

-- Add new columns to circle_messages table
ALTER TABLE circle_messages
ADD COLUMN IF NOT EXISTS is_question BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES circle_messages(id),
ADD COLUMN IF NOT EXISTS validated_by_asker BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS marked_helpful_by UUID[] DEFAULT ARRAY[]::UUID[];

-- Create circle_resources table
CREATE TABLE IF NOT EXISTS circle_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES village_circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'pdf', 'link', 'ai_generated')),
  url TEXT,
  description TEXT,
  content TEXT, -- For AI-generated content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_circle_resources_circle_id ON circle_resources(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_messages_reply_to ON circle_messages(reply_to);
CREATE INDEX IF NOT EXISTS idx_circle_messages_is_question ON circle_messages(is_question);

-- Enable RLS on circle_resources
ALTER TABLE circle_resources ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can view resources
CREATE POLICY "Anyone can view circle resources"
  ON circle_resources FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Circle members can add resources
CREATE POLICY "Circle members can add resources"
  ON circle_resources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_resources.circle_id
      AND circle_members.user_id = auth.uid()
    )
  );

-- Policy: Resource creators can update their resources
CREATE POLICY "Resource creators can update their resources"
  ON circle_resources FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Resource creators can delete their resources
CREATE POLICY "Resource creators can delete their resources"
  ON circle_resources FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_circle_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER circle_resources_updated_at
  BEFORE UPDATE ON circle_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_circle_resources_updated_at();

-- Add comment for documentation
COMMENT ON TABLE circle_resources IS 'Learning resources shared within village circles';
COMMENT ON COLUMN circle_messages.is_question IS 'Marks message as a question to be answered';
COMMENT ON COLUMN circle_messages.reply_to IS 'Links message as a reply to another message (typically a question)';
COMMENT ON COLUMN circle_messages.validated_by_asker IS 'Marks answer as validated/helpful by the original question asker';
COMMENT ON COLUMN circle_messages.marked_helpful_by IS 'Array of user IDs who marked this message as helpful';

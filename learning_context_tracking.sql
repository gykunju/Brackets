-- Learning Context and Progress Tracking System

-- Create user_learning_context table to track interests and interactions
CREATE TABLE IF NOT EXISTS user_learning_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  interaction_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interest_level INTEGER DEFAULT 1 CHECK (interest_level BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic, category)
);

-- Create learning_progress_indicators table
CREATE TABLE IF NOT EXISTS learning_progress_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  estimated_progress INTEGER DEFAULT 0 CHECK (estimated_progress BETWEEN 0 AND 100),
  topics_explored TEXT[] DEFAULT ARRAY[]::TEXT[],
  content_consumed INTEGER DEFAULT 0,
  questions_asked INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  resources_viewed INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Create learning_snippets table for recommendations
CREATE TABLE IF NOT EXISTS learning_snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_read_time_minutes INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_snippet_history table to track sent snippets
CREATE TABLE IF NOT EXISTS user_snippet_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snippet_id UUID NOT NULL REFERENCES learning_snippets(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  marked_helpful BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  UNIQUE(user_id, snippet_id, sent_at)
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snippet_notifications_enabled BOOLEAN DEFAULT TRUE,
  notification_frequency_hours INTEGER DEFAULT 1 CHECK (notification_frequency_hours > 0),
  preferred_times TIME[] DEFAULT ARRAY['09:00:00'::TIME, '12:00:00'::TIME, '15:00:00'::TIME, '18:00:00'::TIME],
  categories_to_include TEXT[] DEFAULT ARRAY[]::TEXT[],
  difficulty_preference TEXT DEFAULT 'mixed' CHECK (difficulty_preference IN ('beginner', 'intermediate', 'advanced', 'mixed')),
  last_snippet_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_learning_context_user_id ON user_learning_context(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_context_category ON user_learning_context(category);
CREATE INDEX IF NOT EXISTS idx_user_learning_context_interest ON user_learning_context(interest_level DESC);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress_indicators(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_category ON learning_progress_indicators(category);
CREATE INDEX IF NOT EXISTS idx_learning_snippets_category ON learning_snippets(category);
CREATE INDEX IF NOT EXISTS idx_learning_snippets_topic ON learning_snippets(topic);
CREATE INDEX IF NOT EXISTS idx_user_snippet_history_user_id ON user_snippet_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Enable RLS
ALTER TABLE user_learning_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_snippet_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_learning_context
CREATE POLICY "Users can view their own learning context"
  ON user_learning_context FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own learning context"
  ON user_learning_context FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own learning context"
  ON user_learning_context FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for learning_progress_indicators
CREATE POLICY "Users can view their own progress"
  ON learning_progress_indicators FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON learning_progress_indicators FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON learning_progress_indicators FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for learning_snippets
CREATE POLICY "Anyone can view learning snippets"
  ON learning_snippets FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_snippet_history
CREATE POLICY "Users can view their own snippet history"
  ON user_snippet_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own snippet history"
  ON user_snippet_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own snippet history"
  ON user_snippet_history FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to update learning context
CREATE OR REPLACE FUNCTION update_learning_context(
  p_user_id UUID,
  p_topic TEXT,
  p_category TEXT,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_learning_context (user_id, topic, category, interaction_count, time_spent_seconds, last_interaction, interest_level)
  VALUES (p_user_id, p_topic, p_category, 1, p_time_spent, NOW(), 1)
  ON CONFLICT (user_id, topic, category)
  DO UPDATE SET
    interaction_count = user_learning_context.interaction_count + 1,
    time_spent_seconds = user_learning_context.time_spent_seconds + p_time_spent,
    last_interaction = NOW(),
    interest_level = LEAST(10, user_learning_context.interest_level + 1),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to update progress indicator
CREATE OR REPLACE FUNCTION update_progress_indicator(
  p_user_id UUID,
  p_category TEXT,
  p_topic TEXT DEFAULT NULL,
  p_content_consumed BOOLEAN DEFAULT FALSE,
  p_question_asked BOOLEAN DEFAULT FALSE,
  p_question_answered BOOLEAN DEFAULT FALSE,
  p_resource_viewed BOOLEAN DEFAULT FALSE
)
RETURNS void AS $$
DECLARE
  v_topics TEXT[];
  v_progress INTEGER;
BEGIN
  -- Get current topics
  SELECT topics_explored INTO v_topics
  FROM learning_progress_indicators
  WHERE user_id = p_user_id AND category = p_category;
  
  -- Add new topic if provided
  IF p_topic IS NOT NULL THEN
    v_topics := array_append(v_topics, p_topic);
    v_topics := array_remove(array_agg(DISTINCT unnest), NULL)
      FROM unnest(v_topics);
  END IF;
  
  -- Calculate progress (simple metric: engagement increases progress)
  v_progress := (
    COALESCE(array_length(v_topics, 1), 0) * 10 +
    (CASE WHEN p_content_consumed THEN 5 ELSE 0 END) +
    (CASE WHEN p_question_asked THEN 3 ELSE 0 END) +
    (CASE WHEN p_question_answered THEN 8 ELSE 0 END) +
    (CASE WHEN p_resource_viewed THEN 2 ELSE 0 END)
  );
  
  INSERT INTO learning_progress_indicators (
    user_id, category, topics_explored, content_consumed,
    questions_asked, questions_answered, resources_viewed,
    estimated_progress, last_activity
  )
  VALUES (
    p_user_id, p_category, v_topics,
    CASE WHEN p_content_consumed THEN 1 ELSE 0 END,
    CASE WHEN p_question_asked THEN 1 ELSE 0 END,
    CASE WHEN p_question_answered THEN 1 ELSE 0 END,
    CASE WHEN p_resource_viewed THEN 1 ELSE 0 END,
    LEAST(100, v_progress),
    NOW()
  )
  ON CONFLICT (user_id, category)
  DO UPDATE SET
    topics_explored = v_topics,
    content_consumed = learning_progress_indicators.content_consumed + CASE WHEN p_content_consumed THEN 1 ELSE 0 END,
    questions_asked = learning_progress_indicators.questions_asked + CASE WHEN p_question_asked THEN 1 ELSE 0 END,
    questions_answered = learning_progress_indicators.questions_answered + CASE WHEN p_question_answered THEN 1 ELSE 0 END,
    resources_viewed = learning_progress_indicators.resources_viewed + CASE WHEN p_resource_viewed THEN 1 ELSE 0 END,
    estimated_progress = LEAST(100, learning_progress_indicators.estimated_progress + v_progress),
    last_activity = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_learning_context_updated_at
  BEFORE UPDATE ON user_learning_context
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER learning_progress_indicators_updated_at
  BEFORE UPDATE ON learning_progress_indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER learning_snippets_updated_at
  BEFORE UPDATE ON learning_snippets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE user_learning_context IS 'Tracks user interactions with topics to understand interests';
COMMENT ON TABLE learning_progress_indicators IS 'Estimated learning progress per category based on engagement';
COMMENT ON TABLE learning_snippets IS 'Curated learning snippets for recommendations';
COMMENT ON TABLE user_snippet_history IS 'History of snippets sent to users';
COMMENT ON TABLE notification_preferences IS 'User preferences for learning snippet notifications';

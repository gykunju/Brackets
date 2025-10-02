# Supabase Database Schema for Brackets Learning Platform

## Overview
This document outlines the complete database schema needed for the Brackets Community-Powered Learning Platform. Execute these SQL commands in your Supabase SQL editor.

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL commands below
4. Execute them in order

---

## Tables

### 1. Users Table (Extended)
```sql
-- Extend the default auth.users with a custom users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'teacher', 'parent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Learning Modules
```sql
CREATE TABLE public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('curriculum', 'financial_literacy', 'digital_skills', 'agriculture')),
  content JSONB,
  duration TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_num INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning modules" ON public.learning_modules
  FOR SELECT TO authenticated USING (true);
```

### 3. User Progress
```sql
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT false,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Quiz Submissions
```sql
CREATE TABLE public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID NOT NULL,
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions" ON public.quiz_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions" ON public.quiz_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. Notifications
```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz_result', 'new_content', 'peer_message', 'circle_invite', 'achievement', 'teaching_points')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

### 6. Village Circles
```sql
CREATE TABLE public.village_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  max_members INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.village_circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view circles" ON public.village_circles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create circles" ON public.village_circles
  FOR INSERT TO authenticated WITH CHECK (true);
```

### 7. Circle Members
```sql
CREATE TABLE public.circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES public.village_circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  teaching_points INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);

ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circle members can view members" ON public.circle_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join circles" ON public.circle_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave circles" ON public.circle_members
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "System can update teaching points" ON public.circle_members
  FOR UPDATE USING (true);
```

### 8. Circle Messages
```sql
CREATE TABLE public.circle_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES public.village_circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_teaching BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.circle_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circle members can view messages" ON public.circle_messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = circle_messages.circle_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Circle members can send messages" ON public.circle_messages
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = circle_messages.circle_id
      AND user_id = auth.uid()
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_messages;
```

### 9. User Activities
```sql
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create activities" ON public.user_activities
  FOR INSERT WITH CHECK (true);
```

### 10. Sponsors
```sql
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('individual', 'business', 'diaspora')),
  description TEXT,
  total_contribution DECIMAL(10, 2) DEFAULT 0,
  learners_supported INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sponsors" ON public.sponsors
  FOR SELECT TO authenticated USING (true);
```

### 11. Contributions
```sql
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('individual', 'business', 'diaspora')),
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contributions" ON public.contributions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can create contributions" ON public.contributions
  FOR INSERT TO authenticated WITH CHECK (true);
```

---

## Indexes for Performance

```sql
-- User Progress indexes
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_module_id ON public.user_progress(module_id);

-- Quiz Submissions indexes
CREATE INDEX idx_quiz_submissions_user_id ON public.quiz_submissions(user_id);
CREATE INDEX idx_quiz_submissions_module_id ON public.quiz_submissions(module_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Circle Members indexes
CREATE INDEX idx_circle_members_circle_id ON public.circle_members(circle_id);
CREATE INDEX idx_circle_members_user_id ON public.circle_members(user_id);

-- Circle Messages indexes
CREATE INDEX idx_circle_messages_circle_id ON public.circle_messages(circle_id);
CREATE INDEX idx_circle_messages_created_at ON public.circle_messages(created_at);

-- Activities indexes
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);
```

---

## Sample Data (Optional)

```sql
-- Insert sample learning modules
INSERT INTO public.learning_modules (title, description, category, difficulty, order_num) VALUES
  ('Introduction to Financial Literacy', 'Learn the basics of managing personal finances', 'financial_literacy', 'beginner', 1),
  ('Digital Skills for Beginners', 'Essential computer and internet skills', 'digital_skills', 'beginner', 1),
  ('Sustainable Agriculture Practices', 'Modern farming techniques for better yields', 'agriculture', 'intermediate', 1),
  ('Mathematics Foundation', 'Core mathematical concepts and problem-solving', 'curriculum', 'beginner', 1);

-- Insert sample village circles
INSERT INTO public.village_circles (name, description, category) VALUES
  ('Math Study Group', 'Help each other with math homework and concepts', 'curriculum'),
  ('Digital Literacy Circle', 'Learning computers and technology together', 'digital_skills'),
  ('Young Farmers Network', 'Share farming tips and techniques', 'agriculture');
```

---

## Post-Setup Steps

1. **Enable Realtime**: Go to Database > Replication and enable realtime for:
   - `notifications`
   - `circle_messages`

2. **Set Environment Variables**: Update your `.env` file with:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Test Authentication**: Try signing up a test user through the app

4. **Verify Real-time**: Test notifications and circle chat functionality

---

## Troubleshooting

- If real-time isn't working, check that tables are added to the `supabase_realtime` publication
- For RLS issues, verify policies are correctly set up
- Check the Supabase logs for any database errors

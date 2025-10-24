# Brackets - Setup Instructions

This document contains step-by-step instructions to set up the complete Brackets application, including database tables, storage buckets, and configurations.

## Prerequisites

- Node.js installed (v18 or higher)
- A Supabase account (free tier works fine)
- A Google Gemini API key

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to finish setting up
4. Navigate to **Project Settings** → **API**
5. Copy your:
   - `Project URL` (starts with `https://`)
   - `anon public` key

### 2.2 Set Up Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL scripts **in order**:

#### Step 1: Create the `profile` table

```sql
CREATE TABLE public.profile (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  brackets integer DEFAULT 0,
  courses integer DEFAULT 0,
  full_name character varying,
  email character varying,
  supabase_user_id uuid,
  CONSTRAINT profile_pkey PRIMARY KEY (id),
  CONSTRAINT profile_supabase_user_id_fkey FOREIGN KEY (supabase_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile
CREATE POLICY "Users can view their own profile" ON public.profile
  FOR SELECT USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can insert their own profile" ON public.profile
  FOR INSERT WITH CHECK (auth.uid() = supabase_user_id);

CREATE POLICY "Users can update their own profile" ON public.profile
  FOR UPDATE USING (auth.uid() = supabase_user_id);
```

#### Step 2: Create the automatic profile creation trigger

```sql
-- Function to create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profile (supabase_user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Step 3: Create the `bracket` table

```sql
CREATE TABLE public.bracket (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying NOT NULL,
  current boolean DEFAULT true,
  user_id bigint NOT NULL,
  CONSTRAINT bracket_pkey PRIMARY KEY (id),
  CONSTRAINT bracket_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.bracket ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bracket
CREATE POLICY "Users can view their own brackets" ON public.bracket
  FOR SELECT USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can insert their own brackets" ON public.bracket
  FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can update their own brackets" ON public.bracket
  FOR UPDATE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can delete their own brackets" ON public.bracket
  FOR DELETE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));
```

#### Step 4: Create the `unit` table

```sql
CREATE TABLE public.unit (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  items bigint DEFAULT 0,
  title character varying NOT NULL,
  description character varying,
  bracket_id bigint NOT NULL,
  CONSTRAINT unit_pkey PRIMARY KEY (id),
  CONSTRAINT unit_bracket_id_fkey FOREIGN KEY (bracket_id) REFERENCES public.bracket(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.unit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for unit
CREATE POLICY "Users can view units of their brackets" ON public.unit
  FOR SELECT USING (
    auth.uid() = (
      SELECT p.supabase_user_id
      FROM public.profile p
      JOIN public.bracket b ON b.user_id = p.id
      WHERE b.id = bracket_id
    )
  );

CREATE POLICY "Users can insert units in their brackets" ON public.unit
  FOR INSERT WITH CHECK (
    auth.uid() = (
      SELECT p.supabase_user_id
      FROM public.profile p
      JOIN public.bracket b ON b.user_id = p.id
      WHERE b.id = bracket_id
    )
  );

CREATE POLICY "Users can update their units" ON public.unit
  FOR UPDATE USING (
    auth.uid() = (
      SELECT p.supabase_user_id
      FROM public.profile p
      JOIN public.bracket b ON b.user_id = p.id
      WHERE b.id = bracket_id
    )
  );

CREATE POLICY "Users can delete their units" ON public.unit
  FOR DELETE USING (
    auth.uid() = (
      SELECT p.supabase_user_id
      FROM public.profile p
      JOIN public.bracket b ON b.user_id = p.id
      WHERE b.id = bracket_id
    )
  );
```

#### Step 5: Create the `event` table

```sql
CREATE TABLE public.event (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying NOT NULL,
  type character varying, -- 'Exam', 'Assignment', 'Event'
  description character varying,
  user_id bigint NOT NULL,
  date date,
  time time without time zone,
  location character varying,
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT event_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event
CREATE POLICY "Users can view their own events" ON public.event
  FOR SELECT USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can insert their own events" ON public.event
  FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can update their own events" ON public.event
  FOR UPDATE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can delete their own events" ON public.event
  FOR DELETE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));
```

#### Step 6: Create the `content` table

```sql
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

-- Create indexes for faster queries
CREATE INDEX content_unit_id_idx ON public.content(unit_id);
CREATE INDEX content_user_id_idx ON public.content(user_id);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content
CREATE POLICY "Users can view their own content" ON public.content
  FOR SELECT USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can insert their own content" ON public.content
  FOR INSERT WITH CHECK (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can update their own content" ON public.content
  FOR UPDATE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));

CREATE POLICY "Users can delete their own content" ON public.content
  FOR DELETE USING (auth.uid() = (SELECT supabase_user_id FROM public.profile WHERE id = user_id));
```

### 2.3 Set Up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Create a bucket with these settings:
   - **Name**: `content-files`
   - **Public bucket**: ✅ Check this box (we need public URLs for file access)
   - Click **Create bucket**

4. Set up bucket policies:
   - Click on the `content-files` bucket
   - Go to **Policies** tab
   - Add the following policies:

**INSERT Policy** (Allow authenticated users to upload):
```sql
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-files' AND (auth.uid())::text = (storage.foldername(name))[1]);
```

**SELECT Policy** (Allow anyone to view files - needed for public URLs):
```sql
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-files');
```

**DELETE Policy** (Allow users to delete their own files):
```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-files' AND (auth.uid())::text = (storage.foldername(name))[1]);
```

---

## 3. Environment Variables Setup

Create a `.env` file in the root directory (if it doesn't exist) and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Get your Gemini API Key:

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the API key and paste it in your `.env` file

---

## 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 5. Testing the Complete Workflow

1. **Sign Up**: Create a new account
2. **Create a Bracket**: Add a new study bracket (e.g., "Semester 1 2025")
3. **Add Units**: Click on the bracket and add units (e.g., "Mathematics", "Physics")
4. **Upload Content**: Click "Upload Content" on a unit and upload a PDF or image
5. **Use AI Assistant**: Go to the AI Assistant tab and ask questions like:
   - "What brackets do I have?"
   - "Give me a study plan for my units"
   - Upload an image and ask the AI to analyze it

---

## Troubleshooting

### Storage Bucket Issues

If file uploads fail:
1. Verify the bucket name is exactly `content-files`
2. Check that the bucket is set to **Public**
3. Ensure all storage policies are correctly set

### RLS Policy Issues

If you get permission denied errors:
1. Go to **Authentication** → **Policies** in Supabase
2. Verify all tables have RLS enabled
3. Check that policies are correctly configured

### AI Not Responding

If the AI Assistant doesn't respond:
1. Check your Gemini API key in `.env`
2. Verify the API key is valid at [Google AI Studio](https://makersuite.google.com/)
3. Check the browser console for errors

### Database Connection Issues

If data isn't loading:
1. Verify your Supabase URL and anon key in `.env`
2. Check that all tables were created successfully
3. Look for errors in the browser console

---

## Security Notes

### ⚠️ Important: Never commit your `.env` file

The `.env` file contains sensitive API keys and should **never** be committed to version control.

Add this to your `.gitignore`:
```
.env
.env.local
```

### Production Deployment

When deploying to production (Vercel, Netlify, etc.):
1. Add environment variables in your hosting platform's dashboard
2. Do not use the `.env` file in production
3. Use environment-specific keys (separate dev/prod Supabase projects)

---

## Features Implemented

✅ User authentication (signup/signin/logout)
✅ Profile management
✅ Brackets (study periods) CRUD operations
✅ Units (topics) CRUD operations
✅ Events/calendar with CRUD operations
✅ File uploads (PDFs and images) to units
✅ File storage with Supabase Storage
✅ AI Assistant powered by Google Gemini
✅ Context-aware AI (can reference user's brackets, units, and content)
✅ Image analysis via AI
✅ Real-time data synchronization
✅ Progressive Web App (PWA) support
✅ Responsive design (mobile-first)

---

## Project Structure

```
brackets/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── context/        # UserContext (global state)
│   ├── services/       # Gemini AI service
│   └── assets/         # Images, fonts, etc.
├── public/             # Static files
├── schema.sql          # Database schema reference
├── content_schema.sql  # Content table schema
├── SETUP.md           # This file
└── .env               # Environment variables (DO NOT COMMIT)
```

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure Supabase tables and policies are correctly configured
4. Check that the storage bucket is public and policies are set

---

## License

This project is for educational purposes.

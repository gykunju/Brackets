# 🔧 CRITICAL: Authentication Setup Fix

## The Problem
Sign up and sign in aren't working because:
1. The `users` table needs an INSERT policy for new signups
2. A database trigger is needed to automatically create user profiles

## ✅ Solution - Run These SQL Commands

### Step 1: Ensure Base Tables Exist
First, make sure you've run `setup.sql` in Supabase Dashboard → SQL Editor.

### Step 2: Add Authentication Trigger
Run `auth_trigger_setup.sql` in Supabase Dashboard → SQL Editor.

This will:
- ✅ Add INSERT policy for new users
- ✅ Create automatic profile creation trigger
- ✅ Link auth.users to public.users table

---

## 📝 Quick Copy-Paste Solution

If you want to do it manually, copy and paste this into Supabase SQL Editor:

```sql
-- 1. Add INSERT policy for new users
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

-- 3. Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;
```

---

## 🧪 Testing After Setup

1. **Open your app**: http://localhost:5174/
2. **You'll be redirected to**: `/login`
3. **Click "Sign Up"**
4. **Fill in**:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm Password: `test123`
5. **Click "Sign Up"**
6. ✅ **Success!** You should be redirected to the homepage

---

## 🔍 Troubleshooting

### Still not working?

1. **Check Supabase logs**:
   - Go to Supabase Dashboard → Logs → Postgres Logs
   - Look for any error messages

2. **Verify the trigger exists**:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

3. **Check if users table has INSERT policy**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT';
```

4. **Try manual user creation** (for testing):
```sql
-- First create auth user in Supabase Dashboard → Authentication → Users → Add User
-- Then manually create profile:
INSERT INTO public.users (id, full_name, role)
VALUES ('USER_UUID_HERE', 'Test User', 'learner');
```

---

## ✨ What This Does

### Before:
- User signs up → auth.users table gets entry
- ❌ public.users table is empty
- ❌ App can't find user profile
- ❌ Login fails silently

### After:
- User signs up → auth.users table gets entry
- ✅ Trigger automatically creates entry in public.users
- ✅ App finds user profile
- ✅ Login works and redirects to homepage

---

## 📊 Database Flow

```
User Signs Up
    ↓
Supabase Auth creates entry in auth.users
    ↓
Trigger "on_auth_user_created" fires
    ↓
Function "handle_new_user()" executes
    ↓
New row inserted into public.users with:
  - id (from auth.users)
  - full_name (from signup form)
  - role = 'learner'
  - created_at = NOW()
    ↓
✅ User can now sign in!
```

---

## 🎯 Summary

**Just run these 2 files in order:**

1. `setup.sql` - Creates all tables (if not done already)
2. `auth_trigger_setup.sql` - **NEW FILE** - Fixes authentication

Then try signing up again! 🚀

# Troubleshooting Guide

## Common Errors and Solutions

### 1. "Bucket not found" Error

**Error Message:**
```
POST https://[your-project].supabase.co/storage/v1/object/content-files/... 400 (Bad Request)
Error uploading content: Bucket not found
```

**Cause:** The Supabase storage bucket `content-files` hasn't been created yet.

**Solution:**

#### Step 1: Create the Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket**
5. Enter these details:
   - **Name**: `content-files` (must be exactly this!)
   - **Public bucket**: ✅ Check this box
   - Click **Create bucket**

#### Step 2: Set Up Storage Policies

After creating the bucket, you need to add policies:

1. Click on the `content-files` bucket
2. Go to the **Policies** tab
3. Click **New Policy** → **For full customization**
4. Add these three policies:

**Policy 1: Allow Authenticated Users to Upload**
```sql
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'content-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Allow Public Read Access**
```sql
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-files');
```

**Policy 3: Allow Users to Delete Their Files**
```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'content-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

5. Click **Review** → **Save policy** for each one

---

### 2. Service Worker Chrome Extension Error

**Error Message:**
```
Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache':
Request scheme 'chrome-extension' is unsupported
```

**Cause:** The service worker tries to cache Chrome extension URLs, which aren't supported.

**Solution:** ✅ Already fixed! The service worker now filters out non-http/https schemes.

**To verify the fix:**
1. Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. The error should disappear

---

### 3. File Upload Fails with 403 Forbidden

**Error Message:**
```
POST https://[your-project].supabase.co/storage/v1/object/content-files/... 403 (Forbidden)
new row violates row-level security policy
```

**Cause:** Storage policies aren't set up correctly.

**Solution:**

1. Check that the bucket is **Public** (in Storage settings)
2. Verify all three policies are added (see solution #1 above)
3. Make sure policy names don't conflict
4. Test with a fresh browser session (clear cache)

---

### 4. Data Not Persisting After Refresh

**Error:** Units or content disappear after page refresh

**Solution:**

✅ Already fixed! All data now persists to localStorage:
- `user_profile`
- `user_brackets`
- `user_units`
- `user_events`
- `user_content`

**To verify:**
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Check that all `user_*` keys exist and have data

---

### 5. AI Assistant Not Responding

**Possible Issues:**

#### Issue A: Invalid Gemini API Key

**Solution:**
1. Check your `.env` file has: `VITE_GEMINI_API_KEY=your_actual_key`
2. Get a new key at: https://makersuite.google.com/app/apikey
3. Restart the dev server: `npm run dev`

#### Issue B: API Quota Exceeded

**Solution:**
1. Check quota at: https://makersuite.google.com/
2. Wait for quota reset or upgrade plan

#### Issue C: Network Error

**Solution:**
1. Check browser console for errors
2. Verify internet connection
3. Try refreshing the page

---

### 6. Cannot Access Content Before Initialization

**Error Message:**
```
Uncaught ReferenceError: Cannot access 'content' before initialization
```

**Cause:** State variables defined in wrong order.

**Solution:** ✅ Already fixed! All state is now properly ordered.

**If you still see this:**
1. Clear browser cache
2. Hard refresh: `Ctrl + Shift + R`
3. Restart dev server

---

### 7. Database Connection Errors

**Error:** Data not loading, "No session found" messages

**Solution:**

1. **Check Environment Variables:**
   ```bash
   # Verify .env has correct values
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Verify Database Tables:**
   - Go to Supabase Dashboard → **Table Editor**
   - Ensure all tables exist: `profile`, `bracket`, `unit`, `event`, `content`
   - Run the SQL from `SETUP.md` if tables are missing

3. **Check RLS Policies:**
   - Go to **Authentication** → **Policies**
   - Ensure policies are enabled for all tables
   - Verify user has permission to read/write

---

### 8. Unable to Create Events

**Error:** Events won't create, form submits but nothing happens

**Cause:** Most likely RLS (Row Level Security) policies are missing on the `event` table

**Solution:**

#### Check Console Logs First
I've added detailed debug logging. Open browser DevTools (F12) → Console tab and try creating an event. You'll see detailed logs showing what's happening.

#### Most Common Fix: Add RLS Policies

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `event_rls_policies.sql` from the project root
6. Click **Run** to execute the SQL

**What this does:**
- Enables Row Level Security on the event table
- Adds policies so authenticated users can INSERT, SELECT, UPDATE, and DELETE their own events
- Links user authentication to their profile via `supabase_user_id`

#### Alternative: Check Existing Policies

If you already have policies, they might be incorrectly configured:

1. Go to **Authentication** → **Policies**
2. Find the `event` table
3. Verify you have policies for: INSERT, SELECT, UPDATE, DELETE
4. Each policy should check:
   ```sql
   auth.uid() = (
     SELECT supabase_user_id FROM profile WHERE id = event.user_id
   )
   ```

#### Check Profile is Loaded

In the browser console, run:
```javascript
JSON.parse(localStorage.getItem('user_profile'))
```

Make sure it shows your profile with:
- `id` (number)
- `supabase_user_id` (UUID)
- `full_name`
- `email`

If `id` is missing or null, that's the problem! Try:
1. Sign out
2. Clear localStorage: `localStorage.clear()`
3. Sign back in

---

### 9. Image Upload Works But PDF Upload Fails

**Cause:** File type validation or MIME type issue.

**Solution:**

**Accepted file types:**
- PDF: `application/pdf`
- Images: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`

**Max file size:** 10MB

**To fix:**
1. Check the file is actually a PDF (not renamed)
2. Ensure file is under 10MB
3. Try with a different PDF

---

### 10. Real-time Updates Not Working

**Error:** Changes don't appear immediately, need to refresh

**Solution:**

1. **Check Realtime is enabled in Supabase:**
   - Go to **Settings** → **API**
   - Ensure **Realtime** is enabled

2. **Verify subscriptions are working:**
   - Open browser console
   - Look for Supabase subscription confirmations
   - Check for WebSocket connection

3. **Test with another user:**
   - Open in incognito window
   - Changes should sync between windows

---

### 11. Build Warnings

**Warning Message:**
```
Some chunks are larger than 500 kB after minification.
```

**Cause:** Large bundle size due to dependencies (React, Supabase, Gemini SDK).

**Solution:**
- This is normal and won't affect functionality
- The app still loads quickly
- For production optimization, consider:
  - Code splitting with dynamic imports
  - Lazy loading routes
  - Tree shaking optimization

---

## Quick Checklist

Before deploying or testing, verify:

- [ ] Supabase project created
- [ ] All database tables created (run `schema.sql` and `content_schema.sql`)
- [ ] RLS policies enabled on all tables
- [ ] Storage bucket `content-files` created
- [ ] Storage bucket is Public
- [ ] Storage policies added (INSERT, SELECT, DELETE)
- [ ] `.env` file has all three keys
- [ ] Gemini API key is valid
- [ ] Dev server running: `npm run dev`

---

## Getting Help

If you're still stuck:

1. **Check browser console** (F12) for detailed errors
2. **Check Supabase logs** (Dashboard → Logs)
3. **Verify API responses** in Network tab
4. **Test with sample data** to isolate the issue

---

## Development Tips

### Clear Everything and Start Fresh

If things get weird:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clear localStorage
# Open browser console and run:
localStorage.clear()

# 3. Clear browser cache (Ctrl+Shift+Delete)

# 4. Restart dev server
npm run dev

# 5. Sign in again
```

### Check What's in LocalStorage

```javascript
// In browser console:
console.log('Profile:', localStorage.getItem('user_profile'))
console.log('Brackets:', localStorage.getItem('user_brackets'))
console.log('Units:', localStorage.getItem('user_units'))
console.log('Events:', localStorage.getItem('user_events'))
console.log('Content:', localStorage.getItem('user_content'))
```

---

## Security Notes

### Don't Commit Sensitive Files

Make sure `.gitignore` includes:
```
.env
.env.local
node_modules/
dist/
```

### API Keys

- Never commit `.env` to Git
- Use environment variables in production
- Rotate keys if accidentally exposed

---

## Performance Tips

### If the app feels slow:

1. **Check network speed** (slow Supabase connection)
2. **Reduce localStorage usage** (clear old data)
3. **Optimize images** before uploading
4. **Use smaller PDFs** when possible

---

## Contact & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **React Docs**: https://react.dev

---

**Last Updated:** 2025-10-23

# Debugging Event Creation Issue

I've added extensive debug logging to help identify why events aren't creating. Follow these steps:

## Step 1: Open Browser DevTools

1. Open your browser (where the app is running at http://localhost:5174)
2. Press **F12** to open DevTools
3. Go to the **Console** tab
4. Click the trash icon to clear any old logs

## Step 2: Try Creating an Event

1. Navigate to the Events page
2. Click the "+" button to open the Create Event modal
3. Fill out the form with:
   - **Title**: Test Event (required)
   - **Type**: Event (or any type)
   - **Description**: Testing (optional)
   - **Date**: Any date (optional)
   - **Time**: Any time (optional)
   - **Location**: Test Location (optional)
4. Click **"Create Event"**

## Step 3: Check Console Output

You should see detailed console logs. Copy **ALL** of the output and share it with me. It will look something like:

```
Creating event with data: {title: "Test Event", type: "Event", description: "Testing", ...}
Profile ID: 123
Inserting event: {title: "Test Event", type: "Event", user_id: 123, ...}
```

**If there's an error**, you'll see:
```
Supabase error: {...}
Error creating event: ...
Error details: {message: "...", details: "...", hint: "...", code: "..."}
```

## Common Issues and What to Look For:

### Issue 1: Profile Not Found
**Console shows:**
```
Profile not found, fetching...
Error: No profile found - please try logging out and back in
```

**Solution:**
1. Click Profile in the navigation
2. Check if your name and email are displayed
3. If not shown, sign out and sign back in

---

### Issue 2: RLS Policy Error
**Console shows:**
```
Error details: {
  message: "new row violates row-level security policy",
  code: "42501"
}
```

**Solution:** You need to add RLS policies to the `event` table in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Authentication** → **Policies** in the left sidebar
4. Find the `event` table
5. Click **New Policy** → **For full customization**
6. Add these three policies:

**Policy 1: Users can create their own events**
```sql
CREATE POLICY "Users can insert their own events"
ON public.event FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = (
  SELECT supabase_user_id FROM public.profile WHERE id = event.user_id
));
```

**Policy 2: Users can view their own events**
```sql
CREATE POLICY "Users can select their own events"
ON public.event FOR SELECT
TO authenticated
USING (auth.uid() = (
  SELECT supabase_user_id FROM public.profile WHERE id = event.user_id
));
```

**Policy 3: Users can delete their own events**
```sql
CREATE POLICY "Users can delete their own events"
ON public.event FOR DELETE
TO authenticated
USING (auth.uid() = (
  SELECT supabase_user_id FROM public.profile WHERE id = event.user_id
));
```

---

### Issue 3: Missing Required Field
**Console shows:**
```
Error details: {
  message: "null value in column 'title' violates not-null constraint",
  code: "23502"
}
```

**Solution:** Make sure you filled in the required field (title)

---

### Issue 4: Network/Connection Error
**Console shows:**
```
Error: Failed to fetch
```

**Solution:**
1. Check your internet connection
2. Verify `.env` has correct Supabase URL and keys
3. Check Supabase project is running (not paused)

---

## Step 4: Check Supabase Logs

If the console doesn't show enough info:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Logs** in the left sidebar
4. Select **Database** logs
5. Look for any errors that occurred when you tried to create the event

---

## Step 5: Verify Profile Data

Open the console and run this command:

```javascript
JSON.parse(localStorage.getItem('user_profile'))
```

This should show your profile data including:
- `id` (should be a number)
- `full_name`
- `email`
- `supabase_user_id`

If any of these are missing, that's the problem!

---

## Quick Test: Check if Events Load

If events load but won't create, that narrows down the issue to INSERT permissions:

1. Check console on Events page
2. Look for "Fetching events..." log
3. If events load successfully, the issue is likely RLS policies for INSERT

---

## Still Stuck?

Share with me:
1. **Full console output** from attempting to create an event
2. **Profile data** from `localStorage.getItem('user_profile')`
3. **Any error messages** from Supabase Dashboard logs

I'll help you identify and fix the exact issue!

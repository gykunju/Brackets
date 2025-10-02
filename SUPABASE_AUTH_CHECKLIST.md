# 🔐 Supabase Authentication Setup Checklist

## Critical Steps to Get Auth Working

### ✅ Step 1: Disable Email Confirmation (For Development)

By default, Supabase requires email confirmation. For development, disable this:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **lmcmxqbzqsudvqxutpuf**
3. Click **Authentication** → **Providers** in left sidebar
4. Scroll to **Email** provider
5. **UNCHECK** "Confirm email" checkbox
6. Click **Save**

This allows immediate signup without email confirmation.

---

### ✅ Step 2: Run Database Trigger (CRITICAL)

This creates user profiles automatically on signup:

1. In Supabase Dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy ALL contents of `auth_trigger_setup.sql`
4. Paste and click **Run**

**What this does:**
- Adds INSERT policy for new users
- Creates automatic profile creation function
- Links auth.users to public.users table

---

### ✅ Step 3: Verify Tables Exist

In SQL Editor, run:

```sql
-- Check if users table exists
SELECT * FROM public.users LIMIT 1;

-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'users';
```

If you get errors, run `setup.sql` first.

---

### ✅ Step 4: Test Signup Flow

1. **Open app**: http://localhost:5173/
2. **Should see**: Login/Signup page
3. **Click**: "Sign Up"
4. **Fill in**:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm Password: `test123`
5. **Click**: "Sign Up"
6. **Expected**: Redirect to homepage

---

## 🐛 Troubleshooting

### Error: "AuthSessionMissingError"

**What it means**: This is NORMAL when not logged in. The app checks for sessions on load.

**Solution**: Ignore this error. It's handled gracefully now.

---

### Error: "User already registered"

**What it means**: Email is already used.

**Solution**: Use a different email OR delete the user:

```sql
-- In Supabase SQL Editor
DELETE FROM auth.users WHERE email = 'test@example.com';
DELETE FROM public.users WHERE email = 'test@example.com';
```

---

### Error: "Email not confirmed"

**What it means**: Email confirmation is enabled.

**Solution**: Disable email confirmation (see Step 1 above).

---

### Error: "Policy violation"

**What it means**: Database trigger or policies not set up.

**Solution**: Run `auth_trigger_setup.sql` (see Step 2 above).

---

### Signup succeeds but can't sign in

**Check**:
1. Look in Supabase Dashboard → Authentication → Users
2. Verify user exists
3. Check if email is confirmed (should show green checkmark)
4. Try signing in with exact same credentials

---

### Can't access Supabase

**Check**:
1. Verify `.env` file has correct credentials
2. Restart dev server: `npm run dev`
3. Check browser console for CORS errors
4. Verify project URL: https://lmcmxqbzqsudvqxutpuf.supabase.co

---

## 🔍 Debugging Commands

### Check current user in console
```javascript
// Open browser console and run:
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data.session);
```

### Verify environment variables
Visit: http://localhost:5173/debug

Should show:
- ✅ Supabase URL: Set
- ✅ Supabase Key: Set
- ✅ Gemini API Key: Set

---

## 📋 Quick Reference

### Your Supabase Project Details
- **Project URL**: https://lmcmxqbzqsudvqxutpuf.supabase.co
- **Project Ref**: lmcmxqbzqsudvqxutpuf
- **Dashboard**: https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpuf

### Important Files
- `.env` - Supabase credentials (UPDATED ✓)
- `auth_trigger_setup.sql` - Database trigger (NEEDS TO BE RUN)
- `setup.sql` - Initial database schema
- `src/services/authService.js` - Auth functions (FIXED ✓)

---

## ✨ Success Checklist

- [ ] Email confirmation disabled in Supabase
- [ ] `setup.sql` executed (creates tables)
- [ ] `auth_trigger_setup.sql` executed (creates trigger)
- [ ] `.env` has real credentials (✓ Done)
- [ ] Dev server restarted after .env update (✓ Done)
- [ ] Can access http://localhost:5173/
- [ ] See login page on load
- [ ] Can sign up with test account
- [ ] Redirects to homepage after signup
- [ ] Can sign out and sign back in

---

## 🎯 Next Steps After Auth Works

1. **Load curriculum content**: Run `kenyan_curriculum_content.sql`
2. **Test dashboard**: Visit `/dashboard` to see learning modules
3. **Test Village Circles**: Visit `/village-circles`
4. **Test AI Assistant**: Visit `/ai-assistant`

---

Need more help? Check the browser console (F12) for detailed error messages!

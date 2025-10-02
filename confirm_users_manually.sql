-- ============================================
-- MANUALLY CONFIRM USERS (If email confirmation is causing issues)
-- Run this in Supabase SQL Editor if you can't disable email confirmation
-- ============================================

-- 1. Check which users need confirmation
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Not Confirmed'
    ELSE '✅ Confirmed'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- 2. Confirm ALL unconfirmed users (use with caution!)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 3. Confirm a specific user by email
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'test@example.com';

-- 4. Verify confirmations
SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Not Confirmed'
    ELSE '✅ Confirmed'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- This is a TEMPORARY workaround. 
-- The proper solution is to disable email confirmation in:
-- Supabase Dashboard → Authentication → Providers → Email
-- 
-- Use this SQL only if you need to test immediately
-- and can't access the dashboard right now.
-- ============================================

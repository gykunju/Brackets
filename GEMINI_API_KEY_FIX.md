# Fixing Gemini API Key - PERMISSION_DENIED Error

## The Problem
Error 403: "Method doesn't allow unregistered callers" means your API key either:
1. Doesn't have the Generative Language API enabled
2. Has restrictions that block browser requests
3. Is invalid or expired

## Solution: Create a New API Key

### Step 1: Go to Google AI Studio
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account

### Step 2: Create New API Key
1. Click "Create API Key" button
2. Choose "Create API key in new project" (recommended)
3. **IMPORTANT**: DO NOT add any restrictions (Application restrictions should be "None")
4. Copy the new API key (starts with AIzaSy...)

### Step 3: Update Your .env File
Replace the current key in your `.env` file:

```properties
VITE_GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

### Step 4: Restart the Dev Server
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 5: Clear Browser Cache & Test
1. Hard refresh: Ctrl + Shift + R (or Cmd + Shift + R on Mac)
2. Or use private/incognito window
3. Go to AI Assistant and test

## Why This Happens

The error occurs when:
- ✅ API key has "HTTP referrers" restriction (blocks browser requests)
- ✅ API key has "IP addresses" restriction (blocks your IP)
- ✅ Generative Language API is not enabled for the project
- ✅ API key is from an old project with quota issues

## Verification Checklist

After creating a new key, verify:
- [ ] Key starts with "AIzaSy"
- [ ] Key is 39 characters long
- [ ] No application restrictions set
- [ ] .env file updated with new key
- [ ] Dev server restarted
- [ ] Browser cache cleared

## Alternative: Check Current Key Restrictions

If you want to fix the existing key instead:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key in the list
3. Click on it to edit
4. Under "Application restrictions" → Select "None"
5. Under "API restrictions" → Make sure "Generative Language API" is in the list
6. Save and wait 1-2 minutes for changes to propagate

## Still Not Working?

If you still get the error after creating a new unrestricted key:
1. Try waiting 5 minutes (API key activation can be slow)
2. Check the browser console for the exact API Key length (should be 39 chars)
3. Make sure there are no extra spaces in the .env file
4. Verify the .env file is in the root directory (same level as package.json)

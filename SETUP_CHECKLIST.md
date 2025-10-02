# 🚀 Brackets - Quick Setup Checklist

Follow these steps in order to get your platform running!

## ☑️ Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Web browser (Chrome/Firefox/Edge)

---

## 1️⃣ Get API Keys (15 minutes)

### Supabase Setup
- [ ] Go to https://supabase.com
- [ ] Create free account
- [ ] Create new project (choose region close to users)
- [ ] Wait for project to finish setting up (~2 minutes)
- [ ] Go to Settings → API
- [ ] Copy **Project URL** (starts with https://)
- [ ] Copy **anon public** key (long string starting with eyJ)

### Gemini AI Setup
- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the API key (starts with AIza)

---

## 2️⃣ Configure Environment (5 minutes)

- [ ] Open project folder in terminal
- [ ] Copy environment template:
```bash
cp .env.example .env
```
- [ ] Open `.env` file in editor
- [ ] Paste your Supabase URL
- [ ] Paste your Supabase anon key
- [ ] Paste your Gemini API key
- [ ] Save the file

Your `.env` should look like:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 3️⃣ Setup Database (15 minutes)

- [ ] Go to your Supabase project dashboard
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "New query"
- [ ] Open `SUPABASE_SETUP.md` in your code editor
- [ ] Copy the **Users Table** SQL
- [ ] Paste in Supabase SQL Editor
- [ ] Click "Run" button
- [ ] Repeat for each table section:
  - [ ] Users Table
  - [ ] Learning Modules
  - [ ] User Progress
  - [ ] Quiz Submissions
  - [ ] Notifications
  - [ ] Village Circles
  - [ ] Circle Members
  - [ ] Circle Messages
  - [ ] User Activities
  - [ ] Sponsors
  - [ ] Contributions
  - [ ] Indexes
  - [ ] Sample Data (optional)

### Enable Realtime
- [ ] Go to Database → Replication
- [ ] Find `notifications` table
- [ ] Toggle it ON
- [ ] Find `circle_messages` table
- [ ] Toggle it ON

---

## 4️⃣ Install & Run (5 minutes)

### Install Dependencies
```bash
npm install
```
Wait for installation to complete (~2 minutes)

### Start Development Server
```bash
npm run dev
```

- [ ] Server should start
- [ ] Terminal shows: "Local: http://localhost:5173"
- [ ] Open browser to http://localhost:5173
- [ ] You should see the Brackets home page!

---

## 5️⃣ Test Core Features (10 minutes)

### Basic Navigation
- [ ] Click around bottom navigation
- [ ] Click "More" button to see extended menu
- [ ] Visit each page:
  - [ ] Home
  - [ ] Brackets
  - [ ] Events
  - [ ] AI Assistant
  - [ ] Dashboard
  - [ ] Village Circles
  - [ ] Parent View
  - [ ] Sponsors

### Test Database Connection
- [ ] Go to Dashboard page
- [ ] Should see categories (even if no modules)
- [ ] Go to Village Circles
- [ ] Should see "No circles yet" or sample circles if you added them

### Test AI (if modules exist)
- [ ] Go to Dashboard
- [ ] Wait for AI recommendations to load
- [ ] Should see personalized recommendations panel

---

## 6️⃣ Add Sample Data (Optional, 5 minutes)

If you want to test with data:

### Add Sample Modules
- [ ] Go to Supabase SQL Editor
- [ ] Run the sample data SQL from `SUPABASE_SETUP.md`
- [ ] Refresh Dashboard in app
- [ ] Should see 4 sample modules

### Create Test User
- [ ] In Supabase, go to Authentication → Users
- [ ] Click "Add user"
- [ ] Enter email & password
- [ ] Click "Create user"
- [ ] Use these credentials to test login (when auth UI is ready)

---

## 7️⃣ Deploy (Optional, 10 minutes)

### Option A: Vercel (Recommended)
- [ ] Push code to GitHub
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Add environment variables (all 3)
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Visit your live URL!

### Option B: Netlify
- [ ] Build project: `npm run build`
- [ ] Go to https://netlify.com
- [ ] Drag `dist` folder to deploy
- [ ] Add environment variables in settings
- [ ] Redeploy with env vars

---

## ✅ Success Checklist

You're all set when:
- [ ] Dev server runs without errors
- [ ] All pages load correctly
- [ ] Notification bell shows in top-right
- [ ] Navigation works smoothly
- [ ] Dashboard displays (even if empty)
- [ ] Village Circles page loads
- [ ] No console errors (some warnings OK)

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not working
- Check `.env` file is in project root (not in `src/`)
- Variable names must start with `VITE_`
- Restart dev server after changing `.env`

### Database errors
- Check Supabase project is active (not paused)
- Verify all SQL ran without errors
- Check RLS policies are enabled

### Realtime not working
- Verify realtime enabled for tables
- Check browser console for connection errors
- Ensure user is authenticated (for protected tables)

### Build errors
- Check all imports are correct
- Ensure all dependencies installed
- Clear cache: `rm -rf node_modules/.vite`

---

## 📞 Need Help?

1. **Check Documentation**:
   - `README.md` - Overview
   - `SUPABASE_SETUP.md` - Database
   - `DEPLOYMENT_GUIDE.md` - Deployment
   - `DEVELOPER_GUIDE.md` - Development

2. **Common Issues**: See troubleshooting section above

3. **Still Stuck?**: Check browser console and terminal for error messages

---

## 🎉 You're Done!

Once all checkboxes are checked, you have a fully functional:
- ✅ Real-time notification system
- ✅ AI-powered learning platform
- ✅ Peer collaboration circles
- ✅ Progress tracking dashboard
- ✅ Parent monitoring system
- ✅ Community sponsorship board

**Happy Learning! 🎓✨**

---

**Time to complete**: ~45 minutes
**Difficulty**: Beginner-friendly
**Support**: All documentation included

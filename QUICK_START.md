# 🚀 Quick Start Guide - Updated Brackets Platform

## What's New? 🎉

1. **Beautiful Blue Background** - Soft blue gradient instead of white
2. **Authentication Required** - Users must log in to use the app
3. **25+ Kenyan Curriculum Modules** - Full content ready to use
4. **Persistent Sessions** - Stay logged in even after refresh

---

## ⚡ Getting Started (2 Minutes)

### Step 1: Load Curriculum Content

Open Supabase Dashboard and run this SQL:

```bash
# Go to: https://supabase.com/dashboard → Your Project → SQL Editor
# Then copy and paste content from: kenyan_curriculum_content.sql
# Click "Run"
```

### Step 2: Open the App

```bash
# Your app is running at:
http://localhost:5174/
```

### Step 3: Create Your Account

1. You'll see the **Brackets login page** with blue background
2. Click **"Don't have an account? Sign Up"**
3. Fill in:
   - Full Name: `Your Name`
   - Email: `your@email.com`
   - Password: (min 6 characters)
   - Confirm Password
4. Click **"Sign Up"**
5. ✅ You're in! Welcome to Brackets!

---

## 🎯 What You Can Do Now

### 1. **Explore the Dashboard** (`/dashboard`)
- See 25+ learning modules
- Filter by: Curriculum, Financial Literacy, Digital Skills, Agriculture
- View Kenyan curriculum content (Grade 1 - Form 4)
- Get AI-powered study recommendations

### 2. **Join Village Circles** (`/village-circles`)
- Connect with other learners
- Peer-to-peer teaching
- Earn teaching points
- Real-time chat

### 3. **Use AI Tutor** (`/ai-assistant`)
- Get personalized help
- Ask questions about curriculum topics
- Instant feedback on quizzes
- Powered by Gemini AI

### 4. **Check Your Profile**
- Click your avatar (top-right on Home page)
- See your name and email
- Sign out when needed

---

## 📚 Sample Modules Available

### Curriculum
- 📐 **Grade 1 Math**: Numbers 1-100
- 🔬 **Grade 6 Science**: Human Body Systems
- 📖 **Grade 5 Kiswahili**: Uandishi na Insha
- 🇰🇪 **Grade 4 Social Studies**: Kenyan History
- 🧬 **Form 4 Biology**: Genetics

### Financial Literacy
- 💰 **Money Management**: Saving and budgeting
- 📱 **M-Pesa Training**: Digital payments safety
- 🏪 **Student Business**: Entrepreneurship basics

### Digital Skills
- 💻 **Computer Basics**: Typing, software
- 🎮 **Scratch Coding**: Programming for kids
- 🔒 **Internet Safety**: Digital citizenship

### Agriculture
- 🌱 **Kitchen Gardens**: Grow your own food
- 🐔 **Poultry Farming**: Raising chickens
- 🐟 **Fish Farming**: Aquaculture basics

---

## 🎨 UI Features

### Beautiful Design
- ✨ Soft blue gradient background
- 🟢 Lime-green accent colors
- 🌙 Dark mode support
- 📱 Mobile-responsive

### Smooth Experience
- ⚡ Fast loading with Vite
- 🔄 Auto-saves your progress
- 🔔 Real-time notifications
- 💾 Session persistence

---

## 🔧 Troubleshooting

### "I can't access any page"
→ You need to log in first! Go to: http://localhost:5174/login

### "Background is still white"
→ Hard refresh your browser: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

### "No modules showing in dashboard"
→ Run the SQL content file in Supabase Dashboard (see Step 1 above)

### "Session not persisting"
→ Check your .env file has correct Supabase credentials

---

## 📋 Next Steps

1. ✅ **Add content to database** (run kenyan_curriculum_content.sql)
2. ✅ **Create your account**
3. ✅ **Explore the modules**
4. ✅ **Join a Village Circle**
5. ✅ **Try the AI Tutor**

---

## 🎓 For Teachers

### How to Add Your Own Content

1. Go to Supabase Dashboard → SQL Editor
2. Use this template:

```sql
INSERT INTO public.learning_modules (title, description, category, content, difficulty_level, duration) 
VALUES (
  'Your Module Title',
  'Description of what students will learn',
  'curriculum', -- or 'financial_literacy', 'digital_skills', 'agriculture'
  '{"topics": ["Topic 1", "Topic 2"], "activities": ["Activity 1"]}',
  'beginner', -- or 'intermediate', 'advanced'
  '4 weeks'
);
```

3. Click "Run"
4. Module appears in dashboard immediately!

---

## 🌟 Features Summary

| Feature | Status |
|---------|--------|
| Authentication | ✅ Working |
| Session Persistence | ✅ Working |
| Blue Background | ✅ Applied |
| Kenyan Curriculum | ✅ 25+ Modules |
| AI Recommendations | ✅ Gemini Powered |
| Village Circles | ✅ Real-time Chat |
| Progress Tracking | ✅ Automatic |
| Mobile Responsive | ✅ Optimized |
| Dark Mode | ✅ Supported |
| PWA Support | ✅ Offline Ready |

---

## 💚 Enjoy Learning with Brackets!

**Your app is ready at: http://localhost:5174/**

Questions? Check the AI Tutor or join a Village Circle for community support! 🚀

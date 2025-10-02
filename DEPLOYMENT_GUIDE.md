# 🚀 Brackets - Complete Setup & Deployment Guide# Brackets: Deployment & Usage Guide



## 🚨 CRITICAL FIRST STEP: Enable Email Authentication## 🚀 Quick Start



### The Problem### For Development

You're seeing: **"Email signups are disabled"**

1. **Clone and Install**

### The Solution (Takes 2 minutes)```bash

git clone <your-repo>

1. **Go to your Supabase Dashboard:**cd Brackets

   https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpufnpm install

```

2. **Click: Authentication → Providers** (left sidebar)

2. **Configure Environment**

3. **Find "Email" provider and configure:**Create `.env` file:

   - ✅ **Toggle "Enable email provider" to ON**```env

   - ☐ **Uncheck "Confirm email"** (for development)VITE_SUPABASE_URL=https://your-project.supabase.co

   - Set **Minimum password length: 6**VITE_SUPABASE_ANON_KEY=your-anon-key

   - Click **Save**VITE_GEMINI_API_KEY=your-gemini-key

```

4. **Done!** Email authentication is now enabled.

3. **Setup Database**

---- Follow `SUPABASE_SETUP.md` to create all tables

- Enable realtime for `notifications` and `circle_messages`

## 📋 Complete Setup Checklist

4. **Run Development Server**

### ✅ Step 1: Enable Email Auth (Above) - DONE!```bash

npm run dev

### ✅ Step 2: Run Database Setup```



**A. Create Tables** (if not done already)Visit: `http://localhost:5173`



1. Open: https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpuf/sql---

2. Click "New Query"

3. Copy & paste entire `setup.sql`## 📱 Feature Walkthrough

4. Click "Run"

### 1. Authentication Flow

**B. Setup Auth Trigger** (CRITICAL!)

**Sign Up:**

1. Click "New Query" again- Navigate to home page

2. Copy & paste entire `auth_trigger_setup.sql`- Click "Sign Up" button (to be implemented in auth page)

3. Click "Run"- Enter email, password, and full name

- Account created + auto-signed in

This trigger automatically creates user profiles when someone signs up.

**Sign In:**

**C. Load Curriculum** (Optional)- Click "Sign In" button

- Enter credentials

1. Click "New Query"- Access full platform features

2. Copy & paste `kenyan_curriculum_content.sql`

3. Click "Run"### 2. Learning Dashboard



---**Access:** Click "Dashboard" in navigation or home quick actions



## 🧪 Test Your Setup**Features:**

- View your learning statistics (modules completed, avg score, teaching points, circles joined)

1. **Open app**: http://localhost:5173/- Get AI-powered recommendations based on your performance

2. **Should see**: Login page (not homepage)- Browse modules by category (Curriculum, Financial Literacy, Digital Skills, Agriculture)

3. **Click**: "Sign Up"- See progress bars for each module

4. **Fill in**:- Click modules to access content (to be implemented)

   - Full Name: `Test User`

   - Email: `test@example.com`**AI Recommendations:**

   - Password: `test123`- Automatically generated based on your quiz scores and module progress

   - Confirm: `test123`- Shows personalized study suggestions

5. **Click**: "Create Account"- Recommends specific modules to focus on

6. **Expected**: ✅ Success message → Redirect to homepage- Provides study tips tailored to your learning pattern

7. **Profile Icon**: Shows in top-right

8. **Click**: Profile → Sign Out### 3. Village Learning Circles

9. **Try**: Sign in again with same credentials

**Access:** Navigation → More → Village Circles

---

**Join a Circle:**

## ✨ What's Been Fixed1. Browse available circles

2. View circle details (members, category)

### 1. **Authentication Service** (`src/services/authService.js`)3. Click "Join Circle" button

- ✅ Better error messages4. Start participating immediately

- ✅ Detects "Email signups disabled" error

- ✅ Detects "User already registered" error**Chat & Collaborate:**

- ✅ Detects "Email not confirmed" error1. Click on a joined circle to open chat

- ✅ Proper session management2. View top teachers leaderboard

- ✅ Console logging for debugging3. Send messages

4. Check "I'm teaching/helping" to mark teaching messages

### 2. **Auth Page UI** (`src/pages/AuthPage.jsx`)5. Vote helpful on peer teaching messages to award points

- ✅ Success alerts (green) and error alerts (red)

- ✅ Loading spinner with status text**Teaching Points System:**

- ✅ Better form validation- Earn 10 points when someone marks your teaching message as helpful

- ✅ Email normalization (lowercase, trimmed)- Points displayed in leaderboard

- ✅ 1-second delay after signup (for database trigger)- Gamifies peer-to-peer learning

- ✅ Automatic mode switching after success

- ✅ Help text for "email disabled" error### 4. Notifications System



### 3. **Session Management****Access:** Bell icon in top-right corner (visible on all pages)

- ✅ Proper session detection

- ✅ No annoying console errors**Types of Notifications:**

- ✅ Automatic navigation- 📝 Quiz results

- ✅ Session persistence across refreshes- 📚 New content available

- 💬 Peer messages

---- 👥 Circle invitations

- 🏆 Achievements unlocked

## 🐛 Troubleshooting- ⭐ Teaching points earned



### "Email signups are disabled"**Features:**

- Real-time delivery (no refresh needed)

**Fix**: Enable Email Provider (see Step 1 above)- Unread count badge

- Click to mark as read

---- Mark all as read button

- Browser notifications (if permitted)

### "User already registered"

### 5. Parent/Guardian Dashboard

**Fix**: Use different email OR delete existing user:

```sql**Access:** Navigation → More → Parent View

DELETE FROM auth.users WHERE email = 'test@example.com';

DELETE FROM public.users WHERE email = 'test@example.com';**Features:**

```- View all linked learners

- Click learner to see detailed progress

---- Module completion status with progress bars

- Recent activity timeline

### "Invalid login credentials"- Quiz scores and statistics



**Possible causes**:**For Parents:**

1. Wrong password- Monitor learner engagement

2. User doesn't exist (sign up first)- Track learning milestones

3. Email confirmation required- View strengths and areas needing support



**Fix**:### 6. Sponsor Board

1. Double-check password

2. Try signing up if new user**Access:** Navigation → More → Sponsors OR Home → Support Us

3. Disable email confirmation (see Step 1)

**View Contributions:**

---- Total contributions amount

- Number of active sponsors

### Signup works but no profile in database- Learners supported count

- Individual sponsor cards (businesses, diaspora, individuals)

**Fix**: Run `auth_trigger_setup.sql` (see Step 2B above)

**Make a Contribution:**

---1. Click "Contribute Now"

2. Fill out form:

### Sign up succeeds but can't sign in   - Name/Organization

   - Email

**Fix**: Disable email confirmation:   - Type (Individual/Business/Diaspora)

1. Supabase Dashboard → Authentication → Providers → Email   - Amount

2. Uncheck "Confirm email"   - Optional message

3. Save3. Submit contribution

4. Appears in community board

OR manually confirm user:

```sql### 7. AI Assistant (Existing Feature)

UPDATE auth.users 

SET email_confirmed_at = NOW() **Access:** Navigation → AI icon

WHERE email = 'test@example.com';

```**Capabilities:**

- Ask questions about any subject

---- Get instant explanations

- Receive study guidance

## 📁 Important Files- Powered by Gemini AI



### Updated Files:---

- ✅ `src/services/authService.js` - Better error handling

- ✅ `src/pages/AuthPage.jsx` - Success/error alerts, better UX## 🔧 Advanced Configuration

- ✅ `.env` - Real Supabase credentials

### Customizing AI Behavior

### Database Files:

- `setup.sql` - Creates all tablesEdit `src/config/gemini.js`:

- `auth_trigger_setup.sql` - Auto-creates user profiles

- `kenyan_curriculum_content.sql` - Loads 25+ modules```javascript

// Adjust model parameters

### Documentation:export const getModel = (modelName = 'gemini-pro') => {

- `ENABLE_EMAIL_AUTH.md` - How to enable email authentication  return genAI.getGenerativeModel({ 

- `AUTHENTICATION_READY.md` - Auth implementation details    model: modelName,

- `DEPLOYMENT_GUIDE.md` - This file    generationConfig: {

      temperature: 0.7,

---      topP: 0.8,

      topK: 40,

## 🎯 Final Checklist    }

  });

- [ ] Email Provider enabled in Supabase};

- [ ] Email confirmation disabled (for dev)```

- [ ] `setup.sql` executed

- [ ] `auth_trigger_setup.sql` executed### Customizing Notification Types

- [ ] Dev server running: `npm run dev`

- [ ] Can access http://localhost:5173/Edit `src/services/notificationService.js`:

- [ ] See login page on load

- [ ] Can sign up successfully```javascript

- [ ] Redirected to homepage after signupexport const NOTIFICATION_TYPES = {

- [ ] Can sign out  // Add your custom notification types

- [ ] Can sign in again  CUSTOM_EVENT: 'custom_event',

- [ ] Session persists on refresh  // ...

};

---```



## 🚀 You're Ready!### Adding New Learning Categories



Once you enable email authentication in Supabase (Step 1), everything will work!1. Update Supabase table check constraint:

```sql

The code is complete and tested. Just flip that switch in Supabase! 🎉ALTER TABLE learning_modules DROP CONSTRAINT learning_modules_category_check;

ALTER TABLE learning_modules ADD CONSTRAINT learning_modules_category_check 

---  CHECK (category IN ('curriculum', 'financial_literacy', 'digital_skills', 'agriculture', 'your_new_category'));

```

## 📞 Quick Links

2. Update `LearningDashboard.jsx` categories array

- **Your Project**: https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpuf

- **Auth Providers**: https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpuf/auth/providers---

- **SQL Editor**: https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpuf/sql

- **Users List**: https://supabase.com/dashboard/project/lmcmxqbzqsudvqxutpuf/auth/users## 🌐 Deployment

- **Dev App**: http://localhost:5173/

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel:**
- Go to vercel.com
- Click "New Project"
- Import your GitHub repository
- Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY`

3. **Deploy:**
- Click "Deploy"
- Wait for build to complete
- Visit your live URL!

### Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Deploy:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **Set environment variables:**
- Go to Site Settings → Environment Variables
- Add all three environment variables

### Custom Domain Setup

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Netlify:**
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

---

## 📊 Database Management

### Backing Up Data

```sql
-- Export all data
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

### Adding Sample Data

```sql
-- Insert test users (do this through Supabase Auth UI)

-- Insert sample modules
INSERT INTO learning_modules (title, description, category, difficulty, order_num)
VALUES 
  ('Your Module Title', 'Description', 'curriculum', 'beginner', 1);

-- Insert test circles
INSERT INTO village_circles (name, description, category)
VALUES 
  ('Test Circle', 'A test learning circle', 'curriculum');
```

### Monitoring Real-time Connections

In Supabase Dashboard:
1. Go to Database → Realtime
2. View active subscriptions
3. Monitor message throughput

---

## 🐛 Troubleshooting

### Notifications Not Working

**Check:**
1. Browser notification permission granted
2. Real-time enabled in Supabase for `notifications` table
3. User is authenticated
4. RLS policies allow user to see notifications

**Fix:**
```javascript
// Request notification permission
if ('Notification' in window) {
  Notification.requestPermission();
}
```

### Circle Chat Not Real-time

**Check:**
1. Real-time enabled for `circle_messages`
2. User is member of circle
3. Supabase connection active

**Debug:**
```javascript
// Check channel status
const channel = supabase.channel('test');
console.log(channel.state); // Should be 'joined'
```

### AI Recommendations Not Generating

**Check:**
1. Gemini API key is valid
2. User has quiz/progress data
3. Check console for errors

**Fallback:**
```javascript
// Service returns default recommendations if AI fails
{
  recommendations: ['Continue practicing regularly'],
  suggestedModules: [],
  studyTips: ['Set daily learning goals']
}
```

### Build Errors

**Common issues:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Check for missing dependencies
npm install
```

---

## 🔐 Security Best Practices

### Environment Variables
- Never commit `.env` file
- Use different keys for dev/prod
- Rotate keys regularly

### Supabase Security
- Enable RLS on all tables
- Test policies thoroughly
- Use service role key only server-side
- Enable 2FA on Supabase account

### API Keys
- Restrict Gemini API key by domain/IP
- Monitor usage for anomalies
- Set usage quotas

---

## 📈 Performance Optimization

### Images
- Use optimized images
- Implement lazy loading
- Consider using CDN

### Code Splitting
```javascript
// Lazy load components
const VillageCircles = lazy(() => import('./components/VillageCircles'));
```

### Caching
- Service worker caches static assets
- Supabase queries can be cached
- Consider Redis for session data

---

## 🎯 Future Enhancements

### Phase 2 Features
- [ ] Video lessons support
- [ ] Live video calls in circles
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Gamification badges system
- [ ] Certificate generation

### Admin Panel
- [ ] Content management system
- [ ] User management
- [ ] Analytics dashboard
- [ ] Moderation tools

---

## 📞 Support

**Issues:** Create a GitHub issue
**Email:** support@brackets.edu
**Community:** Join our Village Circles!

## 🤝 Contributing

See `CONTRIBUTING.md` for guidelines.

---

**Happy Learning! 🎓✨**

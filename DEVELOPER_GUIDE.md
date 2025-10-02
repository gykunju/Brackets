# Brackets - Developer Quick Reference

## 🎯 Project Overview
Community-powered learning platform with AI tutoring, real-time notifications, and peer collaboration.

---

## 📁 Key Files & Their Purpose

### Configuration
- `src/config/supabase.js` - Supabase client initialization
- `src/config/gemini.js` - Gemini AI integration & helper functions
- `.env` - Environment variables (create from `.env.example`)

### Context Providers (State Management)
- `src/contexts/AuthContext.jsx` - User authentication state
- `src/contexts/NotificationContext.jsx` - Real-time notifications

### Services (Business Logic)
- `src/services/authService.js` - Authentication operations
- `src/services/learningService.js` - Learning modules & progress
- `src/services/villageCircleService.js` - Circle management & chat
- `src/services/notificationService.js` - Notification CRUD

### Components
- `src/components/LearningDashboard.jsx` - Main dashboard with AI recommendations
- `src/components/VillageCircles.jsx` - Peer learning circles with real-time chat
- `src/components/ParentDashboard.jsx` - Parent/guardian progress monitoring
- `src/components/SponsorBoard.jsx` - Community sponsorship board
- `src/components/NotificationBell.jsx` - Notification UI component
- `src/components/Navigation.jsx` - Bottom navigation bar

### Pages
- `src/pages/Home.jsx` - Landing page with quick actions
- `src/pages/Ai_Assistant.jsx` - AI tutor interface
- `src/pages/Brackets.jsx`, `Courses.jsx`, `Events.jsx` - Existing features

---

## 🔌 API Reference

### Supabase Client
```javascript
import { supabase } from '../config/supabase';

// Query
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value);

// Insert
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: value }]);

// Update
const { data, error } = await supabase
  .from('table_name')
  .update({ column: newValue })
  .eq('id', id);

// Real-time subscription
const channel = supabase
  .channel('channel_name')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'table_name' 
  }, (payload) => {
    console.log(payload.new);
  })
  .subscribe();
```

### Gemini AI
```javascript
import { generateRecommendations, getQuizFeedback } from '../config/gemini';

// Get recommendations
const recs = await generateRecommendations({
  completedModules: 5,
  quizScores: [80, 85, 90],
  weakAreas: ['algebra'],
  strongAreas: ['geometry']
});

// Get quiz feedback
const feedback = await getQuizFeedback(
  'What is 2+2?',
  '4',
  '4'
);
```

### Context Hooks
```javascript
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

// In component
const { user, profile, loading } = useAuth();
const { notifications, unreadCount, markAsRead } = useNotifications();
```

---

## 🗄️ Database Schema Quick Reference

### Key Tables
- `users` - User profiles (extends auth.users)
- `learning_modules` - Course content
- `user_progress` - Learning progress tracking
- `quiz_submissions` - Quiz answers & scores
- `notifications` - User notifications (realtime)
- `village_circles` - Learning circles
- `circle_members` - Circle membership & teaching points
- `circle_messages` - Circle chat (realtime)
- `user_activities` - Activity log
- `sponsors` - Sponsor organizations
- `contributions` - Contribution records

### Common Queries
```sql
-- Get user progress
SELECT * FROM user_progress WHERE user_id = 'uuid';

-- Get unread notifications
SELECT * FROM notifications WHERE user_id = 'uuid' AND read = false;

-- Get circle members with points
SELECT * FROM circle_members WHERE circle_id = 'uuid' ORDER BY teaching_points DESC;

-- Get user stats
SELECT 
  COUNT(*) FILTER (WHERE completed) as completed_modules,
  AVG(progress) as avg_progress
FROM user_progress 
WHERE user_id = 'uuid';
```

---

## 🎨 Component Patterns

### Loading States
```javascript
if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

### Error Handling
```javascript
try {
  const result = await someAsyncOperation();
  // Success
} catch (error) {
  console.error('Operation failed:', error);
  // Show user-friendly error
}
```

### Real-time Subscription Cleanup
```javascript
useEffect(() => {
  const channel = subscribeToSomething(callback);
  
  return () => {
    channel?.unsubscribe();
  };
}, [dependencies]);
```

---

## 🎨 Styling Conventions

### Tailwind Classes Order
1. Layout (flex, grid, block)
2. Positioning (relative, absolute)
3. Sizing (w-, h-, p-, m-)
4. Typography (text-, font-)
5. Colors (bg-, text-, border-)
6. Effects (shadow-, rounded-, hover:)

### Color Palette
- Primary: Lime (`lime-600`, `bg-lime-50`)
- Success: Green (`green-600`)
- Info: Blue (`blue-600`)
- Warning: Yellow (`yellow-600`)
- Danger: Red (`red-600`)
- Purple: AI/Special features (`purple-600`)

### Responsive Design
```javascript
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔔 Notification System

### Creating Notifications
```javascript
import { createNotification, NOTIFICATION_TYPES } from '../services/notificationService';

await createNotification({
  userId: 'user-uuid',
  type: NOTIFICATION_TYPES.QUIZ_RESULT,
  title: 'Quiz Completed!',
  message: 'You scored 85% on Math Quiz',
  data: { quizId: 'quiz-uuid', score: 85 }
});
```

### Notification Types
- `QUIZ_RESULT` - Quiz completion
- `NEW_CONTENT` - New modules added
- `PEER_MESSAGE` - Direct messages
- `CIRCLE_INVITE` - Circle invitations
- `ACHIEVEMENT` - Unlocked achievements
- `TEACHING_POINTS` - Points awarded

---

## 🤖 AI Integration Tips

### Prompting Best Practices
```javascript
// Be specific and structured
const prompt = `
  As an educational AI tutor:
  
  Student Context:
  - Level: ${student.level}
  - Subject: ${subject}
  - Recent Scores: ${scores.join(', ')}
  
  Task: ${task}
  
  Format: JSON with keys: answer, explanation, tips
`;
```

### Error Handling
```javascript
// Always provide fallback
try {
  const aiResponse = await generateAIContent(prompt);
  return aiResponse;
} catch (error) {
  console.error('AI error:', error);
  return defaultContent; // Always have a fallback
}
```

---

## 🔧 Common Tasks

### Add a New Page
1. Create component in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
```javascript
<Route path='/new-page' element={<NewPage/>}/>
```
3. Add navigation link in `Navigation.jsx`

### Add a New Service Function
1. Create function in appropriate service file
2. Export function
3. Import in component:
```javascript
import { newFunction } from '../services/serviceName';
```

### Create a New Database Table
1. Write SQL in Supabase SQL Editor
2. Add RLS policies
3. Enable realtime if needed
4. Create service functions
5. Update TypeScript types (if using TS)

---

## 🐛 Debugging Tips

### Supabase Issues
```javascript
// Check connection
console.log(supabase);

// Log query errors
const { data, error } = await supabase.from('table').select();
if (error) console.error('Query error:', error);
```

### Real-time Issues
```javascript
// Check channel status
const channel = supabase.channel('test');
console.log('Channel state:', channel.state);

// Monitor all events
channel.on('*', (payload) => {
  console.log('Event:', payload);
});
```

### Context Issues
```javascript
// Ensure provider wraps component tree
<AuthProvider>
  <NotificationProvider>
    <App />
  </NotificationProvider>
</AuthProvider>
```

---

## 📦 Build & Deploy

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
VITE_GEMINI_API_KEY=AIzaxxx
```

### Production Checklist
- [ ] Environment variables set
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Realtime enabled for required tables
- [ ] Service worker registered
- [ ] API keys secured
- [ ] Error tracking setup
- [ ] Analytics configured

---

## 🔗 Useful Links

- **Supabase Docs**: https://supabase.com/docs
- **Gemini API**: https://ai.google.dev/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/
- **React Icons**: https://react-icons.github.io/react-icons/

---

## 💡 Pro Tips

1. **Use Real-time Wisely**: Only subscribe when component is mounted, always cleanup
2. **Batch Updates**: Use `upsert` for insert-or-update operations
3. **Optimize Queries**: Select only needed columns, use indexes
4. **Cache AI Responses**: Store common AI responses to reduce API calls
5. **Error Boundaries**: Wrap components in error boundaries for better UX
6. **Progressive Enhancement**: App works without JS, enhance with features
7. **Mobile-First**: Design for mobile, scale up to desktop
8. **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation

---

**Last Updated**: October 2025
**Version**: 1.0.0

# Learning Context Tracking - Setup Checklist

## 🚀 Quick Setup (10 minutes)

### Step 1: Database Setup ✓
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Copy contents of `learning_context_tracking.sql`
- [ ] Execute the migration
- [ ] Verify success message

### Step 2: Verify Database ✓
Check these tables exist in Supabase:
- [ ] `user_learning_context`
- [ ] `learning_progress_indicators`
- [ ] `learning_snippets`
- [ ] `user_snippet_history`
- [ ] `notification_preferences`

### Step 3: Test Tracking ✓
1. [ ] Login to your app
2. [ ] Visit a few pages (Brackets, AI Assistant, Events)
3. [ ] Check `user_learning_context` table in Supabase
4. [ ] Verify rows are being created with your user_id

### Step 4: Configure Preferences ✓
1. [ ] Click notification bell (top-right)
2. [ ] Click settings icon
3. [ ] Scroll to "Learning Preferences" section
4. [ ] Enable "Learning Snippets"
5. [ ] Set frequency (start with "Every hour")
6. [ ] Choose difficulty ("Mixed" recommended)
7. [ ] Select interested categories
8. [ ] Click "Save Preferences"

### Step 5: Test Snippet Generation ✓
1. [ ] Wait for configured time interval OR
2. [ ] Manually test in browser console:
   ```javascript
   // Open browser console (F12)
   import { generateAndSendSnippet } from './src/services/learningContextService';
   await generateAndSendSnippet('your-user-id');
   ```
3. [ ] Look for floating snippet card (top-right)
4. [ ] Mark as helpful or dismiss

### Step 6: Verify History ✓
1. [ ] Click floating book icon (bottom-right)
2. [ ] See list of received snippets
3. [ ] Verify read/helpful status
4. [ ] Close history panel

## ✅ Verification Queries

### Check if tracking is working:
```sql
-- In Supabase SQL Editor
SELECT * FROM user_learning_context 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY last_interaction DESC 
LIMIT 10;
```

### Check progress indicators:
```sql
SELECT * FROM learning_progress_indicators 
WHERE user_id = 'YOUR_USER_ID';
```

### Check notification preferences:
```sql
SELECT * FROM notification_preferences 
WHERE user_id = 'YOUR_USER_ID';
```

### Check snippet history:
```sql
SELECT 
  ush.*,
  ls.title,
  ls.topic,
  ls.category
FROM user_snippet_history ush
JOIN learning_snippets ls ON ls.id = ush.snippet_id
WHERE ush.user_id = 'YOUR_USER_ID'
ORDER BY ush.sent_at DESC;
```

## 🎯 Test Scenarios

### Scenario 1: Automatic Tracking
1. [ ] Visit Brackets page
2. [ ] Click on a course (e.g., "Photosynthesis")
3. [ ] Spend 2-3 minutes reading
4. [ ] Navigate away
5. [ ] Check database for new entry

**Expected Result:**
- New row in `user_learning_context` with topic="Photosynthesis"
- `time_spent_seconds` ≥ 120
- `interaction_count` = 1

### Scenario 2: Progress Update
1. [ ] Go to Village Circles
2. [ ] Ask a question
3. [ ] View a resource
4. [ ] Check database

**Expected Result:**
- Row in `learning_progress_indicators` with category="social_learning"
- `questions_asked` = 1
- `resources_viewed` = 1
- `estimated_progress` > 0

### Scenario 3: Snippet Delivery
1. [ ] Enable snippets in preferences
2. [ ] Set frequency to "Every hour"
3. [ ] Interact with content for 5+ minutes
4. [ ] Wait 1 hour
5. [ ] Snippet should appear

**Expected Result:**
- Floating snippet card appears
- Topic relates to your interests
- Difficulty matches your progress
- Can mark helpful or dismiss

### Scenario 4: Analytics View
1. [ ] Open Learning Preferences
2. [ ] View analytics section
3. [ ] Check displayed metrics

**Expected Result:**
- Shows total interactions > 0
- Shows time spent > 0
- Shows progress by category
- Shows snippet stats if any delivered

## 🐛 Common Issues & Fixes

### Issue: No tracking happening
**Fix:**
- Verify user is logged in
- Check browser console for errors
- Ensure `learningContextService.js` is imported
- Test with manual function calls

### Issue: Snippets not appearing
**Fix:**
- Check `snippet_notifications_enabled` = true
- Verify enough time has passed (check `last_snippet_sent`)
- Ensure user has tracked interests
- Check Gemini API key is configured

### Issue: Progress always 0%
**Fix:**
- Interact with content (don't just visit)
- Track specific actions (questions, resources)
- Wait for background updates
- Refresh analytics view

### Issue: Preferences not saving
**Fix:**
- Check Supabase RLS policies are enabled
- Verify user authentication
- Look for errors in console
- Check network tab for failed requests

## 📊 Success Metrics

After 24 hours of use, you should see:
- [ ] 10+ tracked interactions
- [ ] 2-3 categories with progress
- [ ] 3+ topics in learning context
- [ ] At least 1 snippet delivered (if enabled)
- [ ] Analytics showing meaningful data

## 🎓 Usage Tips

### For Better Recommendations:
1. **Interact authentically**: Spend time on content you're interested in
2. **Provide feedback**: Mark snippets as helpful
3. **Update preferences**: Adjust frequency if too many/few
4. **Select categories**: Focus on what you want to learn
5. **Review history**: See what's been helpful

### For Developers:
1. **Add tracking hooks**: To all learning components
2. **Test thoroughly**: Verify data flows correctly
3. **Monitor console**: Watch for errors
4. **Check RLS**: Ensure policies work
5. **Optimize queries**: If performance issues

## 🔄 Integration Checklist

To add tracking to a new component:

- [ ] Import `useLearningTracker` hook
- [ ] Call hook with topic, category, options
- [ ] Add manual tracking for specific actions
- [ ] Test tracking in database
- [ ] Verify progress updates
- [ ] Document in component

Example:
```javascript
import { useLearningTracker } from '../hooks/useLearningTracker';

function MyLearningComponent() {
  const { trackAction } = useLearningTracker(
    'Component Topic',
    'component_category',
    { trackProgress: true, contentConsumed: true }
  );

  const handleSpecialAction = async () => {
    await trackAction('questionAsked');
  };

  return ...;
}
```

## 📝 Monitoring Dashboard

Create a simple monitoring query:

```sql
-- Daily tracking summary
SELECT 
  DATE(last_interaction) as date,
  COUNT(*) as interactions,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT topic) as unique_topics
FROM user_learning_context
WHERE last_interaction > NOW() - INTERVAL '7 days'
GROUP BY DATE(last_interaction)
ORDER BY date DESC;

-- Snippet effectiveness
SELECT 
  marked_helpful,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM user_snippet_history
WHERE read = true
GROUP BY marked_helpful;
```

## 🎉 You're All Set!

Once all checkboxes are ticked:
- ✅ System is tracking learning context
- ✅ Progress indicators are updating
- ✅ Snippets are being delivered
- ✅ Analytics are available
- ✅ Users can manage preferences

The intelligent learning assistant is now working! 🚀

## 🆘 Need Help?

1. Check LEARNING_CONTEXT_GUIDE.md for detailed documentation
2. Review browser console for errors
3. Check Supabase logs for database issues
4. Verify all SQL migrations ran successfully
5. Test with simple manual function calls first

Happy Learning! 📚✨

# Village Circles Setup - Quick Start

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Database Migration

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `village_circles_enhancement.sql`
4. Click "Run"
5. Verify success ✓

### Step 2: Verify Database Changes

Check these tables exist:
- ✓ `circle_messages` (with new columns: is_question, reply_to, validated_by_asker, marked_helpful_by)
- ✓ `circle_resources` (new table)

### Step 3: Test the Features

1. **Login** to your app
2. **Navigate** to Village Circles
3. **Join** a circle or create one
4. **Test Question System**:
   - Check "Ask a Question"
   - Send a message
   - See amber-highlighted question

5. **Test Answer Validation**:
   - Reply to your own question (from another account or ask someone)
   - As question asker, click "✓ Mark as Solved"
   - See verified badge and points awarded

6. **Test Resources**:
   - Click "Resources" tab
   - Click "+ Add Learning Resource"
   - Add a resource
   - Click "Generate" for AI content

## ✅ Verification Checklist

- [ ] Database migration completed
- [ ] Can ask questions (amber highlight visible)
- [ ] Can reply to questions (threaded display)
- [ ] Can validate answers (only as question asker)
- [ ] Points awarded correctly (10 pts normal, 20 pts validated)
- [ ] Resources tab visible
- [ ] Can add resources
- [ ] AI generation works
- [ ] Resources display correctly

## 🎯 Test Scenarios

### Scenario 1: Ask and Answer Question
1. User A asks: "What is photosynthesis?"
2. User B replies with answer (marks as teaching)
3. User A validates B's answer
4. User B receives +20 points
5. Answer shows "✓ Verified Answer" badge

### Scenario 2: Add Learning Resource
1. Navigate to Resources tab
2. Click "+ Add Learning Resource"
3. Enter:
   - Title: "Photosynthesis Video Tutorial"
   - Type: Video
   - URL: https://youtube.com/example
   - Description: "Great explanation for beginners"
4. Submit
5. Resource appears in list

### Scenario 3: Generate AI Content
1. Navigate to Resources tab
2. Click "Generate" button
3. Wait for AI to generate content
4. See comprehensive study guide appear
5. Content includes topics, objectives, exercises

## 🔧 Troubleshooting

### Issue: Migration fails
**Solution**: Check if tables already exist. Drop and recreate if needed.

### Issue: Can't validate answers
**Solution**: Only the question asker can validate. Make sure you're logged in as the person who asked the question.

### Issue: AI generation doesn't work
**Solution**: 
- Check Gemini API key in `.env`
- Verify `VITE_GEMINI_API_KEY` is set
- Check browser console for errors

### Issue: Resources don't load
**Solution**: 
- Check Supabase RLS policies
- Verify `circle_resources` table exists
- Check browser console for errors

### Issue: Points not updating
**Solution**: 
- Refresh the page
- Check `circle_members` table has `teaching_points` column
- Verify database triggers are working

## 📝 SQL Queries for Testing

### Check if columns exist:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'circle_messages' 
AND column_name IN ('is_question', 'reply_to', 'validated_by_asker', 'marked_helpful_by');
```

### Check resources table:
```sql
SELECT * FROM circle_resources LIMIT 5;
```

### View member points:
```sql
SELECT 
  u.full_name,
  cm.teaching_points,
  vc.name as circle_name
FROM circle_members cm
JOIN users u ON u.id = cm.user_id
JOIN village_circles vc ON vc.id = cm.circle_id
ORDER BY cm.teaching_points DESC
LIMIT 10;
```

### View questions and answers:
```sql
SELECT 
  m1.message as question,
  m1.user_id as asker,
  COUNT(m2.id) as answer_count
FROM circle_messages m1
LEFT JOIN circle_messages m2 ON m2.reply_to = m1.id
WHERE m1.is_question = true
GROUP BY m1.id, m1.message, m1.user_id;
```

## 🎓 Usage Tips

1. **For Better Questions**:
   - Be specific and clear
   - Include context
   - Use proper formatting

2. **For Better Answers**:
   - Mark as "teaching" to earn points
   - Include examples
   - Be thorough but concise

3. **For Better Resources**:
   - Add clear descriptions
   - Verify links work
   - Categorize properly (article, video, etc.)

4. **Point Optimization**:
   - Focus on answering questions (more points)
   - Get your answers validated
   - Contribute quality resources
   - Be active in discussions

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check Supabase logs
3. Verify database schema matches migration
4. Review `.env` file for correct API keys

## 🎉 You're All Set!

Your Village Circles now have:
- ✅ Question & Answer system
- ✅ Answer validation by askers
- ✅ Learning resources
- ✅ AI-generated content
- ✅ Enhanced point system
- ✅ Threaded discussions

Happy learning! 🚀

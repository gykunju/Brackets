# Learning Context Tracking & Personalized Recommendations

## 🎯 Overview

This feature implements a comprehensive system for tracking user learning context, monitoring progress, and providing personalized learning snippet recommendations based on user interests and engagement patterns.

## ✨ Features

### 1. **Context Tracking**
- Automatically tracks user interactions with content
- Records time spent on topics and categories
- Builds interest level based on engagement
- Monitors learning patterns across the platform

### 2. **Progress Indicators**
- Estimated progress per category (0-100%)
- Tracks topics explored
- Counts content consumed, questions asked/answered
- Resources viewed tracking
- Dynamic progress calculation based on engagement

### 3. **Personalized Learning Snippets**
- AI-generated bite-sized learning content
- Delivered based on user interests
- Configurable notification frequency (1h, 2h, 4h, 8h, 24h)
- Difficulty-adaptive (beginner, intermediate, advanced, mixed)
- 3-5 minute read time snippets

### 4. **Smart Recommendations**
- Recommendations based on top interests
- Category and topic filtering
- Avoids sending duplicate snippets
- Time-based delivery system
- User feedback integration

### 5. **Learning Analytics**
- Total interactions count
- Time spent tracking
- Average progress across categories
- Engagement rate metrics
- Snippet helpfulness tracking

## 🗄️ Database Schema

### Tables Created:

#### `user_learning_context`
Tracks user interactions with topics to understand interests.

```sql
- user_id: UUID (FK to users)
- topic: TEXT
- category: TEXT
- interaction_count: INTEGER
- time_spent_seconds: INTEGER
- last_interaction: TIMESTAMP
- interest_level: INTEGER (1-10)
```

#### `learning_progress_indicators`
Estimated learning progress per category based on engagement.

```sql
- user_id: UUID (FK to users)
- category: TEXT
- estimated_progress: INTEGER (0-100)
- topics_explored: TEXT[]
- content_consumed: INTEGER
- questions_asked: INTEGER
- questions_answered: INTEGER
- resources_viewed: INTEGER
```

#### `learning_snippets`
Curated learning snippets for recommendations.

```sql
- topic: TEXT
- category: TEXT
- title: TEXT
- content: TEXT
- difficulty_level: TEXT (beginner/intermediate/advanced)
- estimated_read_time_minutes: INTEGER
- tags: TEXT[]
```

#### `user_snippet_history`
History of snippets sent to users.

```sql
- user_id: UUID (FK to users)
- snippet_id: UUID (FK to learning_snippets)
- sent_at: TIMESTAMP
- read: BOOLEAN
- marked_helpful: BOOLEAN
- feedback: TEXT
```

#### `notification_preferences`
User preferences for learning snippet notifications.

```sql
- user_id: UUID (FK to users)
- snippet_notifications_enabled: BOOLEAN
- notification_frequency_hours: INTEGER
- preferred_times: TIME[]
- categories_to_include: TEXT[]
- difficulty_preference: TEXT
- last_snippet_sent: TIMESTAMP
```

## 🔧 Service Functions

### Context Tracking

```javascript
// Track user interaction with content
trackLearningInteraction(userId, topic, category, timeSpentSeconds)

// Update progress indicator
updateProgressIndicator(userId, category, options)
```

### Progress & Context Retrieval

```javascript
// Get user's learning context
getUserLearningContext(userId)

// Get user's top interests
getUserTopInterests(userId, limit)

// Get learning progress by category
getLearningProgress(userId, category)
```

### Notification Preferences

```javascript
// Get or create notification preferences
getNotificationPreferences(userId)

// Update notification preferences
updateNotificationPreferences(userId, preferences)
```

### Snippet Generation & Delivery

```javascript
// Generate personalized snippet
generatePersonalizedSnippet(userId, topic, category, difficulty)

// Get recommended snippets
getRecommendedSnippets(userId, limit)

// Send snippet notification
sendSnippetNotification(userId, snippetId)

// Check if should send notification
shouldSendSnippetNotification(userId)

// Generate and send snippet automatically
generateAndSendSnippet(userId)
```

### User Interactions

```javascript
// Mark snippet as read
markSnippetAsRead(userId, snippetId)

// Mark snippet as helpful
markSnippetAsHelpful(userId, snippetId, feedback)

// Get user's snippet history
getUserSnippetHistory(userId, limit)
```

### Analytics

```javascript
// Get comprehensive learning analytics
getUserLearningAnalytics(userId)
```

## 🎣 React Hooks

### `useLearningTracker`
Automatically tracks learning interactions when component mounts/unmounts.

```javascript
import { useLearningTracker } from '../hooks/useLearningTracker';

function CourseComponent() {
  const { trackAction } = useLearningTracker('Photosynthesis', 'curriculum', {
    trackProgress: true,
    contentConsumed: true
  });

  // Manual action tracking
  const handleQuestionAsked = () => {
    trackAction('questionAsked');
  };

  return ...;
}
```

### `usePageTimeTracker`
Tracks time spent on a page.

```javascript
import { usePageTimeTracker } from '../hooks/useLearningTracker';

function BracketsPage() {
  usePageTimeTracker('Brackets Learning', 'curriculum');
  return ...;
}
```

## 🎨 Components

### `LearningSnippets`
Main component that displays learning snippet notifications.

**Features:**
- Floating snippet cards
- Auto-check every hour for new snippets
- History view with unread counter
- Mark as helpful/dismiss actions
- Beautiful gradient design

**Location:** `src/components/LearningSnippets.jsx`

### `LearningPreferences`
Settings modal for managing learning preferences.

**Features:**
- Analytics overview
- Progress by category visualization
- Enable/disable snippets
- Frequency configuration
- Difficulty preference
- Category selection
- Save preferences

**Location:** `src/components/LearningPreferences.jsx`

## 📖 Usage Guide

### For Users

#### Viewing Learning Snippets:
1. Learning snippets appear automatically based on your settings
2. Read the snippet (3-5 minutes)
3. Mark as "Helpful" if valuable
4. Or "Dismiss" if not relevant

#### Viewing Snippet History:
1. Click the floating book icon (bottom-right)
2. See all past snippets
3. Review what you've learned
4. Check helpful marks

#### Configuring Preferences:
1. Click notification bell → Settings
2. Scroll to "Learning Preferences" section
3. Enable/disable snippet notifications
4. Set frequency (1h, 2h, 4h, 8h, 24h)
5. Choose difficulty level
6. Select interested categories
7. Save preferences

### For Developers

#### Tracking Content Interaction:

```javascript
// In any learning component
import { useLearningTracker } from '../hooks/useLearningTracker';

function MyComponent() {
  const { trackAction } = useLearningTracker(
    'Topic Name',
    'Category',
    {
      trackProgress: true,
      contentConsumed: true,
      resourceViewed: true
    }
  );

  // Track specific actions
  const handleAction = async () => {
    await trackAction('questionAsked');
  };

  return ...;
}
```

#### Tracking Page Visits:

```javascript
import { usePageTimeTracker } from '../hooks/useLearningTracker';

function PageComponent() {
  usePageTimeTracker('Page Name', 'category');
  return ...;
}
```

#### Manual Tracking:

```javascript
import { 
  trackLearningInteraction,
  updateProgressIndicator 
} from '../services/learningContextService';

// Track interaction
await trackLearningInteraction(userId, 'Topic', 'Category', 120); // 120 seconds

// Update progress
await updateProgressIndicator(userId, 'Category', {
  topic: 'Topic',
  contentConsumed: true,
  questionAsked: false,
  questionAnswered: true,
  resourceViewed: false
});
```

## 🔄 Automatic Tracking Points

The system automatically tracks interactions at these points:

1. **Course/Module Views**: When viewing course details
2. **AI Assistant**: Questions asked and time spent
3. **Village Circles**: Questions asked, answers given, resources viewed
4. **Events Page**: Event interactions
5. **Brackets Learning**: Time spent on learning paths

## 📊 Progress Calculation

Progress is estimated based on:
- Number of topics explored (×10 points each)
- Content consumed (+5 points each)
- Questions asked (+3 points each)
- Questions answered (+8 points each)
- Resources viewed (+2 points each)

**Formula:** `min(100, sum of all engagement points)`

## 🎯 Snippet Generation Logic

1. **User Analysis**: Get top 10 interests
2. **Category Selection**: Choose from most engaged categories
3. **Topic Selection**: Pick topics with highest interest level
4. **Difficulty Adaptation**:
   - Progress < 30%: Beginner content
   - Progress 30-70%: Intermediate content
   - Progress > 70%: Advanced content
5. **AI Generation**: Create personalized 200-word snippet
6. **Delivery Check**: Verify time since last snippet
7. **Send Notification**: Record in history

## 🔔 Notification Timing

Snippets are sent based on:
- **Frequency setting**: User-configured interval (1-24 hours)
- **Last sent time**: Tracks when last snippet was delivered
- **User interests**: Must have tracked interests
- **Enable status**: User must have notifications enabled

## 📈 Analytics Metrics

### Tracked Metrics:
- **Total Interactions**: Sum of all content interactions
- **Time Spent**: Total minutes across all topics
- **Average Progress**: Mean progress across categories
- **Categories Explored**: Number of unique categories
- **Topics Explored**: Number of unique topics
- **Snippets Received**: Total snippets delivered
- **Snippets Read**: Number marked as read
- **Snippets Helpful**: Number marked helpful
- **Engagement Rate**: (Read / Received) × 100
- **Helpful Rate**: (Helpful / Read) × 100

## 🎨 UI/UX Features

### Snippet Card Design:
- **Gradient headers**: Color-coded by difficulty
- **Difficulty indicators**: Emoji + label
- **Estimated time**: Read time displayed
- **Category/Topic tags**: Visual categorization
- **Action buttons**: Helpful/Dismiss with icons
- **Smooth animations**: Slide-in, fade effects

### Preferences UI:
- **Analytics dashboard**: Overview of learning journey
- **Progress visualization**: Bars per category
- **Toggle switches**: Enable/disable features
- **Frequency selector**: Dropdown with options
- **Difficulty buttons**: Visual selection
- **Category chips**: Multi-select interface

## 🚀 Setup Instructions

### 1. Run Database Migration

```bash
# Execute in Supabase SQL Editor
# File: learning_context_tracking.sql
```

### 2. Verify Tables Created

Check that all 5 tables exist:
- ✓ user_learning_context
- ✓ learning_progress_indicators
- ✓ learning_snippets
- ✓ user_snippet_history
- ✓ notification_preferences

### 3. Test Tracking

1. Visit different pages
2. Check `user_learning_context` table
3. Verify interactions recorded

### 4. Configure Preferences

1. Login to app
2. Go to notification settings
3. Enable learning snippets
4. Set frequency and preferences
5. Test snippet generation

### 5. Monitor Delivery

Check `user_snippet_history` for delivered snippets

## 🔐 Privacy & Security

- **RLS Policies**: All tables have Row Level Security
- **User Isolation**: Users only see their own data
- **No Data Sharing**: Learning context is private
- **Optional Tracking**: Users can disable features
- **Data Control**: Users can delete history

## 🎯 Best Practices

### For Optimal Experience:
1. **Enable tracking** on key learning pages
2. **Set realistic frequency** (not too often)
3. **Select relevant categories** (quality > quantity)
4. **Provide feedback** on snippets (improves recommendations)
5. **Review progress** regularly in dashboard

### For Developers:
1. **Add tracking hooks** to all learning components
2. **Track meaningful actions** (not just clicks)
3. **Use appropriate categories** (consistent naming)
4. **Include time tracking** (accurate engagement)
5. **Test progress updates** (verify calculation)

## 📊 Performance Considerations

- **Batch updates**: Context updates use upsert
- **Indexed queries**: All lookups use indexes
- **Background checks**: Snippet checks run hourly
- **Cached preferences**: Stored in state
- **Efficient filters**: Avoid duplicate deliveries

## 🐛 Troubleshooting

### Snippets Not Appearing:
- Check if notifications enabled in preferences
- Verify last_snippet_sent time (must exceed frequency)
- Ensure user has tracked interests
- Check browser console for errors

### Progress Not Updating:
- Verify tracking hooks properly placed
- Check userId is correct
- Review database triggers
- Test with manual calls

### Analytics showing zeros:
- Must interact with content first
- Track interactions using hooks
- Wait for data to accumulate
- Refresh analytics view

## 🔮 Future Enhancements

Potential additions:
- [ ] Email delivery of snippets
- [ ] Push notifications (PWA)
- [ ] Snippet collections/playlists
- [ ] Social sharing of helpful snippets
- [ ] Snippet bookmarking
- [ ] Advanced analytics dashboard
- [ ] ML-based recommendation engine
- [ ] Spaced repetition system
- [ ] Gamification (streaks, badges)
- [ ] Collaborative learning goals

## 📝 Example Workflow

1. **User browses** Brackets → Photosynthesis
2. **System tracks**: "Photosynthesis", "curriculum", 180 seconds
3. **Interest level** increases to 3/10
4. **Progress indicator** updated: +15 points
5. **1 hour later**: Check if user should receive snippet
6. **AI generates**: Personalized beginner snippet on Photosynthesis
7. **Snippet delivered**: Appears as floating card
8. **User reads**: Marks as helpful
9. **System learns**: Boost photosynthesis interest to 5/10
10. **Next snippet**: Higher difficulty, related topic

## 🎉 Summary

This feature creates a self-learning, adaptive system that:
- ✅ Understands user interests automatically
- ✅ Tracks learning progress intelligently
- ✅ Delivers personalized content timely
- ✅ Adapts to user preferences
- ✅ Provides valuable analytics
- ✅ Enhances engagement
- ✅ Improves learning outcomes

The system works silently in the background, learning from every interaction to provide increasingly relevant and helpful learning snippets! 🚀

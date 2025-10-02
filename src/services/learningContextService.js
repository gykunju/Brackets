import { supabase } from '../config/supabase';
import { generateText } from '../config/gemini';

// Track user interaction with content
export const trackLearningInteraction = async (userId, topic, category, timeSpentSeconds = 0) => {
  try {
    const { error } = await supabase.rpc('update_learning_context', {
      p_user_id: userId,
      p_topic: topic,
      p_category: category,
      p_time_spent: timeSpentSeconds
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error tracking learning interaction:', error);
    return false;
  }
};

// Update progress indicator
export const updateProgressIndicator = async (userId, category, options = {}) => {
  try {
    const {
      topic = null,
      contentConsumed = false,
      questionAsked = false,
      questionAnswered = false,
      resourceViewed = false
    } = options;

    const { error } = await supabase.rpc('update_progress_indicator', {
      p_user_id: userId,
      p_category: category,
      p_topic: topic,
      p_content_consumed: contentConsumed,
      p_question_asked: questionAsked,
      p_question_answered: questionAnswered,
      p_resource_viewed: resourceViewed
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating progress indicator:', error);
    return false;
  }
};

// Get user's learning context
export const getUserLearningContext = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_learning_context')
      .select('*')
      .eq('user_id', userId)
      .order('interest_level', { ascending: false })
      .order('last_interaction', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user learning context:', error);
    return [];
  }
};

// Get user's top interests
export const getUserTopInterests = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('user_learning_context')
      .select('topic, category, interest_level, interaction_count')
      .eq('user_id', userId)
      .order('interest_level', { ascending: false })
      .order('interaction_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching top interests:', error);
    return [];
  }
};

// Get learning progress by category
export const getLearningProgress = async (userId, category = null) => {
  try {
    let query = supabase
      .from('learning_progress_indicators')
      .select('*')
      .eq('user_id', userId);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('estimated_progress', { ascending: false });

    if (error) throw error;
    return category ? (data?.[0] || null) : (data || []);
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    return category ? null : [];
  }
};

// Get or create notification preferences
export const getNotificationPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No preferences exist, create default
      const { data: newData, error: insertError } = await supabase
        .from('notification_preferences')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (userId, preferences) => {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return null;
  }
};

// Generate personalized learning snippet
export const generatePersonalizedSnippet = async (userId, topic, category, difficultyLevel = 'mixed') => {
  try {
    // Get user's progress in this category
    const progress = await getLearningProgress(userId, category);
    const progressLevel = progress?.estimated_progress || 0;

    // Determine difficulty based on progress if mixed
    let targetDifficulty = difficultyLevel;
    if (difficultyLevel === 'mixed') {
      if (progressLevel < 30) targetDifficulty = 'beginner';
      else if (progressLevel < 70) targetDifficulty = 'intermediate';
      else targetDifficulty = 'advanced';
    }

    const prompt = `Generate a concise, engaging learning snippet about "${topic}" in the category "${category}" for a ${targetDifficulty} level learner.

Requirements:
1. Keep it under 200 words
2. Include one key concept or insight
3. Make it practical and actionable
4. End with a thought-provoking question or reflection
5. Use simple, clear language

Format the response as a short educational paragraph.`;

    const content = await generateText(prompt);

    if (!content) {
      return null;
    }

    // Store the snippet
    const { data, error } = await supabase
      .from('learning_snippets')
      .insert([{
        topic,
        category,
        title: `${topic} Insight`,
        content,
        difficulty_level: targetDifficulty,
        estimated_read_time_minutes: 3,
        tags: [topic, category, targetDifficulty]
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating personalized snippet:', error);
    return null;
  }
};

// Get recommended snippets for user
export const getRecommendedSnippets = async (userId, limit = 5) => {
  try {
    // Get user's top interests
    const interests = await getUserTopInterests(userId, 10);
    
    if (interests.length === 0) {
      // No interests yet, return general snippets
      const { data, error } = await supabase
        .from('learning_snippets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }

    // Get snippets matching user's interests
    const categories = [...new Set(interests.map(i => i.category))];
    const topics = [...new Set(interests.map(i => i.topic))];

    const { data, error } = await supabase
      .from('learning_snippets')
      .select('*')
      .or(`category.in.(${categories.join(',')}),topic.in.(${topics.join(',')})`)
      .order('created_at', { ascending: false })
      .limit(limit * 2);

    if (error) throw error;

    // Filter out already sent snippets
    const { data: history } = await supabase
      .from('user_snippet_history')
      .select('snippet_id')
      .eq('user_id', userId);

    const sentIds = new Set(history?.map(h => h.snippet_id) || []);
    const unsent = data?.filter(s => !sentIds.has(s.id)) || [];

    return unsent.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommended snippets:', error);
    return [];
  }
};

// Send snippet notification to user
export const sendSnippetNotification = async (userId, snippetId) => {
  try {
    // Record in history
    const { error: historyError } = await supabase
      .from('user_snippet_history')
      .insert([{
        user_id: userId,
        snippet_id: snippetId,
        sent_at: new Date().toISOString()
      }]);

    if (historyError) throw historyError;

    // Update last snippet sent time
    await supabase
      .from('notification_preferences')
      .update({ last_snippet_sent: new Date().toISOString() })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    console.error('Error sending snippet notification:', error);
    return false;
  }
};

// Mark snippet as read
export const markSnippetAsRead = async (userId, snippetId) => {
  try {
    const { error } = await supabase
      .from('user_snippet_history')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('snippet_id', snippetId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking snippet as read:', error);
    return false;
  }
};

// Mark snippet as helpful
export const markSnippetAsHelpful = async (userId, snippetId, feedback = null) => {
  try {
    const updateData = {
      marked_helpful: true,
      read: true
    };

    if (feedback) {
      updateData.feedback = feedback;
    }

    const { error } = await supabase
      .from('user_snippet_history')
      .update(updateData)
      .eq('user_id', userId)
      .eq('snippet_id', snippetId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking snippet as helpful:', error);
    return false;
  }
};

// Get user's snippet history
export const getUserSnippetHistory = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('user_snippet_history')
      .select(`
        *,
        snippet:learning_snippets(*)
      `)
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching snippet history:', error);
    return [];
  }
};

// Check if user should receive snippet notification
export const shouldSendSnippetNotification = async (userId) => {
  try {
    const prefs = await getNotificationPreferences(userId);
    
    if (!prefs || !prefs.snippet_notifications_enabled) {
      return false;
    }

    // Check if enough time has passed since last snippet
    if (prefs.last_snippet_sent) {
      const lastSent = new Date(prefs.last_snippet_sent);
      const now = new Date();
      const hoursSinceLastSent = (now - lastSent) / (1000 * 60 * 60);

      if (hoursSinceLastSent < prefs.notification_frequency_hours) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking snippet notification eligibility:', error);
    return false;
  }
};

// Generate and send snippet notification
export const generateAndSendSnippet = async (userId) => {
  try {
    const shouldSend = await shouldSendSnippetNotification(userId);
    if (!shouldSend) {
      return null;
    }

    // Get user's top interest
    const interests = await getUserTopInterests(userId, 1);
    if (interests.length === 0) {
      return null;
    }

    const topInterest = interests[0];
    const prefs = await getNotificationPreferences(userId);

    // Generate snippet
    const snippet = await generatePersonalizedSnippet(
      userId,
      topInterest.topic,
      topInterest.category,
      prefs?.difficulty_preference || 'mixed'
    );

    if (!snippet) {
      return null;
    }

    // Send notification
    await sendSnippetNotification(userId, snippet.id);

    return snippet;
  } catch (error) {
    console.error('Error generating and sending snippet:', error);
    return null;
  }
};

// Get learning analytics for user
export const getUserLearningAnalytics = async (userId) => {
  try {
    const [context, progress, snippetHistory] = await Promise.all([
      getUserLearningContext(userId),
      getLearningProgress(userId),
      getUserSnippetHistory(userId, 100)
    ]);

    // Calculate analytics
    const totalInteractions = context.reduce((sum, c) => sum + c.interaction_count, 0);
    const totalTimeSpent = context.reduce((sum, c) => sum + c.time_spent_seconds, 0);
    const averageProgress = progress.length > 0
      ? progress.reduce((sum, p) => sum + p.estimated_progress, 0) / progress.length
      : 0;
    const snippetsRead = snippetHistory.filter(h => h.read).length;
    const snippetsHelpful = snippetHistory.filter(h => h.marked_helpful).length;

    return {
      totalInteractions,
      totalTimeSpentMinutes: Math.round(totalTimeSpent / 60),
      averageProgress: Math.round(averageProgress),
      categoriesExplored: progress.length,
      topicsExplored: context.length,
      snippetsReceived: snippetHistory.length,
      snippetsRead,
      snippetsHelpful,
      engagementRate: snippetHistory.length > 0 ? Math.round((snippetsRead / snippetHistory.length) * 100) : 0,
      helpfulRate: snippetsRead > 0 ? Math.round((snippetsHelpful / snippetsRead) * 100) : 0
    };
  } catch (error) {
    console.error('Error getting learning analytics:', error);
    return null;
  }
};

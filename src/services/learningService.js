import { supabase } from '../config/supabase';
import { generateRecommendations, getQuizFeedback } from '../config/gemini';

// Get user's learning modules
export const getLearningModules = async (category = null) => {
  try {
    let query = supabase
      .from('learning_modules')
      .select('*')
      .order('order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching learning modules:', error);
    return [];
  }
};

// Track module progress
export const updateModuleProgress = async (userId, moduleId, progress) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert([
        {
          user_id: userId,
          module_id: moduleId,
          progress: progress,
          last_accessed: new Date().toISOString(),
          completed: progress >= 100
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating module progress:', error);
    return null;
  }
};

// Get user's learning progress
export const getUserProgress = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        module:learning_modules(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
};

// Submit quiz answer
export const submitQuizAnswer = async (quizData) => {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert([
        {
          user_id: quizData.userId,
          quiz_id: quizData.quizId,
          module_id: quizData.moduleId,
          answers: quizData.answers,
          score: quizData.score,
          submitted_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    
    // Get AI feedback for each question
    const feedback = await Promise.all(
      quizData.questions.map(async (q, idx) => {
        return await getQuizFeedback(
          q.question,
          quizData.answers[idx],
          q.correctAnswer
        );
      })
    );

    return { submission: data[0], feedback };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return null;
  }
};

// Get AI-powered recommendations
export const getPersonalizedRecommendations = async (userId) => {
  try {
    // Fetch user's learning data
    const progress = await getUserProgress(userId);
    const { data: quizScores } = await supabase
      .from('quiz_submissions')
      .select('score, module_id')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(10);

    const learnerData = {
      completedModules: progress.filter(p => p.completed).length,
      quizScores: quizScores || [],
      weakAreas: [], // Could be computed from quiz results
      strongAreas: []
    };

    const recommendations = await generateRecommendations(learnerData);
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return null;
  }
};

// Track user activity
export const trackUserActivity = async (userId, activityType, metadata = {}) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([
        {
          user_id: userId,
          activity_type: activityType,
          metadata: metadata,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error tracking activity:', error);
    return false;
  }
};

// Get learner statistics
export const getLearnerStats = async (userId) => {
  try {
    const [progress, quizzes, circles] = await Promise.all([
      getUserProgress(userId),
      supabase
        .from('quiz_submissions')
        .select('score')
        .eq('user_id', userId),
      supabase
        .from('circle_members')
        .select('teaching_points, circle_id')
        .eq('user_id', userId)
    ]);

    const totalModules = progress.length;
    const completedModules = progress.filter(p => p.completed).length;
    const averageScore = quizzes.data?.length 
      ? quizzes.data.reduce((sum, q) => sum + q.score, 0) / quizzes.data.length 
      : 0;
    const totalTeachingPoints = circles.data?.reduce((sum, c) => sum + c.teaching_points, 0) || 0;

    return {
      totalModules,
      completedModules,
      averageScore: Math.round(averageScore),
      totalTeachingPoints,
      circlesJoined: circles.data?.length || 0
    };
  } catch (error) {
    console.error('Error getting learner stats:', error);
    return null;
  }
};

import React, { useState, useEffect } from 'react';
import { FiUser, FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';
import { supabase } from '../config/supabase';
import { getUserProgress, getLearnerStats } from '../services/learningService';

const LearnerCard = ({ learner, onSelect }) => (
  <div
    onClick={() => onSelect(learner)}
    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
        {learner.full_name?.charAt(0) || 'L'}
      </div>
      <div>
        <h3 className="font-semibold">{learner.full_name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{learner.email}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="bg-lime-50 dark:bg-lime-900/20 rounded p-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">Modules</p>
        <p className="font-semibold">
          {learner.stats?.completedModules || 0}/{learner.stats?.totalModules || 0}
        </p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">Avg Score</p>
        <p className="font-semibold">{learner.stats?.averageScore || 0}%</p>
      </div>
    </div>
  </div>
);

const LearnerDetail = ({ learner, onBack }) => {
  const [progress, setProgress] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearnerData();
  }, [learner.id]);

  const loadLearnerData = async () => {
    setLoading(true);
    
    const [progressData, activityData] = await Promise.all([
      getUserProgress(learner.id),
      supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', learner.id)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);
    
    setProgress(progressData);
    setRecentActivity(activityData.data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-lime-700 hover:text-lime-800 dark:text-lime-500 text-sm mb-4"
        >
          ← Back to learners
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
            {learner.full_name?.charAt(0) || 'L'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{learner.full_name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{learner.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FiUser className="text-lime-700" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Modules</span>
          </div>
          <p className="text-2xl font-bold">
            {learner.stats?.completedModules || 0}/{learner.stats?.totalModules || 0}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Score</span>
          </div>
          <p className="text-2xl font-bold">{learner.stats?.averageScore || 0}%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FiAward className="text-yellow-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Points</span>
          </div>
          <p className="text-2xl font-bold">{learner.stats?.totalTeachingPoints || 0}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FiClock className="text-purple-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Circles</span>
          </div>
          <p className="text-2xl font-bold">{learner.stats?.circlesJoined || 0}</p>
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-4">Module Progress</h3>
        <div className="space-y-4">
          {progress.length > 0 ? (
            progress.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{p.module?.title || 'Unknown Module'}</span>
                  <span className="text-gray-600 dark:text-gray-400">{p.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      p.completed ? 'bg-green-500' : 'bg-lime-600'
                    }`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No progress yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center text-lime-700 flex-shrink-0 mt-1">
                  {activity.activity_type === 'quiz' ? '📝' : '📚'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">
                    {activity.activity_type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const [learners, setLearners] = useState([]);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearners();
  }, []);

  const loadLearners = async () => {
    setLoading(true);
    
    // In a real app, this would fetch learners linked to the parent/guardian
    // For now, fetch all users with their stats
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'learner')
      .limit(10);

    if (!error && users) {
      // Load stats for each learner
      const learnersWithStats = await Promise.all(
        users.map(async (user) => {
          const stats = await getLearnerStats(user.id);
          return { ...user, stats };
        })
      );
      setLearners(learnersWithStats);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  if (selectedLearner) {
    return (
      <div className="min-h-screen p-5 geist-font">
        <div className="max-w-4xl mx-auto">
          <LearnerDetail
            learner={selectedLearner}
            onBack={() => setSelectedLearner(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 geist-font">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Parent/Guardian Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your learners' progress and achievements
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learners.map((learner) => (
            <LearnerCard
              key={learner.id}
              learner={learner}
              onSelect={setSelectedLearner}
            />
          ))}
        </div>

        {learners.length === 0 && (
          <div className="text-center py-12">
            <FiUser size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">No learners found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;

import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiTrendingUp, FiAward, FiUsers, FiZap } from 'react-icons/fi';
import {
  getLearningModules,
  getUserProgress,
  getPersonalizedRecommendations,
  getLearnerStats
} from '../services/learningService';
import { useAuth } from '../contexts/AuthContext';

const ModuleCard = ({ module, progress, onClick }) => {
  const progressPercent = progress?.progress || 0;
  
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-2xl hover:scale-105 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 relative overflow-hidden"
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="flex items-start justify-between mb-3 relative z-10">
        <h3 className="font-semibold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{module.title}</h3>
        {progress?.completed && (
          <span className="text-green-500 text-2xl animate-bounce">✓</span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 relative z-10">
        {module.description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-3 relative z-10">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
          <span>Progress</span>
          <span className="text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-3 rounded-full transition-all duration-500 ease-out relative"
            style={{ 
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
              boxShadow: progressPercent > 0 ? '0 0 10px rgba(139, 92, 246, 0.5)' : 'none'
            }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-3 relative z-10">
        <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-md">
          {module.category}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
          </svg>
          {module.duration || '2-3 hours'}
        </span>
      </div>
    </div>
  );
};

const AIRecommendationPanel = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-xl border-2 border-purple-200 dark:border-purple-800 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
            <FiZap className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI-Powered Recommendations</h3>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="relative z-10">
        {recommendations.recommendations && recommendations.recommendations.length > 0 && (
          <div className="mb-5">
            <h4 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">For You:</h4>
            <ul className="space-y-3">
              {recommendations.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">✨</span>
                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Suggested Modules */}
        {recommendations.suggestedModules && recommendations.suggestedModules.length > 0 && (
          <div className="mb-5">
            <h4 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">Focus On:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.suggestedModules.map((module, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Study Tips */}
        {recommendations.studyTips && recommendations.studyTips.length > 0 && (
          <div>
            <h4 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">Study Tips:</h4>
            <ul className="space-y-2">
              {recommendations.studyTips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-xl">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color, gradient }) => (
  <div className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative">
    {/* Animated background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    
    <div className="relative flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={28} className="group-hover:animate-pulse" />
      </div>
      <div>
        <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  </div>
);

const LearningDashboard = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const categories = [
    { id: 'all', name: 'All Modules' },
    { id: 'curriculum', name: 'Curriculum' },
    { id: 'financial_literacy', name: 'Financial Literacy' },
    { id: 'digital_skills', name: 'Digital Skills' },
    { id: 'agriculture', name: 'Agriculture' }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [user, selectedCategory]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    
    // Load modules and progress
    const [modulesData, progressData, statsData] = await Promise.all([
      getLearningModules(selectedCategory === 'all' ? null : selectedCategory),
      getUserProgress(user.id),
      getLearnerStats(user.id)
    ]);
    
    setModules(modulesData);
    setProgress(progressData);
    setStats(statsData);
    setLoading(false);

    // Load AI recommendations
    setLoadingRecommendations(true);
    const recs = await getPersonalizedRecommendations(user.id);
    setRecommendations(recs);
    setLoadingRecommendations(false);
  };

  const getProgressForModule = (moduleId) => {
    return progress.find((p) => p.module_id === moduleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="relative mx-auto" style={{ width: '100px', height: '100px' }}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>
            {/* Middle ring */}
            <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-purple-500 border-l-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Inner circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Dashboard
            </h3>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 geist-font">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FiBookOpen className="animate-pulse" />
              Learning Dashboard
            </h1>
            <p className="text-indigo-100 text-lg">
              Track your progress and get personalized recommendations
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={FiBookOpen}
              label="Completed Modules"
              value={`${stats.completedModules}/${stats.totalModules}`}
              color="bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
              gradient="from-blue-500 to-indigo-600"
            />
            <StatsCard
              icon={FiTrendingUp}
              label="Average Score"
              value={`${stats.averageScore}%`}
              color="bg-gradient-to-br from-green-500 to-emerald-600 text-white"
              gradient="from-green-500 to-emerald-600"
            />
            <StatsCard
              icon={FiAward}
              label="Teaching Points"
              value={stats.totalTeachingPoints}
              color="bg-gradient-to-br from-yellow-500 to-orange-600 text-white"
              gradient="from-yellow-500 to-orange-600"
            />
            <StatsCard
              icon={FiUsers}
              label="Circles Joined"
              value={stats.circlesJoined}
              color="bg-gradient-to-br from-purple-500 to-pink-600 text-white"
              gradient="from-purple-500 to-pink-600"
            />
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mb-6">
          <AIRecommendationPanel
            recommendations={recommendations}
            loading={loadingRecommendations}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Browse Categories</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={getProgressForModule(module.id)}
              onClick={() => {
                // Handle module click - navigate to module detail
                console.log('Navigate to module:', module.id);
              }}
            />
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="animate-float">
              <FiBookOpen size={64} className="mx-auto mb-6 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No modules available</h3>
            <p className="text-gray-500 dark:text-gray-400">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;

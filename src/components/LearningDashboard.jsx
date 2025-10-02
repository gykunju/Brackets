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
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{module.title}</h3>
        {progress?.completed && (
          <span className="text-green-500 text-xl">✓</span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {module.description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-lime-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-3">
        <span className="px-2 py-1 bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 rounded">
          {module.category}
        </span>
        <span>{module.duration || '2-3 hours'}</span>
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
    <div className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FiZap className="text-lime-700 dark:text-lime-500" size={24} />
        <h3 className="font-semibold text-lg">AI-Powered Recommendations</h3>
      </div>
      
      {/* Recommendations */}
      {recommendations.recommendations && recommendations.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">For You:</h4>
          <ul className="space-y-2">
            {recommendations.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <span className="text-lime-700 dark:text-lime-500">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Suggested Modules */}
      {recommendations.suggestedModules && recommendations.suggestedModules.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Focus On:</h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.suggestedModules.map((module, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm"
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
          <h4 className="font-medium text-sm mb-2">Study Tips:</h4>
          <ul className="space-y-1">
            {recommendations.studyTips.map((tip, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                💡 {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 geist-font">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and get personalized recommendations
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              icon={FiBookOpen}
              label="Completed Modules"
              value={`${stats.completedModules}/${stats.totalModules}`}
              color="bg-lime-100 dark:bg-lime-900/30 text-lime-700"
            />
            <StatsCard
              icon={FiTrendingUp}
              label="Average Score"
              value={`${stats.averageScore}%`}
              color="bg-green-100 dark:bg-green-900/30 text-green-600"
            />
            <StatsCard
              icon={FiAward}
              label="Teaching Points"
              value={stats.totalTeachingPoints}
              color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
            />
            <StatsCard
              icon={FiUsers}
              label="Circles Joined"
              value={stats.circlesJoined}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
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
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-lime-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
          <div className="text-center py-12">
            <FiBookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">No modules available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;

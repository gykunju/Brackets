import { useState, useEffect } from 'react';
import { FiSettings, FiX, FiClock, FiBell, FiTrendingUp } from 'react-icons/fi';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserLearningAnalytics,
  getLearningProgress
} from '../services/learningContextService';
import { useAuth } from '../contexts/AuthContext';

const LearningPreferences = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    'curriculum',
    'financial_literacy',
    'digital_skills',
    'agriculture',
    'entrepreneurship',
    'health',
    'technology'
  ];

  const frequencyOptions = [
    { hours: 1, label: 'Every hour' },
    { hours: 2, label: 'Every 2 hours' },
    { hours: 4, label: 'Every 4 hours' },
    { hours: 8, label: 'Twice a day' },
    { hours: 24, label: 'Once a day' }
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    }
  }, [isOpen, user]);

  const loadData = async () => {
    setLoading(true);
    const [prefs, analyticsData, progressData] = await Promise.all([
      getNotificationPreferences(user.id),
      getUserLearningAnalytics(user.id),
      getLearningProgress(user.id)
    ]);
    
    setPreferences(prefs || {
      snippet_notifications_enabled: true,
      notification_frequency_hours: 1,
      categories_to_include: [],
      difficulty_preference: 'mixed'
    });
    setAnalytics(analyticsData);
    setProgress(progressData);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateNotificationPreferences(user.id, preferences);
    setSaving(false);
    onClose();
  };

  const toggleCategory = (category) => {
    const categories = preferences.categories_to_include || [];
    const newCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
    
    setPreferences({ ...preferences, categories_to_include: newCategories });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <FiSettings size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Learning Preferences</h2>
                <p className="text-indigo-100">Customize your learning experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Analytics Overview */}
              {analytics && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-indigo-600" />
                    Your Learning Journey
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{analytics.totalInteractions}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Interactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{analytics.totalTimeSpentMinutes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">{analytics.averageProgress}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{analytics.snippetsHelpful}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Helpful Snippets</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress by Category */}
              {progress.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                    Progress by Category
                  </h3>
                  <div className="space-y-3">
                    {progress.map((p) => (
                      <div key={p.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {p.category.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {p.estimated_progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                            style={{ width: `${p.estimated_progress}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          {p.topics_explored?.length || 0} topics • {p.content_consumed} content consumed
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FiBell />
                  Snippet Notifications
                </h3>
                
                {/* Enable/Disable */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Enable Learning Snippets
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Receive personalized learning content
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences?.snippet_notifications_enabled || false}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          snippet_notifications_enabled: e.target.checked
                        })
                      }
                      className="w-6 h-6 rounded"
                    />
                  </label>
                </div>

                {/* Frequency */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FiClock />
                    Notification Frequency
                  </label>
                  <select
                    value={preferences?.notification_frequency_hours || 1}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        notification_frequency_hours: parseInt(e.target.value)
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    disabled={!preferences?.snippet_notifications_enabled}
                  >
                    {frequencyOptions.map((opt) => (
                      <option key={opt.hours} value={opt.hours}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Preference */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">
                    Content Difficulty
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['beginner', 'intermediate', 'advanced', 'mixed'].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setPreferences({ ...preferences, difficulty_preference: level })
                        }
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          preferences?.difficulty_preference === level
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                        disabled={!preferences?.snippet_notifications_enabled}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <label className="block mb-3 font-medium text-gray-900 dark:text-gray-100">
                    Interested Categories
                    <span className="ml-2 text-sm text-gray-500">(leave empty for all)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          preferences?.categories_to_include?.includes(category)
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                        disabled={!preferences?.snippet_notifications_enabled}
                      >
                        {category.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPreferences;

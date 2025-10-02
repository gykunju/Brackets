import { useState, useEffect } from 'react';
import { FiX, FiThumbsUp, FiBook, FiClock, FiTrendingUp } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import {
  getRecommendedSnippets,
  markSnippetAsRead,
  markSnippetAsHelpful,
  getUserSnippetHistory,
  shouldSendSnippetNotification,
  generateAndSendSnippet
} from '../services/learningContextService';
import { useAuth } from '../contexts/AuthContext';

const LearningSnippet = ({ snippet, onDismiss, onMarkHelpful }) => {
  const difficultyColors = {
    beginner: 'from-green-500 to-emerald-500',
    intermediate: 'from-blue-500 to-indigo-500',
    advanced: 'from-purple-500 to-pink-500'
  };

  const difficultyIcons = {
    beginner: '🌱',
    intermediate: '🌿',
    advanced: '🌳'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden max-w-md animate-slide-in">
      {/* Header */}
      <div className={`bg-gradient-to-r ${difficultyColors[snippet.difficulty_level]} p-4 text-white`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <BsStars size={24} className="animate-pulse" />
            <span className="font-bold text-lg">Quick Learn</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            <FiClock size={14} />
            {snippet.estimated_read_time_minutes} min
          </span>
          <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            {difficultyIcons[snippet.difficulty_level]}
            {snippet.difficulty_level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <FiBook className="text-indigo-600" />
          {snippet.title}
        </h3>
        
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
            {snippet.category}
          </span>
          {snippet.topic && (
            <span className="inline-block ml-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              {snippet.topic}
            </span>
          )}
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {snippet.content}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => onMarkHelpful(snippet.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            <FiThumbsUp size={18} />
            Helpful
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

const LearningSnippets = () => {
  const { user } = useAuth();
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [snippetHistory, setSnippetHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      checkAndShowSnippet();
      loadSnippetHistory();
      
      // Set up interval to check for new snippets
      const interval = setInterval(checkAndShowSnippet, 60 * 60 * 1000); // Check every hour
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkAndShowSnippet = async () => {
    if (!user || currentSnippet) return;

    setLoading(true);
    const shouldSend = await shouldSendSnippetNotification(user.id);
    
    if (shouldSend) {
      const snippet = await generateAndSendSnippet(user.id);
      if (snippet) {
        setCurrentSnippet(snippet);
        await markSnippetAsRead(user.id, snippet.id);
      }
    }
    setLoading(false);
  };

  const loadSnippetHistory = async () => {
    if (!user) return;
    const history = await getUserSnippetHistory(user.id, 10);
    setSnippetHistory(history);
  };

  const handleDismiss = () => {
    setCurrentSnippet(null);
  };

  const handleMarkHelpful = async (snippetId) => {
    if (!user) return;
    await markSnippetAsHelpful(user.id, snippetId);
    setCurrentSnippet(null);
    loadSnippetHistory();
  };

  if (!user) return null;

  return (
    <>
      {/* Current Snippet Notification */}
      {currentSnippet && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <LearningSnippet
            snippet={currentSnippet}
            onDismiss={handleDismiss}
            onMarkHelpful={handleMarkHelpful}
          />
        </div>
      )}

      {/* History Button */}
      {snippetHistory.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="fixed bottom-24 right-4 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          title="View snippet history"
        >
          <FiBook size={24} />
          {snippetHistory.filter(h => !h.read).length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
              {snippetHistory.filter(h => !h.read).length}
            </span>
          )}
        </button>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiBook />
                  Learning History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  <FiX size={24} />
                </button>
              </div>
              <p className="text-indigo-100 mt-2">
                Review your past learning snippets
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {snippetHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BsStars size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No snippets yet. Keep learning!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {snippetHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        item.read
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                          : 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.snippet?.title}
                        </h3>
                        {item.marked_helpful && (
                          <FiThumbsUp className="text-green-500" size={18} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.snippet?.category} • {item.snippet?.topic}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.sent_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LearningSnippets;

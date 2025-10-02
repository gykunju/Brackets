import { useState, useEffect } from 'react';
import { FiBell, FiSettings, FiCheck, FiX } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  NOTIFICATION_INTERVALS,
  requestNotificationPermission
} from '../services/eventNotificationService';

function NotificationSettings({ onClose }) {
  const [preferences, setPreferences] = useState(getNotificationPreferences());
  const [browserPermission, setBrowserPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const toggleInterval = (intervalKey) => {
    setPreferences(prev => {
      const intervals = prev.intervals.includes(intervalKey)
        ? prev.intervals.filter(i => i !== intervalKey)
        : [...prev.intervals, intervalKey];
      
      const updated = { ...prev, intervals };
      saveNotificationPreferences(updated);
      return updated;
    });
  };

  const togglePreference = (key) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      saveNotificationPreferences(updated);
      return updated;
    });
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setBrowserPermission(granted ? 'granted' : 'denied');
    if (granted) {
      setPreferences(prev => {
        const updated = { ...prev, browserNotifications: true };
        saveNotificationPreferences(updated);
        return updated;
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-5 pb-24"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 max-h-[calc(90vh-5rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <FiBell size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Notification Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your event reminders and learning suggestions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <AiOutlineClose size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Enable/Disable Notifications */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Event Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get reminders about your upcoming events and deadlines
                </p>
              </div>
              <button
                onClick={() => togglePreference('enabled')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  preferences.enabled
                    ? 'bg-indigo-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    preferences.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notification Intervals */}
          {preferences.enabled && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Notification Timing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose when to receive reminders before your events
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(NOTIFICATION_INTERVALS).map(([key, interval]) => (
                  <button
                    key={key}
                    onClick={() => toggleInterval(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.intervals.includes(key)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {interval.label}
                      </span>
                      {preferences.intervals.includes(key) && (
                        <FiCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Learning Suggestions */}
          {preferences.enabled && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BsStars className="text-purple-600 dark:text-purple-400" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      AI Learning Suggestions
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get personalized study recommendations for upcoming events
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('learningSuggestions')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    preferences.learningSuggestions
                      ? 'bg-purple-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      preferences.learningSuggestions ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Browser Notifications */}
          {preferences.enabled && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Browser Notifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications even when Brackets is in the background
                  </p>
                  {browserPermission === 'denied' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      Browser notifications are blocked. Please enable them in your browser settings.
                    </p>
                  )}
                </div>
                {browserPermission === 'granted' ? (
                  <button
                    onClick={() => togglePreference('browserNotifications')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      preferences.browserNotifications
                        ? 'bg-indigo-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        preferences.browserNotifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                ) : browserPermission === 'default' ? (
                  <button
                    onClick={handleRequestPermission}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Enable
                  </button>
                ) : (
                  <FiX className="text-red-600 dark:text-red-400" size={24} />
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>💡 Tip:</strong> Notifications are checked every time you open the app. 
              Make sure to keep your browser open or enable browser notifications for timely reminders.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;

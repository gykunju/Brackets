import { useState, useEffect } from 'react';
import { FiBell, FiX, FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { MdOutlineAssignmentLate, MdEvent } from 'react-icons/md';
import { PiExam } from 'react-icons/pi';
import {
  checkAllEventsForNotifications,
  formatTimeUntil,
  showBrowserNotification,
  getNotificationPreferences,
  cleanupOldNotifications
} from '../services/eventNotificationService';

function EventNotifications({ onDismiss }) {
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    // Clean up old notifications on mount
    cleanupOldNotifications();
    
    // Check for notifications
    checkNotifications();
    
    // Check every 30 minutes
    const interval = setInterval(checkNotifications, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    const newNotifications = await checkAllEventsForNotifications();
    
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const existing = prev.map(n => `${n.event.id}-${n.interval}`);
        const filtered = newNotifications.filter(
          n => !existing.includes(`${n.event.id}-${n.interval}`)
        );
        
        // Show browser notifications for new ones
        const preferences = getNotificationPreferences();
        if (preferences.browserNotifications) {
          filtered.forEach(notification => {
            showBrowserNotification(
              `${notification.event.title} - ${formatTimeUntil(notification.hoursUntil)}`,
              notification.event.description || `Don't forget about your ${notification.event.type}!`,
              '/vite.svg'
            );
          });
        }
        
        return [...prev, ...filtered];
      });
    }
  };

  const handleDismiss = (notificationId) => {
    setDismissed(prev => new Set([...prev, notificationId]));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, 300);
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'exam':
        return <PiExam size={24} className="text-white" />;
      case 'assignment':
        return <MdOutlineAssignmentLate size={24} className="text-white" />;
      case 'event':
        return <MdEvent size={24} className="text-white" />;
      default:
        return <FiCalendar size={24} className="text-white" />;
    }
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'exam':
        return 'from-red-500 to-pink-600';
      case 'assignment':
        return 'from-indigo-500 to-purple-600';
      case 'event':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const visibleNotifications = notifications.filter(n => !dismissed.has(n.id));

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-40 max-w-md w-full space-y-3 max-h-[calc(100vh-100px)] overflow-y-auto">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
            dismissed.has(notification.id) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${getEventColor(notification.event.type)} flex-shrink-0`}>
                  {getEventIcon(notification.event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FiBell className="text-white flex-shrink-0" size={16} />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">
                      Event Reminder
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white truncate">
                    {notification.event.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(notification.id)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <FiX className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Time Until */}
            <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 border border-orange-200 dark:border-orange-800">
              <FiClock className="text-orange-600 dark:text-orange-400" size={20} />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Starting in</p>
                <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                  {formatTimeUntil(notification.hoursUntil)}
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <FiCalendar size={16} className="text-gray-400" />
                <span>
                  {notification.event.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {notification.event.time && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FiClock size={16} className="text-gray-400" />
                  <span>{notification.event.time}</span>
                </div>
              )}
              {notification.event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span>📍</span>
                  <span>{notification.event.location}</span>
                </div>
              )}
              {notification.event.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {notification.event.description}
                </p>
              )}
            </div>

            {/* AI Learning Suggestions */}
            {notification.suggestions && notification.suggestions.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-3">
                  <BsStars className="text-indigo-600 dark:text-indigo-400" size={18} />
                  <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    AI Study Suggestions
                  </h4>
                </div>
                <ul className="space-y-2">
                  {notification.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FiCheckCircle className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleDismiss(notification.id)}
              className="w-full py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventNotifications;

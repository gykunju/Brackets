import { generateText } from '../config/gemini';

// Notification intervals (in hours before event)
export const NOTIFICATION_INTERVALS = {
  '1_day': { value: 24, label: '1 Day Before' },
  '2_days': { value: 48, label: '2 Days Before' },
  '3_days': { value: 72, label: '3 Days Before' },
  '1_week': { value: 168, label: '1 Week Before' },
  '2_hours': { value: 2, label: '2 Hours Before' },
  '1_hour': { value: 1, label: '1 Hour Before' },
};

// Get user notification preferences
export const getNotificationPreferences = () => {
  const saved = localStorage.getItem('notification-preferences');
  if (saved) {
    return JSON.parse(saved);
  }
  // Default preferences
  return {
    enabled: true,
    intervals: ['1_day', '2_hours'],
    browserNotifications: false,
    learningSuggestions: true
  };
};

// Save user notification preferences
export const saveNotificationPreferences = (preferences) => {
  localStorage.setItem('notification-preferences', JSON.stringify(preferences));
};

// Check if event needs notification
export const checkEventNotifications = (event, preferences) => {
  if (!preferences.enabled) return [];

  const now = new Date();
  const eventDate = new Date(event.date);
  
  // Parse time and combine with date
  if (event.time) {
    const [time, period] = event.time.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period?.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period?.toUpperCase() === 'AM' && hour === 12) {
      hour = 0;
    }
    
    eventDate.setHours(hour, parseInt(minutes) || 0, 0, 0);
  }

  const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
  const notifications = [];

  // Check each interval
  preferences.intervals.forEach(intervalKey => {
    const interval = NOTIFICATION_INTERVALS[intervalKey];
    if (!interval) return;

    const notificationTime = interval.value;
    
    // Check if we should notify now (within a 1-hour window)
    if (hoursUntilEvent <= notificationTime && hoursUntilEvent > (notificationTime - 1)) {
      notifications.push({
        interval: intervalKey,
        hoursUntil: Math.round(hoursUntilEvent),
        event: event
      });
    }
  });

  return notifications;
};

// Generate learning suggestions for an event
export const generateLearningSuggestions = async (event) => {
  try {
    const prompt = `Generate study recommendations for this upcoming event:
    
Event: ${event.title}
Type: ${event.type}
Time until event: Soon
Description: ${event.description || 'No description'}

Provide 3-4 specific, actionable study tips and suggestions.
Return ONLY a JSON array (no markdown, no code blocks) like this:
[
  "Review the main concepts and create summary notes",
  "Practice with past questions or examples",
  "Focus on understanding weak areas",
  "Organize your materials and time effectively"
]`;

    const response = await generateText(prompt);
    
    // Try to parse JSON from response
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("Could not parse AI suggestions, using defaults");
    }

    // Default suggestions based on event type
    return getDefaultSuggestions(event);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return getDefaultSuggestions(event);
  }
};

// Get default suggestions based on event type
const getDefaultSuggestions = (event) => {
  const suggestions = {
    exam: [
      `Review all key topics covered in ${event.title}`,
      "Practice with past papers or sample questions",
      "Create a study schedule for remaining time",
      "Get enough rest before the exam day"
    ],
    assignment: [
      `Start working on ${event.title} early`,
      "Break down the assignment into smaller tasks",
      "Review requirements and rubric carefully",
      "Leave time for revision and proofreading"
    ],
    event: [
      `Prepare materials needed for ${event.title}`,
      "Review the agenda or schedule if available",
      "Set reminders for the event time",
      "Plan your transportation and arrival time"
    ]
  };

  return suggestions[event.type] || [
    `Prepare well for ${event.title}`,
    "Review any related materials",
    "Set up necessary resources in advance",
    "Manage your time effectively"
  ];
};

// Check all events and create notifications
export const checkAllEventsForNotifications = async () => {
  const preferences = getNotificationPreferences();
  if (!preferences.enabled) return [];

  const events = JSON.parse(localStorage.getItem('brackets-events') || '[]')
    .map(e => ({ ...e, date: new Date(e.date) }));

  const notifications = [];
  const notifiedEvents = JSON.parse(localStorage.getItem('notified-events') || '{}');

  for (const event of events) {
    const eventNotifications = checkEventNotifications(event, preferences);
    
    for (const notification of eventNotifications) {
      const notificationKey = `${event.id}-${notification.interval}`;
      
      // Skip if already notified for this interval
      if (notifiedEvents[notificationKey]) continue;

      // Generate learning suggestions if enabled
      let suggestions = [];
      if (preferences.learningSuggestions) {
        suggestions = await generateLearningSuggestions(event);
      }

      notifications.push({
        ...notification,
        suggestions,
        id: Date.now() + Math.random()
      });

      // Mark as notified
      notifiedEvents[notificationKey] = new Date().toISOString();
    }
  }

  // Save notified events
  localStorage.setItem('notified-events', JSON.stringify(notifiedEvents));

  return notifications;
};

// Request browser notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show browser notification
export const showBrowserNotification = (title, body, icon) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: icon || '/vite.svg',
      badge: '/vite.svg',
      vibrate: [200, 100, 200]
    });

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000);

    return notification;
  }
  return null;
};

// Clean up old notified events (older than 7 days)
export const cleanupOldNotifications = () => {
  const notifiedEvents = JSON.parse(localStorage.getItem('notified-events') || '{}');
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  const cleaned = {};
  Object.keys(notifiedEvents).forEach(key => {
    const timestamp = new Date(notifiedEvents[key]).getTime();
    if (timestamp > sevenDaysAgo) {
      cleaned[key] = notifiedEvents[key];
    }
  });

  localStorage.setItem('notified-events', JSON.stringify(cleaned));
};

// Format time until event
export const formatTimeUntil = (hours) => {
  if (hours < 1) {
    return 'Less than 1 hour';
  } else if (hours < 24) {
    return `${Math.round(hours)} hour${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  }
};

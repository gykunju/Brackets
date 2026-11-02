import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { playChimeSound, playAlarmSound, unlockAudio } from '../services/soundService';

/**
 * Accurately parses a local date and time without UTC timezone distortion
 */
export function parseEventDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const timeParts = timeStr.split(':');
    if (timeParts.length >= 2) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }
  }
  return new Date(year, month, day, hours, minutes, 0, 0);
}

/**
 * Triggers a native browser notification if permission is granted
 */
export function sendNativeNotification(title, body) {
  if (typeof window === 'undefined' || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body: body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          vibrate: [200, 100, 200]
        });
      }).catch(() => {
        new Notification(title, { body, icon: '/pwa-192x192.png' });
      });
    } else {
      new Notification(title, { body, icon: '/pwa-192x192.png' });
    }
  } catch (err) {
    console.warn("Native notification display failed:", err);
  }
}

/**
 * Helper to request notification permission and unlock audio context
 */
export async function enableRemindersAndAudio() {
  unlockAudio();
  if (typeof window !== 'undefined' && "Notification" in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (e) {
      console.warn("Permission request failed:", e);
    }
  }
  return false;
}

/**
 * Test function to verify sound and notification output
 */
export function testReminderAlert() {
  unlockAudio();
  playAlarmSound();
  toast.success("🔔 Test Alarm! Audio and visual notifications are functioning.", {
    duration: 6000,
    style: { fontWeight: 'bold' }
  });
  sendNativeNotification("Brackets Test Alarm", "Alarms and notifications are working properly!");
}

export function useNotifications() {
  const { events, isLoading } = useUser();
  const notifiedEvents = useRef(JSON.parse(localStorage.getItem('notifiedEvents') || '{}'));

  useEffect(() => {
    if (isLoading.events || !events || events.length === 0) return;

    const checkNotifications = () => {
      const now = new Date();
      let hasUpdates = false;

      events.forEach((event) => {
        if (!event.date) return;
        const eventDate = parseEventDateTime(event.date, event.time);
        if (!eventDate) return;

        const timeDiffMs = eventDate.getTime() - now.getTime();
        const hoursDiff = timeDiffMs / (1000 * 60 * 60);

        // Milestone threshold definitions
        // hoursDiff is positive for future events, negative for past events
        const milestones = [
          {
            key: 'sent24h',
            label: 'in 24 hours',
            shouldTrigger: (h) => h <= 24 && h > 2,
            isPassed: (h) => h <= 2,
            isAlarm: false,
            sound: 'chime'
          },
          {
            key: 'sent2h',
            label: 'in 2 hours',
            shouldTrigger: (h) => h <= 2 && h > 0.5,
            isPassed: (h) => h <= 0.5,
            isAlarm: false,
            sound: 'chime'
          },
          {
            key: 'sent30m',
            label: 'in 30 minutes',
            shouldTrigger: (h) => h <= 0.5 && h > 0,
            isPassed: (h) => h <= 0,
            isAlarm: false,
            sound: 'chime'
          },
          {
            key: 'sentNow',
            label: 'now',
            // Triggers from scheduled start up to 30 minutes after scheduled time
            shouldTrigger: (h) => h <= 0 && h >= -0.5,
            isPassed: (h) => h < -0.5,
            isAlarm: true,
            sound: 'alarm'
          }
        ];

        // Initialize state for newly discovered events
        if (!notifiedEvents.current[event.id]) {
          notifiedEvents.current[event.id] = {
            sent24h: false,
            sent2h: false,
            sent30m: false,
            sentNow: false
          };

          // Mark milestones as already sent ONLY if their time window has already passed
          milestones.forEach((m) => {
            if (m.isPassed(hoursDiff)) {
              notifiedEvents.current[event.id][m.key] = true;
            }
          });
          hasUpdates = true;
        }

        const eventState = notifiedEvents.current[event.id];

        // Evaluate milestones in chronological sequence
        milestones.forEach((m) => {
          if (!eventState[m.key] && m.shouldTrigger(hoursDiff)) {
            // Trigger Alarm Sound
            if (m.isAlarm) {
              playAlarmSound();
            } else {
              playChimeSound();
            }

            const alertTitle = m.isAlarm 
              ? `🚨 Event Starting: ${event.title}` 
              : `⏰ Upcoming ${event.type || 'Event'}`;
              
            const message = m.isAlarm 
              ? `It is time for "${event.title}"! ${event.location ? `(${event.location})` : ''}` 
              : `"${event.title}" is coming up ${m.label}!`;

            // Visual Toast with distinct icon
            toast(message, {
              icon: m.isAlarm ? '🚨' : '🔔',
              duration: m.isAlarm ? 10000 : 7000,
              style: {
                fontWeight: '600',
                borderRadius: '12px',
                background: m.isAlarm ? '#1c1917' : '#ffffff',
                color: m.isAlarm ? '#fef08a' : '#1c1917',
                border: m.isAlarm ? '2px solid #ca8a04' : '1px solid #e7e5e4'
              }
            });

            // Native OS / Browser Notification
            sendNativeNotification(alertTitle, message);

            eventState[m.key] = true;
            hasUpdates = true;
          }
        });
      });

      if (hasUpdates) {
        localStorage.setItem('notifiedEvents', JSON.stringify(notifiedEvents.current));
      }
    };

    // Check immediately, then every 30 seconds for precise alarm timing
    checkNotifications();
    const intervalId = setInterval(checkNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [events, isLoading.events]);
}

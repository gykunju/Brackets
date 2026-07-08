import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { CiCalendar } from 'react-icons/ci';

export function useNotifications() {
  const { events, isLoading } = useUser();
  const notifiedEvents = useRef(JSON.parse(localStorage.getItem('notifiedEvents') || '{}'));

  useEffect(() => {
    if (isLoading.events || !events || events.length === 0) return;

    const checkNotifications = () => {
      const now = new Date();
      let hasUpdates = false;

      events.forEach(event => {
        if (!event.date) return;
        const eventDate = new Date(event.date);
        
        // If event has time, use it, otherwise assume start of day
        if (event.time) {
          const [hours, minutes] = event.time.split(':');
          eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        } else {
          eventDate.setHours(0, 0, 0, 0);
        }

        const timeDiffMs = eventDate.getTime() - now.getTime();
        const hoursDiff = timeDiffMs / (1000 * 60 * 60);

        // Define our thresholds
        const thresholds = [
          { key: 'sent24h', maxHours: 24.1, minHours: 23.9, label: 'in 24 hours' },
          { key: 'sent2h', maxHours: 2.1, minHours: 1.9, label: 'in 2 hours' },
          { key: 'sent30m', maxHours: 0.55, minHours: 0.45, label: 'in 30 minutes' },
          { key: 'sentNow', maxHours: 0.02, minHours: -0.05, label: 'now' }
        ];

        // Initialize state for this event if not present
        if (!notifiedEvents.current[event.id]) {
          notifiedEvents.current[event.id] = { sent24h: false, sent2h: false, sent30m: false, sentNow: false };
          // If the event is already in the past or too close, we might want to mark older thresholds as sent
          if (hoursDiff < 23.9) notifiedEvents.current[event.id].sent24h = true;
          if (hoursDiff < 1.9) notifiedEvents.current[event.id].sent2h = true;
          if (hoursDiff < 0.45) notifiedEvents.current[event.id].sent30m = true;
          if (hoursDiff < -0.05) notifiedEvents.current[event.id].sentNow = true;
          hasUpdates = true;
        }

        const eventState = notifiedEvents.current[event.id];

        thresholds.forEach(threshold => {
          if (!eventState[threshold.key] && hoursDiff <= threshold.maxHours && hoursDiff >= threshold.minHours) {
            
            // Trigger Notification
            const message = threshold.key === 'sentNow' 
              ? `It is time for ${event.title}!` 
              : `${event.title} is coming up ${threshold.label}!`;
            
            // Always show in-app toast as primary reliable alert
            toast.success(message, { duration: 8000, style: { fontWeight: 'bold' } });
            
            // Additionally try native notification if permitted
            if ("Notification" in window && Notification.permission === "granted") {
              try {
                // Try to use ServiceWorker first if available (required for mobile PWAs)
                navigator.serviceWorker?.getRegistration().then((reg) => {
                  if (reg) {
                    reg.showNotification(threshold.key === 'sentNow' ? `Event Started` : `Upcoming ${event.type}`, {
                      body: message,
                      icon: '/vite.svg'
                    });
                  } else {
                    // Fallback to standard Notification API
                    new Notification(threshold.key === 'sentNow' ? `Event Started` : `Upcoming ${event.type}`, {
                      body: message,
                      icon: '/vite.svg'
                    });
                  }
                }).catch(() => {
                  // If all else fails, use standard Notification API
                  new Notification(threshold.key === 'sentNow' ? `Event Started` : `Upcoming ${event.type}`, {
                    body: message,
                    icon: '/vite.svg'
                  });
                });
              } catch (err) {
                console.error("Native notification failed:", err);
              }
            }

            eventState[threshold.key] = true;
            hasUpdates = true;
          }
        });
      });

      if (hasUpdates) {
        localStorage.setItem('notifiedEvents', JSON.stringify(notifiedEvents.current));
      }
    };

    // Check immediately, then set an interval to check every minute
    checkNotifications();
    const intervalId = setInterval(checkNotifications, 60000);

    return () => clearInterval(intervalId);
  }, [events, isLoading.events]);
}

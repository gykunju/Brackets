import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { CiCalendar } from 'react-icons/ci';

export function useNotifications() {
  const { events, isLoading } = useUser();
  const notifiedEvents = useRef(new Set(JSON.parse(localStorage.getItem('notifiedEvents') || '[]')));

  useEffect(() => {
    if (isLoading.events || !events || events.length === 0) return;

    const now = new Date();
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const upcomingEvents = events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      
      // If event has time, use it, otherwise assume start of day
      if (event.time) {
        const [hours, minutes] = event.time.split(':');
        eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      } else {
        eventDate.setHours(0, 0, 0, 0);
      }

      // Is it between now and 48 hours from now?
      return eventDate > now && eventDate <= fortyEightHoursFromNow;
    });

    let newNotifications = false;

    upcomingEvents.forEach(event => {
      // Prevent spamming the same notification
      if (!notifiedEvents.current.has(event.id)) {
        toast((t) => (
          <div className="flex items-center gap-3 geist-font">
            <div className="p-2 bg-lime-100 text-lime-800 rounded-lg">
              <CiCalendar size={24} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Upcoming {event.type}</p>
              <p className="text-xs text-gray-600">{event.title} is coming up!</p>
            </div>
          </div>
        ), {
          duration: 6000,
          position: 'top-right',
        });
        
        notifiedEvents.current.add(event.id);
        newNotifications = true;
      }
    });

    if (newNotifications) {
      localStorage.setItem('notifiedEvents', JSON.stringify(Array.from(notifiedEvents.current)));
    }

  }, [events, isLoading.events]);
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeToNotifications,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount
} from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    try {
      const channel = subscribeToNotifications(user.id, (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/vite.svg'
          });
        }
      });

      return () => {
        channel?.unsubscribe();
      };
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (user) {
      try {
        await markAllNotificationsAsRead(user.id);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

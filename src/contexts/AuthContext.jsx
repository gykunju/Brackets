import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, onAuthStateChange, signOut as authSignOut } from '../services/authService';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          const userProfile = await getUserProfile(currentUser.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    try {
      const { data: { subscription } } = onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Auth subscription error:', error);
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    profile,
    loading,
    signOut: async () => {
      await authSignOut();
      setUser(null);
      setProfile(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

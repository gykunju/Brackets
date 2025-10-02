import { supabase } from '../config/supabase';

// Authentication functions
export const signUp = async (email, password, fullName) => {
  try {
    console.log('🔐 Attempting signup for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('❌ Signup error:', error);
      
      // Provide helpful error messages
      if (error.message.includes('Email signups are disabled')) {
        return { 
          user: null, 
          error: '❌ Email authentication is disabled. Please enable it in Supabase Dashboard → Authentication → Providers → Email'
        };
      }
      
      if (error.message.includes('User already registered')) {
        return { 
          user: null, 
          error: 'This email is already registered. Try signing in instead.'
        };
      }
      
      throw error;
    }

    console.log('✅ Signup successful:', data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('❌ Signup failed:', error);
    return { user: null, error: error.message || 'Signup failed. Please try again.' };
  }
};

export const signIn = async (email, password) => {
  try {
    console.log('🔐 Attempting signin for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Signin error:', error);
      
      // Provide helpful error messages
      if (error.message.includes('Invalid login credentials')) {
        return { 
          user: null, 
          session: null, 
          error: 'Invalid email or password. Please check your credentials and try again.'
        };
      }
      
      if (error.message.includes('Email not confirmed')) {
        return { 
          user: null, 
          session: null, 
          error: 'Please confirm your email address. Check your inbox for the confirmation link.'
        };
      }
      
      if (error.message.includes('Email signups are disabled')) {
        return { 
          user: null, 
          session: null, 
          error: 'Email authentication is disabled. Please contact the administrator.'
        };
      }
      
      throw error;
    }

    console.log('✅ Signin successful:', data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('❌ Signin failed:', error);
    return { user: null, session: null, error: error.message || 'Signin failed. Please try again.' };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    // Don't log "session missing" errors - they're expected when not logged in
    if (error.name !== 'AuthSessionMissingError') {
      console.error('Error getting current user:', error);
    }
    return null;
  }
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// User profile functions
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

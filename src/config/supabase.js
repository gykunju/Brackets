import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
  console.error('⚠️ Supabase credentials not configured properly. Please check your .env file.');
  console.log('Current VITE_SUPABASE_URL:', supabaseUrl);
}

// Create client with default values if not configured
const url = supabaseUrl && supabaseUrl !== 'your_supabase_project_url' ? supabaseUrl : 'https://placeholder.supabase.co';
const key = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key' ? supabaseAnonKey : 'placeholder-key';

export const supabase = createClient(url, key);

// Database schema helper functions
export const initializeDatabase = async () => {
  // This is a placeholder - actual table creation should be done in Supabase dashboard
  console.log('Database initialized. Please ensure tables are created in Supabase dashboard.');
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create the initial client
let supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Function to recreate the Supabase client (effectively reconnecting)
export const reconnectSupabase = () => {
  console.log('Reconnecting to Supabase...');
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log('Supabase client recreated');
  return supabaseClient;
};

// Export the client
export const supabase = supabaseClient;

// Function to get the current client (useful after reconnection)
export const getSupabaseClient = () => supabaseClient;

export interface Story {
  id: string;
  title: string;
  title_english: string;
  country: string;
  language: string;
  theme: string;
  native_text: string;
  english_text: string;
  contributor: string;
  contributor_email: string;
  native_audio_url?: string;
  english_audio_url?: string;
  illustration_url?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface StorySubmission {
  title: string;
  title_english: string;
  country: string;
  language: string;
  theme: string;
  native_text: string;
  english_text: string;
  contributor: string;
  contributor_email: string;
  native_audio_file?: File;
  english_audio_file?: File;
  illustration_file?: File;
}
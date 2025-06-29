import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
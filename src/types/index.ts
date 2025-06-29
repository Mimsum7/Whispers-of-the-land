export interface Story {
  id: string;
  title: string;
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

export interface FilterOptions {
  language: string;
  country: string;
  theme: string;
  search: string;
}

export const LANGUAGES = [
  'Shona', 'Ndebele', 'Swahili', 'Yoruba', 'Igbo', 'Hausa', 
  'Amharic', 'Zulu', 'Xhosa', 'Afrikaans', 'Twi', 'Fon'
];

export const COUNTRIES = [
  'Zimbabwe', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 
  'South Africa', 'Tanzania', 'Uganda', 'Botswana', 'Benin'
];

export const THEMES = [
  'Wisdom', 'Animals', 'Tricksters', 'Origin Myths', 
  'Love Stories', 'Heroic Tales', 'Morality', 'Nature'
];
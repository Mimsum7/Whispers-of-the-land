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
  'Algeria',
  'Angola',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cameroon',
  'Central African Republic',
  'Chad',
  'Comoros',
  'Congo (Brazzaville)',
  'Congo (Kinshasa)',
  'Côte d\'Ivoire',
  'Djibouti',
  'Egypt',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Ethiopia',
  'Gabon',
  'Gambia',
  'Ghana',
  'Guinea',
  'Guinea-Bissau',
  'Kenya',
  'Lesotho',
  'Liberia',
  'Libya',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Mauritius',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Rwanda',
  'São Tomé and Príncipe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Sudan',
  'Tanzania',
  'Togo',
  'Tunisia',
  'Uganda',
  'Zambia',
  'Zimbabwe'
];

export const THEMES = [
  'Wisdom', 'Animals', 'Tricksters', 'Origin Myths', 
  'Love Stories', 'Heroic Tales', 'Morality', 'Nature'
];
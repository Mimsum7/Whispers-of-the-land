import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import StoryCard from '../components/Story/StoryCard';
import FilterPanel from '../components/Story/FilterPanel';
import { Story, FilterOptions } from '../types';
import { supabase } from '../lib/supabase';

const HomePage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    language: '',
    country: '',
    theme: '',
    search: ''
  });

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [stories, filters]);

  const fetchStories = async () => {
    try {
      console.log('Fetching approved stories...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      setError(null);
      
      // Test the connection first
      const { data: testData, error: testError } = await supabase
        .from('stories')
        .select('count(*)')
        .limit(1);
      
      if (testError) {
        console.error('Connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Connection test successful, fetching stories...');
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch stories: ${error.message}`);
      }
      
      console.log('Fetched stories:', data);
      console.log('Number of stories:', data?.length || 0);
      
      if (data && data.length > 0) {
        setStories(data);
      } else {
        console.log('No approved stories found, using sample data');
        setStories(sampleStories);
      }
      
    } catch (error: any) {
      console.error('Error fetching stories:', error);
      setError(error.message || 'Failed to load stories');
      // Use sample data as fallback
      console.log('Using sample data as fallback');
      setStories(sampleStories);
    } finally {
      setLoading(false);
    }
  };

  const filterStories = () => {
    let filtered = stories;

    if (filters.search) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        story.title_english.toLowerCase().includes(filters.search.toLowerCase()) ||
        story.contributor.toLowerCase().includes(filters.search.toLowerCase()) ||
        story.native_text.toLowerCase().includes(filters.search.toLowerCase()) ||
        story.english_text.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.language) {
      filtered = filtered.filter(story => story.language === filters.language);
    }

    if (filters.country) {
      filtered = filtered.filter(story => story.country === filters.country);
    }

    if (filters.theme) {
      filtered = filtered.filter(story => story.theme === filters.theme);
    }

    setFilteredStories(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ochre-500 mx-auto mb-4"></div>
          <p className="text-forest-600">Loading stories...</p>
          <p className="text-sm text-forest-500 mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-african-pattern">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-clay-100 border border-clay-300 rounded-lg p-8 text-center">
              <AlertCircle className="h-16 w-16 text-clay-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-forest-700 mb-2">Connection Issue</h2>
              <p className="text-forest-600 mb-4 text-sm">{error}</p>
              <p className="text-forest-500 mb-4 text-xs">
                Don't worry - we're showing sample stories below while we fix the connection.
              </p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchStories();
                }}
                className="bg-ochre-500 hover:bg-ochre-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-african-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-ochre-500 mr-4" />
            <Sparkles className="h-8 w-8 text-clay-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-forest-700 mb-4 font-serif">
            African Folklore Library
          </h1>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
            Discover the rich tapestry of African storytelling through our digital collection 
            of folklore, myths, and legends in their original languages alongside English translations.
          </p>
          {error && (
            <div className="mt-4 text-sm text-clay-600 bg-clay-50 border border-clay-200 rounded-lg p-3 max-w-md mx-auto">
              <p>⚠️ Currently showing sample stories due to database connection issues</p>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        <FilterPanel filters={filters} onFiltersChange={setFilters} />

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-ochre-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-forest-600 mb-2">No stories found</h3>
            <p className="text-forest-500">
              {stories.length === 0 
                ? "No approved stories yet. Be the first to submit a story!" 
                : "Try adjusting your filters or search terms."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample data for demo purposes
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Kweku Anansi ne Nyansa',
    title_english: 'Anansi and the Wisdom of the World',
    country: 'Ghana',
    language: 'Twi',
    theme: 'Wisdom',
    native_text: 'Kweku Anansi na ne ho yε dε ɔwɔ nyansa dodow biara...',
    english_text: 'Kweku Anansi thought he possessed all the wisdom in the world...',
    contributor: 'Akosua Mensah',
    contributor_email: 'akosua@example.com',
    illustration_url: 'https://images.pexels.com/photos/6969141/pexels-photo-6969141.jpeg',
    is_approved: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Tsuro neBere',
    title_english: 'The Hare and the Hyena',
    country: 'Zimbabwe',
    language: 'Shona',
    theme: 'Tricksters',
    native_text: 'Paive ne tsuro ne bere vakanga vachigara mumusha mumwe...',
    english_text: 'There once lived a hare and a hyena in the same village...',
    contributor: 'Tendai Mukamuri',
    contributor_email: 'tendai@example.com',
    illustration_url: 'https://images.pexels.com/photos/8828528/pexels-photo-8828528.jpeg',
    is_approved: true,
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Idi ti Oorun ati Osupa wa si Oju Ọrun',
    title_english: 'Why the Sun and Moon Live in the Sky',
    country: 'Nigeria',
    language: 'Yoruba',
    theme: 'Origin Myths',
    native_text: 'Ni akoko kan, Oorun ati Osupa wa ni ile...',
    english_text: 'Long ago, the Sun and Moon lived on earth...',
    contributor: 'Adunni Oladele',
    contributor_email: 'adunni@example.com',
    illustration_url: 'https://images.pexels.com/photos/8828563/pexels-photo-8828563.jpeg',
    is_approved: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  }
];

export default HomePage;
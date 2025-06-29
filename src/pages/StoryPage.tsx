import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe, Tag, User, Calendar, Volume2 } from 'lucide-react';
import AudioPlayer from '../components/Story/AudioPlayer';
import PatternBorder from '../components/Common/PatternBorder';
import { Story } from '../types';
import { supabase } from '../lib/supabase';

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStory(id);
    }
  }, [id]);

  const fetchStory = async (storyId: string) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (error) throw error;
      setStory(data);
    } catch (error) {
      console.error('Error fetching story:', error);
      // Use sample data for demo
      const sampleStory = {
        id: storyId,
        title: 'Anansi and the Wisdom of the World',
        country: 'Ghana',
        language: 'Twi',
        theme: 'Wisdom',
        native_text: `Kweku Anansi na ne ho yε dε ɔwɔ nyansa dodow biara wɔ wiase yi mu. Ɔsusuw sε ɔbεyε adε bi akora nyansa no nyinaa wɔ faako baako, na ɔno nko ara na ɔbεyε nyansafoɔ.

Ɔkɔɔ kwaeε mu kɔhwehwεε duaba kεseε bi. Ɔtwaa ho, na ɔyεε ahinanan kεseε bi. Afei ɔhyεε ne nyansa nyinaa kɔguu ahinanan no mu.

Ɔkyekyεrεε ahinanan no saa ne kɔn ho, na ɔforo duaba no. Nanso bεrε biara a ɔrebεforo no, ahinanan no bεduruu ne bo ho na εbεsεe ne foroo.

Ne ba ketewa bi huu no. Ɔka kyerεε no sε, "Agya, sε woagyae ahinanan no wɔ w'akyi deε a, εbεyε mmerεw."

Anansi tee saa no, ne bo fuw no. Ɔkae sε, "Mesusu sε meyε nyansafoɔ pa ara, nanso me ba ketewa yi nim adε a mennim!" 

Ɔde ahinanan no gyee ne nsa mu tuu guu fam. Ahinanan no bɔɔ mu pasaa, na nyansa no hweteeε ma εkɔɔ wiase afanan nyinaa.

Εfiri saa berε no, nnipa nyinaa nya nyansa binom.`,
        english_text: `Kweku Anansi thought he possessed all the wisdom in the world. He decided to gather all this wisdom and keep it in one place, so that he alone would be wise.

He went into the forest and found a large calabash. He hollowed it out, making a big pot. Then he put all his wisdom into the calabash.

He tied the calabash around his neck and began to climb a tall tree. But every time he tried to climb, the calabash would bump against his chest and hinder his climbing.

His young son saw him and said, "Father, if you tie the calabash on your back, it would be easier to climb."

When Anansi heard this, he became angry. He said, "I thought I was the wisest of all, but my little son knows something I don't!"

He took the calabash in his hands and threw it down. The calabash broke into pieces, and the wisdom scattered to all corners of the world.

From that time on, all people have some wisdom.`,
        contributor: 'Akosua Mensah',
        contributor_email: 'akosua@example.com',
        illustration_url: 'https://images.pexels.com/photos/6969141/pexels-photo-6969141.jpeg',
        native_audio_url: '/audio/anansi-twi.mp3',
        english_audio_url: '/audio/anansi-english.mp3',
        is_approved: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      };
      setStory(sampleStory);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ochre-500 mx-auto mb-4"></div>
          <p className="text-forest-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-forest-700 mb-4">Story not found</h2>
          <Link to="/" className="text-ochre-600 hover:text-ochre-700 underline">
            Return to library
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-african-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link
          to="/"
          className="inline-flex items-center text-forest-600 hover:text-forest-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Library
        </Link>

        {/* Story Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-700 mb-6 font-serif">
            {story.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-forest-600 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-clay-500" />
              <span className="font-medium">{story.country}</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-clay-500" />
              <span>{story.language}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-clay-500" />
              <span className="bg-ochre-100 text-ochre-800 px-3 py-1 rounded-full text-sm font-medium">
                {story.theme}
              </span>
            </div>
          </div>

          {story.illustration_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={story.illustration_url}
                alt={story.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </div>

        {/* Audio Players */}
        {(story.native_audio_url || story.english_audio_url) && (
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold text-forest-700 mb-4 flex items-center">
              <Volume2 className="h-6 w-6 mr-2 text-ochre-500" />
              Audio Narrations
            </h2>
            {story.native_audio_url && (
              <AudioPlayer
                audioUrl={story.native_audio_url}
                title={story.title}
                language={story.language}
              />
            )}
            {story.english_audio_url && (
              <AudioPlayer
                audioUrl={story.english_audio_url}
                title={story.title}
                language="English"
              />
            )}
          </div>
        )}

        {/* Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PatternBorder>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-forest-700 mb-4 font-serif">
                {story.language} Original
              </h2>
              <div className="prose prose-lg text-forest-600 leading-relaxed whitespace-pre-line">
                {story.native_text}
              </div>
            </div>
          </PatternBorder>

          <PatternBorder>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-forest-700 mb-4 font-serif">
                English Translation
              </h2>
              <div className="prose prose-lg text-forest-600 leading-relaxed whitespace-pre-line">
                {story.english_text}
              </div>
            </div>
          </PatternBorder>
        </div>

        {/* Story Details */}
        <PatternBorder>
          <div className="p-6">
            <h3 className="text-xl font-bold text-forest-700 mb-4">Story Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-forest-600">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-clay-500" />
                <span>Contributed by <strong>{story.contributor}</strong></span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-clay-500" />
                <span>Added on {formatDate(story.created_at)}</span>
              </div>
            </div>
          </div>
        </PatternBorder>
      </div>
    </div>
  );
};

export default StoryPage;
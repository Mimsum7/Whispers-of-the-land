import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatternBorder from '../components/Common/PatternBorder';
import { Story } from '../types';
import { supabase } from '../lib/supabase';

const AdminPage: React.FC = () => {
  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    try {
      console.log('Fetching pending stories...');
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch pending stories: ${error.message}`);
      }
      
      console.log('Fetched pending stories:', data);
      setPendingStories(data || []);
    } catch (error: any) {
      console.error('Error fetching pending stories:', error);
      setError(error.message || 'Failed to load pending stories');
      
      // Use sample pending stories for demo
      setPendingStories(samplePendingStories);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storyId: string) => {
    setActionLoading(storyId);
    try {
      console.log('Approving story:', storyId);
      const { error } = await supabase
        .from('stories')
        .update({ is_approved: true })
        .eq('id', storyId);

      if (error) {
        console.error('Error approving story:', error);
        throw error;
      }

      console.log('Story approved successfully');
      setPendingStories(prev => prev.filter(story => story.id !== storyId));
      setSelectedStory(null);
      
      // Show success message
      alert('Story approved successfully!');
    } catch (error: any) {
      console.error('Error approving story:', error);
      
      // For demo purposes, still remove from pending list
      setPendingStories(prev => prev.filter(story => story.id !== storyId));
      setSelectedStory(null);
      alert('Story approved! (Demo mode - changes may not persist)');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (storyId: string) => {
    if (!confirm('Are you sure you want to reject and delete this story? This action cannot be undone.')) {
      return;
    }

    setActionLoading(storyId);
    try {
      console.log('Rejecting story:', storyId);
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) {
        console.error('Error rejecting story:', error);
        throw error;
      }

      console.log('Story rejected successfully');
      setPendingStories(prev => prev.filter(story => story.id !== storyId));
      setSelectedStory(null);
      
      // Show success message
      alert('Story rejected and deleted successfully!');
    } catch (error: any) {
      console.error('Error rejecting story:', error);
      
      // For demo purposes, still remove from pending list
      setPendingStories(prev => prev.filter(story => story.id !== storyId));
      setSelectedStory(null);
      alert('Story rejected! (Demo mode - changes may not persist)');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = () => {
    fetchPendingStories();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && pendingStories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ochre-500 mx-auto mb-4"></div>
          <p className="text-forest-600">Loading pending stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-african-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-forest-700 mb-4 font-serif">
            Story Moderation
          </h1>
          <p className="text-xl text-forest-600 mb-2">
            Review and approve submitted stories for publication
          </p>
          <div className="bg-ochre-100 border border-ochre-300 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-sm text-ochre-800">
              🚀 <strong>Prototype Mode:</strong> Admin functionality for testing purposes
            </p>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-clay-100 border border-clay-300 rounded-lg p-4 text-center">
              <AlertCircle className="h-8 w-8 text-clay-500 mx-auto mb-2" />
              <p className="text-clay-700 text-sm mb-3">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-ochre-500 hover:bg-ochre-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {pendingStories.length === 0 ? (
          <PatternBorder className="max-w-md mx-auto">
            <div className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-forest-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-forest-600 mb-2">All caught up!</h3>
              <p className="text-forest-500 mb-4">No stories pending review at the moment.</p>
              <Link
                to="/submit"
                className="inline-flex items-center text-ochre-600 hover:text-ochre-700 underline"
              >
                Submit a test story
              </Link>
            </div>
          </PatternBorder>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stories List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-forest-700 mb-4">
                Pending Stories ({pendingStories.length})
              </h2>
              
              {pendingStories.map((story) => (
                <PatternBorder key={story.id}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-forest-700 font-serif">
                          {story.title}
                        </h3>
                        <p className="text-sm text-forest-600 italic">
                          {story.title_english}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedStory(story)}
                          className="text-ochre-600 hover:text-ochre-700 transition-colors"
                          title="Preview story"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/story/${story.id}`}
                          target="_blank"
                          className="text-forest-600 hover:text-forest-700 transition-colors"
                          title="View full story"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-forest-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-clay-500" />
                        <span>{story.contributor}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-clay-500" />
                        <span>{formatDate(story.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="bg-ochre-100 text-ochre-800 px-2 py-1 rounded-full text-xs">
                          {story.country} • {story.language}
                        </span>
                        <span className="bg-forest-100 text-forest-800 px-2 py-1 rounded-full text-xs">
                          {story.theme}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleApprove(story.id)}
                        disabled={actionLoading === story.id}
                        className="flex-1 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {actionLoading === story.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(story.id)}
                        disabled={actionLoading === story.id}
                        className="flex-1 bg-clay-500 hover:bg-clay-600 disabled:bg-clay-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {actionLoading === story.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </PatternBorder>
              ))}
            </div>

            {/* Story Preview */}
            <div className="lg:sticky lg:top-4">
              {selectedStory ? (
                <PatternBorder>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-forest-700 mb-1 font-serif">
                          {selectedStory.title}
                        </h2>
                        <p className="text-lg text-forest-600 italic">
                          {selectedStory.title_english}
                        </p>
                      </div>
                      <Link
                        to={`/story/${selectedStory.id}`}
                        target="_blank"
                        className="text-forest-600 hover:text-forest-700 transition-colors flex items-center space-x-1 text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Full View</span>
                      </Link>
                    </div>

                    {selectedStory.illustration_url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={selectedStory.illustration_url}
                          alt={selectedStory.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="font-medium text-forest-700 mb-2">
                          {selectedStory.language} Original
                        </h3>
                        <div className="bg-cream-100 p-4 rounded-lg max-h-60 overflow-y-auto">
                          <p className="text-forest-600 text-sm whitespace-pre-line">
                            {selectedStory.native_text}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-forest-700 mb-2">English Translation</h3>
                        <div className="bg-cream-100 p-4 rounded-lg max-h-60 overflow-y-auto">
                          <p className="text-forest-600 text-sm whitespace-pre-line">
                            {selectedStory.english_text}
                          </p>
                        </div>
                      </div>

                      {(selectedStory.native_audio_url || selectedStory.english_audio_url) && (
                        <div>
                          <h3 className="font-medium text-forest-700 mb-2">Audio Files</h3>
                          <div className="space-y-2">
                            {selectedStory.native_audio_url && (
                              <p className="text-sm text-forest-600">✓ Native audio available</p>
                            )}
                            {selectedStory.english_audio_url && (
                              <p className="text-sm text-forest-600">✓ English audio available</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(selectedStory.id)}
                        disabled={actionLoading === selectedStory.id}
                        className="flex-1 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {actionLoading === selectedStory.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedStory.id)}
                        disabled={actionLoading === selectedStory.id}
                        className="flex-1 bg-clay-500 hover:bg-clay-600 disabled:bg-clay-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {actionLoading === selectedStory.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </PatternBorder>
              ) : (
                <PatternBorder>
                  <div className="p-8 text-center">
                    <Eye className="h-16 w-16 text-ochre-300 mx-auto mb-4" />
                    <p className="text-forest-600">Select a story to preview</p>
                  </div>
                </PatternBorder>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample pending stories for demo purposes
const samplePendingStories: Story[] = [
  {
    id: 'pending-1',
    title: 'Sungura na Fisi',
    title_english: 'The Rabbit and the Hyena',
    country: 'Kenya',
    language: 'Swahili',
    theme: 'Tricksters',
    native_text: 'Hapo zamani za kale, kulikuwa na sungura mjanja sana. Siku moja alikutana na fisi mkali...',
    english_text: 'Long ago, there was a very clever rabbit. One day he met a fierce hyena...',
    contributor: 'Amina Hassan',
    contributor_email: 'amina@example.com',
    illustration_url: 'https://images.pexels.com/photos/8828528/pexels-photo-8828528.jpeg',
    is_approved: false,
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: 'pending-2',
    title: 'Ọmọ Ọba ati Ẹja Nla',
    title_english: 'The Prince and the Great Fish',
    country: 'Nigeria',
    language: 'Yoruba',
    theme: 'Heroic Tales',
    native_text: 'Ni ilu kan, ọmọ ọba kan wa ti o ni agbara nla...',
    english_text: 'In a certain kingdom, there was a prince who had great power...',
    contributor: 'Folake Adebayo',
    contributor_email: 'folake@example.com',
    is_approved: false,
    created_at: '2024-01-16T12:15:00Z',
    updated_at: '2024-01-16T12:15:00Z'
  }
];

export default AdminPage;
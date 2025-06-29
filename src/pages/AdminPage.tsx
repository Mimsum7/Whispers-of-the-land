import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';
import PatternBorder from '../components/Common/PatternBorder';
import { Story } from '../types';
import { supabase } from '../lib/supabase';

const AdminPage: React.FC = () => {
  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    try {
      console.log('Fetching pending stories...');
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched pending stories:', data);
      setPendingStories(data || []);
    } catch (error) {
      console.error('Error fetching pending stories:', error);
      // Use sample data for demo
      setPendingStories(samplePendingStories);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storyId: string) => {
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
    } catch (error) {
      console.error('Error approving story:', error);
      alert('Error approving story. Please try again.');
    }
  };

  const handleReject = async (storyId: string) => {
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
    } catch (error) {
      console.error('Error rejecting story:', error);
      alert('Error rejecting story. Please try again.');
    }
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

  if (loading) {
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
          <p className="text-xl text-forest-600">
            Review and approve submitted stories for publication
          </p>
        </div>

        {pendingStories.length === 0 ? (
          <PatternBorder className="max-w-md mx-auto">
            <div className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-forest-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-forest-600 mb-2">All caught up!</h3>
              <p className="text-forest-500">No stories pending review at the moment.</p>
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
                      <h3 className="text-lg font-bold text-forest-700 font-serif">
                        {story.title}
                      </h3>
                      <button
                        onClick={() => setSelectedStory(story)}
                        className="text-ochre-600 hover:text-ochre-700 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
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
                        className="flex-1 bg-forest-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(story.id)}
                        className="flex-1 bg-clay-500 hover:bg-clay-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
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
                    <h2 className="text-2xl font-bold text-forest-700 mb-4 font-serif">
                      {selectedStory.title}
                    </h2>

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
                        <div className="bg-cream-100 p-4 rounded-lg max-h-40 overflow-y-auto">
                          <p className="text-forest-600 text-sm whitespace-pre-line">
                            {selectedStory.native_text.substring(0, 200)}...
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-forest-700 mb-2">English Translation</h3>
                        <div className="bg-cream-100 p-4 rounded-lg max-h-40 overflow-y-auto">
                          <p className="text-forest-600 text-sm whitespace-pre-line">
                            {selectedStory.english_text.substring(0, 200)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(selectedStory.id)}
                        className="flex-1 bg-forest-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedStory.id)}
                        className="flex-1 bg-clay-500 hover:bg-clay-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
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

// Sample data for demo
const samplePendingStories: Story[] = [
  {
    id: 'pending-1',
    title: 'The Clever Tortoise',
    country: 'Nigeria',
    language: 'Igbo',
    theme: 'Wisdom',
    native_text: 'O nwere otu mbe nke maara ihe nke ukwuu...',
    english_text: 'There was once a tortoise who was very wise...',
    contributor: 'Chidi Okwu',
    contributor_email: 'chidi@example.com',
    is_approved: false,
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: 'pending-2',
    title: 'The Rainbow Bird',
    country: 'Kenya',
    language: 'Swahili',
    theme: 'Nature',
    native_text: 'Palikuwa na ndege mzuri sana...',
    english_text: 'There was once a very beautiful bird...',
    contributor: 'Amina Hassan',
    contributor_email: 'amina@example.com',
    is_approved: false,
    created_at: '2024-01-16T12:15:00Z',
    updated_at: '2024-01-16T12:15:00Z'
  }
];

export default AdminPage;
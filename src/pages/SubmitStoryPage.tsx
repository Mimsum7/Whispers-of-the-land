import React, { useState } from 'react';
import { PlusCircle, Upload, FileText, MapPin, Globe, Tag } from 'lucide-react';
import PatternBorder from '../components/Common/PatternBorder';
import { LANGUAGES, COUNTRIES, THEMES } from '../types';
import { supabase } from '../lib/supabase';

interface FormData {
  title: string;
  title_english: string;
  country: string;
  language: string;
  theme: string;
  native_text: string;
  english_text: string;
  contributor: string;
  contributor_email: string;
}

const SubmitStoryPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    title_english: '',
    country: '',
    language: '',
    theme: '',
    native_text: '',
    english_text: '',
    contributor: '',
    contributor_email: ''
  });

  const [files, setFiles] = useState({
    nativeAudio: null as File | null,
    englishAudio: null as File | null,
    illustration: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'nativeAudio' | 'englishAudio' | 'illustration') => {
    const file = e.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload files to Supabase Storage
      let nativeAudioUrl = '';
      let englishAudioUrl = '';
      let illustrationUrl = '';

      if (files.nativeAudio) {
        const { data, error } = await supabase.storage
          .from('audio')
          .upload(`native/${Date.now()}-${files.nativeAudio.name}`, files.nativeAudio);
        if (error) throw error;
        nativeAudioUrl = data.path;
      }

      if (files.englishAudio) {
        const { data, error } = await supabase.storage
          .from('audio')
          .upload(`english/${Date.now()}-${files.englishAudio.name}`, files.englishAudio);
        if (error) throw error;
        englishAudioUrl = data.path;
      }

      if (files.illustration) {
        const { data, error } = await supabase.storage
          .from('illustrations')
          .upload(`${Date.now()}-${files.illustration.name}`, files.illustration);
        if (error) throw error;
        illustrationUrl = data.path;
      }

      // Submit story to database
      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          ...formData,
          native_audio_url: nativeAudioUrl,
          english_audio_url: englishAudioUrl,
          illustration_url: illustrationUrl,
          is_approved: false
        });

      if (insertError) throw insertError;

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        title: '',
        title_english: '',
        country: '',
        language: '',
        theme: '',
        native_text: '',
        english_text: '',
        contributor: '',
        contributor_email: ''
      });
      setFiles({ nativeAudio: null, englishAudio: null, illustration: null });

    } catch (error) {
      console.error('Error submitting story:', error);
      alert('There was an error submitting your story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-african-pattern flex items-center justify-center">
        <PatternBorder className="max-w-md mx-4">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="h-8 w-8 text-forest-600" />
            </div>
            <h2 className="text-2xl font-bold text-forest-700 mb-4">Story Submitted!</h2>
            <p className="text-forest-600 mb-6">
              Thank you for contributing to our digital library. Your story has been submitted for review 
              and will be published once approved.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-ochre-500 hover:bg-ochre-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Submit Another Story
            </button>
          </div>
        </PatternBorder>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-african-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <PlusCircle className="h-10 w-10 text-ochre-500 mr-3" />
              <FileText className="h-8 w-8 text-clay-500" />
            </div>
            <h1 className="text-4xl font-bold text-forest-700 mb-4 font-serif">
              Share Your Story
            </h1>
            <p className="text-xl text-forest-600 max-w-2xl mx-auto">
              Help preserve African folklore by contributing stories from your community. 
              All submissions are reviewed before publication.
            </p>
          </div>

          <PatternBorder>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Story Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Story Title (Native Language) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter the story title in native language"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Story Title (English) *
                  </label>
                  <input
                    type="text"
                    name="title_english"
                    value={formData.title_english}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter the English translation of the title"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Language *
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Theme *
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                  >
                    <option value="">Select theme</option>
                    {THEMES.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Story Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Native Language Text *
                  </label>
                  <textarea
                    name="native_text"
                    value={formData.native_text}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter the story in its original language..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    English Translation *
                  </label>
                  <textarea
                    name="english_text"
                    value={formData.english_text}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter the English translation..."
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-forest-700 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-ochre-500" />
                  Optional Files
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      Native Audio
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'nativeAudio')}
                      className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      English Audio
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'englishAudio')}
                      className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      Illustration
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'illustration')}
                      className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contributor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="contributor"
                    value={formData.contributor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contributor_email"
                    value={formData.contributor_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-ochre-500 hover:bg-ochre-600 disabled:bg-ochre-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Submit Story
                    </>
                  )}
                </button>
              </div>
            </form>
          </PatternBorder>
        </div>
      </div>
    </div>
  );
};

export default SubmitStoryPage;
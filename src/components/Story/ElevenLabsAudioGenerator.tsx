import React, { useState } from 'react';
import { Volume2, Download, Loader2, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { elevenLabsService, ElevenLabsVoice } from '../../lib/elevenlabs';
import { supabase } from '../../lib/supabase';

interface ElevenLabsAudioGeneratorProps {
  storyId: string;
  englishText: string;
  englishTitle: string;
  onAudioGenerated?: (audioUrl: string) => void;
  className?: string;
}

const ElevenLabsAudioGenerator: React.FC<ElevenLabsAudioGeneratorProps> = ({
  storyId,
  englishText,
  englishTitle,
  onAudioGenerated,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Bella default
  const [availableVoices] = useState(elevenLabsService.getRecommendedVoices());

  const generateAudio = async () => {
    if (!elevenLabsService.isConfigured()) {
      setError('ElevenLabs is not configured. Please add your API key to environment variables.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Generating audio for story:', englishTitle);
      
      // Generate audio using ElevenLabs
      const audioBlob = await elevenLabsService.generateStoryAudio(englishText, selectedVoice);
      setAudioBlob(audioBlob);

      // Create a local URL for immediate playback
      const localUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(localUrl);

      // Upload to Supabase Storage
      const fileName = `english-${storyId}-${Date.now()}.mp3`;
      const { data, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(`english/${fileName}`, audioBlob, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload audio: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(`english/${fileName}`);

      // Update story record with audio URL
      const { error: updateError } = await supabase
        .from('stories')
        .update({ english_audio_url: publicUrl })
        .eq('id', storyId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to update story: ${updateError.message}`);
      }

      setSuccess(true);
      onAudioGenerated?.(publicUrl);
      
      console.log('Audio generated and uploaded successfully');
    } catch (err: any) {
      console.error('Error generating audio:', err);
      setError(err.message || 'Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${englishTitle.replace(/[^a-zA-Z0-9]/g, '_')}_english_audio.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!elevenLabsService.isConfigured()) {
    return (
      <div className={`bg-clay-100 border border-clay-300 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-clay-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">ElevenLabs Not Configured</p>
            <p className="text-sm text-clay-600">
              Add your ElevenLabs API key to generate AI voice narrations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-cream-100 border border-ochre-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Volume2 className="h-5 w-5 mr-2 text-forest-600" />
          <span className="font-medium text-forest-700">AI Voice Generation</span>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-ochre-600 hover:text-ochre-700 transition-colors"
          title="Voice Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-4 p-3 bg-cream-50 rounded-lg border border-ochre-200">
          <label className="block text-sm font-medium text-forest-700 mb-2">
            Select Voice
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent text-sm"
          >
            {availableVoices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-clay-100 border border-clay-300 rounded-lg">
          <div className="flex items-center text-clay-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-forest-100 border border-forest-300 rounded-lg">
          <div className="flex items-center text-forest-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Audio generated and saved successfully!</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <button
          onClick={generateAudio}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-ochre-500 hover:bg-ochre-600 disabled:bg-ochre-300 text-white rounded-lg transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 mr-2" />
              Generate Audio
            </>
          )}
        </button>

        {audioUrl && (
          <>
            <audio
              controls
              src={audioUrl}
              className="flex-grow max-w-xs"
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
            
            <button
              onClick={downloadAudio}
              className="flex items-center px-3 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-lg transition-colors"
              title="Download Audio"
            >
              <Download className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 text-xs text-forest-600">
        <p>
          <strong>Preview:</strong> "{englishText.substring(0, 100)}..."
        </p>
        <p className="mt-1">
          Voice: {availableVoices.find(v => v.id === selectedVoice)?.name} • 
          Length: ~{Math.ceil(englishText.length / 1000)} minutes
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsAudioGenerator;
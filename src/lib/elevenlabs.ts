interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  model: string;
}

interface GenerateAudioOptions {
  text: string;
  voiceId?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    // Enhanced debug environment variables
    console.log('=== ElevenLabs Environment Debug ===');
    console.log('All environment variables:', import.meta.env);
    console.log('ElevenLabs specific vars:', {
      VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY,
      VITE_ELEVENLABS_VOICE_ID: import.meta.env.VITE_ELEVENLABS_VOICE_ID,
      hasApiKey: !!import.meta.env.VITE_ELEVENLABS_API_KEY,
      apiKeyLength: import.meta.env.VITE_ELEVENLABS_API_KEY?.length || 0,
      apiKeyFirstChars: import.meta.env.VITE_ELEVENLABS_API_KEY?.substring(0, 10) || 'none'
    });
    console.log('All env keys containing ELEVEN:', Object.keys(import.meta.env).filter(key => key.includes('ELEVEN')));
    console.log('All env keys starting with VITE_:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL', // Default: Bella (storytelling voice)
      model: 'eleven_multilingual_v2'
    };

    console.log('Final config:', {
      hasApiKey: !!this.config.apiKey,
      apiKeyLength: this.config.apiKey.length,
      voiceId: this.config.voiceId
    });
  }

  private getHeaders(): HeadersInit {
    return {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': this.config.apiKey
    };
  }

  async generateAudio(options: GenerateAudioOptions): Promise<Blob> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured. Please add VITE_ELEVENLABS_API_KEY to your environment variables.');
    }

    const voiceId = options.voiceId || this.config.voiceId;
    const url = `${this.baseUrl}/text-to-speech/${voiceId}`;

    const requestBody = {
      text: options.text,
      model_id: options.model || this.config.model,
      voice_settings: {
        stability: options.stability || 0.5,
        similarity_boost: options.similarityBoost || 0.75,
        style: options.style || 0.0,
        use_speaker_boost: options.useSpeakerBoost || true
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating audio with ElevenLabs:', error);
      throw error;
    }
  }

  async getVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Recommended voices for storytelling
  getRecommendedVoices(): { id: string; name: string; description: string }[] {
    return [
      {
        id: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Bella',
        description: 'Warm, engaging storytelling voice - perfect for folklore'
      },
      {
        id: 'ErXwobaYiN019PkySvjV',
        name: 'Antoni',
        description: 'Deep, authoritative voice - great for epic tales'
      },
      {
        id: 'VR6AewLTigWG4xSOukaG',
        name: 'Arnold',
        description: 'Crisp, clear narration - excellent for educational content'
      },
      {
        id: 'pNInz6obpgDQGcFmaJgB',
        name: 'Adam',
        description: 'Versatile, natural voice - suitable for all story types'
      },
      {
        id: 'Xb7hH8MSUJpSbSDYk0k2',
        name: 'Alice',
        description: 'Gentle, soothing voice - perfect for children\'s stories'
      }
    ];
  }

  // Generate audio for a story with optimized settings for folklore
  async generateStoryAudio(text: string, voiceId?: string): Promise<Blob> {
    // Clean and prepare text for better speech synthesis
    const cleanText = this.prepareTextForSpeech(text);

    return this.generateAudio({
      text: cleanText,
      voiceId: voiceId,
      stability: 0.6, // Slightly more stable for storytelling
      similarityBoost: 0.8, // Higher similarity for consistent character
      style: 0.2, // Slight style for more engaging delivery
      useSpeakerBoost: true
    });
  }

  private prepareTextForSpeech(text: string): string {
    return text
      // Add pauses for better pacing
      .replace(/\.\s+/g, '. ')
      .replace(/!\s+/g, '! ')
      .replace(/\?\s+/g, '? ')
      // Add longer pauses for paragraph breaks
      .replace(/\n\n/g, '... ')
      // Clean up any multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Check if service is configured
  isConfigured(): boolean {
    const configured = !!this.config.apiKey;
    console.log('ElevenLabs isConfigured:', configured, 'API Key length:', this.config.apiKey.length);
    return configured;
  }

  // Get current configuration
  getConfig(): Partial<ElevenLabsConfig> {
    return {
      voiceId: this.config.voiceId,
      model: this.config.model
    };
  }
}

export const elevenLabsService = new ElevenLabsService();
export type { ElevenLabsVoice, GenerateAudioOptions };
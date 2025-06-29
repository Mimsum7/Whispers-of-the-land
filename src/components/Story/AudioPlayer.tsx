import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  language: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-cream-100 border border-ochre-300 rounded-lg p-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-forest-600" />
          <span className="text-sm font-medium text-forest-700">
            {language} Narration
          </span>
        </div>
        <a
          href={audioUrl}
          download={`${title}-${language}.mp3`}
          className="text-clay-600 hover:text-clay-700 transition-colors"
          title="Download audio"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-ochre-500 hover:bg-ochre-600 text-white rounded-full transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </button>

        <div className="flex-grow">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-ochre-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="text-xs text-forest-600 min-w-[80px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
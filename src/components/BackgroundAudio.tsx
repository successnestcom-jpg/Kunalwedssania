import React, { useState, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { Sound } from '../utils/audioSynth';

interface BackgroundAudioProps {
  musicPreset?: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram';
}

export const BackgroundAudio: React.FC<BackgroundAudioProps> = ({ musicPreset = 'shehnai' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const label =
    musicPreset === 'flute'
      ? 'Flute'
      : musicPreset === 'sitar'
      ? 'Sitar'
      : musicPreset === 'romantic'
      ? 'Melody'
      : 'Shehnai';

  const toggle = () => {
    const active = Sound.toggleMusic(musicPreset);
    setIsPlaying(active);
    setShowTooltip(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {showTooltip && !isPlaying && (
        <span className="hidden sm:inline-block bg-neutral-900/85 backdrop-blur-md text-amber-200 text-xs px-3 py-1.5 rounded-full font-cinzel animate-pulse shadow-xl border border-amber-500/40">
          Tap for {label} Music 🎵
        </span>
      )}
      <button
        id="wedding-music-toggle-btn"
        onClick={toggle}
        aria-label="Toggle Wedding Music"
        type="button"
        className={`relative flex items-center justify-center w-11 h-11 rounded-full shadow-2xl border transition-all duration-300 cursor-pointer ${
          isPlaying
            ? 'bg-gradient-to-tr from-amber-700 via-rose-800 to-amber-600 text-amber-100 border-amber-300 scale-105 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
            : 'bg-black/70 backdrop-blur-md text-neutral-200 border-amber-500/40 hover:bg-neutral-900 hover:text-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Music className="w-5 h-5 animate-spin-slow text-amber-200" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
          </>
        ) : (
          <VolumeX className="w-5 h-5 text-amber-300" />
        )}
      </button>
    </div>
  );
};

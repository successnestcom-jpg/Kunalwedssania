import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Music, Volume2, VolumeX, Lock, Unlock, RotateCcw } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { Sound } from '../utils/audioSynth';

interface GatewayRevealSectionProps {
  config: WeddingConfig;
  onTriggerPetalShower: () => void;
}

export const GatewayRevealSection: React.FC<GatewayRevealSectionProps> = ({
  config,
  onTriggerPetalShower,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const realPhoto =
    config.gatewayPhotoUrl ||
    '/assets/aistudio/WhatsApp_Image_2026-10-28_at_4.10.23_PM_24ea3598.jpeg';

  useEffect(() => {
    const unsubscribe = Sound.subscribe((playing) => {
      setIsPlayingMusic(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenGateway = () => {
    Sound.playWaxSealSound();
    setIsOpen(true);
    onTriggerPetalShower();

    // Auto-play the uploaded romantic song if not already playing
    if (!Sound.getIsPlaying()) {
      setTimeout(() => {
        Sound.playWeddingMusic();
      }, 300);
    }
  };

  const handleToggleDoor = () => {
    if (isOpen) {
      Sound.playCardFlipSound();
      setIsOpen(false);
    } else {
      handleOpenGateway();
    }
  };

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    Sound.toggleMusic();
  };

  return (
    <section
      id="scene-3d-gateway-reveal"
      className="relative w-full min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-950 via-[#18040A] to-neutral-950 text-white select-none"
    >
      {/* Background Ambience with Warm Lights & Bokeh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-900/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 shadow-lg text-xs font-cinzel tracking-widest text-amber-300 uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span>3D Royal Gateway Reveal</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
        </div>

        <h2 className="font-title text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-400 font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          The Heart of Our Love
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-amber-100/90 font-montserrat max-w-lg mx-auto leading-relaxed">
          Unlock the grand 3D palace doors to unveil the cherished moments of Kunal &amp; Sania celebrating love amidst roses, candlelight, and soulful music.
        </p>

        {/* Music Status Bar */}
        <div className="mt-4 inline-flex items-center gap-3 bg-black/60 backdrop-blur-md border border-amber-500/40 px-4 py-1.5 rounded-full text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-1.5">
            <Music className={`w-3.5 h-3.5 text-rose-400 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
            <span className="font-cinzel text-[11px] font-semibold">
              {isPlayingMusic ? 'Playing: Tere Naal Pyaar 🎵' : 'Soundtrack: Kunal & Sania Love Song'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleAudio}
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isPlayingMusic ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={isPlayingMusic ? 'Pause Song' : 'Play Romantic Song'}
          >
            {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Gateway Door Frame (Perspective 1000px) */}
      <div className="relative z-20 w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] aspect-[9/13] perspective-1000 p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-[#D4AF37] via-[#850B1B] to-[#450A0A] shadow-[0_0_60px_rgba(212,175,55,0.45)] border-2 border-amber-300">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-950 shadow-inner preserve-3d">
          {/* REVEALED PHOTO INSIDE */}
          <div className="absolute inset-0 z-0">
            <img
              src={realPhoto}
              alt="Kunal & Sania Heart of Roses Celebration"
              className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.05]"
            />

            {/* Subtle Gradient & Information Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none flex flex-col justify-between p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="bg-[#850B1B]/90 backdrop-blur-md text-amber-200 text-[10px] font-cinzel font-bold px-3 py-1 rounded-full border border-amber-400/50 uppercase tracking-wider">
                  ✦ Heart of Roses
                </span>
                <span className="bg-black/60 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" /> Kunal &amp; Sania
                </span>
              </div>

              <div className="text-center">
                <p className="font-playfair text-lg sm:text-xl font-bold text-amber-200 drop-shadow-md">
                  A Love to Last a Lifetime
                </p>
                <p className="text-[11px] sm:text-xs text-amber-100/90 font-montserrat mt-0.5">
                  LeafyLush Resort &amp; Spa, Jim Corbett
                </p>
              </div>
            </div>
          </div>

          {/* 3D GATEWAY LEFT DOOR */}
          <motion.div
            initial={false}
            animate={{
              rotateY: isOpen ? -115 : 0,
            }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left center' }}
            className="absolute top-0 left-0 w-1/2 h-full z-20 origin-left preserve-3d cursor-pointer shadow-[10px_0_25px_rgba(0,0,0,0.85)]"
            onClick={handleToggleDoor}
          >
            {/* Left Door Exterior: Royal Red & Gold Filigree */}
            <div className="relative w-full h-full bg-gradient-to-r from-[#3B0715] via-[#52091D] to-[#2D0A0F] border-r border-amber-400/70 p-3 flex flex-col justify-between overflow-hidden">
              {/* Gold Filigree Inlay */}
              <div className="absolute inset-1.5 border-2 border-amber-400/60 rounded-l-xl pointer-events-none" />
              <div className="absolute inset-3 border border-amber-300/30 rounded-l-lg pointer-events-none" />

              {/* Arch Top Trim */}
              <div className="relative z-10 flex items-center justify-start text-[10px] font-cinzel text-amber-300 uppercase tracking-wider pt-2">
                <span>✦ PALACE GATE</span>
              </div>

              {/* Center Handle / Brass Knocker */}
              <div className="relative z-10 flex flex-col items-end pr-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center text-red-950 font-bold shadow-lg border border-amber-200">
                  <span className="text-xs">⚜</span>
                </div>
              </div>

              {/* Bottom Traditional Floral Border */}
              <div className="relative z-10 text-[9px] font-cinzel text-amber-200/80 pb-2">
                <span>॥ शुभ विवाह ॥</span>
              </div>
            </div>
          </motion.div>

          {/* 3D GATEWAY RIGHT DOOR */}
          <motion.div
            initial={false}
            animate={{
              rotateY: isOpen ? 115 : 0,
            }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'right center' }}
            className="absolute top-0 right-0 w-1/2 h-full z-20 origin-right preserve-3d cursor-pointer shadow-[-10px_0_25px_rgba(0,0,0,0.85)]"
            onClick={handleToggleDoor}
          >
            {/* Right Door Exterior */}
            <div className="relative w-full h-full bg-gradient-to-l from-[#3B0715] via-[#52091D] to-[#2D0A0F] border-l border-amber-400/70 p-3 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-1.5 border-2 border-amber-400/60 rounded-r-xl pointer-events-none" />
              <div className="absolute inset-3 border border-amber-300/30 rounded-r-lg pointer-events-none" />

              <div className="relative z-10 flex items-center justify-end text-[10px] font-cinzel text-amber-300 uppercase tracking-wider pt-2">
                <span>ROYAL REVEAL ✦</span>
              </div>

              <div className="relative z-10 flex flex-col items-start pl-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-bl from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center text-red-950 font-bold shadow-lg border border-amber-200">
                  <span className="text-xs">⚜</span>
                </div>
              </div>

              <div className="relative z-10 text-[9px] font-cinzel text-amber-200/80 text-right pb-2">
                <span>॥ सदा सुहागन ॥</span>
              </div>
            </div>
          </motion.div>

          {/* CENTRAL WAX SEAL / MONOGRAM EMBLEM (Visible when closed) */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer pointer-events-none"
            >
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-1 shadow-[0_0_35px_rgba(245,158,11,0.8)] border-2 border-white animate-aura-glow">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#850B1B] to-[#450A0A] flex flex-col items-center justify-center text-center">
                  <span className="font-title text-2xl font-black text-amber-200 tracking-tight">
                    {config.monogramText || 'KS'}
                  </span>
                </div>
              </div>

              <div className="mt-3 px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-300 text-[10px] font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Tap to Open Gateway</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Gateway Control Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={handleToggleDoor}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600 hover:brightness-110 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 border border-amber-300 cursor-pointer transition-transform active:scale-95"
        >
          {isOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          <span>{isOpen ? 'Close Palace Gateway' : 'Open 3D Gateway & Reveal'}</span>
        </button>

        <button
          type="button"
          onClick={onTriggerPetalShower}
          className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-rose-300 font-cinzel font-semibold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 border border-rose-500/40 cursor-pointer transition-transform active:scale-95"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>Shower Rose Petals</span>
        </button>

        <button
          type="button"
          onClick={handleToggleAudio}
          className={`px-5 py-2.5 rounded-full font-cinzel font-semibold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 border transition-all cursor-pointer ${
            isPlayingMusic
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 border-amber-200 font-bold'
              : 'bg-neutral-900 text-amber-200 border-amber-500/40 hover:bg-neutral-800'
          }`}
        >
          <Music className={`w-4 h-4 ${isPlayingMusic ? 'animate-spin-slow' : ''}`} />
          <span>{isPlayingMusic ? 'Music Playing 🎵' : 'Play Background Audio'}</span>
        </button>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Eye, RotateCcw, CheckCircle2 } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ASSETS } from '../data/presets';
import { Sound } from '../utils/audioSynth';

interface ScratchCardSectionProps {
  config: WeddingConfig;
}

export const ScratchCardSection: React.FC<ScratchCardSectionProps> = ({ config }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  const revealImage =
    ASSETS.kunalSaniaArtwork ||
    '/assets/aistudio/Gemini_Generated_Image_3jg3413jg3413jg3_670d7826.png';

  // Render the gold foil scratch layer on canvas
  const initFoilCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.offsetWidth || 340;
    const h = canvas.offsetHeight || 440;
    canvas.width = w;
    canvas.height = h;

    // Metallic Punjabi Gold Foil Gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#7F1D1D');
    gradient.addColorStop(0.2, '#D97706');
    gradient.addColorStop(0.4, '#FBBF24');
    gradient.addColorStop(0.6, '#F59E0B');
    gradient.addColorStop(0.8, '#B45309');
    gradient.addColorStop(1, '#450A0A');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Gold dust particle stippling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 300; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      const radius = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Double Gold Filigree Borders
    ctx.strokeStyle = 'rgba(255, 240, 180, 0.85)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.95)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Central Medallion
    const cx = w / 2;
    const cy = h / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(20, 10, 5, 0.75)';
    ctx.beginPath();
    ctx.arc(cx, cy, 56, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.95)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFE58F';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', cx, cy - 14);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SCRATCH TO REVEAL', cx, cy + 14);

    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText('SACRED HATHLEWA UNION', cx, cy + 28);
    ctx.restore();
  }, []);

  useEffect(() => {
    if (!isRevealed) {
      const timer = setTimeout(() => {
        initFoilCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initFoilCanvas, isRevealed]);

  // Compute scratch percentage
  const calculateScratchedArea = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let cleared = 0;
      const step = 32;
      const totalSampled = Math.floor(data.length / (4 * step));

      if (totalSampled <= 0) return;

      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] === 0) cleared++;
      }

      const percent = Math.min(100, Math.max(0, Math.round((cleared / totalSampled) * 100)));
      setScratchPercent(percent);

      if (percent >= 38 && !isRevealed) {
        handleFullReveal();
      }
    } catch {
      // Ignore cross-origin canvas security errors
    }
  };

  const handleFullReveal = () => {
    setIsRevealed(true);
    setScratchPercent(100);
    Sound.playTempleBellSound();
    Sound.playBlessingChime();

    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#F59E0B', '#E11D48', '#850B1B', '#FFFFFF'],
    });
  };

  // Perform scratching action at coordinate
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    const now = Date.now();
    if (now - lastSoundTimeRef.current > 160) {
      Sound.playScratchSound();
      lastSoundTimeRef.current = now;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratchAt(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratchAt(e.clientX, e.clientY);
      calculateScratchedArea();
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
    calculateScratchedArea();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    const touch = e.touches[0];
    if (touch) scratchAt(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      const touch = e.touches[0];
      if (touch) {
        scratchAt(touch.clientX, touch.clientY);
        calculateScratchedArea();
      }
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
    calculateScratchedArea();
  };

  const handleReset = () => {
    setIsRevealed(false);
    setScratchPercent(0);
    setTimeout(() => {
      initFoilCanvas();
    }, 60);
  };

  return (
    <section
      id="scene-scratch-gatefold"
      className="relative min-h-screen py-16 px-4 flex flex-col items-center justify-center overflow-hidden bg-neutral-950 text-white select-none"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={ASSETS.punjabiEmbrace}
          alt="Royal Punjabi Hathlewa Atmosphere"
          className="w-full h-full object-cover object-center filter brightness-[0.22] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#850B1B]/75 via-neutral-950/85 to-neutral-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Header Badges */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 shadow-lg text-xs font-cinzel tracking-widest text-amber-300 uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span>✨ 3D Macro Ritual Scratch Reveal ✨</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
        </div>

        <h2 className="font-title text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-400 font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {config.scratchRevealHeading || '3D MACRO RITUAL CLOSE-UP: HATHLEWA'}
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-amber-100/90 font-montserrat max-w-lg mx-auto leading-relaxed">
          {config.scratchRevealNote ||
            'Gently scratch to reveal the sacred Hathlewa hand union: red Chooda, bridal Mehendi, gold rings & floral threads'}
        </p>

        {/* Scratch Progress Pill */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded-full border border-amber-500/30 text-xs font-cinzel text-amber-200 shadow-md">
            <span>Revealed:</span>
            <span className="font-mono font-bold text-amber-400">{scratchPercent}%</span>
            <div className="w-20 h-2 bg-neutral-800 rounded-full overflow-hidden border border-amber-400/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${scratchPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scratch Card Frame */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-[9/16] rounded-2xl p-2.5 bg-gradient-to-b from-[#FBBF24] via-[#D4AF37] to-[#850B1B] shadow-[0_0_50px_rgba(212,175,55,0.45)] border-2 border-amber-300/80">
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#FAF5EC] shadow-inner">
          {/* Revealed Sacred Ritual Photo Underneath */}
          <div className="absolute inset-0">
            <img
              src={revealImage}
              alt="Sacred Hathlewa & Eternal Blessings of Kunal & Sania"
              className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04]"
            />
          </div>

          {/* HTML5 Canvas Scratchable Foil Layer */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-500"
            />
          )}

          {/* Revealed Celebration Overlay */}
          {isRevealed && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-cinzel px-3 py-1 rounded-full shadow-lg animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ritual Revealed!</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="relative z-10 flex items-center gap-3 mt-6">
        {!isRevealed ? (
          <button
            type="button"
            onClick={handleFullReveal}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:brightness-110 text-neutral-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 border border-amber-300"
          >
            <Eye className="w-4 h-4" />
            Auto Reveal Ritual
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-cinzel font-semibold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95 border border-amber-500/40"
          >
            <RotateCcw className="w-4 h-4" />
            Scratch Again
          </button>
        )}
      </div>
    </section>
  );
};

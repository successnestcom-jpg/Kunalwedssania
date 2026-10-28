import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MapPin, Navigation, Car, Sparkles, Plane, Train } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ASSETS } from '../data/presets';
import { Sound } from '../utils/audioSynth';

interface VenueSectionProps {
  config: WeddingConfig;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Twinkling stars on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 400);
    const height = (canvas.height = canvas.offsetHeight || 600);

    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7),
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.03 + 0.01,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        const brightness = Math.abs(Math.sin(s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 160, ${brightness * 0.85})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#FFD700';
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const launchFireworks = () => {
    Sound.playFireworkSound();

    confetti({
      particleCount: 80,
      angle: 60,
      spread: 75,
      origin: { x: 0.15, y: 0.6 },
      colors: ['#FFE87C', '#FF4500', '#FFD700', '#FF69B4', '#00FFFF', '#FFFFFF'],
    });

    confetti({
      particleCount: 80,
      angle: 120,
      spread: 75,
      origin: { x: 0.85, y: 0.6 },
      colors: ['#FFE87C', '#FF4500', '#FFD700', '#FF69B4', '#00FFFF', '#FFFFFF'],
    });
  };

  const openGoogleMaps = () => {
    const url = config.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(config.venueName + ' ' + config.venueCity)}`;
    window.open(url, '_blank');
  };

  const openUber = () => {
    const url = `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encodeURIComponent(
      config.venueAddress
    )}&dropoff[nickname]=${encodeURIComponent(config.venueName)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="relative w-full min-h-[720px] h-full flex flex-col items-center justify-between overflow-hidden select-none text-white p-4 py-16 bg-[#18040A]">
      {/* Background imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.royalVarmala}
          alt="Taj Swarna Amritsar Grand Destination"
          className="w-full h-full object-cover object-center brightness-[0.8] contrast-[1.1] saturate-[1.2]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(133, 11, 27, 0.78) 0%, rgba(20, 5, 10, 0.65) 50%, rgba(133, 11, 27, 0.95) 100%)',
          }}
        />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />

      {/* Header */}
      <div className="relative z-20 w-full flex flex-col items-center pt-4 text-center">
        <div className="px-6 py-2 rounded-full backdrop-blur-md border border-amber-400/60 shadow-[0_0_25px_rgba(255,215,0,0.4)] mb-3 bg-[#18040A]/80">
          <span className="text-amber-300 font-cinzel text-xs font-bold tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
            The Wedding Destination &amp; Travel Guide
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          </span>
        </div>

        <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-300">
          {config.venueName}
        </h2>
        <p className="text-sm font-montserrat text-amber-200 font-medium mt-1">
          {config.venueCity}
        </p>
      </div>

      {/* Main Venue Card & Travel Logistics */}
      <div className="relative z-20 w-full max-w-xl mx-auto my-6 p-6 rounded-2xl bg-black/75 backdrop-blur-md border border-amber-400/50 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-2 text-amber-300 mb-2">
          <MapPin className="w-5 h-5 text-rose-400" />
          <span className="font-cinzel text-xs uppercase font-bold tracking-wider">
            Official Address
          </span>
        </div>

        <p className="font-playfair text-base sm:text-lg text-white font-semibold leading-relaxed">
          {config.venueAddress}
        </p>

        {/* Travel Distance Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-5 text-left">
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-cinzel font-bold mb-1">
              <Plane className="w-3.5 h-3.5" />
              <span>Nearest Airport</span>
            </div>
            <p className="text-[11px] text-neutral-300">Pantnagar (PGH) / Dehradun</p>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-cinzel font-bold mb-1">
              <Train className="w-3.5 h-3.5" />
              <span>Railway Station</span>
            </div>
            <p className="text-[11px] text-neutral-300">Ramnagar (~12 km / 20 mins)</p>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-cinzel font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wilderness &amp; Safari</span>
            </div>
            <p className="text-[11px] text-neutral-300">Jim Corbett Reserve &amp; Kosi River</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={openGoogleMaps}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:brightness-110 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 border border-emerald-400 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            Open Google Maps Directions
          </button>

          <button
            type="button"
            onClick={openUber}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-cinzel font-semibold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 border border-amber-500/40 cursor-pointer"
          >
            <Car className="w-4 h-4" />
            Ride with Uber / Cab
          </button>
        </div>
      </div>

      {/* Celebratory Fireworks Trigger */}
      <div className="relative z-20 w-full flex flex-col items-center pb-4 text-center">
        <button
          type="button"
          onClick={launchFireworks}
          className="group px-6 py-2 rounded-full bg-gradient-to-r from-purple-900/80 via-rose-900/80 to-purple-900/80 hover:brightness-125 text-amber-200 text-xs font-cinzel font-bold border border-amber-400/50 shadow-xl flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
          <span>Launch Celebration Sky Fireworks 🎆</span>
        </button>
      </div>
    </section>
  );
};

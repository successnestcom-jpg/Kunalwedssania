import React, { useState, useEffect } from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ASSETS } from '../data/presets';

interface GatefoldInvitationProps {
  config: WeddingConfig;
}

export const GatefoldInvitation: React.FC<GatefoldInvitationProps> = ({ config }) => {
  const [currentTime, setCurrentTime] = useState({
    timeString: '',
    dateString: '',
    fullFormatted: '',
  });

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      const tStr = timeFormatter.format(now);
      const dStr = dateFormatter.format(now);

      setCurrentTime({
        timeString: tStr,
        dateString: dStr,
        fullFormatted: `${dStr}, ${tStr} IST`,
      });

      // Target wedding date countdown: Dec 13, 2026 07:00 PM IST
      const targetDate = new Date('2026-12-13T19:00:00+05:30').getTime();
      const diff = targetDate - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="scene-sacred-invitation"
      className="relative w-full min-h-[660px] h-full flex flex-col items-center justify-between overflow-hidden select-none text-white py-10 px-4"
      style={{ backgroundColor: '#18040A' }}
    >
      {/* Background Royal Mandap Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.royalVarmala}
          alt="Royal Mandap & Crystal Chandelier"
          className="w-full h-full object-cover object-center brightness-[1.04] contrast-[1.1] saturate-[1.15]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(133, 11, 27, 0.78) 0%, rgba(45, 10, 15, 0.65) 50%, rgba(26, 5, 11, 0.95) 100%)',
          }}
        />

        {/* Floating golden particles */}
        <div className="absolute top-1/4 right-8 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle" />
        <div className="absolute top-1/3 left-6 w-2.5 h-2.5 rounded-full bg-amber-300 animate-sparkle [animation-delay:500ms]" />
      </div>

      {/* Top Monogram Seal & Invocation */}
      <div className="relative z-20 w-full flex flex-col items-center pt-4 text-center">
        <div className="relative flex flex-col items-center">
          {/* Circular Glowing Monogram */}
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#FBBF24] backdrop-blur-md shadow-[0_0_40px_rgba(255,215,0,0.6)] animate-aura-glow bg-gradient-to-br from-[#F59E0B]/30 via-[#2A0610]/90 to-black">
            <div className="absolute -inset-2 border-2 border-[#FBBF24]/40 rounded-full animate-spin-slow pointer-events-none" />
            <span className="font-title text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-yellow-200 via-amber-100 to-yellow-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] tracking-tight">
              {config.monogramText}
            </span>
          </div>

          {/* Cultural Tagline */}
          <div className="flex items-center gap-2 mt-4 text-amber-200 text-xs font-cinzel tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
            <span className="font-bold">🌸 Kunal &amp; Sania • Shubh Vivah Countdown 🌸</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          </div>

          {/* Eternal Blessings of Elders */}
          <div className="mt-2.5 px-4 py-1 rounded-full bg-black/60 border border-amber-400/50 text-[11px] text-amber-200">
            <span className="font-cinzel text-neutral-400 text-[10px] uppercase mr-1.5">With Eternal Blessings of</span>
            <span className="font-serif font-bold text-amber-300">{config.eldersBlessing || 'Late Sh PL Makkar & Late Sh AK Bhatia'}</span>
          </div>
        </div>
      </div>

      {/* Sacred Vedic Shloka Pill */}
      <div className="relative z-10 w-full flex justify-center px-4 py-3">
        <div className="max-w-md md:max-w-2xl px-6 md:px-8 py-3 md:py-4 rounded-full backdrop-blur-md border border-amber-400/80 text-center shadow-[0_0_25px_rgba(0,0,0,0.7)] bg-[#2A0610]/85">
          <p className="text-amber-200 text-xs sm:text-sm md:text-base font-serif italic tracking-wide">
            “{config.shloka || 'Sakhe saptapada bhava sa mamanuvrata bhava vishnustva nayatu'}”
          </p>
          {config.shlokaMeaning && (
            <p className="text-[10px] md:text-xs text-amber-100/80 font-body mt-1">
              {config.shlokaMeaning}
            </p>
          )}
        </div>
      </div>

      {/* Welcome Message & Live Countdown Card */}
      <div className="relative z-20 w-full flex flex-col items-center pb-8 px-4 text-center">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl backdrop-blur-md rounded-2xl p-5 md:p-6 border border-amber-500/80 shadow-[0_0_40px_rgba(0,0,0,0.85)] bg-[#18040A]/90">
          <p className="text-amber-100/95 text-xs md:text-sm font-editorial italic mb-3.5 leading-relaxed px-2 md:px-6">
            “{config.welcomeMessage}”
          </p>

          {/* Current Local Time in IST */}
          <div className="mb-4 px-3.5 py-1.5 md:py-2 rounded-xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-2 shadow-inner max-w-md mx-auto">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] md:text-xs font-mono text-emerald-300 font-semibold tracking-wider">
                LIVE IST
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-mono text-amber-200">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentTime.fullFormatted || 'Loading IST...'}</span>
            </div>
          </div>

          {/* 4-Box Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
            {[
              { label: 'Days', val: countdown.days },
              { label: 'Hours', val: countdown.hours },
              { label: 'Minutes', val: countdown.minutes },
              { label: 'Seconds', val: countdown.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-black/70 border border-amber-400/40 shadow-inner"
              >
                <span className="font-title text-xl sm:text-2xl md:text-3xl font-bold text-amber-300">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] md:text-[10px] uppercase font-cinzel text-amber-200/80 tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] font-cinzel text-amber-300 font-semibold uppercase tracking-widest">
            {config.weddingDateFormatted} • {config.venueName}
          </p>
        </div>
      </div>
    </section>
  );
};

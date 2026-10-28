import React from 'react';
import { Sparkles } from 'lucide-react';

interface DecorativeDividerProps {
  variant?: 'kaleerein' | 'floral' | 'both';
  label?: string;
  themeAccent?: string;
  isKerala?: boolean;
}

export const DecorativeDivider: React.FC<DecorativeDividerProps> = ({
  variant = 'kaleerein',
  label,
  themeAccent = '#D4AF37',
  isKerala = false,
}) => {
  if (isKerala) {
    return (
      <div aria-hidden="true" className="relative w-full py-6 my-2 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20">
        <div className="relative w-full max-w-lg flex items-center justify-center gap-2 px-4 mb-1">
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F59E0B] to-[#FBBF24]" />
          <div className="flex items-center gap-2 bg-[#062419]/95 px-4 py-1.5 rounded-full border border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <span className="text-xs" title="Coconut Palm">🌴</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span className="text-xs">🌸</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 flex items-center justify-center text-[11px] text-amber-950 font-bold shadow-md">
              🪔
            </div>
            <span className="text-xs">🌸</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span className="text-xs">🌴</span>
          </div>
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F59E0B] to-[#FBBF24]" />
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="relative w-full py-6 my-3 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20">
      <div className="relative w-full max-w-xl flex items-center justify-center gap-3 px-4">
        {/* Left gold filigree bar */}
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-amber-500 opacity-90" />

        {/* Central Royal Kaleerein & Lotus Medallion */}
        <div className="flex items-center gap-2.5 bg-gradient-to-b from-[#2D0A0F] to-[#18040A] px-5 py-1.5 rounded-full border border-amber-400/80 shadow-[0_0_25px_rgba(212,175,55,0.45)]">
          <span className="text-xs text-amber-300 drop-shadow-xs">🌸</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-200" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
            <span className="font-cinzel text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 uppercase tracking-widest">
              {label || (variant === 'kaleerein' ? '॥ ANAND KARAJ ॥' : '॥ SHUBH VIVAH ॥')}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-200" />
          <span className="text-xs text-amber-300 drop-shadow-xs">🌸</span>
        </div>

        {/* Right gold filigree bar */}
        <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-amber-400 to-amber-500 opacity-90" />
      </div>

      {/* Hanging Kaleerein decorative bells motif */}
      <div className="flex items-center justify-center gap-6 mt-1 text-[10px] text-amber-400/60 font-serif">
        <span>✨</span>
        <span>•</span>
        <span>🔔</span>
        <span>•</span>
        <span>✨</span>
      </div>
    </div>
  );
};

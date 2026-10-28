import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronDown, Sparkles, ScrollText, Heart } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ASSETS } from '../data/presets';

interface HeroSectionProps {
  config: WeddingConfig;
  onScrollNext: () => void;
  onScrollToEvents: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onScrollNext, onScrollToEvents }) => {
  const [isScrollOpen, setIsScrollOpen] = useState(true);
  const [shotVariant, setShotVariant] = useState<'embrace' | 'varmala'>('embrace');

  const currentCoupleImg =
    shotVariant === 'embrace'
      ? ASSETS.punjabiEmbrace
      : ASSETS.royalVarmala;

  return (
    <section className="relative w-full min-h-[700px] h-full flex flex-col items-center justify-between overflow-hidden bg-[#18040A] select-none text-white">
      {/* Background Image with Warm Luxury Vignette and Bokeh */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentCoupleImg}
          alt={`${config.groomName} & ${config.brideName} Royal Punjabi Wedding`}
          className="w-full h-full object-cover object-center brightness-[0.98] contrast-[1.08] saturate-[1.15] transition-all duration-700"
        />

        {/* Cinematic Vignette */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.32), transparent 70%), linear-gradient(to bottom, rgba(133, 11, 27, 0.65) 0%, rgba(45, 10, 15, 0.45) 45%, rgba(26, 5, 11, 0.95) 100%)',
          }}
        />

        {/* Shimmering Gold Bokeh Dots */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#D4AF37_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

        {/* Floating Twinkling Stars */}
        <div className="absolute top-1/4 right-8 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle" />
        <div className="absolute top-1/3 left-6 w-2.5 h-2.5 rounded-full bg-amber-300 animate-sparkle [animation-delay:600ms]" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-yellow-100 animate-sparkle [animation-delay:1200ms]" />
      </div>

      {/* Main Content: Interactive Unrolling Silk Scroll */}
      <div className="relative z-20 w-full flex flex-col items-center pt-5 sm:pt-7 px-3 sm:px-4">
        <AnimatePresence>
          {isScrollOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0.3, scaleY: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                scaleY: 1,
                transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{ height: 0, opacity: 0, scaleY: 0 }}
              className="relative w-full max-w-[370px] sm:max-w-[440px] md:max-w-2xl lg:max-w-3xl origin-top preserve-3d"
            >
              {/* Top Wooden Scroll Bar with Amber Beads */}
              <div className="relative z-10 w-[104%] -left-[2%] h-4 bg-gradient-to-r from-[#451f08] via-[#854d19] to-[#451f08] rounded-full shadow-lg border-b border-[#2b1204] flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
              </div>

              {/* Silk Parchment Body */}
              <div className="relative bg-[#FFFDF7] border-x-2 border-b-2 border-amber-400/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-b-2xl px-4 py-5 md:px-8 md:py-7 text-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#D4AF37 1.5px, transparent 1.5px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Inner Gold Foil Frame */}
                <div className="relative border-2 border-amber-400/80 p-3 sm:p-5 md:p-6 rounded-xl bg-[#FAF5EC]/90 backdrop-blur-[1px] shadow-inner">
                  {/* Auspicious Invocation */}
                  <div className="flex items-center justify-center gap-1.5 mb-1.5 text-amber-900">
                    <Heart className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-cinzel tracking-wider font-bold uppercase drop-shadow-xs text-amber-950">
                      {config.culturalInvocation || '॥ ॐ श्री गणेशाय नमः • ANAND KARAJ & SHUBH VIVAH ॥'}
                    </span>
                    <Heart className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                  </div>

                  {/* Eternal Blessings of Elders */}
                  <div className="mb-2 py-1.5 px-4 bg-gradient-to-r from-amber-100/80 via-amber-200/90 to-amber-100/80 rounded-xl border border-amber-400/60 inline-block shadow-xs">
                    <p className="text-[9px] sm:text-[10px] font-cinzel text-neutral-700 font-semibold uppercase tracking-wider">
                      With the Eternal Blessings of
                    </p>
                    <p className="text-[11px] sm:text-xs font-serif font-bold text-[#850B1B]">
                      {config.eldersBlessing || 'Late Sh PL Makkar & Late Sh AK Bhatia'}
                    </p>
                  </div>

                  <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] font-cinzel font-bold text-amber-950 mb-2">
                    WE ARE GETTING MARRIED
                  </p>

                  <div className="md:grid md:grid-cols-12 md:gap-6 md:items-center my-2">
                    {/* Couple Portrait with Dual Scene Selector */}
                    <div className="md:col-span-5 my-2 md:my-0 flex flex-col items-center justify-center">
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full p-1.5 shadow-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 transition-transform duration-300 hover:scale-105">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 md:border-[3px] border-[#FFFDF7] bg-neutral-100 shadow-inner">
                          <img
                            src={currentCoupleImg}
                            alt={`${config.groomName} & ${config.brideName}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs shadow-md">
                          ✨
                        </div>
                      </div>

                      {/* Punjabi Couple Shot Switcher */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShotVariant('embrace')}
                          className={`text-[9px] font-cinzel px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            shotVariant === 'embrace'
                              ? 'bg-[#850B1B] text-amber-100 border-amber-400 font-bold shadow-xs'
                              : 'bg-white/90 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                          }`}
                        >
                          Embrace (Shot 1)
                        </button>
                        <button
                          type="button"
                          onClick={() => setShotVariant('varmala')}
                          className={`text-[9px] font-cinzel px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                            shotVariant === 'varmala'
                              ? 'bg-[#850B1B] text-amber-100 border-amber-400 font-bold shadow-xs'
                              : 'bg-white/90 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                          }`}
                        >
                          Varmala (Shot 3)
                        </button>
                      </div>
                    </div>

                    {/* Couple Names, Parents, Date, and Venue */}
                    <div className="md:col-span-7 flex flex-col items-center text-center">
                      <div className="my-1.5 py-2 border-y border-amber-400/50 w-full">
                        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide leading-tight text-[#850B1B]">
                          {config.groomName}
                        </h1>
                        <p className="text-[10px] sm:text-[11px] text-neutral-700 font-montserrat">
                          Son of <span className="font-semibold text-amber-950">Mrs. Uma Makkar &amp; Mr. Sanjeev Makkar</span>
                        </p>

                        <div className="flex items-center justify-center gap-2 my-1">
                          <span className="w-10 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                          <span className="font-script text-2xl md:text-3xl font-bold text-[#D4AF37]">
                            &
                          </span>
                          <span className="w-10 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                        </div>

                        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide leading-tight text-[#850B1B]">
                          {config.brideName}
                        </h1>
                        <p className="text-[10px] sm:text-[11px] text-neutral-700 font-montserrat">
                          Daughter of <span className="font-semibold text-amber-950">Mrs. Pushpa Gusain &amp; Mr. Rakesh Gusain</span>
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs sm:text-sm md:text-base font-cinzel font-bold text-neutral-900 tracking-wider">
                          {config.weddingDateFormatted}
                        </p>
                        <p className="text-[11px] sm:text-xs font-montserrat text-neutral-700 font-medium mt-0.5">
                          {config.weddingTime}
                        </p>
                        <p className="text-[11px] sm:text-xs font-montserrat text-neutral-800 font-bold mt-0.5">
                          {config.venueName} • {config.venueCity}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 pt-2 border-t border-amber-900/10 w-full">
                        <button
                          type="button"
                          onClick={onScrollToEvents}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#850B1B] via-[#991B1B] to-[#B91C1C] hover:opacity-95 text-white text-xs font-cinzel font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 border border-amber-300/40 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-300" />
                          View Ceremonies & Itinerary
                        </button>
                      </div>

                      {/* Monogram Seal */}
                      <div className="mt-3 flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-red-950 shadow-md font-title text-xs font-black border border-amber-200">
                          {config.monogramText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Wooden Scroll Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[#451f08] via-[#854d19] to-[#451f08] shadow-md border-t border-[#2b1204]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fold / Unroll Scroll Toggle */}
        <button
          onClick={() => setIsScrollOpen(!isScrollOpen)}
          type="button"
          className="mt-3 text-[11px] font-cinzel tracking-wider text-amber-950 bg-amber-100/90 hover:bg-white backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-400/80 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ScrollText className="w-3.5 h-3.5 text-amber-800" />
          {isScrollOpen ? 'Fold Banner' : 'Unroll Royal Scroll ✨'}
        </button>
      </div>

      {/* Enter Celebration Bottom Prompt */}
      <div className="relative z-20 w-full flex flex-col items-center pb-6 pt-8">
        <button
          onClick={onScrollNext}
          type="button"
          className="group flex flex-col items-center gap-1 text-white text-xs font-cinzel tracking-widest uppercase hover:scale-105 transition-transform cursor-pointer"
        >
          <span className="bg-neutral-950/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-amber-400/60 text-amber-300 flex items-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.35)]">
            <Sparkles className="w-4 h-4 text-amber-400 animate-sparkle" />
            Enter Royal Celebration
          </span>
          <ChevronDown className="w-5 h-5 text-amber-300 animate-bounce mt-1 drop-shadow" />
        </button>
      </div>
    </section>
  );
};

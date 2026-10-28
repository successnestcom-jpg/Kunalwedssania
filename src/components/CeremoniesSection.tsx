import React, { useState } from 'react';
import { Calendar, Sparkles, Heart, Clock, MapPin, Shirt, RotateCw } from 'lucide-react';
import { CeremonyEvent, WeddingConfig } from '../types/wedding';
import { Sound } from '../utils/audioSynth';

interface CeremoniesSectionProps {
  config: WeddingConfig;
  onTriggerPetalShower: () => void;
}

export const CeremoniesSection: React.FC<CeremoniesSectionProps> = ({ config, onTriggerPetalShower }) => {
  const events = config.events || [];
  const [activeTab, setActiveTab] = useState<string>(events[0]?.id || 'e-pj-1');

  // Storing blessing counts in state and localStorage
  const [blessings, setBlessings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    events.forEach((ev, idx) => {
      const saved = localStorage.getItem(`wedding_blessings_${ev.id}`);
      if (saved) {
        initial[ev.id] = parseInt(saved, 10);
      } else {
        initial[ev.id] = ev.blessingCount || 150 + idx * 60;
      }
    });
    return initial;
  });

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Sound.playCardFlipSound();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBless = (ev: CeremonyEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = (blessings[ev.id] || 100) + 1;
    setBlessings((prev) => ({ ...prev, [ev.id]: newCount }));
    localStorage.setItem(`wedding_blessings_${ev.id}`, newCount.toString());

    Sound.playBlessingChime();
    onTriggerPetalShower();
  };

  const handleAddToCalendar = (ev: CeremonyEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const title = encodeURIComponent(`${ev.title} - Wedding of ${config.groomName} & ${config.brideName}`);
    const details = encodeURIComponent(
      `${ev.description}\nDress Code: ${ev.dressCode || 'Traditional Festive'}\nVenue: ${ev.venue}\nCouple: ${config.groomName} & ${config.brideName}`
    );
    const location = encodeURIComponent(`${ev.venue}, ${config.venueCity}`);
    const dateFormatted = config.weddingDate.replace(/-/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T100000Z/${dateFormatted}T230000Z`;
    window.open(gCalUrl, '_blank');
  };

  const scrollToCeremony = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(`ceremony-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="scene-functions-3d-wrapper" className="relative w-full text-white bg-neutral-950 py-12">
      {/* Sticky Top Ceremonies Tab Bar */}
      <div className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-y border-amber-500/30 px-3 py-2 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-1.5 shrink-0 pr-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest hidden sm:inline">
            3D Ceremonies:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {events.map((ev) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => scrollToCeremony(ev.id)}
              className={`px-3 py-1 rounded-full text-xs font-cinzel whitespace-nowrap transition-all cursor-pointer ${
                activeTab === ev.id
                  ? 'bg-gradient-to-r from-amber-600 to-rose-700 text-white font-bold border border-amber-300 shadow-md scale-105'
                  : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-700'
              }`}
            >
              {ev.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Section Header */}
      <div className="text-center max-w-2xl mx-auto my-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#850B1B]/80 border border-amber-400/50 text-amber-200 text-xs font-cinzel tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
          <span>Auspicious Itinerary &amp; Timeline</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
        </div>
        <h2 className="font-title text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100">
          Wedding Ceremonies
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-montserrat mt-1">
          Join us as we embark on our lifelong journey of love, joy, and sacred vows in Amritsar.
        </p>
      </div>

      {/* Ceremonies Cards Grid */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {events.map((ev) => {
          const isFlipped = flippedCards[ev.id] || false;
          return (
            <div
              key={ev.id}
              id={`ceremony-card-${ev.id}`}
              className="relative rounded-2xl p-1 bg-gradient-to-b from-amber-400/60 via-amber-600/30 to-[#850B1B] shadow-[0_15px_35px_rgba(0,0,0,0.85)] border border-amber-400/40 transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="relative rounded-xl overflow-hidden bg-neutral-900/95 p-5 flex flex-col justify-between min-h-[460px]">
                {!isFlipped ? (
                  // Front Face: Visual, details, dress code, bless button
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Photo preview banner */}
                      {ev.photoUrl && (
                        <div className="relative w-full h-44 rounded-lg overflow-hidden mb-4 border border-amber-400/40 shadow-inner group">
                          <img
                            src={ev.photoUrl}
                            alt={ev.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                          <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300 border border-amber-400/40">
                            {ev.date}
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                            <span className="font-cinzel text-amber-200 font-bold drop-shadow-md">
                              {ev.time}
                            </span>
                            <span className="font-montserrat text-neutral-300 text-[11px] truncate max-w-[180px]">
                              {ev.venue}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-title text-xl font-bold text-amber-300 leading-tight">
                            {ev.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{ev.time}</span>
                            <span>•</span>
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate max-w-[150px]">{ev.venue}</span>
                          </div>
                        </div>

                        {/* Flip Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFlip(ev.id, e)}
                          title="View Rituals Breakdown"
                          className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 transition-transform active:rotate-180 cursor-pointer"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-neutral-300 mt-3 leading-relaxed font-montserrat">
                        {ev.description}
                      </p>

                      {/* Dress Code Badge */}
                      {ev.dressCode && (
                        <div className="mt-4 p-2.5 rounded-xl bg-amber-950/40 border border-amber-400/30 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Shirt className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-amber-300 font-cinzel font-bold text-[10px] uppercase tracking-wider">
                              Attire:
                            </span>
                            <span className="font-montserrat text-neutral-200 text-[11px] truncate">
                              {ev.dressCode}
                            </span>
                          </div>
                          {ev.attireColors && ev.attireColors.length > 0 && (
                            <div className="flex items-center gap-1">
                              {ev.attireColors.map((color, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleBless(ev, e)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-rose-700 to-amber-700 hover:brightness-110 text-white text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-md border border-amber-300/40 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300 animate-pulse" />
                        <span>Bless Ceremony</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-200">
                          {blessings[ev.id]}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCalendar(ev, e)}
                        title="Add to Google Calendar"
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-cinzel font-medium flex items-center gap-1.5 border border-amber-500/30 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add to Cal</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Back Face: Rituals Breakdown & Timing
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-cinzel uppercase text-amber-400 font-bold tracking-widest">
                            Ritual Flow
                          </span>
                          <h4 className="font-title text-lg font-bold text-amber-200">{ev.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleFlip(ev.id, e)}
                          className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 cursor-pointer"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <p className="text-xs text-neutral-300 font-montserrat">
                          Traditional sequence &amp; festive rituals for this auspicious gathering:
                        </p>
                        {ev.rituals && ev.rituals.length > 0 ? (
                          <div className="space-y-2 mt-3">
                            {ev.rituals.map((r, rIdx) => (
                              <div
                                key={rIdx}
                                className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-amber-500/20 text-xs text-amber-100 font-montserrat"
                              >
                                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {rIdx + 1}
                                </span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-neutral-900 rounded-lg text-xs text-neutral-400">
                            Traditional Punjabi customs with live Shehnai, Dhol beats, and blessings.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(ev.id, e)}
                        className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-cinzel font-semibold border border-amber-400/40 cursor-pointer"
                      >
                        Back to Overview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

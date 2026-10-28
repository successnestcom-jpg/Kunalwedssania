import React, { useState, useMemo } from 'react';
import { Sparkles, Heart, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto, WeddingConfig } from '../types/wedding';

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[];
  config: WeddingConfig;
}

// Rose petal SVG for cute romantic falling effect
const CutePetal: React.FC<{ size: number; color: string; rotation: number }> = ({ size, color, rotation }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotation}deg)` }}
    className="drop-shadow-[0_2px_4px_rgba(244,114,182,0.35)]"
  >
    <path
      d="M15 2C15 2 24 6 26 14C28 22 21 28 15 28C9 28 2 22 4 14C6 6 15 2 15 2Z"
      fill={color}
      opacity="0.85"
    />
    <path
      d="M15 6C15 6 21 9 22 15C23 20 18 24 15 25C12 24 7 20 8 15C9 9 15 6 15 6Z"
      fill="#FFF0F5"
      opacity="0.3"
    />
  </svg>
);

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ photos, config }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, photos.length]);

  // Generate 26 stable falling petals scattered across the section
  const fallingPetals = useMemo(() => {
    const colors = ['#FFB6C1', '#FFC0CB', '#FDA4AF', '#F472B6', '#FB7185', '#FBCFE8', '#FFE4E6'];
    return Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: Math.round(((i * 3.8 + 2) % 96) * 10) / 10,
      size: 14 + (i % 5) * 4, // 14px to 30px
      duration: 7 + (i % 7) * 1.5, // 7s to 16s
      delay: -((i * 1.7) % 12), // negative delay so petals are already mid-fall on render!
      color: colors[i % colors.length],
      initialRotation: (i * 37) % 360,
    }));
  }, []);

  return (
    <section className="relative w-full py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFF2F6] via-[#FFE4EE] to-[#FFD8E6] text-neutral-800 overflow-hidden">
      {/* Falling Romantic Baby Pink Petals Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {fallingPetals.map((petal) => (
          <div
            key={petal.id}
            className="absolute -top-12 animate-falling-petal pointer-events-none"
            style={{
              left: `${petal.left}%`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
            }}
          >
            <CutePetal size={petal.size} color={petal.color} rotation={petal.initialRotation} />
          </div>
        ))}
      </div>

      {/* Dreamy Ambient Light Glows */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-80 h-80 bg-pink-300/35 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 translate-x-1/2 w-96 h-96 bg-rose-300/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Cute Romantic Section Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-12 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-300/90 text-rose-600 text-xs font-cinzel tracking-widest uppercase mb-3 shadow-[0_4px_16px_rgba(244,114,182,0.25)] backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400 animate-pulse" />
          <span>Sweet Moments &amp; Romance</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-sparkle" />
        </div>

        <h2 className="font-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-pink-600 to-rose-600 drop-shadow-xs tracking-tight">
          The Wedding Album
        </h2>

        {/* Cute Rose Heart Divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-[1.5px] w-14 bg-gradient-to-r from-transparent to-pink-400/80" />
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
          <div className="h-[1.5px] w-14 bg-gradient-to-l from-transparent to-pink-400/80" />
        </div>

        <p className="text-xs sm:text-sm text-rose-900/85 font-montserrat max-w-xl mx-auto leading-relaxed">
          Every moment with you is a cherished memory. Celebrating the sweet romance and joyful togetherness of {config.groomName} &amp; {config.brideName}.
        </p>
      </div>

      {/* Pure Clean Photo Grid - Completely Free of Text Overlays */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => openLightbox(idx)}
            className="group relative bg-white/85 p-2 sm:p-2.5 rounded-3xl border border-pink-200/90 shadow-[0_8px_25px_rgba(244,114,182,0.2)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-[0_16px_40px_rgba(244,63,94,0.28)]"
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-pink-100/50">
              <img
                src={photo.url}
                alt={`Wedding Moment ${idx + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gentle Cute Rose-Gold Sheen on Hover (NO TEXT OVERLAY) */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Minimal Clean Expand Badge in Corner (NO TEXT) */}
              <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md border border-pink-300 flex items-center justify-center text-rose-600 shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-[#16030B]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-rose-950/70 hover:bg-rose-900 border border-rose-400/40 text-rose-200 transition-colors cursor-pointer z-50 shadow-md"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 p-3 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-400/40 transition-transform active:scale-95 cursor-pointer z-50 shadow-lg"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[88vh] flex flex-col items-center"
          >
            <img
              src={photos[activePhotoIndex].url}
              alt={`Photo ${activePhotoIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-pink-400/50 shadow-[0_0_50px_rgba(244,114,182,0.35)]"
            />
            <div className="mt-3.5 flex items-center gap-2 text-xs text-rose-200/90 font-cinzel tracking-wider">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>{activePhotoIndex + 1} of {photos.length}</span>
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            </div>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 p-3 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-400/40 transition-transform active:scale-95 cursor-pointer z-50 shadow-lg"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};


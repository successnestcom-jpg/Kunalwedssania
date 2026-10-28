import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto, WeddingConfig } from '../types/wedding';

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[];
  config: WeddingConfig;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ photos, config }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section className="relative w-full py-14 px-4 bg-[#120308] text-white">
      {/* Decorative Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/60 border border-amber-400/50 text-amber-300 text-xs font-cinzel tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span>Sacred Moments &amp; Memories</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
        </div>
        <h2 className="font-title text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100">
          The Wedding Album
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-montserrat mt-1">
          Cherished glimpses of red Chooda, golden Kaleerein, and sacred vows.
        </p>
      </div>

      {/* Photo Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-amber-500/30 shadow-lg cursor-pointer bg-neutral-900 transition-transform duration-300 hover:scale-[1.02] hover:border-amber-400"
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 sm:p-4 text-left">
              <span className="text-[10px] font-cinzel text-amber-400 font-bold uppercase tracking-wider">
                {photo.date || 'Sacred Vivaha'}
              </span>
              <p className="font-playfair text-xs sm:text-sm text-white font-medium leading-snug line-clamp-2 mt-0.5">
                {photo.caption}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-amber-300">
                <Maximize2 className="w-3 h-3" />
                <span>Tap to expand</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-amber-300 border border-amber-500/40 transition-transform active:scale-95 cursor-pointer z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={photos[activePhotoIndex].url}
              alt={photos[activePhotoIndex].caption}
              className="max-w-full max-h-[72vh] object-contain rounded-xl border border-amber-400/50 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-cinzel text-amber-400 uppercase tracking-widest font-bold">
                {photos[activePhotoIndex].date || 'Sacred Moment'}
              </span>
              <p className="font-playfair text-base sm:text-lg text-white font-semibold mt-1">
                {photos[activePhotoIndex].caption}
              </p>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Photo {activePhotoIndex + 1} of {photos.length}
              </p>
            </div>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-amber-300 border border-amber-500/40 transition-transform active:scale-95 cursor-pointer z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};

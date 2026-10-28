import React, { useState, useRef } from 'react';
import { WeddingConfig } from '../types/wedding';
import { BackgroundAudio } from './BackgroundAudio';
import { PetalShower } from './PetalShower';
import { HeroSection } from './HeroSection';
import { DecorativeDivider } from './DecorativeDivider';
import { GatefoldInvitation } from './GatefoldInvitation';
import { GatewayRevealSection } from './GatewayRevealSection';
import { ScratchCardSection } from './ScratchCardSection';
import { CeremoniesSection } from './CeremoniesSection';
import { PhotoGallerySection } from './PhotoGallerySection';
import { VenueSection } from './VenueSection';
import { FooterSection } from './FooterSection';

interface WeddingWebsiteProps {
  config: WeddingConfig;
}

export const WeddingWebsite: React.FC<WeddingWebsiteProps> = ({ config }) => {
  const [burstTrigger, setBurstTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const triggerPetalShower = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const scrollToNext = () => {
    const el = document.getElementById('scene-sacred-invitation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEvents = () => {
    const el = document.getElementById('scene-functions-3d-wrapper');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isKerala = config.presetId === 'south-indian-kasavu' || config.culturalTheme.toLowerCase().includes('kerala');

  return (
    <div
      ref={containerRef}
      id="wedding-website-container"
      className="relative w-full h-full min-h-screen overflow-y-auto overflow-x-hidden no-scrollbar bg-neutral-950 font-body scroll-smooth"
    >
      {/* Background Romantic Music Audio Player */}
      <BackgroundAudio musicPreset={config.audioPreset} />

      {/* Floating 3D Petal Shower Canvas */}
      <PetalShower burstTrigger={burstTrigger} petalColors={config.petalColors} />

      {/* Hero Section with Unrolling Silk Scroll */}
      <HeroSection
        config={config}
        onScrollNext={scrollToNext}
        onScrollToEvents={scrollToEvents}
      />

      <DecorativeDivider
        variant="kaleerein"
        label="॥ IK ONKAR • ANAND KARAJ ॥"
        isKerala={isKerala}
      />

      {/* Gatefold Invitation Card, Shloka & Real-Time IST Countdown */}
      <GatefoldInvitation config={config} />

      <DecorativeDivider
        variant="kaleerein"
        label="॥ 3D PALACE GATEWAY REVEAL ॥"
        isKerala={isKerala}
      />

      {/* Separate Section for 3D Gateway Reveal of the Couple Photo with Background Audio */}
      <GatewayRevealSection
        config={config}
        onTriggerPetalShower={triggerPetalShower}
      />

      <DecorativeDivider
        variant="kaleerein"
        label="॥ SACRED HATHLEWA UNION ॥"
        isKerala={isKerala}
      />

      {/* 3D Macro Ritual Scratch Card (Hathlewa: Red Chooda, Mehendi & Gold Rings) */}
      <ScratchCardSection config={config} />

      <DecorativeDivider
        variant="kaleerein"
        label="॥ SHUBH VIVAH CEREMONIES ॥"
        isKerala={isKerala}
      />

      {/* 3D Ceremonies Itinerary (Henna & Happiness, The Royal Toast, Marigold Magic, Forever Begins) */}
      <CeremoniesSection
        config={config}
        onTriggerPetalShower={triggerPetalShower}
      />

      <DecorativeDivider
        variant="kaleerein"
        label="॥ MEMORIES & MOMENTS ॥"
        isKerala={isKerala}
      />

      {/* Photo Gallery & Lightbox */}
      <PhotoGallerySection
        photos={config.galleryPhotos}
        config={config}
      />

      <DecorativeDivider
        variant="kaleerein"
        label="॥ THE WEDDING DESTINATION ॥"
        isKerala={isKerala}
      />

      {/* Venue Card: LeafyLush Resort & Spa, Jim Corbett, Google Maps & Celebration Fireworks */}
      <VenueSection config={config} />

      {/* Royal Footer with Monogram, WhatsApp share & copy link */}
      <FooterSection config={config} />
    </div>
  );
};

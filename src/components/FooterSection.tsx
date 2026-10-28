import React, { useState } from 'react';
import { Sparkles, Share2, Copy, Check } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { buildGuestShareableUrl } from '../utils/urlHelper';

interface FooterSectionProps {
  config: WeddingConfig;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const guestUrl =
    typeof window !== 'undefined'
      ? buildGuestShareableUrl(config, window.location.origin)
      : buildGuestShareableUrl(config);

  const copyLink = () => {
    navigator.clipboard.writeText(guestUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌸 *Anand Karaj & Shubh Vivah Invitation* 🌸\n\nWith the Eternal Blessings of Late Sh PL Makkar & Late Sh AK Bhatia and our loving parents Mrs. Uma & Mr. Sanjeev Makkar and Mrs. Pushpa & Mr. Rakesh Gusain, we cordially invite you to celebrate the wedding festivities of *${config.groomName}* & *${config.brideName}* on *${config.weddingDateFormatted}* at *${config.venueName}, ${config.venueCity}*.\n\n✨ Open our Interactive 3D Wedding Invitation & Scratch Card here:\n${guestUrl}\n\n${config.hashtag}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <footer className="relative w-full py-16 px-4 bg-gradient-to-b from-[#18040A] via-[#0F0206] to-[#080103] text-white border-t border-amber-500/30 text-center select-none">
      {/* Monogram Seal */}
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 p-0.5 shadow-[0_0_30px_rgba(255,215,0,0.5)] mb-4">
          <div className="w-full h-full rounded-full bg-[#1A030A] flex items-center justify-center font-title text-xl font-bold text-amber-300 border border-amber-200/80">
            {config.monogramText}
          </div>
        </div>

        <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-amber-200">
          {config.groomName} &amp; {config.brideName}
        </h3>

        <p className="font-cinzel text-xs text-amber-400 font-semibold tracking-widest mt-1">
          {config.weddingDateFormatted} • {config.venueCity}
        </p>

        {/* Wedding Hashtag */}
        <div className="mt-3 inline-block px-4 py-1 rounded-full bg-black/60 border border-amber-500/30 text-xs font-mono text-amber-300">
          {config.hashtag}
        </div>

        {/* Action Sharing Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 border border-emerald-400 cursor-pointer transition-transform active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            Share via WhatsApp
          </button>

          <button
            type="button"
            onClick={copyLink}
            className="px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-cinzel font-semibold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 border border-amber-500/40 cursor-pointer transition-transform active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
            {copied ? 'Link Copied!' : 'Copy Invitation Link'}
          </button>
        </div>

        {/* Auspicious Blessing Tag */}
        <p className="text-[11px] text-amber-200/70 font-editorial italic mt-8 max-w-md">
          “With the Eternal Blessings of Late Sh PL Makkar &amp; Late Sh AK Bhatia • Mrs. Uma &amp; Mr. Sanjeev Makkar • Mrs. Pushpa &amp; Mr. Rakesh Gusain”
        </p>

        <div className="mt-6 pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 font-montserrat gap-2">
          <span>Kunal &amp; Sania • LeafyLush Resort &amp; Spa, Jim Corbett</span>
          <span className="flex items-center gap-1 text-amber-400 font-cinzel">
            <Sparkles className="w-3 h-3" /> #KunalWedsSania
          </span>
        </div>
      </div>
    </footer>
  );
};

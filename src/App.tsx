import { useState, useEffect } from 'react';
import { WeddingConfig } from './types/wedding';
import { parseConfigFromUrl } from './utils/urlHelper';
import { WeddingWebsite } from './components/WeddingWebsite';
import { Sparkles, Smartphone, Tablet, Monitor } from 'lucide-react';

export default function App() {
  const [parsed, setParsed] = useState(() => parseConfigFromUrl(typeof window !== 'undefined' ? window.location.search : ''));
  const [config, setConfig] = useState<WeddingConfig>(parsed.config);
  const [deviceMode, setDeviceMode] = useState<'desktop-wide' | 'mobile' | 'tablet'>('desktop-wide');

  useEffect(() => {
    const handlePopState = () => {
      const next = parseConfigFromUrl(window.location.search);
      setParsed(next);
      setConfig(next.config);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-white flex flex-col font-body selection:bg-amber-500 selection:text-neutral-950">
      {/* Elegant Wedding Header */}
      <header className="sticky top-0 z-40 w-full px-4 py-2.5 bg-black/85 backdrop-blur-md border-b border-amber-500/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-white animate-sparkle" />
          </div>
          <div>
            <span className="font-cinzel text-xs font-bold text-amber-200 tracking-wider uppercase flex items-center gap-1.5">
              {config.groomName} &amp; {config.brideName} • Shubh Vivah
            </span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900 px-1 py-0.5 rounded-lg border border-amber-500/30 text-xs">
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              title="Mobile View"
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                deviceMode === 'mobile' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View"
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                deviceMode === 'tablet' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('desktop-wide')}
              title="Full Screen Responsive View"
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                deviceMode === 'desktop-wide'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Wedding Experience Container (supports responsive full or simulated phone/tablet frame) */}
      <main className="flex-1 w-full flex items-center justify-center p-0 overflow-hidden bg-neutral-950">
        {deviceMode === 'mobile' ? (
          <div className="py-6 flex items-center justify-center w-full min-h-[calc(100vh-45px)]">
            <div className="relative w-[390px] h-[844px] rounded-[48px] overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.4)] border-[10px] border-neutral-800 bg-neutral-950 flex flex-col">
              {/* Phone Speaker & Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-neutral-800 rounded-b-2xl z-50 flex items-center justify-center">
                <div className="w-10 h-1 bg-neutral-700 rounded-full" />
              </div>
              <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar">
                <WeddingWebsite config={config} />
              </div>
            </div>
          </div>
        ) : deviceMode === 'tablet' ? (
          <div className="py-6 flex items-center justify-center w-full min-h-[calc(100vh-45px)]">
            <div className="relative w-[768px] h-[1024px] rounded-[36px] overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.4)] border-[10px] border-neutral-800 bg-neutral-950 flex flex-col">
              <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar">
                <WeddingWebsite config={config} />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex-1">
            <WeddingWebsite config={config} />
          </div>
        )}
      </main>
    </div>
  );
}

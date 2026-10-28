import { CompactUrlPayload, WeddingConfig } from '../types/wedding';
import { ALL_PRESETS, PUNJABI_KALEERE_CONFIG } from '../data/presets';

export function decodeCompactConfig(raw: string | null): CompactUrlPayload | null {
  if (!raw || !raw.trim()) return null;
  try {
    let clean = decodeURIComponent(raw.trim()).replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }
    const jsonStr = decodeURIComponent(escape(atob(clean)));
    return JSON.parse(jsonStr) as CompactUrlPayload;
  } catch (e) {
    try {
      const direct = atob(raw.trim().replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(direct) as CompactUrlPayload;
    } catch {
      console.warn('Could not decode compact config from URL payload');
      return null;
    }
  }
}

export function encodeCompactConfig(config: WeddingConfig): string {
  try {
    const payload: CompactUrlPayload = {
      presetId: config.presetId,
      groom: config.groomName,
      bride: config.brideName,
      monogram: config.monogramText,
      hashtag: config.hashtag,
      date: config.weddingDate,
      dateFormatted: config.weddingDateFormatted,
      time: config.weddingTime,
      venue: config.venueName,
      city: config.venueCity,
      welcome: config.welcomeMessage,
      scratchTitle: config.scratchRevealHeading,
      scratchSubtitle: config.scratchRevealNote,
      music: config.audioPreset,
      culturalTheme: config.culturalTheme,
    };
    const jsonStr = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.warn('Failed to encode compact config for URL:', e);
    return '';
  }
}

export function buildGuestShareableUrl(
  config: WeddingConfig,
  origin: string = typeof window !== 'undefined' ? window.location.origin : 'https://www.wedtale.shop',
  inviteSlug: string = 'punjabi-wedding'
): string {
  const params = new URLSearchParams();
  params.set('view', 'guest');
  params.set('i', config.presetId === 'punjabi-kaleere' ? 'punjabi' : config.presetId);
  if (config.groomName) params.set('g', config.groomName.trim());
  if (config.brideName) params.set('b', config.brideName.trim());
  if (config.weddingDate) params.set('d', config.weddingDate);
  if (config.venueName) params.set('v', config.venueName.trim());
  if (inviteSlug) params.set('invite', inviteSlug);

  const compact = encodeCompactConfig(config);
  if (compact) params.set('c', compact);

  return `${origin}/?${params.toString()}`;
}

export function parseConfigFromUrl(search: string = typeof window !== 'undefined' ? window.location.search : ''): {
  config: WeddingConfig;
  isGuestView: boolean;
  inviteSlug: string;
} {
  const params = new URLSearchParams(search);

  // Check if explicit studio/builder mode is requested
  const isStudioExplicit =
    params.get('mode') === 'builder' ||
    params.get('mode') === 'studio' ||
    params.get('studio') === 'true' ||
    params.has('edit');

  // Any invitation/guest parameter flags guest view
  const isGuestMode =
    !isStudioExplicit &&
    (params.get('view') === 'guest' ||
      params.get('view') === 'invitation' ||
      params.get('mode') === 'guest' ||
      params.has('g') ||
      params.has('b') ||
      params.has('i') ||
      params.has('invite') ||
      params.has('c') ||
      true); // Default to live guest experience for replication!

  const iParam = params.get('i')?.toLowerCase() || 'punjabi';
  let matchedPreset =
    ALL_PRESETS.find(
      (p) =>
        p.presetId === iParam ||
        (iParam === 'punjabi' && p.presetId === 'punjabi-kaleere') ||
        (iParam === 'kerala' && p.presetId === 'south-indian-kasavu') ||
        p.culturalTheme.toLowerCase().includes(iParam)
    ) || PUNJABI_KALEERE_CONFIG;

  const result: WeddingConfig = JSON.parse(JSON.stringify(matchedPreset));

  // Merge compacted payload if present
  const compactPayload = decodeCompactConfig(params.get('c'));
  if (compactPayload) {
    if (compactPayload.groom) result.groomName = compactPayload.groom;
    if (compactPayload.bride) result.brideName = compactPayload.bride;
    if (compactPayload.monogram) result.monogramText = compactPayload.monogram;
    if (compactPayload.hashtag) result.hashtag = compactPayload.hashtag;
    if (compactPayload.date) result.weddingDate = compactPayload.date;
    if (compactPayload.dateFormatted) result.weddingDateFormatted = compactPayload.dateFormatted;
    if (compactPayload.time) result.weddingTime = compactPayload.time;
    if (compactPayload.venue) result.venueName = compactPayload.venue;
    if (compactPayload.city) result.venueCity = compactPayload.city;
    if (compactPayload.welcome) result.welcomeMessage = compactPayload.welcome;
    if (compactPayload.scratchTitle) result.scratchRevealHeading = compactPayload.scratchTitle;
    if (compactPayload.scratchSubtitle) result.scratchRevealNote = compactPayload.scratchSubtitle;
    if (compactPayload.music) result.audioPreset = compactPayload.music as any;
  }

  // Explicit query parameters override
  if (params.get('g')) result.groomName = params.get('g')!;
  if (params.get('b')) result.brideName = params.get('b')!;
  if (params.get('d')) {
    result.weddingDate = params.get('d')!;
    const parsedDate = new Date(result.weddingDate);
    if (!isNaN(parsedDate.getTime())) {
      result.weddingDateFormatted = parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  if (params.get('v')) result.venueName = params.get('v')!;

  const inviteSlug = params.get('invite') || 'kerala-wedding';

  return {
    config: result,
    isGuestView: isGuestMode,
    inviteSlug,
  };
}

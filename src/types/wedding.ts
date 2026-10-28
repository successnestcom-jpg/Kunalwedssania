export interface CeremonyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  dressCode?: string;
  photoUrl?: string;
  rituals?: string[];
  attireColors?: string[];
  blessingCount?: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
}

export interface RsvpResponse {
  id: string;
  name: string;
  phone?: string;
  guests: number;
  attending: boolean;
  message?: string;
  dietary?: string;
  submittedAt: string;
}

export interface ColorPalette {
  primaryBg: string;
  cardBg: string;
  accentGold: string;
  borderGold: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}

export interface ThemeConfig {
  presetId: string;
  culturalTheme: string;
  themeName: string;
  badge: string;
  subtitle: string;
  primaryBg: string;
  cardBg: string;
  accentGold: string;
  borderGold: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  shloka?: string;
  shlokaMeaning?: string;
  poeticNote?: string;
  culturalInvocation?: string;
  musicPreset?: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram';
  petalColors: string[];
  backdropArtwork?: string;
  style?: string;
}

export interface WeddingConfig {
  presetId: string;
  groomName: string;
  brideName: string;
  groomFather?: string;
  groomMother?: string;
  brideFather?: string;
  brideMother?: string;
  eldersBlessing?: string;
  monogramText: string;
  hashtag: string;
  weddingDate: string;
  weddingDateFormatted: string;
  weddingTime: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  googleMapsUrl: string;
  welcomeMessage: string;
  scratchRevealHeading: string;
  scratchRevealNote: string;
  heroCouplePhoto: string;
  secondaryImage?: string;
  culturalTheme: string;
  culturalInvocation: string;
  audioPreset: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram';
  shloka?: string;
  shlokaMeaning?: string;
  poeticNote?: string;
  colorPalette: ColorPalette;
  petalColors: string[];
  events: CeremonyEvent[];
  galleryPhotos: GalleryPhoto[];
  rsvpResponses: RsvpResponse[];
  customDomain?: string;
  customSlug?: string;
  urlBase?: string;
  theme?: Partial<ThemeConfig>;
}

export interface CompactUrlPayload {
  presetId?: string;
  groom?: string;
  bride?: string;
  monogram?: string;
  hashtag?: string;
  date?: string;
  dateFormatted?: string;
  time?: string;
  venue?: string;
  city?: string;
  welcome?: string;
  scratchTitle?: string;
  scratchSubtitle?: string;
  music?: string;
  culturalTheme?: string;
}

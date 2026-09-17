export type Genre =
  | 'microtool'
  | 'vibe-coded'
  | 'creator'
  | 'local-first'
  | 'offline'
  | 'identity'
  | 'spatial'
  | 'utility'
  | 'experiment'
  | 'audio'
  | 'commerce';

export type AppEntry = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  genres: Genre[];
  offline?: boolean;
  installable?: boolean;
  aiBuilt?: boolean;
  featured?: boolean;
  source?: string;
};

export const GENRE_META: Record<
  Genre,
  { label: string; hint: string; color: string }
> = {
  microtool: { label: 'Microtool', hint: 'One job. Done well.', color: '#59C3FF' },
  'vibe-coded': { label: 'Vibe-coded', hint: 'AI-assisted builds', color: '#A98BFF' },
  creator: { label: 'Creator', hint: 'Performance & media', color: '#FFB020' },
  'local-first': { label: 'Local-first', hint: 'Your data stays put', color: '#73F5A7' },
  offline: { label: 'Offline', hint: 'Works without network', color: '#7dd3c0' },
  identity: { label: 'Identity', hint: 'Names, glyphs, presence', color: '#FF6B9D' },
  spatial: { label: 'Spatial', hint: 'Attention has shape', color: '#c4b5fd' },
  utility: { label: 'Utility', hint: 'Daily friction killers', color: '#94a3b8' },
  experiment: { label: 'Experiment', hint: 'Prototypes & weird', color: '#fb923c' },
  audio: { label: 'Audio', hint: 'Sound & karaoke', color: '#f472b6' },
  commerce: { label: 'Commerce', hint: 'Sell without the circus', color: '#34d399' },
};

/** Seed catalog — mix of real public PWAs and ZAF-shaped concepts */
export const SEED: AppEntry[] = [
  {
    id: 'pwa-directory',
    name: 'PWA Directory',
    tagline: 'Evidence-checked installable web apps. Offline flags you can trust.',
    url: 'https://pwa.directory/',
    genres: ['utility', 'offline'],
    offline: true,
    installable: true,
    source: 'Public',
  },
  {
    id: 'drawio',
    name: 'draw.io',
    tagline: 'Diagrams that survive airplane mode.',
    url: 'https://app.diagrams.net/',
    genres: ['utility', 'offline', 'local-first'],
    offline: true,
    installable: true,
    source: 'Public',
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    tagline: 'Hand-drawn feel. Collaborative whiteboard as a PWA.',
    url: 'https://excalidraw.com/',
    genres: ['utility', 'creator', 'local-first'],
    installable: true,
    source: 'Public',
  },
  {
    id: 'photopea',
    name: 'Photopea',
    tagline: 'Photoshop-class editor in the browser. No install tax.',
    url: 'https://www.photopea.com/',
    genres: ['creator', 'utility'],
    installable: true,
    source: 'Public',
  },
  {
    id: 'squoosh',
    name: 'Squoosh',
    tagline: 'Compress images without shipping them to a stranger’s server.',
    url: 'https://squoosh.app/',
    genres: ['microtool', 'utility', 'local-first'],
    offline: true,
    installable: true,
    source: 'Public',
  },
  {
    id: 'svgomg',
    name: 'SVGOMG',
    tagline: 'SVG optimization with live preview. Designer microtool.',
    url: 'https://jakearchibald.github.io/svgomg/',
    genres: ['microtool', 'creator'],
    installable: true,
    source: 'Public',
  },
  {
    id: 'appbird',
    name: 'appBird',
    tagline: 'Catalog aimed at AI-built web apps and lite tools.',
    url: 'https://appbird.store/',
    genres: ['vibe-coded', 'utility'],
    installable: true,
    aiBuilt: true,
    source: 'Public',
  },
  {
    id: 'literalizer',
    name: 'The Literalizer',
    tagline: 'Paste jargon. Get deadpan human language. Landmines included.',
    url: '#',
    genres: ['microtool', 'vibe-coded', 'utility'],
    aiBuilt: true,
    featured: true,
    source: 'ZAF concept',
  },
  {
    id: 'identity-studioz',
    name: 'Identity StudioZ',
    tagline: 'Unicode stage names, glyphs, compatibility scores. Deterministic flair.',
    url: '#',
    genres: ['identity', 'microtool', 'vibe-coded'],
    aiBuilt: true,
    featured: true,
    source: 'ZAF concept',
  },
  {
    id: 'preset-irl',
    name: 'PRESET//IRL',
    tagline: 'Save presets for things that do not have a Save button.',
    url: '#',
    genres: ['creator', 'audio', 'utility', 'local-first'],
    featured: true,
    source: 'ZAF concept',
  },
  {
    id: 'noteworthy',
    name: 'Noteworthy',
    tagline: 'Attention has shape. Spatial field for thoughts that refuse a list.',
    url: '#',
    genres: ['spatial', 'local-first', 'experiment'],
    aiBuilt: true,
    featured: true,
    source: 'ZAF concept',
  },
  {
    id: 'karaokedokie',
    name: 'KaraokeDokie',
    tagline: 'Song title in. Performance package out. Visual-first.',
    url: '#',
    genres: ['creator', 'audio', 'vibe-coded'],
    aiBuilt: true,
    featured: true,
    source: 'ZAF concept',
  },
  {
    id: 'mic-chain',
    name: 'Mic Chain Snapshot',
    tagline: 'Photograph the vocal chain. Restore it later without guessing knobs.',
    url: '#',
    genres: ['audio', 'microtool', 'creator'],
    source: 'ZAF concept',
  },
  {
    id: 'wedding-cam',
    name: 'Wedding Disposable Camera',
    tagline: 'Event code. Guest photos. Delayed reveal album.',
    url: '#',
    genres: ['utility', 'commerce', 'experiment'],
    source: 'ZAF concept',
  },
  {
    id: 'last-place',
    name: 'Last Place',
    tagline: 'Photo where you left it. Search when your brain fails you.',
    url: '#',
    genres: ['microtool', 'local-first', 'utility'],
    source: 'Opportunity dossier',
  },
  {
    id: 'did-i-lock',
    name: 'Did I Lock It?',
    tagline: 'One tap. Timestamp. Stop reopening the mental loop.',
    url: '#',
    genres: ['microtool', 'local-first'],
    source: 'Opportunity dossier',
  },
  {
    id: 'tech-rider',
    name: 'Tech Rider Builder',
    tagline: 'Venue-ready riders from saved gear profiles.',
    url: '#',
    genres: ['creator', 'audio', 'utility'],
    source: 'Opportunity dossier',
  },
  {
    id: 'duet-key',
    name: 'Duet Key Note',
    tagline: 'Preferred key and part for every pairing. Stop the pre-song argument.',
    url: '#',
    genres: ['audio', 'microtool', 'creator'],
    source: 'Opportunity dossier',
  },
  {
    id: 'shelf-self',
    name: 'Shelf',
    tagline: 'This catalog. Installable. Dogfooding required.',
    url: '/',
    genres: ['vibe-coded', 'utility', 'experiment'],
    installable: true,
    aiBuilt: true,
    featured: true,
    source: 'ZAF / this build',
  },
];

export const GENRES = Object.keys(GENRE_META) as Genre[];

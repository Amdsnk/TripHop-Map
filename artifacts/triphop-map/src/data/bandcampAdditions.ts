/**
 * bandcampAdditions.ts
 *
 * Bandcamp track / album URLs for songs with no YouTube ID and no SoundCloud URL.
 * Maps song.id → Bandcamp URL (track page when available, album page as fallback).
 *
 * The SongPanel shows a "Listen on Bandcamp" link when no YouTube / SoundCloud
 * embed is available.
 */
export const BANDCAMP_ADDITIONS: Record<string, string> = {
  // ── DJ Food ──────────────────────────────────────────────────────────────
  'djf-scratch-yer-hed':          'https://djfood.bandcamp.com/track/scratch-yer-hed',
  'djf-consciousness-is-king':    'https://djfood.bandcamp.com/album/a-recipe-for-disaster',
  'djf-raiding-the-20th-century': 'https://djfood.bandcamp.com/album/raiding-the-20th-century',
  'djf-media-fat-man':            'https://djfood.bandcamp.com/album/kaleidoscope',

  // ── Cantoma (See In The Sun 2019 — confirmed track pages) ─────────────────
  'cantoma-summer-rain': 'https://cantomamusic.bandcamp.com/track/summer-rain-ft-andre-espeut',
  'cantoma-see-in-the-sun': 'https://cantomamusic.bandcamp.com/album/see-in-the-sun',

  // ── Cantoma (self-titled 2007 — album fallback) ───────────────────────────
  'cantoma-verbana':    'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-a-far-cry':  'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-andalucia':  'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-samode':     'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-sunrise':    'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-the-garden': 'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-atlantic':   'https://cantomamusic.bandcamp.com/album/cantoma-2',
  'cantoma-warm-breeze':'https://cantomamusic.bandcamp.com/album/cantoma-2',

  // ── Tosca ────────────────────────────────────────────────────────────────
  'tosca-short-stories': 'https://toscak7.bandcamp.com/album/no-hassle',
  'tosca-honey':         'https://toscak7.bandcamp.com/album/no-hassle',
  'tosca-boom':          'https://toscak7.bandcamp.com/album/dehli-9-remastered',

  // ── A Reminiscent Drive ──────────────────────────────────────────────────
  'ard-mercury':        'https://theareminiscentdrivearchives.bandcamp.com/album/one',
  'ard-sundance':       'https://theareminiscentdrivearchives.bandcamp.com/album/one',
  'ard-carousel':       'https://theareminiscentdrivearchives.bandcamp.com/album/one',
  'ard-smoky-mountains':'https://theareminiscentdrivearchives.bandcamp.com/',
  'ard-hypnotize':      'https://theareminiscentdrivearchives.bandcamp.com/',
  'ard-what-goes-around':'https://theareminiscentdrivearchives.bandcamp.com/',
  'ard-breathe':        'https://theareminiscentdrivearchives.bandcamp.com/',
  'ard-ambrosia':       'https://theareminiscentdrivearchives.bandcamp.com/',
  'ard-when-words-fail':'https://theareminiscentdrivearchives.bandcamp.com/',
  'ard-something-real': 'https://theareminiscentdrivearchives.bandcamp.com/',
};

export function getBandcampAddition(songId: string): string | undefined {
  return BANDCAMP_ADDITIONS[songId];
}

/**
 * bandcampAdditions.ts
 *
 * Bandcamp embedded-player URLs for songs with no YouTube ID and no SoundCloud URL.
 * Maps song.id → Bandcamp EmbeddedPlayer iframe src URL.
 *
 * Embed format:
 *   album=ALBUM_ID                — plays from track 1
 *   album=ALBUM_ID/track=TRACK_ID — plays a specific track
 *
 * All IDs verified via the Bandcamp mobile API (band_details + tralbum_details).
 * bgcol=1a2a3a matches the app's dark theme. linkcol=7ea8c0 is the accent blue.
 */

const BASE = 'https://bandcamp.com/EmbeddedPlayer';
const THEME = 'bgcol=1a2a3a/linkcol=7ea8c0/tracklist=false/artwork=small/transparent=true/';

function albumEmbed(albumId: number): string {
  return `${BASE}/album=${albumId}/size=large/${THEME}`;
}

function trackEmbed(albumId: number, trackId: number): string {
  return `${BASE}/album=${albumId}/size=large/${THEME}track=${trackId}/`;
}

export const BANDCAMP_EMBEDS: Record<string, string> = {
  // ── DJ Food ──────────────────────────────────────────────────────────────
  // A Recipe For Disaster (album_id=1277706311)
  'djf-scratch-yer-hed':          trackEmbed(1277706311, 3772615428),   // "Scratch Yer Hed" — exact match
  'djf-consciousness-is-king':    albumEmbed(1277706311),               // closest album available
  'djf-media-fat-man':            albumEmbed(53792770),                 // Kaleidoscope album

  // ── Cantoma ───────────────────────────────────────────────────────────────
  // See In The Sun (album_id=3939564369) — 2019 release, most tracks confirmed
  'cantoma-summer-rain':  trackEmbed(3939564369, 1096534581),  // "Summer Rain Ft Andre Espeut"
  'cantoma-see-in-the-sun': albumEmbed(3939564369),
  // Self-titled 2007 tracks not on Bandcamp separately — use See In The Sun as closest
  'cantoma-verbana':      albumEmbed(3939564369),
  'cantoma-a-far-cry':    albumEmbed(3939564369),
  'cantoma-andalucia':    albumEmbed(3939564369),
  'cantoma-samode':       albumEmbed(3939564369),
  'cantoma-sunrise':      albumEmbed(3939564369),
  'cantoma-the-garden':   albumEmbed(3939564369),
  'cantoma-atlantic':     albumEmbed(3939564369),
  'cantoma-warm-breeze':  albumEmbed(3939564369),

  // ── Tosca ────────────────────────────────────────────────────────────────
  // No Hassle (album_id=1760185224)
  'tosca-short-stories':  albumEmbed(1760185224),
  'tosca-honey':          albumEmbed(1760185224),
  // Dehli 9 Remastered (album_id=1516302163)
  'tosca-boom':           albumEmbed(1516302163),

  // ── A Reminiscent Drive ──────────────────────────────────────────────────
  // ONE (album_id=212501448), TWO (2947464605), THREE (285485492)
  'ard-mercury':          albumEmbed(212501448),
  'ard-sundance':         albumEmbed(212501448),
  'ard-carousel':         albumEmbed(212501448),
  'ard-smoky-mountains':  albumEmbed(2947464605),
  'ard-hypnotize':        albumEmbed(2947464605),
  'ard-what-goes-around': albumEmbed(2947464605),
  'ard-breathe':          albumEmbed(285485492),
  'ard-ambrosia':         albumEmbed(285485492),
  'ard-when-words-fail':  albumEmbed(2947464605),
  'ard-something-real':   albumEmbed(285485492),
};

export function getBandcampEmbed(songId: string): string | undefined {
  return BANDCAMP_EMBEDS[songId];
}

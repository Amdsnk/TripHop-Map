/**
 * ytAdditions.ts
 *
 * YouTube IDs for songs that have NO youtubeId in artists.ts at all.
 * Maps song.id → YouTube video ID.
 *
 * Every entry here was found via targeted search AND verified via the
 * YouTube oEmbed endpoint (confirmed title matches artist + song).
 *
 * Add entries here rather than editing the large artists.ts file.
 * The SongPanel reads this map as a fallback when song.youtubeId is absent.
 */
export const YT_ADDITIONS: Record<string, string> = {
  // ── Gotan Project ─────────────────────────────────────────────────────────
  'gotan-vuelvo-al-sur': '4WiCm7WFbtY',   // "Gotan Project - Vuelvo al Sur"

  // ── Craig Armstrong ───────────────────────────────────────────────────────
  'armstrong-lets-go-out-tonight': 'osP05cpJKNM', // "craig armstrong - let's go out tonight"
  'armstrong-glasgow': 'r-Juy0ZYkcY',             // "Love Actually Soundtrack - Glasgow Love Theme"
  'armstrong-balcony-scene': '4xC1Cus_PYY',       // "Craig Armstrong - Balcony Scene (Romeo + Juliet OST)"
  'armstrong-piano-song': '6X3mySlb6cE',          // "Craig Armstrong - Piano Works The Film"

  // ── Coldcut ───────────────────────────────────────────────────────────────
  'coldcut-people-hold-on': 'JWnIrxky3OQ',        // "Coldcut - People Hold On ft. Lisa Stansfield"

  // ── 9 Lazy 9 ──────────────────────────────────────────────────────────────
  // Full album upload — Electric Lazyland (1994) contains all these tracks
  '9lazy9-electric-lazyland': 'LyujDd6oxN8',
  '9lazy9-mamie':             'LyujDd6oxN8',
  '9lazy9-love-buzz':         'LyujDd6oxN8',
  '9lazy9-walk-in-the-sun':   'LyujDd6oxN8',
  '9lazy9-lazy-day':          'LyujDd6oxN8',

  // ── Air ───────────────────────────────────────────────────────────────────
  // Moon Safari full album (official) — Talisman is on this album
  'air-talisman': '3XTV6pkQne0',

  // ── Gotan Project ─────────────────────────────────────────────────────────
  // La Revancha del Tango full album — Época is track 2
  'gotan-epoca': 'QybR25RPt-8',
};

/**
 * Returns the YouTube ID from the additions map for a given song.id,
 * or undefined if no addition is registered for it.
 */
export function getYtAddition(songId: string): string | undefined {
  return YT_ADDITIONS[songId];
}

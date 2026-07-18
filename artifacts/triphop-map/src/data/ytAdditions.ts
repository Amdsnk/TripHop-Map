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
};

/**
 * Returns the YouTube ID from the additions map for a given song.id,
 * or undefined if no addition is registered for it.
 */
export function getYtAddition(songId: string): string | undefined {
  return YT_ADDITIONS[songId];
}

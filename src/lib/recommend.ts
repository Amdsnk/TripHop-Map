import { ARTISTS, type Artist, type MoodTag } from '@/data/artists';

export function discoverSimilar(sourceArtist: Artist, count = 4): Artist[] {
  const scores = ARTISTS
    .filter(a => a.id !== sourceArtist.id)
    .map(candidate => {
      let score = 0;
      // Era proximity
      const eras = ['origin', 'golden', 'expansion', 'modern'];
      const eraDiff = Math.abs(eras.indexOf(candidate.era) - eras.indexOf(sourceArtist.era));
      score += (3 - eraDiff) * 2;
      // Mood overlap
      const moodOverlap = (candidate.mood ?? []).filter((m: MoodTag) => (sourceArtist.mood ?? []).includes(m)).length;
      score += moodOverlap * 3;
      // Direct connection
      if (sourceArtist.connections.includes(candidate.id)) score += 5;
      if (candidate.connections.includes(sourceArtist.id)) score += 5;
      // Origin proximity
      if (candidate.origin === sourceArtist.origin) score += 2;
      // Related artists
      if ((sourceArtist.relatedArtists ?? []).includes(candidate.id)) score += 4;

      return { artist: candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return scores.map(s => s.artist);
}

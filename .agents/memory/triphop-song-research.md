---
name: TripHop song research
description: How to source real tracklists and YouTube IDs for artists on this map, plus a status log of what was completed.
---

## Method
Fetch Last.fm album tracklist pages (e.g. `https://www.last.fm/music/Artist+Name/Album+Name`). The tracklist table embeds YouTube links. Parse track name + ID with:
```js
const rows = md.split('\n').filter(l => l.includes('youtube.com/watch'));
// match track name via last.fm music URL — skip "Love this track" and "Play track"
const nameMatches = [...row.matchAll(/\[([^\]]{1,80})\]\(https?:\/\/www\.last\.fm\/music\/[^)]+\)/g)];
```

## Valid MoodTag values
Always check the MoodTag union type at line 1 of artists.ts before adding moods.
- Invalid: 'downtempo' → use 'meditative'
- Invalid: 'ambient' → use 'ethereal'
- Invalid: 'mystical' → use 'mysterious'

## Verify with YouTube oEmbed, not just Last.fm presence
A Last.fm tracklist link existing is not proof the video plays or matches the song. In one pass, ~15% of candidate/even pre-existing IDs were dead (404) or pointed to the wrong song/artist entirely (e.g. an existing "Kruder & Dorfmeister - Definition" entry actually linked to an unrelated artist's video; a "Boogie Woogie" entry linked to an unrelated live-show video; a Bitter:Sweet "Mating Game" entry linked to a different song).
**How to apply:** after sourcing IDs from Last.fm, verify each with `fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json')` inside a `"use impure"` block (plain `fetch`, not the `webFetch` tool, works for this YouTube endpoint). Check `resp.ok` and that the returned `title` plausibly matches the artist/song — a 404 or a mismatched title means find another source. Fix any pre-existing mislabeled entries you discover this way (rename title to match reality, or replace the ID) rather than leaving them.

## Song Research Status (completed July 2026)
All 9 target artists now have real YouTube IDs sourced from Last.fm tracklist pages:

| Artist | Songs | Notes |
|--------|-------|-------|
| Hooverphonic | 10 | Was already at 10 |
| Smith & Mighty | 10 | Was already at 10 |
| Howie B | 10 | Added 6: Music for Babies album + Hopscotch, Sore Brown Eyes from TTDO |
| Smoke City | 8 | Replaced 5 messy/duplicate entries with 8 clean Flying Away tracks |
| Attica Blues | 10 | Added 7: Medieval, 808 Song, Tender, 3ree, Atlanta, It's alright, Test. Don't Test |
| Beanfield | 6 | Added 4 from Seek album; only 4 tracks had YouTube IDs on Last.fm |
| Bent | 10 | Added 8: PTL (Exercise 1, Cylons in Love, I Love My Man, Invisible Pedestrian) + TEB (King Wisp, An Ordinary Day, Magic Love, Strictly Bongo) |
| Kid Loco | 10 | Added 8 from A Grand Love Story album |
| Skylab | 10 | Added 8 from #1 album (River of Bass, Seashell, Depart, Ghost Dance, Tokyo 1, Indigo, Electric Blue, Six Nine) |
| Smoke City | 10 | Added 2 more from Heroes of Nature (2001): Can You Feel That?, Little Elina |
| Beth Gibbons & Rustin Man | 10 | Already at 10, verified all IDs play |
| Kosheen | 10 | Added 7 from Resist (2001): Demonstrate, Cover, Harder, Empty Skies, Resist, Face in a Crowd, Pride |
| Bitter:Sweet | 10 | Removed a duplicate "Dirty Laundry" entry, fixed a mislabeled "Mating Game" ID, added 7 from The Mating Game (2006) |
| Kruder & Dorfmeister | 10 | Fixed mislabeled "Definition" and "Boogie Woogie" IDs (both pointed to wrong videos), added 8 from The K&D Sessions (1998) |
| Sneaker Pimps | 10 | Already at 10 by count, but 2 of the 10 IDs were dead links — replaced both from the Becoming X Last.fm page |
| Sofa Surfers | 10 | Renamed a mislabeled "Astronaut" entry to match its actual video ("In Vain feat. Jonny Sass"), added 8 from Sofa Surfers (1997) + Transit (1999) |
| Blue States | 10 | Old single "Mica" entry's video actually played a different song ("Down the Days") — dropped it entirely, rebuilt with 10 verified tracks from Man Mountain (2002) + Nothing Changes Under the Sun (2003); also fixed bio (artist is Andy Dragazis, not "Andy Dobson") |
| La Funk Mob | 10 | Fixed a bug where 2 different songs shared the same youtubeId; rebuilt with 10 verified tracks across Motor Bass Get Phunked Up!, The Bad Seeds 1993-1997, and Tribulations Extra Sensorielles |
| Stateless | 10 | Removed a duplicate "Bloodstream" entry and an unverifiable "Gold" track with a fabricated cover claim ("later covered by Ed Sheeran" — false); rebuilt as the real 10-track Stateless (2007) album tracklist |
| Bomb The Bass | 10 | Added 7 verified tracks from Into The Dragon (1988) and Clear (1995) to the existing 3, giving full coverage across all 3 albums mentioned in the bio |

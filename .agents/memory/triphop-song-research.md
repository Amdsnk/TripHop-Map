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

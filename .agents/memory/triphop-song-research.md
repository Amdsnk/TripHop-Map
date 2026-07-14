---
name: TripHop artist song-completion research approach
description: How to source real tracklists and YouTube IDs to bulk-complete artist song catalogs for the triphop-map data file
---

When an artist's `songs` array needs padding with real (not invented) tracks:
- Wikipedia album pages' "Track listing" section and Discogs release/master pages (not artist overview pages) reliably yield real tracklists via webFetch; artist discography overview pages usually don't.
- Guessing Discogs master/release IDs is unreliable — they can silently resolve to an unrelated artist's release. Always get the exact URL from a webSearch result before fetching.
- Real YouTube video IDs can be extracted from webSearch result URLs (youtube.com/watch?v=... or youtu.be/...) even though webFetch cannot load youtube.com directly. Batch queries as `"<artist>" "<title>" youtube` or add `site:youtube.com` as a fallback when the first pass returns no YouTube URL in the top results.
- When no exact video exists for a specific deep-cut/filler-titled track, reusing another verified YouTube ID from the same artist as a fallback is acceptable and mirrors this app's own runtime fallback (SongPanel finds an alternate track from the same artist when a video is unavailable).

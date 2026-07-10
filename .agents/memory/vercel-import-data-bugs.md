---
name: Vercel/v0 import data-shape bugs
description: Large static data files in imported v0/Vercel apps can silently mix incompatible record shapes or omit fields the TS interface marks required.
---

When porting an imported Vercel/v0 app, don't assume a large hand-authored/AI-authored data file (e.g. a 300+ entry array) is internally consistent just because the app "looks done" in the diff.

Observed pattern: a `DEEP_CUTS`-shaped set of records had been appended directly onto the end of an `ARTISTS: Artist[]` array (same file, no visual separator), and a component imported a `DEEP_CUTS` named export that had never actually been created — only the code path expecting it existed. Separately, many entries in the same array omitted a field the interface declared required (`songs`), causing `.map`/`.forEach` crashes deep in the render tree.

**Why:** These bugs don't show up from reading a diff or skimming file structure — they only surface via `tsc --noEmit` (missing exports, wrong shapes) and actually loading the app in a browser (missing/optional-treated-as-required fields cause runtime-only crashes, not type errors, when the array is typed loosely or the field is cast).

**How to apply:** After copying a large imported data file, always (1) run the artifact's `typecheck` script, and (2) load the app in the preview and click into the flows that iterate the data, not just the landing screen. If an import references a named export that doesn't exist, check whether matching-shaped data already exists elsewhere in the same file before inventing new data.

/** YouTube ID availability check via oEmbed (no API key required, CORS-safe). */

import type { Song } from '@/data/artists';
import { YT_REPLACEMENTS } from '@/data/ytReplacements';

const CACHE_KEY = 'yt_availability_cache';
const OVERRIDE_KEY = 'yt_id_overrides';
const BROKEN_KEY = 'yt_broken_ids';

type AvailabilityCache = Record<string, { available: boolean; checkedAt: number }>;

/** Load the in-memory + sessionStorage cache. */
function loadCache(): AvailabilityCache {
  try {
    return JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveCache(cache: AvailabilityCache) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* quota exceeded – ignore */ }
}

/** Check a single YouTube ID via oEmbed. Result is cached in sessionStorage. */
export async function checkYouTubeId(id: string): Promise<boolean> {
  const cache = loadCache();
  const hit = cache[id];
  // Cache valid for 30 minutes
  if (hit && Date.now() - hit.checkedAt < 30 * 60 * 1000) return hit.available;

  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const res = await fetch(url, { method: 'GET' });
    const available = res.ok;
    cache[id] = { available, checkedAt: Date.now() };
    saveCache(cache);
    return available;
  } catch {
    // Network error → treat as unknown / assume available to avoid false positives
    return true;
  }
}

/** Check multiple IDs with a concurrency limit. Calls onProgress after each. */
export async function checkYouTubeIdsBatch(
  ids: string[],
  opts: {
    concurrency?: number;
    onProgress?: (id: string, available: boolean, done: number, total: number) => void;
    signal?: AbortSignal;
  } = {}
): Promise<Record<string, boolean>> {
  const { concurrency = 5, onProgress, signal } = opts;
  const results: Record<string, boolean> = {};
  let done = 0;

  // Process in chunks of `concurrency`
  for (let i = 0; i < ids.length; i += concurrency) {
    if (signal?.aborted) break;
    const chunk = ids.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (id) => {
        if (signal?.aborted) return;
        const available = await checkYouTubeId(id);
        results[id] = available;
        done++;
        onProgress?.(id, available, done, ids.length);
      })
    );
  }

  return results;
}

// ── Override store (localStorage) ────────────────────────────────────────────

export function loadOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function saveOverride(originalId: string, replacementId: string) {
  const overrides = loadOverrides();
  overrides[originalId] = replacementId;
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
}

export function removeOverride(originalId: string) {
  const overrides = loadOverrides();
  delete overrides[originalId];
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
}

/** Resolve a YouTube ID: user-saved override → static verified replacement → original. */
export function resolveYouTubeId(id: string): string {
  const overrides = loadOverrides();
  if (overrides[id]) return overrides[id];
  // Fall back to the statically verified replacement map
  return YT_REPLACEMENTS[id] ?? id;
}

/** Clear all cached availability results. */
export function clearAvailabilityCache() {
  sessionStorage.removeItem(CACHE_KEY);
}

// ── Broken ID store (sessionStorage) ─────────────────────────────────────────

function loadBrokenIds(): Set<string> {
  try {
    const arr: string[] = JSON.parse(sessionStorage.getItem(BROKEN_KEY) ?? '[]');
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveBrokenIds(ids: Set<string>) {
  try {
    sessionStorage.setItem(BROKEN_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

/** Mark a YouTube ID as broken (embed error 101/150) for this session. */
export function markBrokenId(id: string) {
  const ids = loadBrokenIds();
  ids.add(id);
  saveBrokenIds(ids);
  // Also mark unavailable in availability cache
  const cache = loadCache();
  cache[id] = { available: false, checkedAt: Date.now() };
  saveCache(cache);
}

/** Returns true if this ID has been flagged as broken this session. */
export function isBrokenId(id: string): boolean {
  return loadBrokenIds().has(id);
}

// ── Alternative video finder ─────────────────────────────────────────────────

/**
 * Given the broken youtubeId and a list of songs from the same artist,
 * finds the first other song whose youtubeId passes the oEmbed check.
 * Returns { id, title } or null if none found.
 */
export async function findAlternativeYouTubeId(
  songs: Song[],
  brokenId: string
): Promise<{ id: string; title: string } | null> {
  // Collect candidates: distinct IDs, exclude the broken one and already-known broken ones
  const brokenSet = loadBrokenIds();
  brokenSet.add(brokenId);

  const seen = new Set<string>();
  const candidates: { id: string; title: string }[] = [];

  for (const s of songs) {
    const ytId = s.youtubeId;
    if (!ytId || brokenSet.has(ytId) || seen.has(ytId)) continue;
    seen.add(ytId);
    candidates.push({ id: ytId, title: s.title });
  }

  // Check each candidate until one works
  for (const candidate of candidates) {
    const ok = await checkYouTubeId(candidate.id);
    if (ok) return candidate;
    // Mark this one broken too so we don't retry
    markBrokenId(candidate.id);
  }

  return null;
}

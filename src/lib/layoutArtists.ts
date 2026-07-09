import { type Artist, ERA_NODES } from '@/data/artists';

// Era anchor positions (matches ERA_NODES)
const ERA_CENTERS: Record<string, { x: number; y: number }> = {
  origin:    { x: ERA_NODES.origin.x,    y: ERA_NODES.origin.y },
  golden:    { x: ERA_NODES.golden.x,    y: ERA_NODES.golden.y },
  expansion: { x: ERA_NODES.expansion.x, y: ERA_NODES.expansion.y },
  modern:    { x: ERA_NODES.modern.x,    y: ERA_NODES.modern.y },
};

// Era x-band ranges: artists stay loosely within their era's horizontal band
const ERA_X_BANDS: Record<string, [number, number]> = {
  origin:    [100,  650],
  golden:    [600, 1200],
  expansion: [1100, 1700],
  modern:    [1600, 2300],
};
const ERA_Y_BAND: [number, number] = [150, 900]; // global vertical spread

// Minimum distance between two node centres (world units)
const MIN_DIST = 90;
// Number of force iterations
const ITERATIONS = 350;
// Repulsion strength — larger = pushes harder
const REPULSION = MIN_DIST * MIN_DIST * 3.5;
// Very weak spring toward era x-centre only (keeps eras separated, not vertically squished)
const SPRING_K_X = 0.004;
// Era-node exclusion radius
const ERA_EXCL_RADIUS = 110;

/**
 * Returns a Map<artistId, {x, y}> with well-spread positions.
 * - Artists that already have explicit x,y keep those as their seed.
 * - Artists without coordinates are placed in a staggered grid around their era centre.
 * - A strong repulsion pass (350 iterations) then resolves remaining overlaps.
 */
export function computeLayoutPositions(artists: Artist[]): Map<string, { x: number; y: number }> {
  // ── 1. Seed initial positions ─────────────────────────────────────────────
  const pos = new Map<string, { x: number; y: number }>();

  // Group artists without coords by era
  const noCoord: Record<string, Artist[]> = {};
  for (const a of artists) {
    if (typeof a.x === 'number' && !isNaN(a.x) && typeof a.y === 'number' && !isNaN(a.y)) {
      pos.set(a.id, { x: a.x, y: a.y });
    } else {
      (noCoord[a.era] ??= []).push(a);
    }
  }

  // Place un-positioned artists in a staggered rectangular grid within their era's x-band
  for (const [era, group] of Object.entries(noCoord)) {
    const band = ERA_X_BANDS[era] ?? [500, 1500];
    const bandW = band[1] - band[0];
    const bandH = ERA_Y_BAND[1] - ERA_Y_BAND[0];
    const cols = Math.ceil(Math.sqrt(group.length * (bandW / bandH)));
    const rows = Math.ceil(group.length / cols);
    const cellW = bandW / (cols + 1);
    const cellH = bandH / (rows + 1);

    group.forEach((a, i) => {
      const col = (i % cols) + 1;
      const row = Math.floor(i / cols) + 1;
      // Stagger odd rows to break grid regularity
      const staggerX = (row % 2 === 0) ? cellW * 0.5 : 0;
      pos.set(a.id, {
        x: band[0] + col * cellW + staggerX + (Math.random() - 0.5) * cellW * 0.3,
        y: ERA_Y_BAND[0] + row * cellH + (Math.random() - 0.5) * cellH * 0.3,
      });
    });
  }

  // Also add a small jitter to already-positioned artists that stack on same x,y
  const seen = new Map<string, number>();
  for (const [id, p] of pos) {
    const key = `${Math.round(p.x / 10) * 10},${Math.round(p.y / 10) * 10}`;
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    if (count > 1) {
      pos.set(id, { x: p.x + (Math.random() - 0.5) * MIN_DIST, y: p.y + (Math.random() - 0.5) * MIN_DIST });
    }
  }

  // ── 2. Force-directed repulsion ───────────────────────────────────────────
  const ids = artists.map(a => a.id);
  const eraOf: Record<string, string> = {};
  for (const a of artists) eraOf[a.id] = a.era;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const dx = new Map<string, number>();
    const dy = new Map<string, number>();
    for (const id of ids) { dx.set(id, 0); dy.set(id, 0); }

    // Node–node repulsion (only when closer than MIN_DIST)
    for (let i = 0; i < ids.length; i++) {
      const a = pos.get(ids[i])!;
      for (let j = i + 1; j < ids.length; j++) {
        const b = pos.get(ids[j])!;
        const ddx = a.x - b.x;
        const ddy = a.y - b.y;
        const dist2 = ddx * ddx + ddy * ddy || 0.001;
        const dist = Math.sqrt(dist2);
        if (dist < MIN_DIST) {
          const f = REPULSION / dist2;
          const nx = (ddx / dist) * f;
          const ny = (ddy / dist) * f;
          dx.set(ids[i], dx.get(ids[i])! + nx);
          dy.set(ids[i], dy.get(ids[i])! + ny);
          dx.set(ids[j], dx.get(ids[j])! - nx);
          dy.set(ids[j], dy.get(ids[j])! - ny);
        }
      }
    }

    // Era-node exclusion (keep artists away from the large era label circles)
    for (const id of ids) {
      const p = pos.get(id)!;
      const ec = ERA_CENTERS[eraOf[id]] ?? ERA_CENTERS.golden;
      const ddx = p.x - ec.x;
      const ddy = p.y - ec.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 0.001;
      if (dist < ERA_EXCL_RADIUS) {
        const push = ((ERA_EXCL_RADIUS - dist) / dist) * 0.8;
        dx.set(id, dx.get(id)! + ddx * push);
        dy.set(id, dy.get(id)! + ddy * push);
      }

      // Very weak x-only spring toward era x-centre (keeps eras horizontally separated)
      const eraCx = (ERA_X_BANDS[eraOf[id]] ?? [800, 1200]);
      const eraMidX = (eraCx[0] + eraCx[1]) / 2;
      dx.set(id, dx.get(id)! + (eraMidX - p.x) * SPRING_K_X);
    }

    // Apply displacements — cooling slows from 100% → 20% over iterations
    const cool = 1 - iter / ITERATIONS * 0.8;
    const maxDisp = MIN_DIST * cool + 2;
    for (const id of ids) {
      const p = pos.get(id)!;
      const fdx = Math.max(-maxDisp, Math.min(maxDisp, dx.get(id)!));
      const fdy = Math.max(-maxDisp, Math.min(maxDisp, dy.get(id)!));
      // Clamp to a large but finite world canvas
      pos.set(id, {
        x: Math.max(-200, Math.min(2600, p.x + fdx)),
        y: Math.max(50,   Math.min(1100, p.y + fdy)),
      });
    }
  }

  return pos;
}

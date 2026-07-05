import { useEffect, useRef, useState, useCallback } from 'react';
import { ARTISTS, ERA_NODES, type Artist, type MoodTag, type EraId } from '@/data/artists';
import { useMapPhysics } from '@/hooks/useMapPhysics';

// Image cache for artist node thumbnails
const imageCache = new Map<string, HTMLImageElement | null>();

function loadArtistImage(url: string): Promise<HTMLImageElement | null> {
  if (imageCache.has(url)) return Promise.resolve(imageCache.get(url)!);
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imageCache.set(url, img); resolve(img); };
    img.onerror = () => { imageCache.set(url, null); resolve(null); };
    img.src = url;
  });
}

interface Props {
  activeMoods: MoodTag[];
  activeEra: EraId | null;
  yearRange: [number, number];
  onSelectArtist: (artist: Artist) => void;
  selectedArtistId: string | null;
}

interface NodeHover {
  artistId: string;
  x: number;
  y: number;
}

export default function GenreMapCanvas({ activeMoods, activeEra, yearRange, onSelectArtist, selectedArtistId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapState, setMapState] = useState({ offsetX: -300, offsetY: -100, scale: 0.85 });
  const [hoveredNode, setHoveredNode] = useState<NodeHover | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nodePositionsRef = useRef<Map<string, { wx: number; wy: number }>>(new Map());
  const glowTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  // Preload all artist images
  useEffect(() => {
    let cancelled = false;
    const urls = ARTISTS.filter(a => a.imageUrl).map(a => a.imageUrl!);
    Promise.all(urls.map(url => loadArtistImage(url))).then(() => {
      if (!cancelled) forceUpdate(n => n + 1);
    });
    return () => { cancelled = true; };
  }, []);

  const handleUpdate = useCallback((s: { offsetX: number; offsetY: number; scale: number }) => {
    setMapState({ offsetX: s.offsetX, offsetY: s.offsetY, scale: s.scale });
  }, []);

  const { centerOn } = useMapPhysics(canvasRef, handleUpdate);

  const worldToScreen = useCallback((wx: number, wy: number) => ({
    sx: wx * mapState.scale + mapState.offsetX,
    sy: wy * mapState.scale + mapState.offsetY,
  }), [mapState]);

  const screenToWorld = useCallback((sx: number, sy: number) => ({
    wx: (sx - mapState.offsetX) / mapState.scale,
    wy: (sy - mapState.offsetY) / mapState.scale,
  }), [mapState]);

  const isArtistVisible = useCallback((artist: Artist) => {
    if (activeEra && artist.era !== activeEra) return false;
    const artistYear = artist.albums?.[0]?.year ?? 1990;
    if (artistYear < yearRange[0] || artistYear > yearRange[1]) return false;
    if (activeMoods.length > 0 && !(artist.mood ?? []).some(m => activeMoods.includes(m))) return false;
    return true;
  }, [activeEra, yearRange, activeMoods]);

  const drawInfluenceLine = useCallback((ctx: CanvasRenderingContext2D, fromArtist: Artist, toId: string, glowT: number) => {
    const toArtist = ARTISTS.find(a => a.id === toId);
    if (!toArtist) return;
    if (!isArtistVisible(fromArtist) || !isArtistVisible(toArtist)) return;

    const { sx: x1, sy: y1 } = worldToScreen(fromArtist.x, fromArtist.y);
    const { sx: x2, sy: y2 } = worldToScreen(toArtist.x, toArtist.y);

    const isSelected = selectedArtistId === fromArtist.id || selectedArtistId === toArtist.id;

    // Determine connection type from connectionTypes map (fallback: 'scene')
    const connType = fromArtist.connectionTypes?.[toId]
      ?? toArtist.connectionTypes?.[fromArtist.id]
      ?? 'scene';

    // Determine strength (1=weak, 2=medium, 3=strong); bidirectional lookup
    const rawStrength =
      fromArtist.connectionStrength?.[toId]
      ?? toArtist.connectionStrength?.[fromArtist.id]
      ?? 1;
    const strength: 1 | 2 | 3 = rawStrength >= 0.66 ? 3 : rawStrength >= 0.33 ? 2 : 1;

    // Strength multiplier for line width and alpha
    const strengthWidthMul = strength === 3 ? 2.0 : strength === 2 ? 1.35 : 1.0;
    const strengthAlphaMul = strength === 3 ? 1.4 : strength === 2 ? 1.15 : 1.0;

    // Visual properties per type — base values scaled by strength
    const typeConfig = {
      collab:   { r: 82,  g: 190, b: 255, baseAlpha: 0.45, selAlpha: 0.95, width: 2.0, selWidth: 3.8, dash: [] as number[],    offset: 0 },
      influence:{ r: 60,  g: 140, b: 210, baseAlpha: 0.22, selAlpha: 0.82, width: 1.1, selWidth: 2.2, dash: [7, 5],             offset: -glowT * 10 },
      scene:    { r: 28,  g: 68,  b: 130, baseAlpha: 0.10, selAlpha: 0.45, width: 0.5, selWidth: 1.0, dash: [2, 8],             offset: -glowT * 4 },
    } as const;

    const cfg = typeConfig[connType];
    const rawAlpha = isSelected ? cfg.selAlpha : (cfg.baseAlpha + Math.sin(glowT * 0.5) * 0.03) * strengthAlphaMul;
    const alpha = Math.min(rawAlpha, 1);
    const lw = (isSelected ? cfg.selWidth : cfg.width) * strengthWidthMul;

    ctx.save();
    ctx.strokeStyle = `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, ${alpha})`;
    ctx.lineWidth = lw;
    ctx.setLineDash(cfg.dash);
    ctx.lineDashOffset = cfg.offset;
    ctx.shadowColor  = isSelected ? `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, 0.55)` : 'transparent';
    ctx.shadowBlur   = isSelected ? (connType === 'collab' ? 14 : 7) : 0;

    // Strength=3 collab gets a subtle double-stroke glow pass
    if (strength === 3 && connType === 'collab' && !isSelected) {
      ctx.save();
      ctx.strokeStyle = `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, ${alpha * 0.25})`;
      ctx.lineWidth = lw * 2.8;
      ctx.setLineDash([]);
      const mx0 = (x1 + x2) / 2 + (y2 - y1) * 0.1;
      const my0 = (y1 + y2) / 2 - (x2 - x1) * 0.1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx0, my0, x2, y2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    const mx = (x1 + x2) / 2 + (y2 - y1) * 0.1;
    const my = (y1 + y2) / 2 - (x2 - x1) * 0.1;
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.stroke();

    // Strength marker: small diamond at midpoint for strong (3) connections
    if (strength >= 2 && mapState.scale > 0.55) {
      const midX = 0.25 * x1 + 0.5 * mx + 0.25 * x2;
      const midY = 0.25 * y1 + 0.5 * my + 0.25 * y2;
      const ds = strength === 3 ? 4 * mapState.scale : 2.5 * mapState.scale;
      ctx.save();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(${cfg.r}, ${cfg.g}, ${cfg.b}, ${alpha * 1.2})`;
      ctx.beginPath();
      ctx.moveTo(midX, midY - ds);
      ctx.lineTo(midX + ds, midY);
      ctx.lineTo(midX, midY + ds);
      ctx.lineTo(midX - ds, midY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }, [worldToScreen, isArtistVisible, selectedArtistId, mapState.scale]);

  const drawEraNode = useCallback((ctx: CanvasRenderingContext2D, era: typeof ERA_NODES[keyof typeof ERA_NODES], glowT: number) => {
    const { sx, sy } = worldToScreen(era.x, era.y);
    const isActive = activeEra === era.id;
    const r = 60 * mapState.scale;
    if (r < 8) return;

    ctx.save();
    // Outer ring
    const pulse = 1 + Math.sin(glowT * 0.8) * 0.05;
    ctx.strokeStyle = isActive ? 'rgba(42, 111, 173, 0.8)' : 'rgba(26, 58, 92, 0.5)';
    ctx.lineWidth = isActive ? 2 : 1;
    ctx.setLineDash([4, 6]);
    ctx.shadowColor = isActive ? 'rgba(42, 111, 173, 0.6)' : 'transparent';
    ctx.shadowBlur = isActive ? 20 : 0;
    ctx.beginPath();
    ctx.arc(sx, sy, r * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Fill
    const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.8);
    grd.addColorStop(0, isActive ? 'rgba(42, 111, 173, 0.15)' : 'rgba(26, 58, 92, 0.08)');
    grd.addColorStop(1, 'rgba(6, 11, 18, 0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();

    // Label
    if (mapState.scale > 0.4) {
      ctx.shadowBlur = 0;
      ctx.setLineDash([]);
      ctx.fillStyle = isActive ? 'rgba(200, 216, 232, 0.9)' : 'rgba(184, 200, 212, 0.5)';
      ctx.font = `bold ${Math.max(8, 11 * mapState.scale)}px 'Space Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(era.label, sx, sy - 6 * mapState.scale);
      ctx.fillStyle = isActive ? 'rgba(42, 111, 173, 0.9)' : 'rgba(184, 200, 212, 0.35)';
      ctx.font = `${Math.max(6, 8 * mapState.scale)}px 'Space Mono', monospace`;
      ctx.fillText(era.years, sx, sy + 10 * mapState.scale);
    }
    ctx.restore();
  }, [worldToScreen, activeEra, mapState.scale]);

  const drawArtistNode = useCallback((ctx: CanvasRenderingContext2D, artist: Artist, glowT: number) => {
    const { sx, sy } = worldToScreen(artist.x, artist.y);
    const visible = isArtistVisible(artist);
    const isSelected = selectedArtistId === artist.id;
    const isHovered = hoveredNode?.artistId === artist.id;
    const nodeR = 22 * mapState.scale;

    if (nodeR < 3) return;

    nodePositionsRef.current.set(artist.id, { wx: artist.x, wy: artist.y });

    ctx.save();
    const alpha = visible ? 1 : 0.15;

    if (isSelected || isHovered) {
      const glowR = nodeR * (1.3 + Math.sin(glowT * 2) * 0.08);
      const halo = ctx.createRadialGradient(sx, sy, nodeR * 0.8, sx, sy, glowR * 2);
      halo.addColorStop(0, `rgba(42, 111, 173, ${0.35 * alpha})`);
      halo.addColorStop(1, 'rgba(42, 111, 173, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(sx, sy, glowR * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Check for cached image
    const cachedImg = artist.imageUrl ? imageCache.get(artist.imageUrl) : undefined;

    if (cachedImg) {
      // Draw monochromatic image clipped to circle
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(sx, sy, nodeR, 0, Math.PI * 2);
      ctx.clip();
      // Apply the monochromatic blue filter: sepia→hue-rotate→saturate→brightness
      ctx.filter = 'sepia(1) hue-rotate(190deg) saturate(2) brightness(0.65)';
      const d = nodeR * 2;
      ctx.drawImage(cachedImg, sx - nodeR, sy - nodeR, d, d);
      ctx.filter = 'none';
      ctx.restore();

      // Ring border on top
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = isSelected
        ? `rgba(42, 111, 173, ${alpha})`
        : isHovered
          ? `rgba(42, 111, 173, ${0.7 * alpha})`
          : `rgba(28, 48, 69, ${0.5 * alpha})`;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.shadowColor = isSelected || isHovered ? 'rgba(42, 111, 173, 0.7)' : 'transparent';
      ctx.shadowBlur = isSelected ? 20 : isHovered ? 12 : 0;
      ctx.beginPath();
      ctx.arc(sx, sy, nodeR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      // Fallback: gradient fill with inner dot
      const nodeFill = ctx.createRadialGradient(sx - nodeR * 0.3, sy - nodeR * 0.3, 0, sx, sy, nodeR);
      nodeFill.addColorStop(0, `rgba(42, 111, 173, ${0.8 * alpha})`);
      nodeFill.addColorStop(0.5, `rgba(26, 58, 92, ${0.9 * alpha})`);
      nodeFill.addColorStop(1, `rgba(13, 32, 53, ${0.95 * alpha})`);
      ctx.fillStyle = nodeFill;
      ctx.strokeStyle = isSelected
        ? `rgba(42, 111, 173, ${alpha})`
        : isHovered
          ? `rgba(42, 111, 173, ${0.7 * alpha})`
          : `rgba(28, 48, 69, ${0.6 * alpha})`;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.shadowColor = isSelected || isHovered ? 'rgba(42, 111, 173, 0.6)' : 'transparent';
      ctx.shadowBlur = isSelected ? 20 : isHovered ? 12 : 0;
      ctx.beginPath();
      ctx.arc(sx, sy, nodeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner dot
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(200, 216, 232, ${0.7 * alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, nodeR * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    if (mapState.scale > 0.55 && visible) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = isSelected ? 'rgba(232, 240, 248, 0.95)' : 'rgba(184, 200, 212, 0.75)';
      const fontSize = Math.max(7, 9 * mapState.scale);
      ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px 'Space Mono', monospace`;
      ctx.textAlign = 'center';
      const label = artist.name.length > 14 ? artist.name.slice(0, 12) + '…' : artist.name;
      ctx.fillText(label, sx, sy + nodeR + fontSize + 2);
    }

    ctx.restore();
  }, [worldToScreen, isArtistVisible, selectedArtistId, hoveredNode, mapState.scale]);

  // Main draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      glowTimeRef.current += 0.016;
      const gt = glowTimeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw influence lines first (under nodes)
      const drawn = new Set<string>();
      ARTISTS.forEach(artist => {
        artist.connections.forEach(toId => {
          const key = [artist.id, toId].sort().join('--');
          if (!drawn.has(key)) {
            drawn.add(key);
            drawInfluenceLine(ctx, artist, toId, gt);
          }
        });
      });

      // Era nodes
      Object.values(ERA_NODES).forEach(era => drawEraNode(ctx, era, gt));

      // Artist nodes
      ARTISTS.forEach(artist => drawArtistNode(ctx, artist, gt));

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [drawInfluenceLine, drawEraNode, drawArtistNode, mapState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: NodeHover | null = null;
    for (const artist of ARTISTS) {
      const { sx, sy } = worldToScreen(artist.x, artist.y);
      const r = 22 * mapState.scale;
      if (Math.hypot(mx - sx, my - sy) <= r + 4) {
        found = { artistId: artist.id, x: e.clientX, y: e.clientY };
        break;
      }
    }
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (found) {
      hoverTimerRef.current = setTimeout(() => setHoveredNode(found), 80);
    } else {
      setHoveredNode(null);
    }
  }, [worldToScreen, mapState.scale]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const artist of ARTISTS) {
      const { sx, sy } = worldToScreen(artist.x, artist.y);
      const r = 22 * mapState.scale + 8;
      if (Math.hypot(mx - sx, my - sy) <= r) {
        onSelectArtist(artist);
        return;
      }
    }
  }, [worldToScreen, mapState.scale, onSelectArtist]);

  const hoveredArtist = hoveredNode ? ARTISTS.find(a => a.id === hoveredNode.artistId) : null;

  const handleZoomIn = () => {
    setMapState(prev => ({ ...prev, scale: Math.min(2.5, prev.scale * 1.2) }));
  };
  const handleZoomOut = () => {
    setMapState(prev => ({ ...prev, scale: Math.max(0.25, prev.scale * 0.85) }));
  };
  const handleReset = () => {
    setMapState({ offsetX: -300, offsetY: -100, scale: 0.85 });
  };

  useEffect(() => {
    if (selectedArtistId) {
      const artist = ARTISTS.find(a => a.id === selectedArtistId);
      if (artist) centerOn(artist.x, artist.y, 1.1);
    }
  }, [selectedArtistId, centerOn]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ cursor: hoveredNode ? 'pointer' : 'grab' }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Hover tooltip — absolute inside map container so it never overflows onto panels */}
      {hoveredArtist && hoveredNode && (
        <div
          className="absolute pointer-events-none z-30 xerox-border bg-card/95 backdrop-blur-sm"
          style={{
            // Offset right of the node; flip left if near right edge of canvas
            left: hoveredNode.x + 16,
            top: Math.max(hoveredNode.y - 60, 8),
            maxWidth: 200,
            // Nudge left if it would overflow the container width
            transform: hoveredNode.x > window.innerWidth * 0.65 ? 'translateX(calc(-100% - 32px))' : undefined,
          }}
        >
          <div className="p-3">
            <div className="archival-label mb-1">{hoveredArtist.era.toUpperCase()} ERA</div>
            <div className="archival-title text-sm mb-1">{hoveredArtist.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{hoveredArtist.origin}</div>
            <div className="flex flex-wrap gap-1">
              {(hoveredArtist.mood ?? []).map(m => (
                <span key={m} className="mood-tag">{m}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-1 z-20">
        {[{ label: '+', fn: handleZoomIn }, { label: '−', fn: handleZoomOut }, { label: '⊙', fn: handleReset }].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            className="w-8 h-8 xerox-border bg-card/80 text-foreground text-sm font-mono flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Connection legend */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="xerox-border bg-card/80 backdrop-blur-sm p-2.5 space-y-2" style={{ minWidth: 160 }}>
          <div className="archival-label text-muted-foreground/60" style={{ fontSize: '0.5rem' }}>CONNECTION TYPE</div>

          {/* Collab */}
          <div className="flex items-center gap-2">
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none">
              <line x1="0" y1="4" x2="36" y2="4" stroke="rgba(82,190,255,0.85)" strokeWidth="3" />
            </svg>
            <span className="font-mono text-blue-300/80" style={{ fontSize: '0.5rem' }}>COLLAB</span>
          </div>

          {/* Influence */}
          <div className="flex items-center gap-2">
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none">
              <line x1="0" y1="4" x2="36" y2="4" stroke="rgba(60,140,210,0.7)" strokeWidth="1.5" strokeDasharray="6 4" />
            </svg>
            <span className="font-mono text-blue-400/70" style={{ fontSize: '0.5rem' }}>INFLUENCE</span>
          </div>

          {/* Scene */}
          <div className="flex items-center gap-2">
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none">
              <line x1="0" y1="4" x2="36" y2="4" stroke="rgba(28,68,130,0.6)" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
            <span className="font-mono text-foreground/40" style={{ fontSize: '0.5rem' }}>SCENE</span>
          </div>

          <div className="border-t border-border/30 pt-1.5 mt-1">
            <div className="archival-label text-muted-foreground/60 mb-1" style={{ fontSize: '0.5rem' }}>STRENGTH</div>
            <div className="flex flex-col gap-1">
              {([
                { label: 'WEAK', w: 0.8, a: 0.35 },
                { label: 'MEDIUM', w: 1.8, a: 0.60, diamond: true },
                { label: 'STRONG', w: 3.2, a: 0.85, diamond: true, bigDiamond: true },
              ] as Array<{ label: string; w: number; a: number; diamond?: boolean; bigDiamond?: boolean }>).map(({ label, w, a, diamond, bigDiamond }) => (
                <div key={label} className="flex items-center gap-2">
                  <svg width="36" height="10" viewBox="0 0 36 10" fill="none">
                    <line x1="0" y1="5" x2="36" y2="5" stroke={`rgba(82,190,255,${a})`} strokeWidth={w} />
                    {diamond && (
                      <polygon
                        points={`18,${5 - (bigDiamond ? 3.5 : 2.5)} ${18 + (bigDiamond ? 3.5 : 2.5)},5 18,${5 + (bigDiamond ? 3.5 : 2.5)} ${18 - (bigDiamond ? 3.5 : 2.5)},5`}
                        fill={`rgba(82,190,255,${a * 1.2})`}
                      />
                    )}
                  </svg>
                  <span className="font-mono text-foreground/40" style={{ fontSize: '0.5rem' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-6 left-6 archival-label z-20">
        {Math.round(mapState.scale * 100)}% — SCROLL TO ZOOM / DRAG TO PAN
      </div>
    </div>
  );
}

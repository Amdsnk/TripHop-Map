import { useRef, useEffect, useCallback } from 'react';
import { type EraId } from '@/data/artists';

interface Props {
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  activeEra: EraId | null;
  onEraChange: (era: EraId | null) => void;
}

const ERAS: { id: EraId; label: string; start: number; end: number; color: string }[] = [
  { id: 'origin',    label: 'ORIGIN',        start: 1980, end: 1992, color: '#0D2035' },
  { id: 'golden',    label: 'GOLDEN ERA',    start: 1993, end: 1999, color: '#1A3A5C' },
  { id: 'expansion', label: 'EXPANSION',     start: 2000, end: 2010, color: '#2A6FAD' },
  { id: 'modern',    label: 'MODERN',        start: 2011, end: 2026, color: '#1A3A5C' },
];

const MIN_YEAR = 1980;
const MAX_YEAR = 2026;

export default function TimelineScrubber({ yearRange, onYearRangeChange, activeEra, onEraChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'start' | 'end' | null>(null);

  const yearToPercent = (y: number) => ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  const percentToYear = (p: number) => Math.round(MIN_YEAR + (p / 100) * (MAX_YEAR - MIN_YEAR));

  const getPercent = useCallback((e: MouseEvent | React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    const pct = getPercent(e);
    const year = percentToYear(pct);
    if (dragging.current === 'start') {
      onYearRangeChange([Math.min(year, yearRange[1] - 1), yearRange[1]]);
    } else {
      onYearRangeChange([yearRange[0], Math.max(year, yearRange[0] + 1)]);
    }
  }, [dragging, getPercent, yearRange, onYearRangeChange]);

  const handleMouseUp = useCallback(() => { dragging.current = null; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const startPct = yearToPercent(yearRange[0]);
  const endPct = yearToPercent(yearRange[1]);

  return (
    <div className="flex flex-col gap-3">
      <div className="archival-label">TIMELINE SCRUBBER</div>

      {/* Era buttons */}
      <div className="grid grid-cols-2 gap-1">
        {ERAS.map(era => (
          <button
            key={era.id}
            onClick={() => onEraChange(activeEra === era.id ? null : era.id)}
            className={`text-left px-2 py-1.5 xerox-border transition-all group ${
              activeEra === era.id ? 'border-accent' : 'hover:border-accent/40'
            }`}
          >
            <div className={`text-xs font-mono font-bold transition-colors ${
              activeEra === era.id ? 'text-accent' : 'text-foreground/50 group-hover:text-foreground/80'
            }`}>
              {activeEra === era.id ? '▪ ' : ''}{era.label}
            </div>
            <div className="text-xs text-muted-foreground">{era.start}–{era.end}</div>
          </button>
        ))}
      </div>

      {/* Scrubber track */}
      <div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
        <div
          ref={trackRef}
          className="relative h-2 xerox-border bg-muted cursor-pointer"
          onClick={e => {
            const pct = getPercent(e as unknown as MouseEvent);
            const year = percentToYear(pct);
            const distToStart = Math.abs(year - yearRange[0]);
            const distToEnd = Math.abs(year - yearRange[1]);
            if (distToStart < distToEnd) {
              onYearRangeChange([Math.min(year, yearRange[1] - 1), yearRange[1]]);
            } else {
              onYearRangeChange([yearRange[0], Math.max(year, yearRange[0] + 1)]);
            }
          }}
        >
          {/* Era colored segments */}
          {ERAS.map(era => {
            const eStart = Math.max(yearToPercent(era.start), 0);
            const eEnd = Math.min(yearToPercent(era.end), 100);
            return (
              <div
                key={era.id}
                className="absolute top-0 h-full opacity-40"
                style={{ left: `${eStart}%`, width: `${eEnd - eStart}%`, backgroundColor: era.color }}
              />
            );
          })}

          {/* Selected range fill */}
          <div
            className="absolute top-0 h-full bg-accent/30"
            style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
          />

          {/* Start handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 border border-accent bg-muted cursor-ew-resize hover:bg-accent/20 transition-colors z-10"
            style={{ left: `${startPct}%` }}
            onMouseDown={e => { e.stopPropagation(); dragging.current = 'start'; }}
          />
          {/* End handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 border border-accent bg-muted cursor-ew-resize hover:bg-accent/20 transition-colors z-10"
            style={{ left: `${endPct}%` }}
            onMouseDown={e => { e.stopPropagation(); dragging.current = 'end'; }}
          />
        </div>

        {/* Year markers */}
        <div className="relative mt-1 h-4">
          {[1985, 1993, 2000, 2010, 2020].map(y => (
            <div
              key={y}
              className="absolute text-xs font-mono text-muted-foreground/50 -translate-x-1/2"
              style={{ left: `${yearToPercent(y)}%`, fontSize: '0.55rem' }}
            >
              {y}
            </div>
          ))}
        </div>
      </div>

      {activeEra && (
        <button
          onClick={() => onEraChange(null)}
          className="text-xs font-mono text-muted-foreground hover:text-foreground/80 transition-colors text-left"
        >
          × CLEAR ERA FILTER
        </button>
      )}
    </div>
  );
}

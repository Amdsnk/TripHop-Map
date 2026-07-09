import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Artist, ARTISTS } from '@/data/artists';

interface Props {
  artist: Artist;
  onClose: () => void;
}

interface DNANode {
  label: string;
  x: number;
  y: number;
  r: number;
  color: string;
  type: 'root' | 'genre' | 'artist' | 'influence';
  alpha: number;
}

export default function SoundDNA({ artist, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const GENRE_ROOTS: { label: string; angle: number; color: string }[] = [
    { label: 'DUB', angle: -90, color: '#1A3A5C' },
    { label: 'HIP-HOP', angle: -30, color: '#2A6FAD' },
    { label: 'JAZZ', angle: 30, color: '#1A3A5C' },
    { label: 'POST-PUNK', angle: 90, color: '#0D2035' },
    { label: 'AMBIENT', angle: 150, color: '#2A6FAD' },
    { label: 'SOUL', angle: 210, color: '#1A3A5C' },
  ];

  const relatedArtists = (artist.relatedArtists ?? [])
    .map(id => ARTISTS.find(a => a.id === id))
    .filter(Boolean) as Artist[];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'hsl(213, 54%, 5%)';
      ctx.fillRect(0, 0, w, h);

      const nodes: DNANode[] = [];

      // Center node (artist)
      nodes.push({
        label: artist.name.split(' ')[0],
        x: cx,
        y: cy,
        r: 28,
        color: '#2A6FAD',
        type: 'artist',
        alpha: 1,
      });

      // Genre roots (orbit 1)
      GENRE_ROOTS.forEach(({ label, angle, color }, i) => {
        const rad = (angle * Math.PI) / 180;
        const orbitR = 90 + Math.sin(t * 0.4 + i) * 4;
        nodes.push({
          label,
          x: cx + Math.cos(rad) * orbitR,
          y: cy + Math.sin(rad) * orbitR,
          r: 16,
          color,
          type: 'genre',
          alpha: 0.7 + Math.sin(t * 0.6 + i * 0.8) * 0.15,
        });
      });

      // Related artists (orbit 2)
      relatedArtists.forEach((rel, i) => {
        const angle = (i / relatedArtists.length) * Math.PI * 2 + t * 0.15;
        const orbitR = 155 + Math.sin(t * 0.3 + i * 1.2) * 6;
        nodes.push({
          label: rel.name.split(' ')[0],
          x: cx + Math.cos(angle) * orbitR,
          y: cy + Math.sin(angle) * orbitR,
          r: 12,
          color: '#1A3A5C',
          type: 'artist',
          alpha: 0.5 + Math.sin(t * 0.5 + i) * 0.2,
        });
      });

      // Mood influence nodes (orbit 3)
      (artist.mood ?? []).forEach((mood, i) => {
        const angle = (i / (artist.mood ?? []).length) * Math.PI * 2 + Math.PI / 4 - t * 0.08;
        const orbitR = 205 + Math.sin(t * 0.2 + i * 0.5) * 8;
        nodes.push({
          label: mood.toUpperCase(),
          x: cx + Math.cos(angle) * orbitR,
          y: cy + Math.sin(angle) * orbitR,
          r: 10,
          color: '#2A6FAD',
          type: 'influence',
          alpha: 0.35 + Math.sin(t * 0.4 + i * 1.5) * 0.1,
        });
      });

      // Draw connections
      const centerNode = nodes[0];
      nodes.slice(1).forEach(node => {
        ctx.save();
        ctx.strokeStyle = `rgba(42, 111, 173, ${node.alpha * 0.3})`;
        ctx.lineWidth = node.type === 'genre' ? 1 : 0.5;
        ctx.setLineDash(node.type === 'influence' ? [3, 5] : []);
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
        ctx.restore();
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.save();

        // Glow
        if (node.type === 'artist' || node.type === 'genre') {
          const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 2.5);
          grd.addColorStop(0, `rgba(42, 111, 173, ${node.alpha * 0.3})`);
          grd.addColorStop(1, 'rgba(42, 111, 173, 0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node fill
        const fill = ctx.createRadialGradient(
          node.x - node.r * 0.3,
          node.y - node.r * 0.3,
          0,
          node.x, node.y, node.r
        );
        fill.addColorStop(0, `rgba(42, 111, 173, ${node.alpha * 0.9})`);
        fill.addColorStop(1, `rgba(13, 32, 53, ${node.alpha})`);

        ctx.shadowColor = `rgba(42, 111, 173, ${node.alpha * 0.5})`;
        ctx.shadowBlur = node.type === 'artist' ? 16 : 8;
        ctx.fillStyle = fill;
        ctx.strokeStyle = `rgba(42, 111, 173, ${node.alpha * 0.6})`;
        ctx.lineWidth = node.type === 'artist' ? 2 : 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = `rgba(200, 216, 232, ${node.alpha})`;
        ctx.font = `${node.type === 'artist' ? 'bold ' : ''}${Math.max(5, node.r * 0.55)}px 'Space Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (node.label.length <= 7 || node.type === 'artist') {
          ctx.fillText(node.label, node.x, node.y);
        } else {
          ctx.fillText(node.label, node.x, node.y - 1);
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [artist, relatedArtists, GENRE_ROOTS]);

  return (
    <div className="flex flex-col h-full overflow-hidden panel-enter">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="archival-label text-accent mb-1">SONIC GENEALOGY</div>
            <h2 className="archival-title text-lg text-glow">SOUND DNA — {artist.name.toUpperCase()}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Genre lineage, influence network, and sonic relationships visualised.
        </p>
      </div>

      <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          className="w-full h-auto xerox-border"
        />

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'GENRE ROOTS', desc: 'Inner orbit', color: '#1A3A5C' },
            { label: 'RELATED', desc: 'Mid orbit', color: '#2A6FAD' },
            { label: 'MOOD NODES', desc: 'Outer orbit', color: '#2A6FAD' },
          ].map(({ label, desc, color }) => (
            <div key={label} className="xerox-border p-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <div>
                <div className="archival-label" style={{ fontSize: '0.55rem' }}>{label}</div>
                <div className="text-xs text-muted-foreground" style={{ fontSize: '0.6rem' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

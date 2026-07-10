import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { ARTISTS, ERA_NODES } from '@/data/artists';

interface Props {
  onClose: () => void;
  onSelectArtist: (id: string) => void;
}

export default function GeographicMap({ onClose, onSelectArtist }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Group artists by city
  const cityArtists = ARTISTS.reduce<Record<string, { name: string; lat: number; lng: number; artists: string[] }>>(
    (acc, artist) => {
      const key = artist.origin;
      if (!acc[key]) {
        acc[key] = { name: key, lat: artist.coordinates?.lat ?? 0, lng: artist.coordinates?.lng ?? 0, artists: [] };
      }
      acc[key].artists.push(artist.name);
      return acc;
    },
    {}
  );

  const cities = Object.values(cityArtists);

  // Simple Mercator projection
  const project = (lat: number, lng: number, w: number, h: number) => {
    const x = ((lng + 180) / 360) * w;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = h / 2 - (w * mercN) / (2 * Math.PI);
    return { x, y };
  };

  // Crop to Europe/UK focus region
  const BOUNDS = { minLng: -10, maxLng: 20, minLat: 45, maxLat: 58 };

  const projectCropped = (lat: number, lng: number, w: number, h: number) => {
    const xPct = (lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng);
    const yPct = 1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat);
    return { x: xPct * w, y: yPct * h };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'hsl(213, 54%, 5%)';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(28, 48, 69, 0.4)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo((w / 10) * i, 0);
      ctx.lineTo((w / 10) * i, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (h / 8) * i);
      ctx.lineTo(w, (h / 8) * i);
      ctx.stroke();
    }

    // Bristol emphasis
    const bristol = projectCropped(51.4545, -2.5879, w, h);
    // Origin pulse rings
    for (let ring = 1; ring <= 3; ring++) {
      ctx.strokeStyle = `rgba(42, 111, 173, ${0.3 - ring * 0.08})`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(bristol.x, bristol.y, ring * 35, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Influence spread lines
    cities.forEach(city => {
      if (city.name === 'Bristol, UK') return;
      const pt = projectCropped(city.lat, city.lng, w, h);
      ctx.strokeStyle = 'rgba(42, 111, 173, 0.2)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(bristol.x, bristol.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // City nodes
    cities.forEach(city => {
      const { x, y } = projectCropped(city.lat, city.lng, w, h);
      const isBristol = city.name === 'Bristol, UK';
      const r = isBristol ? 8 : 5;

      // Glow
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
      grd.addColorStop(0, `rgba(42, 111, 173, ${isBristol ? 0.4 : 0.2})`);
      grd.addColorStop(1, 'rgba(42, 111, 173, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r * 3, 0, Math.PI * 2);
      ctx.fill();

      // Node
      ctx.fillStyle = isBristol ? 'rgba(42, 111, 173, 0.9)' : 'rgba(26, 58, 92, 0.85)';
      ctx.strokeStyle = isBristol ? 'rgba(42, 111, 173, 1)' : 'rgba(42, 111, 173, 0.5)';
      ctx.lineWidth = isBristol ? 2 : 1;
      ctx.shadowColor = 'rgba(42, 111, 173, 0.6)';
      ctx.shadowBlur = isBristol ? 12 : 6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = isBristol ? 'rgba(200, 216, 232, 0.95)' : 'rgba(184, 200, 212, 0.7)';
      ctx.font = `${isBristol ? 'bold ' : ''}${isBristol ? 9 : 7}px 'Space Mono', monospace`;
      ctx.textAlign = 'center';
      const cityShort = city.name.replace(', UK', '').replace(', Belgium', '');
      ctx.fillText(cityShort, x, y - r - 3);

      // Artist count
      if (city.artists.length > 0) {
        ctx.fillStyle = 'rgba(42, 111, 173, 0.8)';
        ctx.font = '6px Space Mono, monospace';
        ctx.fillText(`${city.artists.length} artist${city.artists.length > 1 ? 's' : ''}`, x, y + r + 9);
      }
    });

    // Bristol ORIGIN label
    ctx.fillStyle = 'rgba(42, 111, 173, 0.9)';
    ctx.font = 'bold 8px Space Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ORIGIN POINT', bristol.x + 12, bristol.y + 4);

  }, [cities, project, projectCropped]);

  return (
    <div className="flex flex-col h-full overflow-hidden panel-enter">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="archival-label text-accent mb-1">CARTOGRAPHY</div>
            <h2 className="archival-title text-lg text-glow">GEOGRAPHIC SPREAD</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Bristol as origin node. Influence radiating outward.
        </p>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <canvas
          ref={canvasRef}
          width={480}
          height={280}
          className="w-full h-auto xerox-border"
        />

        {/* City list */}
        <div className="mt-4 space-y-1">
          <div className="archival-label mb-2">LOCATIONS</div>
          {cities.map(city => (
            <div key={city.name} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-accent flex-shrink-0" />
              <div>
                <div className="text-xs font-mono text-foreground/70">{city.name}</div>
                <div className="text-xs text-muted-foreground">{city.artists.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

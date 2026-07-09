import { useState, useMemo } from 'react';
import { X, Users, Music2, ChevronDown, ChevronUp } from 'lucide-react';
import { ARTISTS, type Artist, type EraId } from '@/data/artists';

interface Props {
  onClose: () => void;
  onSelectArtist: (artist: Artist) => void;
}

const ERA_ORDER: EraId[] = ['origin', 'golden', 'expansion', 'modern'];

const ERA_LABEL: Record<EraId, string> = {
  origin:    'ORIGIN',
  golden:    'GOLDEN ERA',
  expansion: 'EXPANSION',
  modern:    'MODERN',
};

const ERA_COLOR: Record<EraId, string> = {
  origin:    'text-amber-400 border-amber-400/30 bg-amber-400/10',
  golden:    'text-accent border-accent/30 bg-accent/10',
  expansion: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  modern:    'text-sky-400 border-sky-400/30 bg-sky-400/10',
};

const ERA_DOT: Record<EraId, string> = {
  origin:    'bg-amber-400',
  golden:    'bg-accent',
  expansion: 'bg-emerald-400',
  modern:    'bg-sky-400',
};

type SortKey = 'az' | 'era' | 'songs';

export default function ArtistList({ onClose, onSelectArtist }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('az');
  const [filterEra, setFilterEra] = useState<EraId | 'all'>('all');
  const [groupByEra, setGroupByEra] = useState(false);

  const eraCounts = useMemo(() => {
    const counts: Partial<Record<EraId | 'all', number>> = { all: ARTISTS.length };
    for (const era of ERA_ORDER) {
      counts[era] = ARTISTS.filter(a => a.era === era).length;
    }
    return counts;
  }, []);

  const sorted = useMemo(() => {
    let list = filterEra === 'all' ? [...ARTISTS] : ARTISTS.filter(a => a.era === filterEra);
    if (sortKey === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortKey === 'era') list.sort((a, b) => ERA_ORDER.indexOf(a.era) - ERA_ORDER.indexOf(b.era) || a.name.localeCompare(b.name));
    else if (sortKey === 'songs') list.sort((a, b) => (b.songs?.length ?? 0) - (a.songs?.length ?? 0));
    return list;
  }, [sortKey, filterEra]);

  const grouped = useMemo(() => {
    if (!groupByEra) return null;
    const map = new Map<EraId, Artist[]>();
    for (const era of ERA_ORDER) map.set(era, []);
    for (const a of sorted) {
      map.get(a.era)?.push(a);
    }
    return map;
  }, [sorted, groupByEra]);

  const renderArtistCard = (artist: Artist) => (
    <button
      key={artist.id}
      onClick={() => { onSelectArtist(artist); onClose(); }}
      className="w-full text-left px-3 py-2.5 xerox-border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group rounded-sm"
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${ERA_DOT[artist.era]}`} />
            <span className="text-sm font-mono font-medium text-foreground group-hover:text-accent transition-colors truncate">
              {artist.name}
            </span>
          </div>
          <div className="text-muted-foreground mt-0.5 pl-3 truncate" style={{ fontSize: '0.6rem' }}>
            {artist.origin ?? '—'}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className={`archival-label px-1.5 py-0.5 xerox-border text-xs ${ERA_COLOR[artist.era]}`}>
            {ERA_LABEL[artist.era]}
          </span>
          <span className="flex items-center gap-0.5 text-muted-foreground" style={{ fontSize: '0.6rem' }}>
            <Music2 className="w-2.5 h-2.5" />
            {artist.songs?.length ?? 0}
          </span>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-accent" />
          <span className="archival-label text-foreground">DAFTAR ARTIS</span>
          <span className="archival-label text-accent">({ARTISTS.length})</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Era filter pills */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-border flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterEra('all')}
          className={`archival-label px-2 py-0.5 xerox-border transition-all ${filterEra === 'all' ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted-foreground hover:border-accent/40'}`}
        >
          ALL ({eraCounts.all})
        </button>
        {ERA_ORDER.map(era => (
          <button
            key={era}
            onClick={() => setFilterEra(era)}
            className={`archival-label px-2 py-0.5 xerox-border transition-all ${filterEra === era ? `${ERA_COLOR[era]} border-current` : 'border-border text-muted-foreground hover:border-accent/40'}`}
          >
            {ERA_LABEL[era]} ({eraCounts[era]})
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="archival-label text-muted-foreground mr-1">URUTKAN:</span>
          {([
            { key: 'az' as SortKey, label: 'A–Z' },
            { key: 'era' as SortKey, label: 'ERA' },
            { key: 'songs' as SortKey, label: 'LAGU' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`archival-label px-2 py-0.5 xerox-border transition-all ${sortKey === key ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted-foreground hover:border-accent/40'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setGroupByEra(g => !g)}
          className={`flex items-center gap-1 archival-label px-2 py-0.5 xerox-border transition-all ${groupByEra ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted-foreground hover:border-accent/40'}`}
        >
          GROUP
          {groupByEra ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
        </button>
      </div>

      {/* Count */}
      <div className="flex-shrink-0 px-4 py-1.5 border-b border-border">
        <span className="archival-label text-muted-foreground">
          Menampilkan <span className="text-accent">{sorted.length}</span> artis
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            <Users className="w-6 h-6 opacity-30" />
            <p className="text-xs font-mono">Tidak ada artis di era ini</p>
          </div>
        ) : groupByEra && grouped ? (
          <div className="p-2 space-y-4">
            {ERA_ORDER.map(era => {
              const list = grouped.get(era) ?? [];
              if (filterEra !== 'all' && filterEra !== era) return null;
              if (list.length === 0) return null;
              return (
                <div key={era}>
                  <div className={`flex items-center gap-2 px-2 py-1 mb-1 archival-label ${ERA_COLOR[era].split(' ')[0]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ERA_DOT[era]}`} />
                    {ERA_LABEL[era]}
                    <span className="text-muted-foreground ml-auto">{list.length} artis</span>
                  </div>
                  <div className="space-y-1">
                    {list.map(renderArtistCard)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sorted.map(renderArtistCard)}
          </div>
        )}
      </div>
    </div>
  );
}

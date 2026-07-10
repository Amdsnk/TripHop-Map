import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Users, Music2 } from 'lucide-react';
import { ARTISTS, type Artist } from '@/data/artists';

interface Props {
  onClose: () => void;
  onSelectArtist: (artist: Artist) => void;
}

const ERA_LABEL: Record<string, string> = {
  origin:    'ORIGIN',
  golden:    'GOLDEN ERA',
  expansion: 'EXPANSION',
  modern:    'MODERN',
};

const ERA_COLOR: Record<string, string> = {
  origin:    'text-amber-400',
  golden:    'text-accent',
  expansion: 'text-emerald-400',
  modern:    'text-sky-400',
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/30 text-accent rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function ArtistSearch({ onClose, onSelectArtist }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARTISTS.slice().sort((a, b) => a.name.localeCompare(b.name));
    return ARTISTS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.origin ?? '').toLowerCase().includes(q)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-accent" />
          <span className="archival-label text-foreground">SEARCH ARTISTS</span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search input */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari nama artis atau kota..."
            className="w-full bg-background/60 border border-border rounded pl-9 pr-9 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="mt-2 archival-label text-muted-foreground">
          {results.length} artis ditemukan
          {query && <span> untuk "<span className="text-accent">{query}</span>"</span>}
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            <Users className="w-6 h-6 opacity-30" />
            <p className="text-xs font-mono">Tidak ada artis yang cocok</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {results.map(artist => (
              <button
                key={artist.id}
                onClick={() => { onSelectArtist(artist); onClose(); }}
                className="w-full text-left px-3 py-2.5 xerox-border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group rounded-sm"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-mono font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {highlight(artist.name, query)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-muted-foreground" style={{ fontSize: '0.6rem' }}>
                        {highlight(artist.origin ?? '—', query)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className={`archival-label ${ERA_COLOR[artist.era] ?? 'text-muted-foreground'}`}>
                      {ERA_LABEL[artist.era] ?? artist.era}
                    </span>
                    <span className="flex items-center gap-0.5 text-muted-foreground" style={{ fontSize: '0.6rem' }}>
                      <Music2 className="w-2.5 h-2.5" />
                      {artist.songs?.length ?? 0}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

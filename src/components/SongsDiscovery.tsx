import { useState, useMemo } from 'react';
import { X, Search, Play, Plus, Music, ExternalLink } from 'lucide-react';
import { ARTISTS, type MoodTag, type EraId, type Song } from '@/data/artists';
import { type PlaylistTrack } from '@/data/playlists';
import { toast } from 'sonner';

interface SongEntry {
  song: Song;
  artistId: string;
  artistName: string;
  era: EraId;
}

// Collect all songs across all artists
const ALL_SONGS: SongEntry[] = ARTISTS.flatMap(a =>
  a.songs.map(s => ({
    song: s,
    artistId: a.id,
    artistName: a.name,
    era: a.era,
  }))
);

const ERA_LABELS: Record<EraId, string> = {
  origin: 'ORIGINS',
  golden: 'GOLDEN AGE',
  expansion: 'EXPANSION',
  modern: 'MODERN',
};

const MOOD_OPTIONS: MoodTag[] = ['dark', 'melancholic', 'jazzy', 'smoky', 'urban', 'cinematic', 'cold', 'hypnotic', 'ethereal', 'dreamy', 'tense', 'intense', 'warm', 'nostalgic', 'meditative', 'experimental'];
const ERA_OPTIONS: EraId[] = ['origin', 'golden', 'expansion', 'modern'];

function moodColor(m: MoodTag): string {
  const map: Partial<Record<MoodTag, string>> = {
    dark: 'text-blue-400 border-blue-400/40',
    melancholic: 'text-blue-300 border-blue-300/40',
    jazzy: 'text-accent border-accent/40',
    smoky: 'text-foreground/50 border-border',
    urban: 'text-foreground/70 border-foreground/20',
    cinematic: 'text-blue-200 border-blue-200/40',
    cold: 'text-sky-300 border-sky-300/40',
    hypnotic: 'text-violet-300 border-violet-300/40',
    ethereal: 'text-purple-200 border-purple-200/40',
    dreamy: 'text-indigo-300 border-indigo-300/40',
    tense: 'text-orange-300 border-orange-300/40',
    intense: 'text-red-400 border-red-400/40',
    warm: 'text-amber-300 border-amber-300/40',
    nostalgic: 'text-yellow-300 border-yellow-300/40',
    meditative: 'text-emerald-300 border-emerald-300/40',
    experimental: 'text-pink-300 border-pink-300/40',
  };
  return map[m] ?? 'text-muted-foreground border-border';
}

interface SongsDiscoveryProps {
  onClose: () => void;
  onAddToPlaylist: (track: PlaylistTrack) => void;
  onSelectSong?: (entry: SongEntry) => void;
}

export default function SongsDiscovery({ onClose, onAddToPlaylist, onSelectSong }: SongsDiscoveryProps) {
  const [query, setQuery] = useState('');
  const [activeMoods, setActiveMoods] = useState<MoodTag[]>([]);
  const [activeEras, setActiveEras] = useState<EraId[]>([]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_SONGS.filter(({ song, artistName, era }) => {
      if (activeMoods.length > 0 && !activeMoods.some(m => song.mood.includes(m))) return false;
      if (activeEras.length > 0 && !activeEras.includes(era)) return false;
      if (q && !song.title.toLowerCase().includes(q) && !artistName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeMoods, activeEras]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleMood = (m: MoodTag) => {
    setActiveMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
    setPage(0);
  };
  const toggleEra = (e: EraId) => {
    setActiveEras(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
    setPage(0);
  };

  const handleAdd = (entry: SongEntry) => {
    onAddToPlaylist({
      id: `${entry.song.id}-${Date.now()}`,
      title: entry.song.title,
      artist: entry.artistName,
      album: entry.song.album,
      year: entry.song.year,
      youtubeId: entry.song.youtubeId,
      mood: entry.song.mood,
    });
    toast.success(`Added "${entry.song.title}" to playlist.`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <div className="archival-label text-accent" style={{ fontSize: '0.55rem' }}>ARCHIVE SYSTEM</div>
          <h2 className="text-sm font-mono font-bold text-foreground tracking-tight flex items-center gap-1">
            <Music className="w-3.5 h-3.5" />
            SONGS DISCOVERY
          </h2>
          <div className="archival-label text-muted-foreground/50 mt-0.5">
            {filtered.length} TRACKS · {ALL_SONGS.length} TOTAL
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(0); }}
            placeholder="search tracks or artists…"
            className="w-full bg-transparent border border-border/50 text-xs font-mono text-foreground placeholder:text-muted-foreground/30 pl-7 pr-3 py-1.5 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-border space-y-2">
        <div>
          <div className="archival-label mb-1" style={{ fontSize: '0.5rem' }}>MOOD</div>
          <div className="flex flex-wrap gap-1">
            {MOOD_OPTIONS.map(m => (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                className={`px-1.5 py-0.5 text-xs font-mono border transition-colors ${
                  activeMoods.includes(m) ? `${moodColor(m)} bg-accent/10` : 'text-muted-foreground/50 border-border/30 hover:border-accent/40'
                }`}
                style={{ fontSize: '0.55rem' }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="archival-label mb-1" style={{ fontSize: '0.5rem' }}>ERA</div>
          <div className="flex flex-wrap gap-1">
            {ERA_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => toggleEra(e)}
                className={`px-1.5 py-0.5 text-xs font-mono border transition-colors ${
                  activeEras.includes(e) ? 'text-accent border-accent/50 bg-accent/10' : 'text-muted-foreground/50 border-border/30 hover:border-accent/40'
                }`}
                style={{ fontSize: '0.55rem' }}
              >
                {ERA_LABELS[e]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/30 text-xs font-mono">
            NO TRACKS MATCH
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {visible.map(entry => (
              <div key={`${entry.artistId}-${entry.song.id}`} className="group flex items-start gap-2 px-4 py-2.5 hover:bg-accent/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <button
                    className="text-left w-full"
                    onClick={() => onSelectSong?.(entry)}
                  >
                    <div className="text-xs font-mono text-foreground/90 truncate group-hover:text-foreground transition-colors">
                      {entry.song.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {entry.artistName} · {entry.song.year}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className="archival-label text-muted-foreground/30" style={{ fontSize: '0.45rem' }}>
                      {ERA_LABELS[entry.era]}
                    </span>
                    {entry.song.mood.slice(0, 2).map(m => (
                      <span key={m} className={`font-mono ${moodColor(m).split(' ')[0]}`} style={{ fontSize: '0.5rem' }}>
                        {m.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {entry.song.youtubeId ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${entry.song.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-accent/60 hover:text-accent transition-colors"
                      title="Play on YouTube"
                    >
                      <Play className="w-3 h-3" />
                    </a>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <a
                        href={`https://soundcloud.com/search?q=${encodeURIComponent(entry.song.title + ' ' + entry.artistName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-accent/60 hover:text-accent transition-colors"
                        title="Search on SoundCloud"
                      >
                        <Music className="w-3 h-3" />
                      </a>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(entry.song.title + ' ' + entry.artistName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        title="Search on YouTube"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  <button
                    onClick={() => handleAdd(entry)}
                    className="p-1 text-muted-foreground/50 hover:text-accent transition-colors"
                    title="Add to playlist"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-3 border-t border-border/30">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              ← PREV
            </button>
            <span className="text-xs font-mono text-muted-foreground/50">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              NEXT →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-border flex items-center justify-between gap-2">
        <div className="archival-label text-muted-foreground/30" style={{ fontSize: '0.45rem' }}>
          {ALL_SONGS.length} INDEXED TRACKS · CLICK TITLE FOR DEEP CONTEXT
        </div>
        {filtered.length > 0 && (
          <button
            onClick={() => {
              filtered.forEach(e => handleAdd(e));
              toast.success(`Added ${filtered.length} track${filtered.length !== 1 ? 's' : ''} to playlist.`);
            }}
            className="flex items-center gap-1 px-2 py-1 xerox-border text-accent/70 border-accent/30 hover:text-accent hover:border-accent/60 hover:bg-accent/5 transition-colors flex-shrink-0"
            title="Add all visible tracks to playlist"
            style={{ fontSize: '0.5rem' }}
          >
            <Plus className="w-2.5 h-2.5" />
            <span className="font-mono">ADD ALL ({filtered.length})</span>
          </button>
        )}
      </div>
    </div>
  );
}

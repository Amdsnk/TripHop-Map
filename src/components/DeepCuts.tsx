import { useState } from 'react';
import { X, Lock, Plus } from 'lucide-react';
import { DEEP_CUTS } from '@/data/artists';
import { type PlaylistTrack } from '@/data/playlists';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  onAddToPlaylist?: (track: PlaylistTrack) => void;
}

export default function DeepCuts({ onClose, onAddToPlaylist }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const reveal = (id: string) => {
    setRevealedIds(prev => new Set([...prev, id]));
  };

  const handleAdd = (cut: typeof DEEP_CUTS[number], e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAddToPlaylist) return;
    onAddToPlaylist({
      id: `${cut.id}-${Date.now()}`,
      title: cut.title,
      artist: cut.artist,
      year: cut.year,
      youtubeId: cut.youtubeId,
      mood: cut.mood,
    });
    toast.success(`Added "${cut.title}" to playlist.`);
  };

  const handleAddAll = () => {
    if (!onAddToPlaylist) return;
    DEEP_CUTS.forEach(cut => {
      onAddToPlaylist({
        id: `${cut.id}-${Date.now()}-${Math.random()}`,
        title: cut.title,
        artist: cut.artist,
        year: cut.year,
        youtubeId: cut.youtubeId,
        mood: cut.mood,
      });
    });
    toast.success(`Added all ${DEEP_CUTS.length} deep cuts to playlist.`);
  };

  if (!unlocked) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 panel-enter">
        <div className="text-center">
          <div className="mb-6">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <div className="flicker-text text-xs font-mono text-accent tracking-widest mb-2">
              ▓▓▓ RESTRICTED ARCHIVE ▓▓▓
            </div>
            <div className="archival-label mb-4">DEEP CUTS — UNDERGROUND SELECTIONS</div>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
              This section contains rare, obscure, and lesser-known recordings from the trip-hop underground.
              Proceed only if you&apos;re prepared to descend further.
            </p>
          </div>
          <button
            onClick={() => setUnlocked(true)}
            className="xerox-border px-6 py-2 text-xs font-mono text-accent border-accent hover:bg-accent/10 transition-all"
          >
            ACCESS ARCHIVE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden panel-enter">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flicker-text archival-label text-accent">RESTRICTED ARCHIVE</div>
            <h2 className="archival-title text-lg text-glow">DEEP CUTS</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Underground selections. Rare pressings. Forgotten frequencies. The edges of trip-hop.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
        {DEEP_CUTS.map(cut => {
          const isRevealed = revealedIds.has(cut.id);
          return (
            <div
              key={cut.id}
              className="xerox-border hover:border-accent/40 transition-all cursor-pointer"
              onClick={() => reveal(cut.id)}
            >
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-accent border border-accent/40 px-1.5 py-0.5" style={{ fontSize: '0.6rem' }}>
                        {cut.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{cut.year}</span>
                    </div>
                    <div className="archival-title text-sm">{cut.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cut.artist}</div>
                  </div>
                </div>

                {isRevealed ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-foreground/70 leading-relaxed">{cut.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {cut.mood.map(m => <span key={m} className="mood-tag">{m}</span>)}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {cut.youtubeId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${cut.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-accent hover:text-accent-foreground transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          ▶ PLAY ON YOUTUBE
                        </a>
                      )}
                      {!cut.youtubeId && (
                        <>
                          <a
                            href={`https://soundcloud.com/search?q=${encodeURIComponent(cut.artist + ' ' + cut.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-accent hover:text-accent-foreground transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            ♫ SOUNDCLOUD
                          </a>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(cut.artist + ' ' + cut.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            ↗ YOUTUBE
                          </a>
                        </>
                      )}
                      {onAddToPlaylist && (
                        <button
                          onClick={e => handleAdd(cut, e)}
                          className="flex items-center gap-1 text-xs font-mono text-muted-foreground/60 hover:text-accent transition-colors"
                          title="Add to playlist"
                        >
                          <Plus className="w-3 h-3" />
                          ADD TO PLAYLIST
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-muted-foreground/40 font-mono">
                    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ — CLICK TO REVEAL
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {onAddToPlaylist && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-border flex items-center justify-between">
          <div className="archival-label text-muted-foreground/30" style={{ fontSize: '0.45rem' }}>
            {DEEP_CUTS.length} DEEP CUTS — CLICK TRACK TO REVEAL
          </div>
          <button
            onClick={handleAddAll}
            className="flex items-center gap-1 px-2 py-1 xerox-border text-accent/70 border-accent/30 hover:text-accent hover:border-accent/60 hover:bg-accent/5 transition-colors flex-shrink-0"
            title="Add all deep cuts to playlist"
            style={{ fontSize: '0.5rem' }}
          >
            <Plus className="w-2.5 h-2.5" />
            <span className="font-mono">ADD ALL ({DEEP_CUTS.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}

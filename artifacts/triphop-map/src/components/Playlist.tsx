import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Play, Plus, Trash2, Copy, ExternalLink, Music2, ChevronDown, ChevronRight, Share2, Loader2 } from 'lucide-react';
import { CURATED_PLAYLISTS, type PlaylistTrack, type CuratedPlaylist } from '@/data/playlists';
import { startSpotifyAuth, exportPlaylistToSpotify } from '@/hooks/useSpotify';
import { toast } from 'sonner';

// ─── Playlist URL encoding ────────────────────────────────────────────────────
export function encodePlaylistToHash(queue: PlaylistTrack[]): string {
  const minimal = queue.map(t => ({
    id: t.id,
    ti: t.title,
    ar: t.artist,
    al: t.album,
    yr: t.year,
    yt: t.youtubeId ?? '',
    mo: t.mood,
    no: t.note ?? '',
  }));
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(minimal))));
  } catch {
    return '';
  }
}

export function decodePlaylistFromHash(encoded: string): PlaylistTrack[] {
  try {
    const raw = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    if (!Array.isArray(raw)) return [];
    return raw.map((t: Record<string, unknown>, i: number) => ({
      id: `shared-${i}-${Date.now()}`,
      title: String(t.ti ?? ''),
      artist: String(t.ar ?? ''),
      album: String(t.al ?? ''),
      year: Number(t.yr ?? 0),
      youtubeId: String(t.yt ?? '') || undefined,
      mood: Array.isArray(t.mo) ? (t.mo as string[]) : [],
      note: String(t.no ?? '') || undefined,
    }));
  } catch {
    return [];
  }
}

interface PlaylistProps {
  queue: PlaylistTrack[];
  onClose: () => void;
  onAddTrack: (track: PlaylistTrack) => void;
  onRemoveTrack: (id: string) => void;
  onClearQueue: () => void;
  onShareUrl: () => void;
  sharedLoaded?: boolean;
  /** If set, means we just returned from Spotify OAuth and have an access token ready */
  spotifyToken?: string;
  onSpotifyTokenConsumed?: () => void;
}

function moodColor(mood: string): string {
  const map: Record<string, string> = {
    dark: 'text-blue-400',
    melancholic: 'text-blue-300',
    jazzy: 'text-accent',
    smoky: 'text-foreground/50',
    urban: 'text-foreground/70',
    cinematic: 'text-blue-200',
  };
  return map[mood] ?? 'text-muted-foreground';
}

function TrackRow({
  track,
  onAdd,
  onRemove,
  removable,
}: {
  track: PlaylistTrack;
  onAdd?: (t: PlaylistTrack) => void;
  onRemove?: (id: string) => void;
  removable?: boolean;
}) {
  return (
    <div className="group flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-foreground/90 truncate">{track.title}</div>
        <div className="text-xs text-muted-foreground truncate">
          {track.artist} · {track.year}
        </div>
        {track.note && (
          <div className="text-xs text-muted-foreground/50 italic mt-0.5 leading-snug line-clamp-2">
            {track.note}
          </div>
        )}
        <div className="flex gap-1 mt-1 flex-wrap">
          {track.mood.map(m => (
            <span key={m} className={`text-xs font-mono ${moodColor(m)}`} style={{ fontSize: '0.55rem' }}>
              {m.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {track.youtubeId && (
          <a
            href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-muted-foreground hover:text-accent transition-colors"
            title="Open on YouTube"
          >
            <Play className="w-3 h-3" />
          </a>
        )}
        {!track.youtubeId && (
          <div className="flex items-center gap-0.5">
            <a
              href={`https://soundcloud.com/search?q=${encodeURIComponent(track.title + ' ' + track.artist)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-accent/60 hover:text-accent transition-colors"
              title="Search on SoundCloud"
            >
              <Music2 className="w-3 h-3" />
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-muted-foreground hover:text-muted-foreground/70 transition-colors"
              title="Search on YouTube"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
        {onAdd && (
          <button
            onClick={() => onAdd(track)}
            className="p-1 text-muted-foreground hover:text-accent transition-colors"
            title="Add to my playlist"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
        {removable && onRemove && (
          <button
            onClick={() => onRemove(track.id)}
            className="p-1 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function CuratedBlock({
  playlist,
  onAdd,
  onAddAll,
}: {
  playlist: CuratedPlaylist;
  onAdd: (t: PlaylistTrack) => void;
  onAddAll: (tracks: PlaylistTrack[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="xerox-border p-3 mb-3">
      <button
        className="w-full flex items-center justify-between gap-2"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="text-left">
          <div className="archival-label text-accent" style={{ fontSize: '0.55rem' }}>
            {playlist.label}
          </div>
          <div className="text-xs font-mono font-bold text-foreground">{playlist.name}</div>
          <div className="text-xs text-muted-foreground leading-snug mt-0.5">{playlist.description}</div>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-3">
          <button
            onClick={() => onAddAll(playlist.tracks)}
            className="mb-2 w-full flex items-center justify-center gap-1 px-3 py-1 xerox-border border-accent/40 text-accent text-xs font-mono hover:bg-accent/10 transition-colors"
          >
            <Plus className="w-3 h-3" />
            ADD ALL TO MY PLAYLIST
          </button>
          <div>
            {playlist.tracks.map(track => (
              <TrackRow key={track.id} track={track} onAdd={onAdd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Playlist({
  queue,
  onClose,
  onAddTrack,
  onRemoveTrack,
  onClearQueue,
  onShareUrl,
  sharedLoaded,
  spotifyToken,
  onSpotifyTokenConsumed,
}: PlaylistProps) {
  const [tab, setTab] = useState<'mine' | 'curated'>('mine');
  const [spotifyExporting, setSpotifyExporting] = useState(false);
  const [spotifyProgress, setSpotifyProgress] = useState<{ done: number; total: number } | null>(null);
  const exportAttemptedRef = useRef(false);

  // Auto-trigger export if we just returned from Spotify OAuth
  const handleSpotifyExport = useCallback(async (token: string) => {
    if (exportAttemptedRef.current) return;
    exportAttemptedRef.current = true;
    if (queue.length === 0) { toast.error('Playlist is empty.'); return; }
    setSpotifyExporting(true);
    setSpotifyProgress({ done: 0, total: queue.length });
    try {
      const result = await exportPlaylistToSpotify(
        token,
        queue.map(t => ({ title: t.title, artist: t.artist })),
        'Trip-Hop Archive Export',
        (done, total) => setSpotifyProgress({ done, total }),
      );
      toast.success(
        `Spotify playlist created! ${result.added} tracks added${result.skipped > 0 ? `, ${result.skipped} not found` : ''}.`,
        { action: { label: 'Open', onClick: () => window.open(result.playlistUrl, '_blank') } }
      );
      onSpotifyTokenConsumed?.();
    } catch (err) {
      toast.error(`Spotify export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSpotifyExporting(false);
      setSpotifyProgress(null);
    }
  }, [queue, onSpotifyTokenConsumed]);

  // Trigger when token arrives (from OAuth redirect)
  const tokenHandledRef = useRef(false);
  useEffect(() => {
    if (spotifyToken && !tokenHandledRef.current) {
      tokenHandledRef.current = true;
      handleSpotifyExport(spotifyToken);
    }
  }, [spotifyToken, handleSpotifyExport]);


  const handleCopyAsText = useCallback(() => {
    if (queue.length === 0) {
      toast.error('Your playlist is empty.');
      return;
    }
    const text = queue
      .map(
        t =>
          `${t.title} — ${t.artist} (${t.year})${t.youtubeId ? `\nhttps://www.youtube.com/watch?v=${t.youtubeId}` : ''}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Playlist copied to clipboard.');
    });
  }, [queue]);

  const handleExportYT = useCallback(() => {
    const tracksWithYT = queue.filter(t => t.youtubeId);
    if (tracksWithYT.length === 0) {
      toast.error('No tracks with YouTube IDs in your playlist.');
      return;
    }
    // Open each in a YouTube search (can't create playlists without OAuth)
    const ids = tracksWithYT.map(t => t.youtubeId).join(',');
    const url = `https://www.youtube.com/watch_videos?video_ids=${ids}`;
    window.open(url, '_blank');
    toast.success(`Opening ${tracksWithYT.length} tracks on YouTube.`);
  }, [queue]);

  const handleAddAll = useCallback(
    (tracks: PlaylistTrack[]) => {
      tracks.forEach(t => onAddTrack(t));
      toast.success(`Added ${tracks.length} tracks to your playlist.`);
    },
    [onAddTrack]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="archival-label text-accent" style={{ fontSize: '0.55rem' }}>
            ARCHIVE SYSTEM
          </div>
          <h2 className="text-sm font-mono font-bold text-foreground tracking-tight flex items-center gap-1">
            <Music2 className="w-3.5 h-3.5" />
            PLAYLISTS
          </h2>
          {sharedLoaded && queue.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <ExternalLink className="w-2.5 h-2.5 text-accent/70" />
              <span className="text-accent/70 font-mono" style={{ fontSize: '0.5rem' }}>
                LOADED FROM SHARED LINK
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex border-b border-border">
        {(['mine', 'curated'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-mono transition-colors ${
              tab === t
                ? 'text-accent border-b border-accent bg-accent/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'mine' ? `MY PLAYLIST (${queue.length})` : 'CURATED'}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        {tab === 'mine' && (
          <>
            {queue.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="text-muted-foreground/25 text-xs font-mono">NO TRACKS QUEUED</div>
                <div className="text-xs text-muted-foreground/40 leading-relaxed">
                  Browse ways to add tracks:
                </div>
                <div className="text-left space-y-2 max-w-[180px] mx-auto">
                  {[
                    { step: '01', text: 'Click any node on the map → open artist panel → press + next to a track' },
                    { step: '02', text: 'Open Songs Discovery (top bar) → press + on any result' },
                    { step: '03', text: 'Switch to CURATED tab and expand a playlist' },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-2">
                      <span className="font-mono text-accent/50 shrink-0" style={{ fontSize: '0.5rem' }}>{step}</span>
                      <span className="text-muted-foreground/40 leading-relaxed" style={{ fontSize: '0.55rem' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Action bar */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    onClick={onShareUrl}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 xerox-border text-xs font-mono text-accent border-accent/40 hover:bg-accent/10 transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    SHARE URL
                  </button>
                  <button
                    onClick={handleCopyAsText}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 xerox-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    COPY TEXT
                  </button>
                  <button
                    onClick={handleExportYT}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 xerox-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    OPEN YT
                  </button>
                  <button
                    onClick={() => { onClearQueue(); toast.success('Playlist cleared.'); }}
                    className="px-2 py-1.5 xerox-border text-xs font-mono text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Spotify export */}
                <div className="mb-4">
                  {spotifyExporting ? (
                    <div className="w-full flex flex-col items-center gap-1 px-3 py-2 xerox-border border-[#1DB954]/40 bg-[#1DB954]/5">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 text-[#1DB954] animate-spin" />
                        <span className="text-xs font-mono text-[#1DB954]">EXPORTING TO SPOTIFY…</span>
                      </div>
                      {spotifyProgress && (
                        <div className="w-full bg-border/30 h-0.5 mt-1">
                          <div
                            className="h-full bg-[#1DB954] transition-all duration-300"
                            style={{ width: `${(spotifyProgress.done / spotifyProgress.total) * 100}%` }}
                          />
                        </div>
                      )}
                      {spotifyProgress && (
                        <div className="archival-label text-[#1DB954]/70" style={{ fontSize: '0.45rem' }}>
                          {spotifyProgress.done} / {spotifyProgress.total} TRACKS
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        if (queue.length === 0) { toast.error('Add tracks before exporting.'); return; }
                        sessionStorage.setItem('spotify_pending_queue', JSON.stringify(queue));
                        try { await startSpotifyAuth(); }
                        catch (e) { toast.error(e instanceof Error ? e.message : 'Spotify auth failed'); }
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 xerox-border text-xs font-mono border-[#1DB954]/40 text-[#1DB954]/80 hover:bg-[#1DB954]/10 hover:text-[#1DB954] transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      EXPORT TO SPOTIFY
                    </button>
                  )}
                </div>
                {queue.map(track => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    removable
                    onRemove={onRemoveTrack}
                  />
                ))}
              </>
            )}
          </>
        )}

        {tab === 'curated' && (
          <>
            <div className="archival-label text-muted-foreground/50 mb-4">
              {CURATED_PLAYLISTS.length} CURATED SELECTIONS · CLICK TO EXPAND
            </div>
            {CURATED_PLAYLISTS.map(pl => (
              <CuratedBlock
                key={pl.id}
                playlist={pl}
                onAdd={t => { onAddTrack(t); toast.success(`Added "${t.title}" to playlist.`); }}
                onAddAll={handleAddAll}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Music, Layers, Mic, Plus, AlertCircle, Play } from 'lucide-react';
import { type Song, type Artist } from '@/data/artists';
import { type PlaylistTrack } from '@/data/playlists';
import { resolveYouTubeId } from '@/utils/youtubeCheck';
import { toast } from 'sonner';

interface Props {
  song: Song;
  artist: Artist;
  onClose: () => void;
  onAddToPlaylist: (track: PlaylistTrack) => void;
}

const MOOD_COLORS: Record<string, string> = {
  dark: '#0D2035',
  melancholic: '#1A3A5C',
  jazzy: '#1E4060',
  smoky: '#162840',
  urban: '#0E2030',
  cinematic: '#203858',
};

function isPlaceholderSCUrl(url: string) {
  return url.includes('/search?') || url.includes('soundcloud.com/search');
}

export default function SongPanel({ song, artist, onClose, onAddToPlaylist }: Props) {
  // Resolve: use override ID if one has been saved for this song's original ID
  const resolvedYtId  = song.youtubeId ? resolveYouTubeId(song.youtubeId) : undefined;
  const hasYoutube    = Boolean(resolvedYtId);
  const hasSoundcloud = Boolean(song.soundcloudUrl) && !isPlaceholderSCUrl(song.soundcloudUrl ?? '');
  const [ytError, setYtError]  = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset on song change
  useEffect(() => { setYtError(false); }, [song.id]);

  // Detect YouTube embed errors via postMessage (requires enablejsapi + origin)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        // onError codes: 2=bad param, 5=HTML5 error, 100=not found, 101/150=embed blocked
        if (d?.event === 'onError') setYtError(true);
        if (d?.event === 'infoDelivery' && d?.info?.error) setYtError(true);
      } catch { /* ignore */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const ytEmbedUrl = resolvedYtId
    ? `https://www.youtube.com/embed/${resolvedYtId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`
    : null;

  const ytWatchUrl   = resolvedYtId ? `https://www.youtube.com/watch?v=${resolvedYtId}` : null;
  const ytSearchUrl  = `https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name + ' ' + song.title)}`;
  const scSearchUrl  = `https://soundcloud.com/search?q=${encodeURIComponent(artist.name + ' ' + song.title)}`;

  return (
    <div className="flex flex-col h-full overflow-hidden xerox-border panel-enter">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="archival-label text-accent mb-1">{artist.name}</div>
            <h2 className="archival-title text-lg leading-tight text-glow">{song.title}</h2>
            <div className="text-xs text-muted-foreground mt-0.5">{song.album} · {song.year}</div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => {
                onAddToPlaylist({
                  id: `${artist.id}-${song.id}`,
                  title: song.title,
                  artist: artist.name,
                  album: song.album,
                  year: song.year,
                  youtubeId: song.youtubeId,
                  mood: song.mood,
                });
                toast.success(`Added "${song.title}" to playlist`);
              }}
              className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              title="Add to playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { label: 'BPM',   value: String(song.bpm) },
            { label: 'KEY',   value: song.key },
            { label: 'YEAR',  value: String(song.year) },
            { label: 'ALBUM', value: song.album },
          ].map(({ label, value }) => (
            <div key={label} className="xerox-border p-2">
              <div className="archival-label text-muted-foreground">{label}</div>
              <div className="text-xs font-mono text-foreground mt-0.5 truncate">{value}</div>
            </div>
          ))}
        </div>

        {/* Mood tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {song.mood.map(m => (
            <span key={m} className="mood-tag active" style={{ backgroundColor: `${MOOD_COLORS[m]}50` }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── LISTEN section ── */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-3">LISTEN</div>

          {/* YouTube embed — shown when ID exists and no error detected */}
          {hasYoutube && ytEmbedUrl && !ytError && (
            <div className="relative w-full mb-2" style={{ paddingBottom: '56.25%' }}>
              <iframe
                ref={iframeRef}
                src={ytEmbedUrl}
                className="absolute inset-0 w-full h-full xerox-border"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${song.title} - ${artist.name}`}
              />
            </div>
          )}

          {/* YouTube error state — auto-fallback to SoundCloud embed if available */}
          {hasYoutube && ytError && (
            <div className="mb-3">
              {hasSoundcloud ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 mb-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>YouTube tidak tersedia · Beralih ke SoundCloud</span>
                  </div>
                  <iframe
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(song.soundcloudUrl!)}&color=%23aaaaaa&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                    className="w-full xerox-border"
                    style={{ height: '166px', border: 'none' }}
                    title={`${song.title} - ${artist.name} (SoundCloud)`}
                  />
                </>
              ) : (
                <div className="xerox-border p-4 flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground font-mono mb-1">Video tidak tersedia</p>
                    <p className="text-xs text-muted-foreground/60 font-mono">Cari versi lain di YouTube atau SoundCloud</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={ytWatchUrl!} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono xerox-border px-4 py-2 text-accent hover:border-accent transition-colors">
                      <Play className="w-3.5 h-3.5" /> Buka YouTube
                    </a>
                    <a href={scSearchUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono xerox-border px-4 py-2 text-muted-foreground hover:border-accent transition-colors">
                      <Music className="w-3.5 h-3.5" /> SoundCloud
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No YouTube ID — SoundCloud embed or search fallback */}
          {!hasYoutube && (
            <div className="mb-3">
              {hasSoundcloud ? (
                <iframe
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(song.soundcloudUrl!)}&color=%23aaaaaa&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                  className="w-full xerox-border"
                  style={{ height: '166px', border: 'none' }}
                  title={`${song.title} - ${artist.name} (SoundCloud)`}
                />
              ) : (
                <a
                  href={ytSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs font-mono xerox-border p-3 text-accent hover:border-accent transition-colors w-full"
                >
                  <Play className="w-3.5 h-3.5" /> Cari di YouTube
                </a>
              )}
            </div>
          )}

          {/* Always-visible action row: Open YouTube + SoundCloud */}
          <div className="flex flex-wrap gap-2">
            {/* Open YouTube watch link — always show if youtubeId exists */}
            {hasYoutube && !ytError && ytWatchUrl && (
              <a
                href={ytWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Buka YouTube
              </a>
            )}
            {/* YouTube search — always show as a secondary option */}
            {!ytError && (
              <a
                href={ytSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Cari YouTube
              </a>
            )}
            {/* SoundCloud */}
            {hasSoundcloud ? (
              <a href={song.soundcloudUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <Music className="w-3 h-3" /> SoundCloud
              </a>
            ) : (
              <a href={scSearchUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <Music className="w-3 h-3" /> Cari SoundCloud
              </a>
            )}
          </div>
        </div>

        {/* Story */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-2 flex items-center gap-2">
            <Music className="w-3 h-3" /> TRACK STORY
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{song.story}</p>
        </div>

        {/* Production Context */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-2">PRODUCTION CONTEXT</div>
          <p className="text-sm text-foreground/70 leading-relaxed">{song.productionContext}</p>
        </div>

        {/* Cultural Impact */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-2">CULTURAL IMPACT</div>
          <p className="text-sm text-foreground/70 leading-relaxed">{song.culturalImpact}</p>
        </div>

        {/* Lyrics Analysis */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-2 flex items-center gap-2">
            <Mic className="w-3 h-3" /> LYRICS ANALYSIS
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed italic">{song.lyricsAnalysis}</p>
        </div>

        {/* Sampling Sources */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-2 flex items-center gap-2">
            <Layers className="w-3 h-3" /> SAMPLING SOURCES
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed font-mono text-xs">{song.samplingSources}</p>
        </div>

        {/* Album context */}
        <div className="p-4">
          <div className="archival-label mb-2">ALBUM CONTEXT</div>
          <div className="xerox-border p-3">
            <div className="text-xs font-mono text-accent">{song.year}</div>
            <div className="text-sm font-bold text-foreground mt-0.5">{song.album}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{artist.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


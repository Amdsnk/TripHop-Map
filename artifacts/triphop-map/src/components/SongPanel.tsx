import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Music, Layers, Mic, Plus, AlertCircle, Play, Loader2, RefreshCw } from 'lucide-react';
import { type Song, type Artist } from '@/data/artists';
import { type PlaylistTrack } from '@/data/playlists';
import { resolveYouTubeId, checkYouTubeId, markBrokenId, isBrokenId, findAlternativeYouTubeId } from '@/utils/youtubeCheck';
import { getYtAddition } from '@/data/ytAdditions';
import { getBandcampEmbed } from '@/data/bandcampAdditions';
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
  const resolvedYtId  = song.youtubeId
    ? resolveYouTubeId(song.youtubeId)
    : getYtAddition(song.id);
  const hasYoutube    = Boolean(resolvedYtId);
  const hasSoundcloud = Boolean(song.soundcloudUrl) && !isPlaceholderSCUrl(song.soundcloudUrl ?? '');
  const bandcampEmbed = getBandcampEmbed(song.id);
  const hasBandcamp   = Boolean(bandcampEmbed);

  const [ytError, setYtError]       = useState(false);
  const [ytChecking, setYtChecking] = useState(false);
  const [findingAlt, setFindingAlt] = useState(false);
  const [altYtId, setAltYtId]       = useState<string | null>(null);
  const [altTitle, setAltTitle]     = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Prevent double-triggering the alt search
  const altSearchedRef = useRef(false);

  /** Search for a playable alternative from the same artist and update state. */
  const searchForAlternative = (brokenId: string) => {
    if (altSearchedRef.current) return;
    altSearchedRef.current = true;
    setFindingAlt(true);
    findAlternativeYouTubeId(artist.songs, brokenId).then(result => {
      setFindingAlt(false);
      if (result) {
        setAltYtId(result.id);
        setAltTitle(result.title);
      }
    });
  };

  // On mount: if already known broken from this session, skip oEmbed and find alt immediately.
  // Otherwise run oEmbed pre-check; if it fails, mark broken and find alt.
  useEffect(() => {
    if (!resolvedYtId) { setYtError(false); return; }

    // Reset alt state when song changes
    altSearchedRef.current = false;
    setAltYtId(null);
    setAltTitle(null);
    setYtError(false);

    if (isBrokenId(resolvedYtId)) {
      setYtError(true);
      searchForAlternative(resolvedYtId);
      return;
    }

    setYtChecking(true);
    checkYouTubeId(resolvedYtId).then(available => {
      setYtChecking(false);
      if (!available) {
        markBrokenId(resolvedYtId);
        setYtError(true);
        searchForAlternative(resolvedYtId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedYtId]);

  // Runtime detection: YouTube iframe postMessage error events (codes 101/150 = embed blocked).
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        const hasError =
          (d?.event === 'onError') ||
          (d?.event === 'infoDelivery' && d?.info?.error);
        if (hasError && resolvedYtId && !ytError) {
          markBrokenId(resolvedYtId);
          setYtError(true);
          searchForAlternative(resolvedYtId);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedYtId, ytError]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // The active ID to embed: alt replacement takes priority over original
  const activeYtId = altYtId ?? (ytError ? null : resolvedYtId);
  const ytEmbedUrl = activeYtId
    ? `https://www.youtube.com/embed/${activeYtId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`
    : null;
  const ytWatchUrl  = activeYtId ? `https://www.youtube.com/watch?v=${activeYtId}` : null;
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name + ' ' + song.title)}`;
  const scSearchUrl = `https://soundcloud.com/search?q=${encodeURIComponent(artist.name + ' ' + song.title)}`;

  // Is the embed currently showing a working video?
  const showingEmbed = Boolean(activeYtId) && !ytChecking && !(ytError && !altYtId);

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

          {/* 1. Loading: oEmbed pre-check */}
          {hasYoutube && ytChecking && (
            <div className="w-full mb-2 xerox-border flex items-center justify-center" style={{ height: '200px' }}>
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-mono">Memeriksa ketersediaan video…</span>
              </div>
            </div>
          )}

          {/* 2. Loading: searching for alternative after error */}
          {findingAlt && (
            <div className="w-full mb-2 xerox-border flex items-center justify-center" style={{ height: '200px' }}>
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-xs font-mono">Searching for another video by this artist…</span>
              </div>
            </div>
          )}

          {/* 3. Alternative-video notice badge */}
          {altYtId && altTitle && !findingAlt && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/70 mb-2 xerox-border px-2 py-1.5">
              <RefreshCw className="w-3 h-3 flex-shrink-0 text-accent" />
              <span className="truncate">
                <span className="text-accent">Lagu lain dari artis ini</span>
                {' · '}
                <span className="text-foreground/60">{altTitle}</span>
              </span>
            </div>
          )}

          {/* 4. YouTube embed — original (no error) or replacement (altYtId) */}
          {ytEmbedUrl && !ytChecking && !findingAlt && (
            <div className="relative w-full mb-2" style={{ paddingBottom: '56.25%' }}>
              <iframe
                ref={iframeRef}
                key={activeYtId}
                src={ytEmbedUrl}
                className="absolute inset-0 w-full h-full xerox-border"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={altTitle ? `${altTitle} - ${artist.name}` : `${song.title} - ${artist.name}`}
              />
            </div>
          )}

          {/* 5. Error state — no alt found — fall back to SoundCloud or manual links */}
          {ytError && !altYtId && !findingAlt && (
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
                    <p className="text-xs text-muted-foreground font-mono mb-1">Video tidak tersedia untuk embed</p>
                    <p className="text-xs text-muted-foreground/60 font-mono">Buka langsung di YouTube</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {resolvedYtId && (
                      <a href={`https://www.youtube.com/watch?v=${resolvedYtId}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-mono xerox-border px-4 py-2 text-accent hover:border-accent transition-colors">
                        <Play className="w-3.5 h-3.5" /> Buka YouTube
                      </a>
                    )}
                    <a href={scSearchUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono xerox-border px-4 py-2 text-muted-foreground hover:border-accent transition-colors">
                      <Music className="w-3.5 h-3.5" /> SoundCloud
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. No YouTube ID — SoundCloud embed or search fallback */}
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
              ) : hasBandcamp ? (
                <div>
                  <iframe
                    src={bandcampEmbed}
                    className="w-full xerox-border"
                    style={{ height: '120px', border: 'none' }}
                    seamless
                    title={`${song.title} - ${artist.name} (Bandcamp)`}
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <a href={`https://bandcamp.com/search?q=${encodeURIComponent(artist.name + ' ' + song.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-[#1da0c3] hover:border-[#1da0c3] transition-colors">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5z"/></svg>
                      Bandcamp
                    </a>
                    <a href={ytSearchUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent transition-colors">
                      <Play className="w-3 h-3" /> YouTube
                    </a>
                  </div>
                </div>
              ) : (
                <div className="xerox-border p-4 flex flex-col items-center gap-3 text-center">
                  <Music className="w-5 h-5 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground font-mono">Belum ada embed tersedia</p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <a href={ytSearchUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono xerox-border px-4 py-2 text-accent hover:border-accent transition-colors">
                      <Play className="w-3.5 h-3.5" /> Search on YouTube
                    </a>
                    <a href={scSearchUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono xerox-border px-4 py-2 text-muted-foreground hover:border-accent transition-colors">
                      <Music className="w-3.5 h-3.5" /> Search on SoundCloud
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action row — shown whenever embed is visible */}
          {showingEmbed && (
            <div className="flex flex-wrap gap-2">
              {ytWatchUrl && (
                <a href={ytWatchUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                  <ExternalLink className="w-3 h-3" /> Buka YouTube
                </a>
              )}
              <a href={ytSearchUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                <ExternalLink className="w-3 h-3" /> Search YouTube
              </a>
              {hasSoundcloud && (
                <a href={song.soundcloudUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                  <Music className="w-3 h-3" /> SoundCloud
                </a>
              )}
            </div>
          )}
        </div>

        {/* Story */}
        {(song.story ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2 flex items-center gap-2">
              <Music className="w-3 h-3" /> TRACK STORY
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{song.story}</p>
          </div>
        )}

        {/* Production Context */}
        {(song.productionContext ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2">PRODUCTION CONTEXT</div>
            <p className="text-sm text-foreground/70 leading-relaxed">{song.productionContext}</p>
          </div>
        )}

        {/* Cultural Impact */}
        {(song.culturalImpact ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2">CULTURAL IMPACT</div>
            <p className="text-sm text-foreground/70 leading-relaxed">{song.culturalImpact}</p>
          </div>
        )}

        {/* Lyrics Analysis */}
        {(song.lyricsAnalysis ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2 flex items-center gap-2">
              <Mic className="w-3 h-3" /> LYRICS ANALYSIS
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed italic">{song.lyricsAnalysis}</p>
          </div>
        )}

        {/* Sampling Sources */}
        {(() => {
          const src = song.samplingSources;
          const text = Array.isArray(src) ? src.join(', ') : (src ?? '');
          return text.trim().length > 0 ? (
            <div className="p-4 border-b border-border">
              <div className="archival-label mb-2 flex items-center gap-2">
                <Layers className="w-3 h-3" /> SAMPLING SOURCES
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed font-mono text-xs">{text}</p>
            </div>
          ) : null;
        })()}

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


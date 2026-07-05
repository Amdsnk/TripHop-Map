import { useState, useEffect, useCallback } from 'react';
import { Map, Compass, Dna, Radio, Volume2, VolumeX, ListMusic, Music, BookOpen, ShieldCheck } from 'lucide-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import GenreMapCanvas from '@/components/GenreMapCanvas';
import ArtistPanel from '@/components/ArtistPanel';
import SongPanel from '@/components/SongPanel';
import MoodFilter from '@/components/MoodFilter';
import TimelineScrubber from '@/components/TimelineScrubber';
import GeographicMap from '@/components/GeographicMap';
import SoundDNA from '@/components/SoundDNA';
import DeepCuts from '@/components/DeepCuts';
import Playlist, { encodePlaylistToHash, decodePlaylistFromHash } from '@/components/Playlist';
import SongsDiscovery from '@/components/SongsDiscovery';
import WikiPanel from '@/components/WikiPanel';
import YouTubeAuditPanel from '@/components/YouTubeAuditPanel';
import { type Artist, type Song, type MoodTag, type EraId, ARTISTS } from '@/data/artists';
import { type PlaylistTrack } from '@/data/playlists';
import { discoverSimilar } from '@/lib/recommend';
import { useVinylCrackle } from '@/hooks/useVinylCrackle';
import { exchangeCodeForToken } from '@/hooks/useSpotify';
import { toast } from 'sonner';

type RightPanel = 'artist' | 'song' | 'geo' | 'dna' | 'deepcuts' | 'playlist' | 'songs' | 'wiki' | 'audit' | null;

export default function App() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>(null);
  const [activeMoods, setActiveMoods] = useState<MoodTag[]>([]);
  const [activeEra, setActiveEra] = useState<EraId | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([1980, 2026]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [similarArtists, setSimilarArtists] = useState<Artist[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sharedPlaylistLoaded, setSharedPlaylistLoaded] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState<string | undefined>(undefined);
  const [playlistQueue, setPlaylistQueue] = useState<PlaylistTrack[]>(() => {
    // Restore playlist from URL hash OR from sessionStorage (post-Spotify OAuth)
    try {
      const stored = sessionStorage.getItem('spotify_pending_queue');
      if (stored) return JSON.parse(stored) as PlaylistTrack[];
    } catch { /* ignore */ }
    try {
      const hash = window.location.hash;
      const match = hash.match(/[#&]playlist=([^&]*)/);
      if (match && match[1]) {
        const decoded = decodePlaylistFromHash(match[1]);
        if (decoded.length > 0) return decoded;
      }
    } catch { /* ignore */ }
    return [];
  });

  const { createCrackle, playUIClick, stop } = useVinylCrackle();

  // Handle Spotify OAuth callback (?code=...&state=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code && state) {
      // Clean URL immediately
      history.replaceState(null, '', window.location.pathname);
      exchangeCodeForToken(code)
        .then(token => {
          setSpotifyToken(token);
          setRightPanel('playlist');
          toast.success('Spotify connected — exporting playlist…');
        })
        .catch(err => {
          toast.error(`Spotify auth failed: ${err instanceof Error ? err.message : String(err)}`);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show toast when a shared playlist was loaded from URL
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const match = hash.match(/[#&]playlist=([^&]*)/);
      if (match && match[1]) {
        const decoded = decodePlaylistFromHash(match[1]);
        if (decoded.length > 0) {
          setSharedPlaylistLoaded(true);
          // Clear the hash so repeated loads don't re-trigger
          history.replaceState(null, '', window.location.pathname + window.location.search);
          setTimeout(() => {
            toast.success(`Shared playlist loaded — ${decoded.length} track${decoded.length !== 1 ? 's' : ''}`, {
              description: 'Open the playlist panel to view and play tracks.',
              duration: 5000,
            });
          }, 800);
        }
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnter = useCallback(() => {
    setShowIntro(false);
    setAudioEnabled(true);
    createCrackle();
  }, [createCrackle]);

  const toggleAudio = useCallback(() => {
    if (audioEnabled) { stop(); setAudioEnabled(false); }
    else { createCrackle(); setAudioEnabled(true); }
  }, [audioEnabled, stop, createCrackle]);

  const handleSelectArtist = useCallback((artist: Artist) => {
    playUIClick();
    setSelectedArtist(artist);
    setSelectedSong(null);
    setRightPanel('artist');
    setSimilarArtists(discoverSimilar(artist, 4));
  }, [playUIClick]);

  const handleSelectSong = useCallback((song: Song) => {
    playUIClick();
    setSelectedSong(song);
    setRightPanel('song');
  }, [playUIClick]);

  const handleToggleMood = useCallback((mood: MoodTag) => {
    playUIClick();
    setActiveMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  }, [playUIClick]);

  const handleEraChange = useCallback((era: EraId | null) => {
    playUIClick();
    setActiveEra(era);
  }, [playUIClick]);

  const openPanel = useCallback((panel: RightPanel) => {
    playUIClick();
    setRightPanel(prev => prev === panel ? null : panel);
  }, [playUIClick]);

  const handleSharePlaylistUrl = useCallback(() => {
    if (playlistQueue.length === 0) {
      toast.error('Your playlist is empty — add tracks before sharing.');
      return;
    }
    const encoded = encodePlaylistToHash(playlistQueue);
    if (!encoded) {
      toast.error('Failed to encode playlist.');
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}#playlist=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success(`Share URL copied! (${playlistQueue.length} tracks)`);
    }).catch(() => {
      toast.error('Could not copy to clipboard.');
    });
  }, [playlistQueue]);

  const handleAddToPlaylist = useCallback((track: PlaylistTrack) => {
    setPlaylistQueue(prev => [...prev, { ...track, id: `${track.id}-${Date.now()}` }]);
  }, []);

  const handleRemoveFromPlaylist = useCallback((id: string) => {
    setPlaylistQueue(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleClearPlaylist = useCallback(() => {
    setPlaylistQueue([]);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showIntro && (e.key === 'Enter' || e.key === ' ')) handleEnter();
      if (!showIntro && e.key === 'Escape') setRightPanel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showIntro, handleEnter]);

  const ERA_DESCRIPTION: Record<string, string> = {
    origin: 'Bristol underground, 1980–1992. Dub, hip-hop, post-punk in a post-industrial rain.',
    golden: 'The defining years, 1993–1999. Massive Attack, Portishead, Tricky.',
    expansion: 'The sound spreads, 2000–2010. New voices absorb the DNA.',
    modern: 'Hybridization, 2010–NOW. Lo-fi, darkwave, ambient bass.',
  };

  const visibleCount = ARTISTS.filter(a => {
    if (activeEra && a.era !== activeEra) return false;
    if (activeMoods.length > 0 && !(a.mood ?? []).some(m => activeMoods.includes(m))) return false;
    const year = a.albums?.[0]?.year ?? 1990;
    return year >= yearRange[0] && year <= yearRange[1];
  }).length;

  return (
    <Router>
      <div className="fixed inset-0 overflow-hidden bg-background" style={{ fontFamily: "'Space Mono', monospace" }}>
        <BackgroundCanvas />

        {/* INTRO */}
        {showIntro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95">
            <div className="text-center max-w-lg px-8 panel-enter">
              <div className="archival-label text-muted-foreground mb-8 tracking-widest">
                ▓ ARCHIVE SYSTEM v0.2 — COMPLETE DATABASE ▓
              </div>
              <h1 className="text-4xl font-bold text-foreground text-glow leading-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
                TRIP-HOP<br />ARCHIVE MAP
              </h1>
              <div className="text-sm text-muted-foreground mb-2 font-mono">1980 — PRESENT</div>
              <div className="w-16 h-px bg-accent mx-auto mb-6" />
              <p className="text-sm text-foreground/60 leading-relaxed mb-2">
                {ARTISTS.length} artists. 5 curated playlists. An infinite map of influence.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-8">
                Drag to explore. Click nodes to open archives. Build your own playlist.
              </p>
              <button onClick={handleEnter} className="xerox-border border-accent px-8 py-3 text-sm font-mono text-accent hover:bg-accent/10 transition-all glow-soft">
                ENTER ARCHIVE
              </button>
              <div className="mt-4 text-xs text-muted-foreground/40 font-mono">PRESS ENTER OR SPACE</div>
            </div>
          </div>
        )}

        {/* MAIN LAYOUT */}
        {!showIntro && (
          <div className="fixed inset-0 flex flex-col">
            {/* TOP BAR */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-sm z-30">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarCollapsed(p => !p)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="text-xs font-mono">≡</span>
                </button>
                <div>
                  <div className="text-xs font-bold font-mono text-foreground tracking-tight">TRIP-HOP ARCHIVE MAP</div>
                  <div className="archival-label text-accent" style={{ fontSize: '0.55rem' }}>
                    {activeEra ? ERA_DESCRIPTION[activeEra] : `${ARTISTS.length} ARTISTS · 1980 — PRESENT · BRISTOL UNDERGROUND`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {([
                  { icon: <Map className="w-3.5 h-3.5" />, label: 'GEO', panel: 'geo' as RightPanel },
                  { icon: <Dna className="w-3.5 h-3.5" />, label: 'DNA', panel: 'dna' as RightPanel, disabled: !selectedArtist },
                  { icon: <Radio className="w-3.5 h-3.5" />, label: 'CUTS', panel: 'deepcuts' as RightPanel },
                  { icon: <Music className="w-3.5 h-3.5" />, label: 'SONGS', panel: 'songs' as RightPanel },
                  { icon: <BookOpen className="w-3.5 h-3.5" />, label: 'WIKI', panel: 'wiki' as RightPanel },
                  { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'AUDIT', panel: 'audit' as RightPanel },
                  {
                    icon: (
                      <div className="relative">
                        <ListMusic className="w-3.5 h-3.5" />
                        {playlistQueue.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent text-background text-center font-mono leading-3 rounded-full" style={{ fontSize: '0.45rem' }}>
                            {playlistQueue.length > 9 ? '9+' : playlistQueue.length}
                          </span>
                        )}
                      </div>
                    ),
                    label: 'LIST',
                    panel: 'playlist' as RightPanel,
                  },
                ] as Array<{ icon: React.ReactNode; label: string; panel: RightPanel; disabled?: boolean }>).map(({ icon, label, panel, disabled }) => (
                  <button
                    key={label}
                    onClick={() => !disabled && openPanel(panel)}
                    disabled={disabled}
                    className={`flex items-center gap-1 px-2 py-1 xerox-border text-xs font-mono transition-all ${
                      rightPanel === panel
                        ? 'border-accent text-accent bg-accent/10'
                        : disabled
                          ? 'opacity-30 cursor-not-allowed border-border text-muted-foreground'
                          : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                    }`}
                    title={disabled ? 'Select an artist first' : undefined}
                  >
                    {icon}
                    <span className="hidden md:inline">{label}</span>
                  </button>
                ))}

                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-1 px-2 py-1 xerox-border text-xs font-mono border-border text-muted-foreground hover:border-accent/50 hover:text-foreground transition-all"
                >
                  {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* LEFT SIDEBAR */}
              {!sidebarCollapsed && (
                <div className="flex-shrink-0 w-52 border-r border-border bg-background/60 backdrop-blur-sm z-20 overflow-y-auto flex flex-col">
                  <div className="p-3 flex-1 space-y-5">
                    <TimelineScrubber yearRange={yearRange} onYearRangeChange={setYearRange} activeEra={activeEra} onEraChange={handleEraChange} />
                    <div className="w-full h-px bg-border" />
                    <MoodFilter activeMoods={activeMoods} onToggleMood={handleToggleMood} />

                    <div className="border-t border-border pt-3">
                      <div className="archival-label mb-1">VISIBLE NODES</div>
                      <div className="text-lg font-bold font-mono text-accent text-glow">{visibleCount}</div>
                      <div className="text-xs text-muted-foreground">of {ARTISTS.length} total</div>
                    </div>

                    {similarArtists.length > 0 && (
                      <div className="border-t border-border pt-3">
                        <div className="archival-label mb-2 flex items-center gap-1">
                          <Compass className="w-3 h-3" /> DISCOVER SIMILAR
                        </div>
                        <div className="space-y-1">
                          {similarArtists.map(a => (
                            <button
                              key={a.id}
                              onClick={() => handleSelectArtist(a)}
                              className="w-full text-left px-2 py-1 xerox-border hover:border-accent/50 transition-all group"
                            >
                              <div className="text-xs font-mono text-foreground/70 group-hover:text-foreground transition-colors truncate">{a.name}</div>
                              <div className="text-xs text-muted-foreground" style={{ fontSize: '0.6rem' }}>{a.era}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-border">
                    <div className="archival-label text-muted-foreground/40">BRISTOL UNDERGROUND<br />ARCHIVE SYSTEM</div>
                  </div>
                </div>
              )}

              {/* MAP */}
              <div className="flex-1 relative min-w-0 overflow-hidden">
                <GenreMapCanvas
                  activeMoods={activeMoods}
                  activeEra={activeEra}
                  yearRange={yearRange}
                  onSelectArtist={handleSelectArtist}
                  selectedArtistId={selectedArtist?.id ?? null}
                />
              </div>

              {/* RIGHT PANEL — desktop: side panel; mobile: full-screen overlay */}
              {rightPanel && (
                <div className="fixed inset-0 md:static md:inset-auto md:flex-shrink-0 md:w-96 border-l border-border bg-background/95 md:bg-background/90 backdrop-blur-sm z-40 md:z-20 overflow-hidden flex flex-col">
                  {rightPanel === 'artist' && selectedArtist && (
                    <ArtistPanel
                      artist={selectedArtist}
                      onClose={() => setRightPanel(null)}
                      onSelectSong={handleSelectSong}
                      onSelectArtist={handleSelectArtist}
                      onAddToPlaylist={handleAddToPlaylist}
                    />
                  )}
                  {rightPanel === 'song' && selectedSong && selectedArtist && (
                    <SongPanel
                      song={selectedSong}
                      artist={selectedArtist}
                      onClose={() => setRightPanel('artist')}
                      onAddToPlaylist={handleAddToPlaylist}
                    />
                  )}
                  {rightPanel === 'geo' && (
                    <GeographicMap
                      onClose={() => setRightPanel(null)}
                      onSelectArtist={(id: string) => {
                        const a = ARTISTS.find(x => x.id === id);
                        if (a) handleSelectArtist(a);
                      }}
                    />
                  )}
                  {rightPanel === 'dna' && selectedArtist && (
                    <SoundDNA artist={selectedArtist} onClose={() => setRightPanel(null)} />
                  )}
                  {rightPanel === 'deepcuts' && (
                    <DeepCuts onClose={() => setRightPanel(null)} />
                  )}
                  {rightPanel === 'playlist' && (
                    <Playlist
                      queue={playlistQueue}
                      onClose={() => setRightPanel(null)}
                      onAddTrack={handleAddToPlaylist}
                      onRemoveTrack={handleRemoveFromPlaylist}
                      onClearQueue={handleClearPlaylist}
                      onShareUrl={handleSharePlaylistUrl}
                      sharedLoaded={sharedPlaylistLoaded}
                      spotifyToken={spotifyToken}
                      onSpotifyTokenConsumed={() => {
                        setSpotifyToken(undefined);
                        sessionStorage.removeItem('spotify_pending_queue');
                      }}
                    />
                  )}
                  {rightPanel === 'songs' && (
                    <SongsDiscovery
                      onClose={() => setRightPanel(null)}
                      onAddToPlaylist={handleAddToPlaylist}
                      onSelectSong={entry => {
                        const artist = ARTISTS.find(a => a.id === entry.artistId);
                        const song = entry.song;
                        if (artist) {
                          setSelectedArtist(artist);
                          setSelectedSong(song);
                          setRightPanel('song');
                        }
                      }}
                    />
                  )}
                  {rightPanel === 'wiki' && (
                    <WikiPanel onClose={() => setRightPanel(null)} />
                  )}
                  {rightPanel === 'audit' && (
                    <YouTubeAuditPanel onClose={() => setRightPanel(null)} />
                  )}
                </div>
              )}
            </div>

            {/* STATUS BAR */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-1 border-t border-border bg-background/60 backdrop-blur-sm z-30">
              <div className="flex items-center gap-4">
                <div className="archival-label">
                  {selectedArtist ? `SELECTED: ${selectedArtist.name.toUpperCase()}` : 'CLICK NODE TO EXPLORE'}
                </div>
                {activeMoods.length > 0 && (
                  <div className="archival-label text-accent">FILTER: {activeMoods.map(m => m.toUpperCase()).join(' + ')}</div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {playlistQueue.length > 0 && (
                  <div className="archival-label text-accent">{playlistQueue.length} IN PLAYLIST</div>
                )}
                <div className="archival-label text-muted-foreground/50">
                  {audioEnabled ? '◉ VINYL CRACKLE' : '○ VINYL CRACKLE'}
                </div>
              </div>
            </div>
          </div>
        )}

        <Toaster />
      </div>
    </Router>
  );
}

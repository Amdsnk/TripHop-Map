import { useState } from 'react';
import { X, MapPin, Clock, Users, Music, ExternalLink, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { type Artist, type Song, ARTISTS } from '@/data/artists';
import { type PlaylistTrack } from '@/data/playlists';
import { toast } from 'sonner';

interface Props {
  artist: Artist;
  onClose: () => void;
  onSelectSong: (song: Song) => void;
  onSelectArtist: (artist: Artist) => void;
  onAddToPlaylist: (track: PlaylistTrack) => void;
}

export default function ArtistPanel({ artist, onClose, onSelectSong, onSelectArtist, onAddToPlaylist }: Props) {
  const [expandedAlbum, setExpandedAlbum] = useState<number | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [glitch] = useState(false);

  const relatedArtistObjects = (artist.relatedArtists ?? [])
    .map(id => ARTISTS.find(a => a.id === id))
    .filter(Boolean) as Artist[];

  const ERA_LABELS: Record<string, string> = {
    origin: 'ORIGIN 1980–1992',
    golden: 'GOLDEN ERA 1993–1999',
    expansion: 'EXPANSION 2000–2010',
    modern: 'MODERN HYBRIDS 2010–',
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden xerox-border ${glitch ? 'glitch-animate' : ''} panel-enter`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="archival-label text-accent mb-1">{ERA_LABELS[artist.era]}</div>
            <h2 className="archival-title text-xl leading-tight truncate text-glow">{artist.name}</h2>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{artist.origin}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mood tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {(artist.mood ?? []).map(m => (
            <span key={m} className="mood-tag active">{m}</span>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Biography — falls back to artist.description if no long-form biography */}
        {(() => {
          const bio = (artist.biography ?? '').trim().length > 0
            ? (artist.biography ?? '')
            : (artist.description ?? '').trim();
          if (!bio) return null;
          return (
            <div className="p-4 border-b border-border">
              <div className="archival-label mb-2">BIOGRAPHY</div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {showFullBio ? bio : bio.slice(0, 280) + (bio.length > 280 ? '…' : '')}
              </p>
              {bio.length > 280 && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="mt-2 text-xs text-accent hover:text-accent-foreground flex items-center gap-1 transition-colors"
                >
                  {showFullBio ? <><ChevronUp className="w-3 h-3" /> COLLAPSE</> : <><ChevronDown className="w-3 h-3" /> READ MORE</>}
                </button>
              )}
            </div>
          );
        })()}

        {/* Historical Significance */}
        {(artist.historicalSignificance ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2">HISTORICAL SIGNIFICANCE</div>
            <p className="text-sm text-foreground/70 leading-relaxed">{artist.historicalSignificance}</p>
          </div>
        )}

        {/* Formation */}
        {(artist.formationStory ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2">FORMATION</div>
            <p className="text-sm text-foreground/70 leading-relaxed">{artist.formationStory}</p>
          </div>
        )}

        {/* Trip-hop Influence */}
        {(artist.tripHopInfluence ?? '').trim().length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2">INFLUENCE ON TRIP-HOP</div>
            <p className="text-sm text-foreground/70 leading-relaxed">{artist.tripHopInfluence}</p>
          </div>
        )}

        {/* Albums */}
        {(artist.albums ?? []).length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-3 flex items-center gap-2">
              <Clock className="w-3 h-3" /> DISCOGRAPHY TIMELINE
            </div>
            <div className="space-y-2">
              {(artist.albums ?? []).map((album, idx) => (
                <div
                  key={idx}
                  className="xerox-border cursor-pointer hover:border-accent/50 transition-colors"
                  onClick={() => setExpandedAlbum(expandedAlbum === idx ? null : idx)}
                >
                  <div className="p-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-accent flex-shrink-0">{album.year}</span>
                      <span className="text-sm text-foreground truncate">{album.title}</span>
                    </div>
                    {expandedAlbum === idx
                      ? <ChevronUp className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      : <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                  </div>
                  {expandedAlbum === idx && (
                    <div className="px-2 pb-2">
                      <p className="text-xs text-foreground/60 leading-relaxed">{album.significance}</p>
                      {album.youtubeId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${album.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-1 text-xs text-accent hover:text-accent-foreground"
                        >
                          <ExternalLink className="w-3 h-3" /> WATCH ON YOUTUBE
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracks */}
        <div className="p-4 border-b border-border">
          <div className="archival-label mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Music className="w-3 h-3" /> KEY TRACKS</span>
            {artist.songs.length > 0 && (
              <button
                onClick={() => {
                  artist.songs.forEach(song => {
                    onAddToPlaylist({
                      id: `${artist.id}-${song.id}-${Date.now()}`,
                      title: song.title,
                      artist: artist.name,
                      album: song.album,
                      year: song.year,
                      youtubeId: song.youtubeId,
                      mood: song.mood,
                    });
                  });
                  toast.success(`Added all ${artist.songs.length} tracks from ${artist.name}`);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 border border-border/50 text-muted-foreground/50 hover:text-accent hover:border-accent/40 transition-colors"
                title="Add all tracks to playlist"
                style={{ fontSize: '0.5rem' }}
              >
                <Plus className="w-2.5 h-2.5" />
                <span className="font-mono">ADD ALL</span>
              </button>
            )}
          </div>
          {artist.songs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <Music className="w-5 h-5 text-muted-foreground/40" />
              <p className="text-xs font-mono text-muted-foreground/60">Belum ada data lagu untuk artis ini</p>
            </div>
          ) : (
            <div className="space-y-1">
              {artist.songs.map(song => (
                <div key={song.id} className="flex items-stretch gap-0">
                  <button
                    onClick={() => onSelectSong(song)}
                    className="flex-1 min-w-0 text-left p-2 xerox-border hover:border-accent/60 hover:bg-accent/5 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm text-foreground group-hover:text-accent transition-colors truncate">{song.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{song.album} · {song.year} · {song.bpm}bpm · {song.key}</div>
                      </div>
                      <div className="flex flex-wrap gap-1 flex-shrink-0">
                        {song.mood.slice(0, 2).map(m => (
                          <span key={m} className="mood-tag">{m}</span>
                        ))}
                      </div>
                    </div>
                  </button>
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
                    className="px-2 border border-l-0 border-border text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors flex-shrink-0"
                    title="Add to playlist"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collaborations */}
        {(artist.keyCollaborations ?? []).length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="archival-label mb-2 flex items-center gap-2">
              <Users className="w-3 h-3" /> KEY COLLABORATIONS
            </div>
            <div className="flex flex-wrap gap-1">
              {(artist.keyCollaborations ?? []).map(c => (
                <span key={c} className="text-xs font-mono text-foreground/60 border border-border px-2 py-0.5">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related Artists */}
        {relatedArtistObjects.length > 0 && (
          <div className="p-4">
            <div className="archival-label mb-2">RELATED ARTISTS</div>
            <div className="flex flex-wrap gap-1">
              {relatedArtistObjects.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => onSelectArtist(rel)}
                  className="text-xs font-mono border border-border px-2 py-1 text-foreground/70 hover:border-accent hover:text-accent transition-colors"
                >
                  {rel.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

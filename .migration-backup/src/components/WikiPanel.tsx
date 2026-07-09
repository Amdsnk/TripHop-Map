import { useState } from 'react';
import { X, ChevronDown, ChevronRight, BookOpen, Disc, Building2, Clock } from 'lucide-react';
import {
  GENRE_OVERVIEW,
  WIKI_TIMELINE,
  WIKI_LABELS,
  WIKI_ESSENTIAL_ALBUMS,
  type WikiEvent,
} from '@/data/wikiContext';

interface Props {
  onClose: () => void;
}

type Tab = 'overview' | 'timeline' | 'labels' | 'albums';

const SIGNIFICANCE_COLORS: Record<WikiEvent['significance'], string> = {
  foundational: 'text-accent border-accent/60 bg-accent/5',
  landmark:     'text-blue-300 border-blue-300/40 bg-blue-300/5',
  expansion:    'text-foreground/60 border-border bg-transparent',
  modern:       'text-muted-foreground border-border/60 bg-transparent',
};

const SIGNIFICANCE_DOTS: Record<WikiEvent['significance'], string> = {
  foundational: 'bg-accent',
  landmark:     'bg-blue-300',
  expansion:    'bg-foreground/40',
  modern:       'bg-muted-foreground',
};

export default function WikiPanel({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'OVERVIEW',  icon: <BookOpen className="w-3 h-3" /> },
    { id: 'timeline',  label: 'TIMELINE',  icon: <Clock className="w-3 h-3" /> },
    { id: 'labels',    label: 'LABELS',    icon: <Building2 className="w-3 h-3" /> },
    { id: 'albums',    label: 'ALBUMS',    icon: <Disc className="w-3 h-3" /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden xerox-border panel-enter">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="archival-label text-accent mb-1">WIKIPEDIA / KNOWLEDGE BASE</div>
            <h2 className="archival-title text-xl leading-tight text-glow">TRIP-HOP</h2>
            <div className="text-xs text-muted-foreground mt-0.5 font-mono">
              {GENRE_OVERVIEW.origin} · {GENRE_OVERVIEW.period}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-mono xerox-border transition-all ${
                activeTab === tab.id
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="p-4 space-y-5">
            {/* Alternate names */}
            <div>
              <div className="archival-label text-muted-foreground mb-2">ALSO KNOWN AS</div>
              <div className="flex flex-wrap gap-1">
                {GENRE_OVERVIEW.alternateNames.map(n => (
                  <span key={n} className="xerox-border px-2 py-0.5 text-xs font-mono text-foreground/70">{n}</span>
                ))}
              </div>
            </div>

            {/* Term origin */}
            <div>
              <div className="archival-label text-muted-foreground mb-2">NAMING THE GENRE</div>
              <p className="text-sm text-foreground/80 leading-relaxed">{GENRE_OVERVIEW.termOrigin}</p>
            </div>

            {/* Definition */}
            <div>
              <div className="archival-label text-muted-foreground mb-2">DEFINITION</div>
              <p className="text-sm text-foreground/80 leading-relaxed">{GENRE_OVERVIEW.definition}</p>
            </div>

            {/* Characteristics */}
            <div>
              <div className="archival-label text-muted-foreground mb-2">SONIC CHARACTERISTICS</div>
              <ul className="space-y-1">
                {GENRE_OVERVIEW.characteristics.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                    <span className="text-accent mt-0.5 flex-shrink-0">▸</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Geographic origins */}
            <div>
              <div className="archival-label text-muted-foreground mb-2">GEOGRAPHIC ORIGINS</div>
              <div className="space-y-3">
                {Object.entries(GENRE_OVERVIEW.geographicOrigins).map(([city, desc]) => (
                  <div key={city} className="xerox-border p-3">
                    <div className="archival-label text-accent mb-1">{city.toUpperCase()}</div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {activeTab === 'timeline' && (
          <div className="p-4">
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-4">
                {WIKI_TIMELINE.map(event => (
                  <div key={event.year} className="flex gap-4 relative">
                    {/* dot */}
                    <div className={`flex-shrink-0 w-9 flex flex-col items-center pt-1 z-10`}>
                      <div className={`w-3 h-3 rounded-full border-2 border-background ${SIGNIFICANCE_DOTS[event.significance]}`} />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-accent">{event.year}</span>
                        <span className={`text-xs font-mono px-1.5 py-0 border rounded-sm ${SIGNIFICANCE_COLORS[event.significance]}`}>
                          {event.significance}
                        </span>
                      </div>
                      <div className="archival-label text-foreground/90 mb-1">{event.title}</div>
                      <p className="text-xs text-foreground/60 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LABELS ── */}
        {activeTab === 'labels' && (
          <div className="p-4 space-y-2">
            {WIKI_LABELS.map(label => (
              <div key={label.name} className="xerox-border overflow-hidden">
                <button
                  onClick={() => setExpandedLabel(expandedLabel === label.name ? null : label.name)}
                  className="w-full p-3 flex items-center justify-between gap-2 hover:bg-accent/5 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <div className="archival-label text-foreground/90 leading-tight">{label.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {label.founded} · {label.location}
                    </div>
                  </div>
                  {expandedLabel === label.name
                    ? <ChevronDown className="w-3 h-3 text-accent flex-shrink-0" />
                    : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  }
                </button>
                {expandedLabel === label.name && (
                  <div className="px-3 pb-3 border-t border-border space-y-3 pt-3">
                    <div>
                      <div className="archival-label text-muted-foreground mb-1">FOUNDERS</div>
                      <div className="flex flex-wrap gap-1">
                        {label.founders.map(f => (
                          <span key={f} className="text-xs font-mono text-foreground/70 xerox-border px-2 py-0.5">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="archival-label text-muted-foreground mb-1">DESCRIPTION</div>
                      <p className="text-xs text-foreground/70 leading-relaxed">{label.description}</p>
                    </div>
                    <div>
                      <div className="archival-label text-muted-foreground mb-1">KEY ARTISTS</div>
                      <div className="flex flex-wrap gap-1">
                        {label.keyArtists.map(a => (
                          <span key={a} className="text-xs font-mono text-accent/80 xerox-border px-2 py-0.5 border-accent/30">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ALBUMS ── */}
        {activeTab === 'albums' && (
          <div className="p-4 space-y-2">
            <div className="archival-label text-muted-foreground mb-3">ESSENTIAL RECORDINGS</div>
            {WIKI_ESSENTIAL_ALBUMS.map(album => (
              <div key={`${album.artist}-${album.title}`} className="xerox-border overflow-hidden">
                <button
                  onClick={() => setExpandedAlbum(expandedAlbum === album.title ? null : album.title)}
                  className="w-full p-3 flex items-start gap-3 hover:bg-accent/5 transition-colors text-left"
                >
                  {/* Year badge */}
                  <div className="flex-shrink-0 w-10 h-10 xerox-border flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-accent leading-tight text-center">{album.year}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="archival-label text-foreground/90 truncate leading-tight">{album.title}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{album.artist} · {album.label}</div>
                  </div>
                  {expandedAlbum === album.title
                    ? <ChevronDown className="w-3 h-3 text-accent flex-shrink-0 mt-1" />
                    : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
                  }
                </button>
                {expandedAlbum === album.title && (
                  <div className="px-3 pb-3 border-t border-border space-y-2 pt-3">
                    <p className="text-xs text-foreground/70 leading-relaxed">{album.description}</p>
                    <div className="flex items-start gap-2">
                      <span className="text-accent flex-shrink-0 mt-0.5">✦</span>
                      <p className="text-xs text-accent/80 font-mono leading-relaxed">{album.significance}</p>
                    </div>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(album.artist + ' ' + album.title + ' full album')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground xerox-border px-2 py-1 transition-colors"
                    >
                      ↗ SEARCH ON YOUTUBE
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 border-t border-border">
        <a
          href="https://en.wikipedia.org/wiki/Trip_hop"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <BookOpen className="w-3 h-3" />
          SOURCE: WIKIPEDIA / TRIP-HOP
        </a>
      </div>
    </div>
  );
}

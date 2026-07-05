import { type MoodTag } from '@/data/artists';

interface Props {
  activeMoods: MoodTag[];
  onToggleMood: (mood: MoodTag) => void;
}

const MOODS: { id: MoodTag; label: string; desc: string }[] = [
  { id: 'dark',       label: 'DARK',       desc: 'Shadowed, ominous' },
  { id: 'melancholic',label: 'MELANCHOLIC', desc: 'Haunted, introspective' },
  { id: 'jazzy',      label: 'JAZZY',      desc: 'Blue-note influenced' },
  { id: 'smoky',      label: 'SMOKY',      desc: 'Late-night, hazy' },
  { id: 'urban',      label: 'URBAN',      desc: 'City textures' },
  { id: 'cinematic',  label: 'CINEMATIC',  desc: 'Film-score scale' },
];

export default function MoodFilter({ activeMoods, onToggleMood }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="archival-label mb-2">MOOD FILTER</div>
      {MOODS.map(({ id, label, desc }) => {
        const active = activeMoods.includes(id);
        return (
          <button
            key={id}
            onClick={() => onToggleMood(id)}
            className={`text-left px-2 py-1.5 xerox-border transition-all group ${
              active
                ? 'border-accent bg-accent/10'
                : 'hover:border-accent/40'
            }`}
          >
            <div className={`text-xs font-mono font-bold transition-colors ${active ? 'text-accent' : 'text-foreground/60 group-hover:text-foreground/80'}`}>
              {active ? '▪ ' : '  '}{label}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
          </button>
        );
      })}
      {activeMoods.length > 0 && (
        <button
          onClick={() => activeMoods.forEach(m => onToggleMood(m))}
          className="mt-1 text-xs font-mono text-muted-foreground hover:text-foreground/80 transition-colors text-left px-2"
        >
          × CLEAR ALL
        </button>
      )}
    </div>
  );
}

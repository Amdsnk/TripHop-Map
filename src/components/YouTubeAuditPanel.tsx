import { useState, useCallback, useRef, useEffect } from 'react';
import {
  X, Play, Square, CheckCircle, XCircle, Loader2,
  ExternalLink, ClipboardCopy, RefreshCw, Save, Info, Zap, Download,
} from 'lucide-react';
import { ARTISTS } from '@/data/artists';
import {
  checkYouTubeIdsBatch,
  loadOverrides,
  saveOverride,
  removeOverride,
  clearAvailabilityCache,
} from '@/utils/youtubeCheck';
import { KNOWN_REPLACEMENTS, getVerifiedReplacement } from '@/data/ytReplacements';

interface AuditEntry {
  songId:     string;
  songTitle:  string;
  artistId:   string;
  artistName: string;
  originalId: string;
  /** undefined = not yet checked */
  available?:  boolean;
  overrideId?: string;
  /** a known verified replacement exists */
  hasKnownFix?: boolean;
}

type AuditStatus = 'idle' | 'running' | 'auto-repairing' | 'done';

interface Props {
  onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildEntries(): AuditEntry[] {
  const overrides = loadOverrides();
  const entries: AuditEntry[] = [];
  for (const artist of ARTISTS) {
    for (const song of artist.songs ?? []) {
      if (!song.youtubeId) continue;
      const repl = getVerifiedReplacement(song.youtubeId);
      entries.push({
        songId:      song.id,
        songTitle:   song.title,
        artistId:    artist.id,
        artistName:  artist.name,
        originalId:  song.youtubeId,
        overrideId:  overrides[song.youtubeId] ?? undefined,
        hasKnownFix: repl !== undefined && repl !== song.youtubeId,
      });
    }
  }
  return entries;
}

function StatusBadge({ available, overrideId }: { available?: boolean; overrideId?: string }) {
  if (overrideId)
    return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" aria-label="Diperbaiki" />;
  if (available === undefined)
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground/40"><Loader2 className="w-3 h-3 animate-spin" /></span>;
  if (available)
    return <CheckCircle className="w-4 h-4 text-green-500/70 shrink-0" />;
  return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function YouTubeAuditPanel({ onClose }: Props) {
  const [entries, setEntries]   = useState<AuditEntry[]>(buildEntries);
  const [status, setStatus]     = useState<AuditStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [autoFixed, setAutoFixed] = useState(0);
  const [filter, setFilter]     = useState<'all' | 'ok' | 'broken' | 'override'>('all');
  const [inputMap, setInputMap] = useState<Record<string, string>>({});
  const abortRef                = useRef<AbortController | null>(null);

  const total     = entries.length;
  const checked   = entries.filter(e => e.available !== undefined).length;
  const broken    = entries.filter(e => e.available === false && !e.overrideId).length;
  const overrides = entries.filter(e => e.overrideId).length;
  const knownFixes = entries.filter(e => e.available === false && e.hasKnownFix && !e.overrideId).length;

  // Reload overrides when panel opens
  useEffect(() => {
    const ovr = loadOverrides();
    setEntries(prev => prev.map(e => ({ ...e, overrideId: ovr[e.originalId] ?? undefined })));
  }, []);

  // ── Auto-Repair: check + fix in one go ────────────────────────────────────
  const runAutoRepair = useCallback(async () => {
    clearAvailabilityCache();
    const fresh = buildEntries();
    setEntries(fresh);
    setProgress(0);
    setAutoFixed(0);
    setStatus('running');

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const ids = fresh.map(e => e.originalId);

    const results = await checkYouTubeIdsBatch(ids, {
      concurrency: 4,
      signal: ctrl.signal,
      onProgress: (_id, available, done) => {
        setProgress(done);
        setEntries(prev =>
          prev.map(e => e.originalId === _id ? { ...e, available } : e)
        );
      },
    });

    if (ctrl.signal.aborted) return;

    // Apply known replacements for all broken IDs
    setStatus('auto-repairing');
    let fixed = 0;
    const brokenIds = Object.entries(results)
      .filter(([, ok]) => !ok)
      .map(([id]) => id);

    for (const id of brokenIds) {
      const repl = KNOWN_REPLACEMENTS[id] ?? getVerifiedReplacement(id);
      if (repl && repl !== id) {
        saveOverride(id, repl);
        fixed++;
      }
    }

    setAutoFixed(fixed);
    // Refresh entries with new overrides
    setEntries(buildEntries().map(e => ({
      ...e,
      available: results[e.originalId],
    })));
    setStatus('done');
  }, []);

  const stopAudit = useCallback(() => {
    abortRef.current?.abort();
    setStatus('done');
  }, []);

  // ── Manual overrides ──────────────────────────────────────────────────────
  const applyOverride = useCallback((originalId: string) => {
    const newId = (inputMap[originalId] ?? '').trim();
    if (!/^[A-Za-z0-9_\-]{11}$/.test(newId)) return;
    saveOverride(originalId, newId);
    setEntries(prev => prev.map(e =>
      e.originalId === originalId ? { ...e, overrideId: newId } : e
    ));
    setInputMap(prev => { const n = { ...prev }; delete n[originalId]; return n; });
  }, [inputMap]);

  const clearOverrideEntry = useCallback((originalId: string) => {
    removeOverride(originalId);
    setEntries(prev => prev.map(e =>
      e.originalId === originalId ? { ...e, overrideId: undefined } : e
    ));
  }, []);

  // ── Export patch ─────────────────────────────────────────────────────────
  const exportPatch = useCallback(() => {
    const ovr = loadOverrides();
    const lines = Object.entries(ovr).map(([orig, repl]) => `  "${orig}": "${repl}"`);
    const json = `{\n${lines.join(',\n')}\n}`;
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'youtube-overrides.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const copyPatch = useCallback(() => {
    const ovr = loadOverrides();
    const lines = Object.entries(ovr).map(([orig, repl]) => `  '${orig}' → '${repl}'`);
    const text = lines.length > 0
      ? `// YouTube ID overrides (${lines.length} entri)\n${lines.join('\n')}`
      : '// Belum ada override.';
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  // ── Filtered + sorted list ────────────────────────────────────────────────
  const visible = entries.filter(e => {
    if (filter === 'ok')       return e.available === true && !e.overrideId;
    if (filter === 'broken')   return e.available === false && !e.overrideId;
    if (filter === 'override') return Boolean(e.overrideId);
    return true;
  });
  const sorted = [...visible].sort((a, b) => {
    const rank = (e: AuditEntry) =>
      (e.available === false && !e.overrideId) ? 0 :
      e.available === undefined                ? 1 :
      e.overrideId                             ? 2 : 3;
    return rank(a) - rank(b);
  });

  const isRunning = status === 'running' || status === 'auto-repairing';

  return (
    <div className="flex flex-col h-full overflow-hidden xerox-border panel-enter">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="archival-label text-accent mb-1">SISTEM AUDIT OTOMATIS</div>
            <h2 className="archival-title text-base leading-tight text-glow">YOUTUBE AUTO-REPAIR</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono leading-relaxed">
              {total} ID · {checked} diperiksa · {broken} rusak · {overrides} diperbaiki
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              {status === 'running'        ? `Memeriksa… ${progress}/${total}` :
               status === 'auto-repairing' ? `Menerapkan perbaikan otomatis…` :
               status === 'done'           ? `Selesai — ${broken} rusak, ${autoFixed} diperbaiki otomatis` :
               'Siap dijalankan'}
            </span>
            <span className="text-xs font-mono text-accent">
              {total > 0 ? Math.round((checked / total) * 100) : 0}%
            </span>
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${total > 0 ? (checked / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {!isRunning ? (
            <button
              onClick={runAutoRepair}
              className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-accent border-accent hover:bg-accent/10 transition-colors"
            >
              {status === 'done' ? <RefreshCw className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {status === 'done' ? 'Periksa Ulang' : 'Auto-Perbaiki Semua'}
            </button>
          ) : (
            <button
              onClick={stopAudit}
              className="flex items-center gap-1.5 text-xs font-mono xerox-border px-3 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <Square className="w-3 h-3" /> Hentikan
            </button>
          )}
          {overrides > 0 && (
            <>
              <button
                onClick={copyPatch}
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-2 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                title="Salin daftar perubahan"
              >
                <ClipboardCopy className="w-3 h-3" /> Salin
              </button>
              <button
                onClick={exportPatch}
                className="flex items-center gap-1.5 text-xs font-mono xerox-border px-2 py-1.5 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                title="Unduh patch JSON"
              >
                <Download className="w-3 h-3" /> Unduh JSON
              </button>
            </>
          )}
        </div>

        {/* Auto-repair stats (post-run) */}
        {status === 'done' && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'DIPERIKSA', val: checked, color: 'text-foreground' },
              { label: 'RUSAK',     val: broken,   color: 'text-red-400' },
              { label: 'DIPERBAIKI', val: overrides, color: 'text-green-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="xerox-border p-2 text-center">
                <div className={`text-lg font-bold font-mono ${color}`}>{val}</div>
                <div className="archival-label text-muted-foreground/60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex-shrink-0 flex border-b border-border">
        {(['all', 'broken', 'ok', 'override'] as const).map(f => {
          const count =
            f === 'all'      ? total :
            f === 'ok'       ? entries.filter(e => e.available === true && !e.overrideId).length :
            f === 'broken'   ? broken :
            overrides;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-mono border-r border-border last:border-r-0 transition-colors ${
                filter === f ? 'text-accent bg-accent/5' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all'      ? `SEMUA (${count})` :
               f === 'broken'   ? `RUSAK (${count})` :
               f === 'ok'       ? `OK (${count})` :
               `FIXED (${count})`}
            </button>
          );
        })}
      </div>

      {/* Info notice (idle) */}
      {status === 'idle' && (
        <div className="flex-shrink-0 flex items-start gap-2 p-3 border-b border-border bg-accent/5">
          <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs font-mono text-muted-foreground leading-relaxed">
            Tekan <span className="text-accent font-semibold">Auto-Perbaiki Semua</span> — sistem akan memeriksa semua {total} ID via oEmbed lalu otomatis menerapkan video pengganti yang terverifikasi untuk semua yang rusak. {Object.keys(KNOWN_REPLACEMENTS).length} pengganti terverifikasi tersedia.
          </div>
        </div>
      )}

      {/* Known fixes notice */}
      {status === 'done' && knownFixes > 0 && (
        <div className="flex-shrink-0 flex items-start gap-2 p-3 border-b border-border bg-yellow-500/5">
          <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {knownFixes} video rusak masih belum diperbaiki — masukkan ID pengganti secara manual.
          </p>
        </div>
      )}

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {sorted.length === 0 && (
          <div className="p-6 text-center text-xs font-mono text-muted-foreground">
            {status === 'idle'
              ? 'Tekan "Auto-Perbaiki Semua" untuk memulai.'
              : 'Tidak ada entri untuk filter ini.'}
          </div>
        )}

        {sorted.map(entry => {
          const activeId  = entry.overrideId ?? entry.originalId;
          const ytUrl     = `https://www.youtube.com/watch?v=${activeId}`;
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(entry.artistName + ' ' + entry.songTitle)}`;
          const inputVal  = inputMap[entry.originalId] ?? '';
          const inputValid = /^[A-Za-z0-9_\-]{11}$/.test(inputVal.trim());

          return (
            <div
              key={`${entry.artistId}-${entry.songId}`}
              className={`border-b border-border p-3 transition-colors ${
                entry.overrideId          ? 'bg-green-500/5' :
                entry.available === false ? 'bg-red-500/5'   : ''
              }`}
            >
              {/* Row top */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <StatusBadge available={entry.available} overrideId={entry.overrideId} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{entry.songTitle}</div>
                  <div className="text-xs text-muted-foreground truncate">{entry.artistName}</div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`text-xs font-mono px-1.5 py-0.5 border ${
                      entry.overrideId          ? 'border-green-500/40 text-green-400' :
                      entry.available === false ? 'border-red-400/40 text-red-400'     :
                                                  'border-border text-muted-foreground'
                    }`}>
                      {activeId}
                    </span>
                    {entry.overrideId && (
                      <span className="text-xs font-mono text-muted-foreground/40 line-through">{entry.originalId}</span>
                    )}
                    {entry.overrideId && (
                      <span className="text-xs font-mono text-green-400/70">AUTO-FIXED</span>
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-1 shrink-0">
                  <a
                    href={ytUrl} target="_blank" rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center xerox-border text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                    title="Buka di YouTube"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {entry.overrideId && (
                    <button
                      onClick={() => clearOverrideEntry(entry.originalId)}
                      className="w-6 h-6 flex items-center justify-center xerox-border text-muted-foreground hover:border-red-400 hover:text-red-400 transition-colors"
                      title="Hapus pengganti"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Manual replacement input for broken, unresolved IDs */}
              {entry.available === false && !entry.overrideId && (
                <div className="mt-2 flex flex-col gap-1.5">
                  <a
                    href={searchUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" /> Cari pengganti di YouTube ↗
                  </a>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tempel ID YouTube baru (11 karakter)"
                      value={inputVal}
                      onChange={e => setInputMap(prev => ({ ...prev, [entry.originalId]: e.target.value }))}
                      className="flex-1 text-xs font-mono xerox-border px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent"
                      maxLength={11}
                    />
                    <button
                      onClick={() => applyOverride(entry.originalId)}
                      disabled={!inputValid}
                      className={`flex items-center gap-1 text-xs font-mono xerox-border px-3 py-1.5 transition-colors ${
                        inputValid
                          ? 'text-accent border-accent hover:bg-accent/10'
                          : 'text-muted-foreground/40 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-3 h-3" /> Simpan
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 border-t border-border">
        <p className="text-xs font-mono text-muted-foreground/50 text-center">
          Override tersimpan di browser · Aktif seketika tanpa reload
        </p>
      </div>
    </div>
  );
}


import { useRef, useCallback } from 'react';

// Minimal vinyl crackle synthesized via Web Audio API
export function useVinylCrackle() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const createCrackle = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      gainRef.current = gain;

      // Create noise buffer
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Sparse crackle pops
        const r = Math.random();
        if (r > 0.998) {
          data[i] = (Math.random() * 2 - 1) * 0.6;
          data[i + 1] = (Math.random() * 2 - 1) * 0.3;
        } else {
          // Low-level white noise (hiss)
          data[i] = (Math.random() * 2 - 1) * 0.006;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Low-pass filter to soften noise
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4000;
      filter.Q.value = 0.5;

      source.connect(filter);
      filter.connect(gain);
      source.start(0);
      sourceRef.current = source;

      // Fade in
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    } catch {
      // Audio not supported — silently ignore
    }
  }, []);

  const playUIClick = useCallback(() => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = 'sawtooth';
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Silently ignore
    }
  }, []);

  const stop = useCallback(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.5);
    }
  }, []);

  return { createCrackle, playUIClick, stop };
}

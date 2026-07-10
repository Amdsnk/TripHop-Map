import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  type: 'smoke' | 'spark' | 'ink';
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = (): Particle => {
      const types: Particle['type'][] = ['smoke', 'smoke', 'smoke', 'spark', 'ink'];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * canvas.width;
      const y = canvas.height + 20;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.1),
        life: 0,
        maxLife: type === 'smoke' ? 400 + Math.random() * 300 : 150 + Math.random() * 100,
        size: type === 'smoke' ? 30 + Math.random() * 80 : type === 'ink' ? 2 + Math.random() * 4 : 1,
        opacity: type === 'smoke' ? 0.03 + Math.random() * 0.05 : 0.1 + Math.random() * 0.3,
        type,
      };
    };

    const drawSmoke = (ctx: CanvasRenderingContext2D, p: Particle) => {
      const progress = p.life / p.maxLife;
      const alpha = p.opacity * Math.sin(progress * Math.PI);
      const radius = p.size * (0.5 + progress * 0.8);
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      grd.addColorStop(0, `rgba(26, 58, 92, ${alpha})`);
      grd.addColorStop(0.5, `rgba(13, 32, 53, ${alpha * 0.6})`);
      grd.addColorStop(1, 'rgba(6, 11, 18, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSpark = (ctx: CanvasRenderingContext2D, p: Particle) => {
      const progress = p.life / p.maxLife;
      const alpha = p.opacity * (1 - progress);
      ctx.shadowColor = 'rgba(42, 111, 173, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = `rgba(42, 111, 173, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawInk = (ctx: CanvasRenderingContext2D, p: Particle) => {
      const progress = p.life / p.maxLife;
      const alpha = p.opacity * Math.sin(progress * Math.PI) * 0.5;
      ctx.strokeStyle = `rgba(42, 111, 173, ${alpha})`;
      ctx.lineWidth = p.size;
      ctx.shadowColor = 'rgba(42, 111, 173, 0.3)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(p.x - p.vx * 20, p.y - p.vy * 20);
      ctx.lineTo(p.x + p.vx * 5, p.y + p.vy * 5);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawWaveform = (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(26, 58, 92, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y1 = h * 0.3 + Math.sin(x * 0.015 + t * 0.5) * 18 + Math.sin(x * 0.04 + t * 0.8) * 8;
        if (x === 0) ctx.moveTo(x, y1);
        else ctx.lineTo(x, y1);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y2 = h * 0.7 + Math.sin(x * 0.012 - t * 0.3) * 12 + Math.cos(x * 0.05 + t * 0.6) * 6;
        if (x === 0) ctx.moveTo(x, y2);
        else ctx.lineTo(x, y2);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawAnalogFeedback = (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
      ctx.save();
      const numLines = 3;
      for (let i = 0; i < numLines; i++) {
        const y = ((t * 20 + i * (h / numLines)) % (h + 60)) - 30;
        const alpha = 0.02 + Math.sin(t + i) * 0.01;
        ctx.strokeStyle = `rgba(42, 111, 173, ${Math.max(0, alpha)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Dark gradient base
      const base = ctx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, 'hsl(213, 54%, 5%)');
      base.addColorStop(0.5, 'hsl(212, 62%, 6%)');
      base.addColorStop(1, 'hsl(213, 54%, 4%)');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Radial depth glow
      const radial = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.55);
      radial.addColorStop(0, 'rgba(26, 58, 92, 0.12)');
      radial.addColorStop(0.4, 'rgba(13, 32, 53, 0.08)');
      radial.addColorStop(1, 'rgba(6, 11, 18, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, w, h);

      drawWaveform(ctx, t, w, h);
      drawAnalogFeedback(ctx, t, w, h);

      // Spawn particles
      if (Math.random() < 0.15 && particlesRef.current.length < 80) {
        particlesRef.current.push(spawnParticle());
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.3;
        p.y += p.vy;
        if (p.type === 'smoke') drawSmoke(ctx, p);
        else if (p.type === 'spark') drawSpark(ctx, p);
        else drawInk(ctx, p);
        return p.life < p.maxLife && p.y > -100;
      });

      // Dithered bottom vignette
      const vignette = ctx.createLinearGradient(0, h * 0.6, 0, h);
      vignette.addColorStop(0, 'rgba(6, 11, 18, 0)');
      vignette.addColorStop(1, 'rgba(6, 11, 18, 0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" aria-hidden="true" />;
}

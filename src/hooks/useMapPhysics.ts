import { useRef, useCallback, useEffect } from 'react';

interface Vec2 { x: number; y: number }

export interface MapState {
  offsetX: number;
  offsetY: number;
  scale: number;
  isDragging: boolean;
  lastMouse: Vec2;
  velocity: Vec2;
}

const FRICTION = 0.88;
const MIN_SCALE = 0.25;
const MAX_SCALE = 2.5;

export function useMapPhysics(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onUpdate: (state: MapState) => void
) {
  const state = useRef<MapState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });
  const rafRef = useRef<number>(0);

  const getState = useCallback(() => state.current, []);

  const animate = useCallback(() => {
    const s = state.current;
    if (!s.isDragging) {
      s.velocity.x *= FRICTION;
      s.velocity.y *= FRICTION;
      if (Math.abs(s.velocity.x) > 0.1 || Math.abs(s.velocity.y) > 0.1) {
        s.offsetX += s.velocity.x;
        s.offsetY += s.velocity.y;
        onUpdate({ ...s });
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [onUpdate]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const s = state.current;
    s.isDragging = true;
    s.lastMouse = { x: e.clientX, y: e.clientY };
    s.velocity = { x: 0, y: 0 };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const s = state.current;
    if (!s.isDragging) return;
    const dx = e.clientX - s.lastMouse.x;
    const dy = e.clientY - s.lastMouse.y;
    s.velocity = { x: dx * 0.8, y: dy * 0.8 };
    s.offsetX += dx;
    s.offsetY += dy;
    s.lastMouse = { x: e.clientX, y: e.clientY };
    onUpdate({ ...s });
  }, [onUpdate]);

  const handleMouseUp = useCallback(() => {
    state.current.isDragging = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const s = state.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale * delta));
    const scaleDiff = newScale / s.scale;
    s.offsetX = mouseX - scaleDiff * (mouseX - s.offsetX);
    s.offsetY = mouseY - scaleDiff * (mouseY - s.offsetY);
    s.scale = newScale;
    onUpdate({ ...s });
  }, [canvasRef, onUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel]);

  const centerOn = useCallback((wx: number, wy: number, targetScale = 1.2) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = state.current;
    s.scale = targetScale;
    s.offsetX = canvas.width / 2 - wx * targetScale;
    s.offsetY = canvas.height / 2 - wy * targetScale;
    s.velocity = { x: 0, y: 0 };
    onUpdate({ ...s });
  }, [canvasRef, onUpdate]);

  return { getState, centerOn };
}

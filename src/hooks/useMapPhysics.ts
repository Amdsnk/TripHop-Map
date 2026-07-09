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
const MAX_SCALE = 4.0;

export interface InitialTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export function useMapPhysics(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onUpdate: (state: MapState) => void,
  initialTransform: InitialTransform = { offsetX: 0, offsetY: 0, scale: 1 }
) {
  const state = useRef<MapState>({
    offsetX: initialTransform.offsetX,
    offsetY: initialTransform.offsetY,
    scale: initialTransform.scale,
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });
  const rafRef = useRef<number>(0);
  // pinch tracking
  const pinchRef = useRef<{ dist: number; midX: number; midY: number } | null>(null);

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

  // ── Mouse events ─────────────────────────────────────────────────────────
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

  // ── Touch events (pan + pinch-zoom) ─────────────────────────────────────
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const s = state.current;
    s.velocity = { x: 0, y: 0 };
    if (e.touches.length === 1) {
      s.isDragging = true;
      s.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      pinchRef.current = null;
    } else if (e.touches.length === 2) {
      s.isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        dist: Math.hypot(dx, dy),
        midX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        midY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const s = state.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (e.touches.length === 1 && s.isDragging) {
      const dx = e.touches[0].clientX - s.lastMouse.x;
      const dy = e.touches[0].clientY - s.lastMouse.y;
      s.velocity = { x: dx * 0.8, y: dy * 0.8 };
      s.offsetX += dx;
      s.offsetY += dy;
      s.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      onUpdate({ ...s });
    } else if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = canvas.getBoundingClientRect();
      const pivotX = midX - rect.left;
      const pivotY = midY - rect.top;
      const ratio = newDist / (pinchRef.current.dist || 1);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale * ratio));
      const scaleDiff = newScale / s.scale;
      s.offsetX = pivotX - scaleDiff * (pivotX - s.offsetX);
      s.offsetY = pivotY - scaleDiff * (pivotY - s.offsetY);
      s.scale = newScale;
      pinchRef.current = { dist: newDist, midX, midY };
      onUpdate({ ...s });
    }
  }, [canvasRef, onUpdate]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) {
      state.current.isDragging = false;
      pinchRef.current = null;
    } else if (e.touches.length === 1) {
      // One finger lifted from two-finger gesture — restart single pan
      pinchRef.current = null;
      state.current.isDragging = true;
      state.current.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel,
      handleTouchStart, handleTouchMove, handleTouchEnd]);

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

  const setTransform = useCallback((transform: Partial<InitialTransform>) => {
    const s = state.current;
    if (transform.offsetX !== undefined) s.offsetX = transform.offsetX;
    if (transform.offsetY !== undefined) s.offsetY = transform.offsetY;
    if (transform.scale !== undefined) s.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.scale));
    s.velocity = { x: 0, y: 0 };
    onUpdate({ ...s });
  }, [onUpdate]);

  return { getState, centerOn, setTransform };
}

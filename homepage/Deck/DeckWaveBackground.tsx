/**
 * DeckWaveBackground — Canvas 2D particle-wave ocean behind the deck slides.
 *
 * Props:
 *   isSpeaking — when true, waves speed up (curtain effect)
 *   speaker    — "denny" (purple) | "ken" (blue)
 */

import { useRef, useEffect, useCallback } from "react";
import s from "./Deck.module.css";

interface Props {
  isSpeaking: boolean;
  speaker: "denny" | "ken";
}

/* ── Colours for each speaker ────────────────────────────────────────── */
const SPEAKER_HUE = { denny: 0.76, ken: 0.58 } as const; // purple vs blue

/* ── Wave parameters (same math as the Three.js reference) ───────────── */
const WAVE_HEIGHT = 6;
const SPREAD = 70;
const FOAM_LINE = 0.85;
const TURBULENCE = 1.5;
const PARTICLE_RADIUS = 1.6;
const SLOW_SPEED = 0.3; // idle
const FAST_SPEED = 2.8; // speaking

export default function DeckWaveBackground({ isSpeaking, speaker }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const prevTsRef = useRef(0);
  const speedRef = useRef(SLOW_SPEED);
  const hueRef = useRef(SPEAKER_HUE[speaker]);

  /* Smooth-lerp targets */
  const targetSpeed = isSpeaking ? FAST_SPEED : SLOW_SPEED;
  const targetHue = SPEAKER_HUE[speaker];

  /* Keep refs synced – avoids stale closures inside rAF */
  const targetSpeedRef = useRef(targetSpeed);
  const targetHueRef = useRef(targetHue);
  useEffect(() => {
    targetSpeedRef.current = targetSpeed;
  }, [targetSpeed]);
  useEffect(() => {
    targetHueRef.current = targetHue;
  }, [targetHue]);

  /* ── Resize handler ─────────────────────────────────────────────── */
  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    c.style.width = `${window.innerWidth}px`;
    c.style.height = `${window.innerHeight}px`;
  }, []);

  /* ── Main animation loop ────────────────────────────────────────── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    resize();
    window.addEventListener("resize", resize);

    const COLS = 110;
    const ROWS = 60;

    const loop = (ts: number) => {
      if (!prevTsRef.current) prevTsRef.current = ts;
      const dt = Math.min((ts - prevTsRef.current) / 1000, 0.05);
      prevTsRef.current = ts;

      // Smooth-lerp speed & hue
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 2.5 * dt;
      hueRef.current += (targetHueRef.current - hueRef.current) * 3 * dt;

      timeRef.current += dt * speedRef.current;
      const t = timeRef.current;

      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);

      const baseHue = hueRef.current;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const nx = (col / COLS - 0.5) * 2.0;
          const nz = (row / ROWS - 0.5) * 2.0;

          // Layered wave interference
          const w1 = Math.sin(nx * 3.1 + t * 1.0) * 1.0;
          const w2 = Math.sin(nz * 2.7 + t * 1.3) * 0.8;
          const w3 = Math.sin((nx + nz) * 2.0 + t * 0.9) * 0.6;
          const w4 = Math.cos(nx * 5.2 - t * 1.7) * 0.3;
          const w5 =
            Math.cos(nz * 4.1 + t * 2.1) * TURBULENCE * 0.2;

          const yWave = (w1 + w2 + w3 + w4 + w5) * WAVE_HEIGHT;
          const normalizedY = yWave / (WAVE_HEIGHT * 2) + 0.5;
          const isCrest = Math.max(0, normalizedY - FOAM_LINE);

          // Map grid to screen
          const sx = ((nx + 1) / 2) * w;
          const sy =
            ((nz + 1) / 2) * h * 0.8 +
            h * 0.1 -
            yWave * (h / SPREAD) * 0.35;

          // Colour
          const hue = baseHue + normalizedY * 0.07;
          const sat = 0.7 + (1 - Math.min(1, normalizedY * 2)) * 0.3;
          const lit = 0.3 + isCrest * 0.55 + normalizedY * 0.15;

          ctx.fillStyle = `hsl(${hue * 360} ${sat * 100}% ${lit * 100}%)`;
          ctx.beginPath();
          ctx.arc(sx, sy, PARTICLE_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return <canvas ref={canvasRef} className={s.waveCanvas} />;
}
